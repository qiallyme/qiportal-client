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
- [ ] Establish ROUTES area for A1 agent
- [ ] Establish CONFIG+TYPES area for A2 agent
- [ ] Create parallel work coordination protocol

## Current Status
- Client: http://localhost:3001 ✅
- Admin: http://localhost:3002 ✅
- Server: Not running - investigation needed ❌

## Agent Areas & Locks
- **ROUTES**: Available for A1 (server routing and API endpoints)
- **CONFIG**: Available for A2 (build and deployment configuration)  
- **TYPES**: Available for A2 (TypeScript definitions and schemas)
- **DEPS**: 🔒 Locked by A# (dependencies and package management)

## Coordination Rules
- A1(ROUTES) and A2(CONFIG+TYPES) may run in parallel on different AREAS
- All locks expire after 15 minutes of inactivity
- Workers must request locks before starting work
- Workers must mark DONE and release locks when complete
