# QiAlly Portal - Structured Development Workflow

## 🎯 Overview

This document outlines a structured approach to developing the QiAlly Portal using AI assistance. The workflow breaks down the project into small, manageable tasks to minimize context drift and ensure high-quality code.

## 📋 Workflow Structure

### **Phase 1: Architecture & Foundation**
1. **Technical Architecture Overview**
2. **Database Schema Design**
3. **API Structure Definition**
4. **Component Architecture Planning**

### **Phase 2: Module Development**
1. **Authentication Module**
2. **User Management Module**
3. **Knowledge Base Module**
4. **Document Management Module**
5. **Messaging Module**
6. **Project Management Module**

### **Phase 3: Integration & Testing**
1. **Module Integration**
2. **End-to-End Testing**
3. **Performance Optimization**
4. **Security Auditing**

## 🔧 Development Workflow Steps

### **Step 1: Define Architecture and Data Models**

**Prompt Template:**
```
[Paste Seed File Here]

**Task:** Create a technical architecture overview, including the data models for the database. Use Mermaid.js or another diagramming tool for the architecture and provide SQL schemas for the database.

**Requirements:**
- System architecture diagram showing frontend, backend, and database layers
- Database schema with all tables, relationships, and constraints
- API endpoint structure and authentication flow
- Component hierarchy and state management strategy
- Security model and access control implementation

**Deliverables:**
- Mermaid.js architecture diagram
- Complete SQL schema with RLS policies
- API documentation structure
- Component architecture diagram
```

### **Step 2: Develop a Single Module**

**Prompt Template:**
```
[Paste Seed File Here]

**Task:** Develop the React component and Supabase backend for the "[MODULE_NAME]" module. Include features for:
- [List specific features]
- [Security requirements]
- [Performance considerations]

**Requirements:**
- React component with TypeScript
- Supabase database functions and RLS policies
- API integration layer
- Error handling and loading states
- Unit tests for component and API functions

**Deliverables:**
- Component code with proper TypeScript types
- Database schema updates and RLS policies
- API integration functions
- Unit test suite
- Documentation for the module
```

### **Step 3: Integrate and Test**

**Prompt Template:**
```
[Paste Seed File Here]

**Task:** Write integration tests to ensure the backend [MODULE_NAME] API properly interacts with the frontend component. Provide the Jest test suite code.

**Requirements:**
- End-to-end integration tests
- API endpoint testing
- Component integration testing
- Error scenario testing
- Performance testing

**Deliverables:**
- Jest integration test suite
- API endpoint test coverage
- Component integration test coverage
- Performance benchmark tests
```

### **Step 4: Refactor and Optimize**

**Prompt Template:**
```
[Paste Seed File Here]

**Task:** Review the [MODULE_NAME] module for potential security vulnerabilities or performance issues. Suggest and implement optimizations.

**Requirements:**
- Security audit of the module
- Performance analysis and optimization
- Code quality improvements
- Accessibility enhancements
- Documentation updates

**Deliverables:**
- Security audit report
- Performance optimization recommendations
- Refactored code with improvements
- Updated documentation
```

### **Step 5: Update the Seed File**

**Prompt Template:**
```
[Paste Seed File Here]

**Task:** Summarize the changes made in the [MODULE_NAME] module and update the "Prior Work Summary" section of the seed file. Provide the new, updated seed file.

**Requirements:**
- Comprehensive summary of completed work
- Updated architecture diagrams if needed
- New API endpoints and database changes
- Component structure updates
- Testing coverage summary

**Deliverables:**
- Updated seed file with current progress
- Summary of completed features
- Next steps and priorities
- Known issues and technical debt
```

## 🛡️ Conversational Guardrails

### **1. Low Temperature Setting**
- **For coding tasks:** Use temperature 0.1-0.3 for deterministic, consistent code
- **For brainstorming:** Use temperature 0.7-0.9 for creative solutions
- **For review tasks:** Use temperature 0.2-0.4 for balanced analysis

### **2. Reasoning Requests**
**Before generating complex code:**
```
"Explain the proposed solution before writing any code. Include:
- Architecture decisions and trade-offs
- Security considerations
- Performance implications
- Testing strategy
- Potential edge cases"
```

### **3. Alternative Solutions**
**For major architectural decisions:**
```
"Provide two or three alternative solutions and explain the trade-offs of each:
- Solution A: [Description]
- Solution B: [Description] 
- Solution C: [Description]

Include pros/cons, complexity, performance, and maintainability for each."
```

### **4. Code Validation**
**After generating code:**
```
"Review the generated code for:
- Security vulnerabilities
- Performance issues
- TypeScript type safety
- Error handling
- Accessibility compliance
- Code style consistency

Provide specific recommendations for improvements."
```

## 📝 Seed File Template

```markdown
# QiAlly Portal - Development Seed File

## 🎯 Project Overview
**Goal:** Build a secure, all-in-one client portal for document management, messaging, knowledge base, and project management.

**Tech Stack:**
- Frontend: React 19.1.1 + Vite + TailwindCSS + Framer Motion
- Backend: Supabase (PostgreSQL + Auth + Real-time)
- Deployment: Cloudflare Pages (frontend hosting only)
- Authentication: Supabase Auth (exclusive)
- Testing: Jest + React Testing Library

## 🏗️ Current Architecture

### System Architecture
```mermaid
[Current architecture diagram]
```

### Database Schema
```sql
[Current database schema]
```

### API Structure
```
[Current API endpoints]
```

### Component Hierarchy
```
[Current component structure]
```

## 📋 Prior Work Summary

### Completed Modules
- [ ] Authentication System
- [ ] User Management
- [ ] Knowledge Base (Static Generation)
- [ ] Document Management
- [ ] Messaging System
- [ ] Project Management

### Current Progress
**Phase:** [Current Phase]
**Module:** [Current Module]
**Status:** [In Progress/Completed/Testing]

### Recent Changes
- [Date] - [Description of changes]
- [Date] - [Description of changes]

### Known Issues
- [Issue 1]
- [Issue 2]

### Technical Debt
- [Debt item 1]
- [Debt item 2]

## 🎯 Next Steps

### Immediate Tasks
1. [Task 1]
2. [Task 2]
3. [Task 3]

### Upcoming Milestones
- [Milestone 1] - [Target Date]
- [Milestone 2] - [Target Date]

## 🔧 Development Environment

### Local Setup
```bash
# Commands to run the project
npm install
npm run dev
npm run build:kb
npm run build:all
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Testing Commands
```bash
npm test
npm run test:integration
npm run test:e2e
```

## 📚 Documentation Links
- [README.md](./README.md)
- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
```

## 🚀 Module Development Templates

### **Authentication Module Template**
```typescript
// src/modules/auth/AuthProvider.tsx
// src/modules/auth/LoginForm.tsx
// src/modules/auth/ProtectedRoute.tsx
// src/lib/auth.ts
// tests/auth.test.ts
```

### **Document Management Template**
```typescript
// src/modules/documents/DocumentList.tsx
// src/modules/documents/DocumentUpload.tsx
// src/modules/documents/DocumentViewer.tsx
// src/lib/documents.ts
// tests/documents.test.ts
```

### **Knowledge Base Template**
```typescript
// src/modules/kb/KBPortal.tsx
// src/modules/kb/KBViewer.tsx
// src/modules/kb/KBSearch.tsx
// src/lib/staticKbApi.ts
// tests/kb.test.ts
```

## 📊 Quality Assurance Checklist

### **Before Code Review**
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Loading states are managed
- [ ] Accessibility features are included
- [ ] Unit tests are written
- [ ] Code follows project style guide

### **Before Integration**
- [ ] API endpoints are tested
- [ ] Database queries are optimized
- [ ] Security policies are implemented
- [ ] Performance is acceptable
- [ ] Documentation is updated

### **Before Deployment**
- [ ] Integration tests pass
- [ ] End-to-end tests pass
- [ ] Security audit is completed
- [ ] Performance benchmarks are met
- [ ] User acceptance testing is done

## 🔄 Iteration Process

### **Daily Development Cycle**
1. **Morning:** Review current seed file and plan day's tasks
2. **Development:** Work on assigned module using structured prompts
3. **Afternoon:** Test and validate completed work
4. **Evening:** Update seed file and plan next day

### **Weekly Review Cycle**
1. **Monday:** Review previous week's progress
2. **Wednesday:** Mid-week checkpoint and adjustments
3. **Friday:** Complete weekly goals and update documentation

### **Sprint Planning**
1. **Sprint Start:** Define sprint goals and tasks
2. **Sprint Middle:** Review progress and adjust priorities
3. **Sprint End:** Complete sprint goals and plan next sprint

---

This structured workflow ensures consistent, high-quality development while maintaining clear communication and progress tracking throughout the project lifecycle.
