# QiAlly Portal - Multi-Tenant Client Portal

## Overview

QiAlly Portal is a comprehensive multi-tenant client portal platform designed for service providers to manage client relationships through AI-powered knowledge bases, real-time collaboration, and intelligent project management. The system features secure tenant isolation with customizable branding, RAG-enabled document chat using OpenAI GPT-5, WebSocket-powered real-time messaging, Stripe payment integration, and modular feature flags for client access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework Stack**: React 19 with TypeScript, Vite build system, TailwindCSS with Framer Motion for animations
- **Routing**: Wouter (lightweight React Router alternative) for client-side navigation
- **State Management**: React Query (TanStack Query) for server state and API caching, React Context for authentication state
- **Component Library**: Radix UI components with shadcn/ui styling system for consistent design
- **Design System**: Glassmorphism UI with responsive mobile-first approach, CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Data Layer**: In-memory storage with database-ready interface, designed for easy PostgreSQL migration
- **Multi-Tenancy**: Client slug-based tenant isolation with secure data separation
- **Real-Time Communication**: WebSocket server for live messaging and notifications
- **Session Management**: Simple token-based authentication with in-memory session storage

### Authentication & Authorization
- **Authentication**: Email/password with session-based tokens
- **Authorization**: Role-based access control (admin, team_member, client_user)
- **Tenant Security**: Client slug-based data isolation ensuring users only access their tenant's data
- **Admin Features**: "View as client" functionality for administrative oversight

### AI Integration
- **RAG System**: OpenAI GPT-5 integration for intelligent document Q&A
- **Vector Search**: Document embedding and similarity search for knowledge base queries
- **Context Management**: Configurable context file limits and response styling per client
- **Knowledge Base**: File-based markdown system with categorized access controls

### Payment Processing
- **Stripe Integration**: Complete payment processing with Elements for secure card handling
- **Invoice Management**: Automated invoice generation and payment tracking
- **Subscription Support**: Stripe customer and subscription management
- **Payment Intent Flow**: Secure payment confirmation with webhook handling

### Project Management
- **Status Tracking**: Multi-stage project workflow (pending, in_progress, completed, cancelled)
- **Progress Visualization**: Percentage-based progress tracking with visual indicators
- **Client Communication**: Integrated messaging tied to specific projects
- **Due Date Management**: Timeline tracking with automated notifications

### Knowledge Base System
- **File Organization**: Hierarchical category structure with markdown content
- **Access Control**: Per-file visibility settings (public/private) with admin override
- **Search Functionality**: Full-text search with Fuse.js integration
- **AI Chat Interface**: Contextual chatbot that references knowledge base content
- **Version Control**: File update tracking with timestamp management

### Real-Time Features
- **WebSocket Implementation**: Persistent connections for live updates
- **Message Synchronization**: Real-time message delivery with read status tracking
- **Notification System**: Live alerts for project updates, new messages, and system events
- **Connection Management**: Automatic reconnection and connection state monitoring

### UI/UX Design Patterns
- **Glassmorphism**: Modern translucent design with backdrop blur effects
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Animation System**: Framer Motion for smooth transitions and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML structure
- **Loading States**: Comprehensive loading indicators and skeleton screens

## External Dependencies

### Core Services
- **OpenAI GPT-5**: Latest AI model for RAG-enabled knowledge base chat and intelligent document processing
- **Stripe**: Payment processing platform for invoice management and subscription billing
- **WebSocket Protocol**: Real-time bidirectional communication for live messaging

### Database & Storage
- **PostgreSQL**: Primary database (configured via Drizzle ORM, currently using in-memory storage)
- **Neon Database**: Serverless PostgreSQL provider integration ready
- **File Storage**: Local file system for knowledge base markdown files and documents

### Development & Build Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and optimized production builds
- **Drizzle ORM**: Type-safe database interactions with migration support
- **ESBuild**: Server-side bundling for production deployment

### UI Component Libraries
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Lucide Icons**: Consistent iconography throughout the application
- **shadcn/ui**: Pre-built component library built on Radix UI
- **TailwindCSS**: Utility-first CSS framework for rapid styling

### Monitoring & Analytics
- **Replit Integration**: Development environment with runtime error overlay
- **Console Logging**: Structured logging for API requests and WebSocket events
- **Error Boundaries**: React error catching with graceful fallbacks

### Future Integrations
- **Supabase**: Prepared for migration from in-memory storage to Supabase backend
- **WebRTC**: Video calling capabilities for enhanced client communication
- **CDN Integration**: Asset delivery optimization for production deployments