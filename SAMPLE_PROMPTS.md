# Sample Prompts for Structured Development

## 🎯 How to Use These Prompts

These sample prompts demonstrate the structured workflow approach for developing the QiAlly Portal. Copy the appropriate prompt, paste your current seed file, and use it with AI assistance.

## 📋 Sample Prompt 1: Document Management Module Development

```
[Paste SEED_FILE.md content here]

**Task:** Develop the React component and Supabase backend for the "Document Management" module. Include features for:
- File upload with drag-and-drop interface
- File organization and categorization
- Access control based on user roles and client membership
- File preview and download functionality
- Search and filtering capabilities
- Version control and audit trail

**Requirements:**
- React component with TypeScript
- Supabase database functions and RLS policies
- API integration layer
- Error handling and loading states
- Unit tests for component and API functions
- Security: Client-specific access control, file type validation, size limits

**Deliverables:**
- Component code with proper TypeScript types
- Database schema updates and RLS policies
- API integration functions
- Unit test suite
- Documentation for the module

**Technical Specifications:**
- Storage: Supabase Storage with RLS policies
- File Types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images
- Max File Size: 50MB per file
- Security: Client-specific access control
- Performance: Lazy loading and pagination

**Architecture Decisions:**
- Use Supabase Storage for file storage with client-specific buckets
- Implement RLS policies for document access control
- Create reusable upload component with drag-and-drop
- Use React Query for API state management
- Implement file preview using browser capabilities
```

## 📋 Sample Prompt 2: Integration Testing

```
[Paste updated SEED_FILE.md content here]

**Task:** Write integration tests to ensure the backend Document Management API properly interacts with the frontend component. Provide the Jest test suite code.

**Requirements:**
- End-to-end integration tests for file upload flow
- API endpoint testing for all CRUD operations
- Component integration testing with mock data
- Error scenario testing (file too large, invalid type, etc.)
- Performance testing for large file uploads
- Security testing for access control

**Test Scenarios:**
1. User uploads a valid file and can view it in the list
2. User tries to upload file larger than 50MB (should fail)
3. User tries to upload invalid file type (should fail)
4. User from different client tries to access documents (should be denied)
5. Admin user can access all documents
6. File deletion and version control

**Deliverables:**
- Jest integration test suite
- API endpoint test coverage
- Component integration test coverage
- Performance benchmark tests
- Security test cases
```

## 📋 Sample Prompt 3: Security Audit and Optimization

```
[Paste updated SEED_FILE.md content here]

**Task:** Review the Document Management module for potential security vulnerabilities or performance issues. Suggest and implement optimizations.

**Requirements:**
- Security audit of the module (file upload, access control, data exposure)
- Performance analysis and optimization (large files, multiple uploads)
- Code quality improvements (TypeScript types, error handling)
- Accessibility enhancements (ARIA labels, keyboard navigation)
- Documentation updates

**Security Focus Areas:**
- File upload validation and sanitization
- Access control implementation
- Data encryption and storage security
- API endpoint security
- Client-side security measures

**Performance Focus Areas:**
- File upload optimization
- Lazy loading implementation
- Caching strategies
- Bundle size optimization
- Memory usage optimization

**Deliverables:**
- Security audit report with findings
- Performance optimization recommendations
- Refactored code with improvements
- Updated documentation
- Accessibility compliance report
```

## 📋 Sample Prompt 4: Update Seed File

```
[Paste current SEED_FILE.md content here]

**Task:** Summarize the changes made in the Document Management module and update the "Prior Work Summary" section of the seed file. Provide the new, updated seed file.

**Requirements:**
- Comprehensive summary of completed work
- Updated architecture diagrams if needed
- New API endpoints and database changes
- Component structure updates
- Testing coverage summary
- Known issues and technical debt updates
- Next steps and priorities

**Summary Should Include:**
- Database schema changes (documents table, RLS policies)
- New API endpoints (/api/documents/*)
- Component files created/modified
- Testing coverage achieved
- Security measures implemented
- Performance optimizations made
- Remaining technical debt

**Deliverables:**
- Updated seed file with current progress
- Summary of completed features
- Next steps and priorities
- Known issues and technical debt
- Updated architecture diagrams
```

## 🔧 Temperature Settings for Different Tasks

### **Low Temperature (0.1-0.3) - For Coding Tasks**
```
Use this setting when:
- Writing specific code implementations
- Creating database schemas
- Implementing API endpoints
- Writing test cases
- Fixing bugs or errors

Example: "Generate the TypeScript interface for the Document type with strict typing"
```

### **Medium Temperature (0.4-0.6) - For Design Decisions**
```
Use this setting when:
- Choosing between implementation approaches
- Designing component architecture
- Planning API structure
- Making security decisions
- Optimizing performance

Example: "Compare three different approaches for file upload with drag-and-drop"
```

### **High Temperature (0.7-0.9) - For Creative Solutions**
```
Use this setting when:
- Brainstorming new features
- Designing user experience
- Creating innovative solutions
- Exploring alternative architectures
- Generating creative ideas

Example: "Brainstorm innovative ways to improve the document management user experience"
```

## 🛡️ Quality Assurance Prompts

### **Code Review Prompt**
```
Review the generated code for:
- Security vulnerabilities (XSS, CSRF, injection attacks)
- Performance issues (memory leaks, inefficient algorithms)
- TypeScript type safety (proper types, no any types)
- Error handling (try-catch blocks, user feedback)
- Accessibility compliance (ARIA labels, keyboard navigation)
- Code style consistency (ESLint rules, naming conventions)

Provide specific recommendations for improvements with code examples.
```

### **Architecture Review Prompt**
```
Analyze the proposed architecture for:
- Scalability (can it handle growth in users and data?)
- Security (are there any security gaps?)
- Performance (will it meet performance requirements?)
- Maintainability (is the code structure maintainable?)
- Testability (can it be easily tested?)

Provide alternative approaches if needed.
```

### **Security Audit Prompt**
```
Conduct a security audit focusing on:
- Authentication and authorization
- Data validation and sanitization
- File upload security
- API endpoint security
- Client-side security
- Database security (RLS policies)

Provide a detailed security report with risk levels and mitigation strategies.
```

## 📊 Progress Tracking Prompts

### **Weekly Progress Review**
```
Review the past week's development progress:
- Completed tasks and features
- Issues encountered and resolutions
- Technical debt accumulated
- Performance metrics
- Security considerations

Provide recommendations for the upcoming week.
```

### **Sprint Planning**
```
Plan the next development sprint:
- Prioritize tasks based on business value
- Estimate effort for each task
- Identify dependencies and blockers
- Set realistic goals and milestones
- Plan for testing and quality assurance

Create a detailed sprint plan with timelines.
```

---

## 🚀 Getting Started

1. **Copy the SEED_FILE.md content** into your clipboard
2. **Choose the appropriate prompt** from the samples above
3. **Paste the seed file** in the `[Paste SEED_FILE.md content here]` section
4. **Customize the prompt** for your specific needs
5. **Use with AI assistance** following the conversational guardrails
6. **Update the seed file** after completing each module

This structured approach ensures consistent, high-quality development while maintaining clear communication and progress tracking throughout the project lifecycle.
