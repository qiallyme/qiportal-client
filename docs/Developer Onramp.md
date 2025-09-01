

This section provides essential information for developers to quickly get up to speed with the QiPortal project.

## Environment Setup

- **Prerequisites**: Node.js v18+, npm v9+, PostgreSQL v14+
- **Installation**: Clone repo and run `npm install`
- **Environment Variables**: Copy `.env.example` to `.env` and configure settings
- **Local Development**: Run `npm run dev` for hot-reload server

## Repository Structure

- **/src**: Source code for the application
- **/src/components**: Reusable UI components
- **/src/modules**: Feature-specific code organized by module
- **/src/lib**: Shared utilities and helpers
- **/src/api**: API routes and handlers
- **/prisma**: Database schema and migrations
- **/public**: Static assets
- **/tests**: Test suites organized by module

## Testing

- **Unit Tests**: Run `npm test` for Jest test suite
- **Integration Tests**: Run `npm run test:integration`
- **E2E Tests**: Run `npm run test:e2e` for Playwright tests
- **Coverage**: Generate reports with `npm run test:coverage`

## Deployment

- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Staging**: Automatic deployment to staging on main branch
- **Production**: Manual promotion from staging with approval
- **Database Migrations**: Run automatically during deployment

## API Documentation

- **OpenAPI Spec**: Available at `/docs` endpoint in development
- **Authentication**: JWT-based with refresh tokens
- **Rate Limiting**: Implemented for all public endpoints