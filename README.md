# QiAlly Portal - Multi-Tenant Client Portal

A comprehensive multi-tenant client portal featuring AI-powered knowledge bases, real-time collaboration, project management, and intelligent automation tools.

## 🚀 Features

### Core Functionality
- **Multi-Tenant Architecture** - Secure client isolation with customizable branding
- **AI-Powered Knowledge Base** - RAG-enabled chatbots with vector search
- **Real-Time Messaging** - WebSocket-powered communication system
- **Project Management** - Progress tracking with visualization
- **Payment Processing** - Stripe integration for invoicing and payments
- **Modular Design** - Feature flags control client access to modules

### Advanced Capabilities
- **RAG-Enabled Document Chat** - Intelligent document Q&A using OpenAI
- **Admin Dashboard** - Complete client management and "view as client" functionality
- **Role-Based Access Control** - Admin, team member, and client user roles
- **Real-Time Updates** - Live notifications and message synchronization
- **Responsive Design** - Mobile-first glassmorphism UI

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build optimization
- **TailwindCSS** + **Framer Motion** for styling and animations
- **React Router (wouter)** for client-side routing
- **React Query** for state management and API caching
- **Stripe Elements** for payment processing
- **WebSocket** for real-time communication

### Backend
- **Node.js** with Express
- **Multi-tenant data architecture** with client isolation
- **OpenAI API** for RAG functionality (GPT-5)
- **Stripe API** for billing and payments
- **WebSocket Server** for real-time messaging
- **In-memory storage** with database-ready interface

### Key Integrations
- **OpenAI GPT-5** - Latest model for AI-powered responses
- **Stripe** - Payment processing and subscription management
- **Vector Search** - Document embedding for intelligent search
- **WebRTC** - Future video calling capabilities

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional)
- Stripe keys (optional)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Optional: OpenAI for AI chat functionality
OPENAI_API_KEY=your_openai_api_key

# Optional: Stripe for payment processing  
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Development
NODE_ENV=development
PORT=5000
