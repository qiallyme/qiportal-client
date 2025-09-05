#!/usr/bin/env node

/**
 * A0 Orchestrator - Traffic Cop for QiPortal Development
 * 
 * Protocol:
 * 1) Ensure tmp/STATE.json exists with shape: { "locks": {}, "tasks": [], "notes": [] }
 * 2) For each AREA in ["ROUTES","CONFIG","TYPES","SERVER"], ensure no stale locks:
 *    - If tmp/locks/<AREA>.lock exists but the file hasn't changed in 15 minutes, clear the lock and add a note.
 * 3) When a worker asks to start, write STATE.json.locks[AREA] = "A#".
 * 4) After a worker marks DONE, remove the lock file, delete STATE.json.locks[AREA], append a LOG.md line.
 * 5) Gate steps: A1(ROUTES) and A2(CONFIG+TYPES) may run in parallel ONLY on different AREAS.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATE_FILE = path.join(__dirname, '../tmp/STATE.json');
const LOG_FILE = path.join(__dirname, '../tmp/LOG.md');
const LOCKS_DIR = path.join(__dirname, '../tmp/locks');
const AREAS = ['ROUTES', 'CONFIG', 'TYPES', 'SERVER', 'DEPS'];
const STALE_THRESHOLD_MS = 15 * 60 * 1000; // 15 minutes

class A0Orchestrator {
  constructor() {
    this.ensureDirectories();
    this.ensureStateFile();
  }

  ensureDirectories() {
    if (!fs.existsSync(LOCKS_DIR)) {
      fs.mkdirSync(LOCKS_DIR, { recursive: true });
    }
  }

  ensureStateFile() {
    if (!fs.existsSync(STATE_FILE)) {
      const initialState = {
        locks: {},
        tasks: [],
        notes: []
      };
      fs.writeFileSync(STATE_FILE, JSON.stringify(initialState, null, 2));
    }
  }

  loadState() {
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Error loading state:', error);
      return { locks: {}, tasks: [], notes: [] };
    }
  }

  saveState(state) {
    try {
      fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  checkStaleLocks() {
    const state = this.loadState();
    const now = Date.now();
    let clearedLocks = [];

    for (const area of AREAS) {
      const lockFile = path.join(LOCKS_DIR, `${area}.lock`);
      
      if (fs.existsSync(lockFile)) {
        const stats = fs.statSync(lockFile);
        const age = now - stats.mtime.getTime();
        
        if (age > STALE_THRESHOLD_MS) {
          // Clear stale lock
          fs.unlinkSync(lockFile);
          delete state.locks[area];
          clearedLocks.push(area);
          
          // Add note
          state.notes.push(`A0 Orchestrator: Cleared stale lock for ${area} area (${Math.round(age / 60000)} minutes old)`);
        }
      }
    }

    if (clearedLocks.length > 0) {
      this.saveState(state);
      this.log(`Cleared stale locks: ${clearedLocks.join(', ')}`);
    }

    return clearedLocks;
  }

  requestLock(area, workerId) {
    const state = this.loadState();
    
    // Check if area is already locked
    if (state.locks[area]) {
      return { success: false, message: `Area ${area} is already locked by ${state.locks[area]}` };
    }

    // Check coordination rules
    if (workerId === 'A1' && state.locks['CONFIG']) {
      return { success: false, message: 'A1 cannot start while A2 has CONFIG locked' };
    }
    
    if (workerId === 'A2' && (state.locks['ROUTES'] || state.locks['TYPES'])) {
      return { success: false, message: 'A2 cannot start while A1 has ROUTES locked or TYPES is locked' };
    }
    
    if (workerId === 'A3' && (state.locks['ROUTES'] || state.locks['CONFIG'] || state.locks['TYPES'])) {
      return { success: false, message: 'A3 cannot start while A1 or A2 have areas locked' };
    }

    // Grant lock
    state.locks[area] = workerId;
    this.saveState(state);

    // Create lock file
    const lockFile = path.join(LOCKS_DIR, `${area}.lock`);
    fs.writeFileSync(lockFile, workerId);

    this.log(`${workerId} -> ${area}: lock granted`);
    return { success: true, message: `Lock granted for ${area} to ${workerId}` };
  }

  releaseLock(area, workerId) {
    const state = this.loadState();
    
    if (state.locks[area] !== workerId) {
      return { success: false, message: `Area ${area} is not locked by ${workerId}` };
    }

    // Remove lock
    delete state.locks[area];
    this.saveState(state);

    // Remove lock file
    const lockFile = path.join(LOCKS_DIR, `${area}.lock`);
    if (fs.existsSync(lockFile)) {
      fs.unlinkSync(lockFile);
    }

    this.log(`${workerId} -> ${area}: lock released`);
    return { success: true, message: `Lock released for ${area} by ${workerId}` };
  }

  getStatus() {
    const state = this.loadState();
    return {
      locks: state.locks,
      tasks: state.tasks,
      notes: state.notes.slice(-5), // Last 5 notes
      availableAreas: AREAS.filter(area => !state.locks[area])
    };
  }

  log(message) {
    const timestamp = new Date().toISOString().replace('T', 'T').replace(/\.\d{3}Z$/, 'Z');
    const logEntry = `## ${timestamp} ${message}\n`;
    
    try {
      fs.appendFileSync(LOG_FILE, logEntry);
    } catch (error) {
      console.error('Error writing to log:', error);
    }
  }

  validateBuildContract(area, workerId) {
    const contract = {
      'ROUTES': {
        'entry_points': [
          'apps/client/src/main.tsx',
          'apps/admin/src/main.tsx', 
          'server/index.ts'
        ],
        'css_imports': '@shared/index.css'
      },
      'CONFIG': {
        'typescript_paths': ['@/*', '@admin/*', '@shared/*', '@ui/*'],
        'tailwind_content': ['./apps/**/index.html', './apps/**/src/**/*.{js,jsx,ts,tsx}', './shared/**/*.{ts,tsx}', './packages/ui/src/**/*.{ts,tsx}'],
        'pnpm_workspace': ['apps/*', 'packages/*', 'shared', 'server']
      },
      'SERVER': {
        'build_outputs': ['apps/client/dist/', 'apps/admin/dist/', 'server/dist/'],
        'production_start': 'node server/dist/index.js',
        'development': 'pnpm run dev:server'
      },
      'DEPS': {
        'package_manager': 'pnpm',
        'lock_file': 'pnpm-lock.yaml',
        'workspace_packages': ['apps/*', 'packages/*', 'shared', 'server']
      }
    };

    return contract[area] || {};
  }
}

// CLI Interface
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     import.meta.url.endsWith(process.argv[1]) ||
                     process.argv[1].endsWith('a0-orchestrator.js') ||
                     process.argv[1].includes('a0-orchestrator.js');

if (isMainModule) {
  const orchestrator = new A0Orchestrator();
  const command = process.argv[2];
  const area = process.argv[3];
  const workerId = process.argv[4];

  switch (command) {
    case 'check-stale':
      const cleared = orchestrator.checkStaleLocks();
      console.log(`Cleared ${cleared.length} stale locks: ${cleared.join(', ')}`);
      break;
      
    case 'request-lock':
      if (!area || !workerId) {
        console.error('Usage: node a0-orchestrator.js request-lock <AREA> <WORKER_ID>');
        process.exit(1);
      }
      const requestResult = orchestrator.requestLock(area, workerId);
      console.log(requestResult.message);
      process.exit(requestResult.success ? 0 : 1);
      
    case 'release-lock':
      if (!area || !workerId) {
        console.error('Usage: node a0-orchestrator.js release-lock <AREA> <WORKER_ID>');
        process.exit(1);
      }
      const releaseResult = orchestrator.releaseLock(area, workerId);
      console.log(releaseResult.message);
      process.exit(releaseResult.success ? 0 : 1);
      
    case 'status':
      const status = orchestrator.getStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
      
    case 'contract':
      const area = process.argv[3];
      if (!area) {
        console.error('Usage: node a0-orchestrator.js contract <AREA>');
        console.log('Areas:', AREAS.join(', '));
        process.exit(1);
      }
      const contract = orchestrator.validateBuildContract(area);
      console.log(JSON.stringify(contract, null, 2));
      break;
      
    default:
      console.log('A0 Orchestrator Commands:');
      console.log('  check-stale                    - Check and clear stale locks');
      console.log('  request-lock <AREA> <WORKER>   - Request lock for area');
      console.log('  release-lock <AREA> <WORKER>   - Release lock for area');
      console.log('  status                         - Show current status');
      console.log('  contract <AREA>                - Show BUILD_CONTRACT for area');
      console.log('');
      console.log('Areas:', AREAS.join(', '));
      console.log('Workers: A1 (ROUTES), A2 (CONFIG+TYPES), A3 (SERVER), A# (DEPS)');
  }
}

export default A0Orchestrator;
