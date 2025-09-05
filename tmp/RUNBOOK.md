# QiPortal Development Runbook

## A0 Orchestrator - Current Sprint Goals
**Sprint Focus**: Stabilize development environment and establish agent coordination

### Priority 1: Environment Stability
- [x] Fix server drizzle-orm import issue
- [x] Clean up old dev processes and port conflicts
- [ ] Investigate and resolve server startup issues
- [ ] Verify all three services (client, admin, server) running cleanly

### Priority 2: Agent Coordination Setup
- [x] Implement A0 Orchestrator lock management
- [x] Establish ROUTES area for A1 agent
- [x] Establish CONFIG+TYPES area for A2 agent
- [x] Add SERVER area for A3 agent
- [x] Create parallel work coordination protocol
- [x] Merge STATUS.json into STATE.json (single source of truth)
- [x] Create copy-paste agent prompts with acceptance criteria

## Current Status
- Client: http://localhost:3001 ✅
- Admin: http://localhost:3002 ✅
- Server: Not running - investigation needed ❌

## Agent Areas & Locks
- **ROUTES**: Available for A1 (entry points and routing)
- **CONFIG**: Available for A2 (build and deployment configuration)  
- **TYPES**: Available for A2 (TypeScript definitions and schemas)
- **SERVER**: Available for A3 (server startup and static serving)
- **DEPS**: 🔒 Locked by A# (dependencies and package management)

## Coordination Rules
- A1(ROUTES) and A2(CONFIG+TYPES) may run in parallel on different AREAS
- A3(SERVER) must wait for A1 and A2 to complete
- A#(DEPS) can run independently but affects all other agents
- All locks expire after 15 minutes of inactivity
- Workers must request locks before starting work
- Workers must mark DONE and release locks when complete

## Traceability & Single Source of Truth
- **tmp/STATE.json**: Contains all project state, progress, and coordination data
- **tmp/LOG.md**: Rolling log of all agent activities with timestamps
- **docs/agent-prompts.md**: Copy-paste ready prompts for all agents
- **docs/BUILD_CONTRACT.md**: Enforced build standards and entry points
- **tmp/STATUS.json**: ❌ RETIRED - merged into STATE.json
