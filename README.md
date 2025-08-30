# QiAlly Portal 🌟

> **Systems That Breathe** — Transforming chaos into clarity through modular systems, client portals, and operational revival.

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/auth)
[![Static KB](https://img.shields.io/badge/Knowledge%20Base-Static%20Generation-10b981?logo=markdown&logoColor=white)](https://quartz.jzhao.xyz/)

## 🚀 Project Overview

QiAlly Portal is a modern client portal and business operations platform that helps small teams transform their operational chaos into streamlined, breathing systems. Built with React and powered by Supabase's secure infrastructure, it provides role-based access to business intelligence, project management, and operational tools.

### 🎯 Mission
**"Systems That Breathe"** — We believe business systems should be living, adaptive, and effortless to use. The QiAlly Portal embodies this philosophy by providing intuitive interfaces that grow with your business.

## 🎯 Project Goals

### **Primary Objectives**
1. **Client Portal Excellence** - Provide a seamless, secure portal for client collaboration
2. **Knowledge Management** - Implement a static knowledge base system with access control
3. **Operational Efficiency** - Streamline business processes and client communication
4. **Scalable Architecture** - Build a foundation that grows with business needs
5. **Security First** - Ensure data protection and role-based access control

### **Technical Goals**
- **Static Site Generation** - Fast, secure knowledge base with no server-side processing
- **Multi-Client Support** - Separate knowledge bases for different organizations
- **Access Control** - Users only see content they're authorized to access
- **Performance** - Sub-second load times and excellent user experience
- **Maintainability** - Clean, documented code that's easy to extend

## ✨ Features

### 🏠 **Public Landing Page**
- **Modern Design**: Beautiful, responsive design with gradient effects and smooth animations
- **Service Showcase**: Comprehensive overview of consulting services and expertise
- **Case Studies**: Real-world success stories with quantified results
- **Client Testimonials**: Social proof from satisfied clients
- **Contact Integration**: Direct email integration for inquiries

### 🔐 **Secure Authentication**
- **Supabase Auth Integration**: Built-in authentication with email/password
- **JWT Token Management**: Secure session handling with automatic token validation
- **Role-Based Access**: Granular permissions for different user types

### 📚 **Static Knowledge Base System**
- **Quartz-Inspired Architecture**: Static file generation for performance and security
- **Multi-Client Support**: Separate knowledge bases for different organizations
- **Access Control**: Users only see knowledge bases they are members of
- **Search Functionality**: Client-side search with Fuse.js
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Admin Interface**: Management tools for knowledge base administration

### 👥 **Role-Based Dashboards**

#### **Client Dashboard**
- **Project Overview**: Active projects, pending tasks, and completion metrics
- **Real-time Activity Feed**: Recent updates and milestones
- **Performance Metrics**: Visual KPIs and progress tracking
- **Secure Document Access**: Protected file sharing and collaboration

#### **Admin Panel**
- **System Monitoring**: User activity, session management, and system health
- **User Management**: Role assignments and access control
- **Analytics Dashboard**: Business intelligence and reporting tools
- **Knowledge Base Management**: Content and access control administration
- **Quick Actions**: Streamlined administrative tasks

### 🎨 **User Experience**
- **Dark/Light Theme Toggle**: Personalized viewing preferences
- **Responsive Design**: Seamless experience across all devices
- **Glass Morphism UI**: Modern, clean interface with depth and clarity
- **Smooth Animations**: Engaging micro-interactions and transitions

## 🛠 Tech Stack

### **Frontend**
- **React 19.1.1** - Latest React with concurrent features
- **React Router 7.8.2** - Modern client-side routing
- **Vite 7.1.2** - Lightning-fast build tool and dev server
- **TailwindCSS 3.4.17** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions

### **Knowledge Base System**
- **Static Generation** - Pre-built HTML files for fast loading
- **Gray Matter** - Frontmatter parsing for markdown files
- **Fast Glob** - File pattern matching for content discovery
- **Fuse.js** - Fuzzy search functionality
- **Marked** - Markdown to HTML conversion

### **Authentication & Security**
- **Supabase Auth** - Built-in authentication with email/password
- **JWT Tokens** - Secure session management
- **Protected Routes** - Role-based access control
- **Row Level Security** - Database-level access control

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Cross-browser compatibility
- **TypeScript** - Type safety and better developer experience

## 🏗 Architecture

```
qiportal-client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProtectedRoute.jsx   # Auth guard component
│   │   ├── ThemeProvider.jsx    # Theme management
│   │   ├── KBAdmin.jsx          # Knowledge base admin
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Dashboard.jsx       # Client dashboard
│   │   ├── AdminPanel.jsx      # Admin interface
│   │   ├── KB.jsx              # Knowledge base interface
│   │   └── ...
│   ├── context/            # React context providers
│   │   └── UserContext.jsx     # User state management
│   ├── utils/              # Utility functions
│   │   └── auth.js             # Authentication helpers
│   └── lib/                # API and external integrations
│       ├── supabase.js         # Supabase client configuration
│       ├── kbApi.js            # Legacy knowledge base API
│       └── staticKbApi.js      # Static knowledge base API
├── kb-content/             # Knowledge base source files
│   ├── zy/                 # Client organization content
│   │   ├── getting-started.md
│   │   └── process-optimization.md
│   └── ...
├── public/kb/              # Generated static knowledge base
│   ├── access-control.json # Access control configuration
│   ├── index.html          # Main portal
│   └── zy/                 # Client-specific KB
├── scripts/                # Build and deployment scripts
│   ├── build-kb.js         # Knowledge base build script
│   └── deploy-kb.js        # Deployment script
├── kb-config.json          # Knowledge base configuration
└── KB_README.md            # Knowledge base documentation
```

## 📊 Current Progress

### ✅ **Completed Features**

#### **Core Platform**
- [x] **Authentication System** - Supabase integration with role-based access
- [x] **Public Landing Page** - Modern, responsive design with service showcase
- [x] **Client Dashboard** - Project overview and activity tracking
- [x] **Admin Panel** - User management and system monitoring
- [x] **Protected Routes** - Secure access control for all features
- [x] **Responsive Design** - Mobile-first approach with glass morphism UI

#### **Knowledge Base System**
- [x] **Static Generation Engine** - Build script for generating static files
- [x] **Multi-Client Support** - Separate knowledge bases per organization
- [x] **Access Control** - Users only see authorized content
- [x] **Search Functionality** - Client-side fuzzy search
- [x] **Markdown Rendering** - Full markdown support with syntax highlighting
- [x] **Admin Interface** - Knowledge base management tools
- [x] **Deployment Scripts** - Automated build and validation

#### **Development Infrastructure**
- [x] **Build System** - Vite configuration with optimization
- [x] **Code Quality** - ESLint setup and code formatting
- [x] **Documentation** - Comprehensive README and KB documentation
- [x] **Deployment Ready** - Cloudflare Pages configuration

### 🚧 **In Progress**

#### **Knowledge Base Enhancements**
- [ ] **React Markdown Integration** - Replace custom markdown parser with react-markdown
- [ ] **Advanced Search** - Server-side search with better indexing
- [ ] **Content Versioning** - Track changes and rollback capabilities
- [ ] **Analytics Integration** - Usage tracking and insights

#### **Platform Features**
- [ ] **Real-time Notifications** - Live updates and alerts
- [ ] **File Management** - Secure document upload and sharing
- [ ] **Project Management** - Task tracking and milestone management
- [ ] **Reporting Dashboard** - Business intelligence and analytics

### 📋 **Planned Features**

#### **Advanced Knowledge Base**
- [ ] **Content Editor** - In-browser markdown editing
- [ ] **Collaboration Tools** - Comments and feedback system
- [ ] **Export Options** - PDF and other format exports
- [ ] **Integration APIs** - Connect with external systems

#### **Platform Extensions**
- [ ] **Mobile App** - React Native companion app
- [ ] **API Gateway** - RESTful API for external integrations
- [ ] **Webhook System** - Real-time event notifications
- [ ] **Advanced Analytics** - Machine learning insights

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase account** (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/qiportal-client.git
   cd qiportal-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build knowledge base (optional)**
   ```bash
   npm run build:kb
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run build:kb      # Build knowledge base only
npm run build:all     # Build KB and main app
npm run deploy:kb     # Deploy knowledge base with validation
npm run deploy:kb-full # Full deployment (KB + app)
npm run preview       # Preview production build
npm run lint          # Run ESLint
```

## 📚 Knowledge Base System

### **Quick Start**

1. **Configure clients** in `kb-config.json`:
   ```json
   {
     "clients": {
       "client-slug": {
         "name": "Client Name",
         "members": ["user@example.com"],
         "public": false
       }
     }
   }
   ```

2. **Add content** to `kb-content/{client-slug}/`:
   ```markdown
   ---
   title: Document Title
   tags: [tag1, tag2]
   description: Document description
   ---
   
   # Content here
   ```

3. **Build and deploy**:
   ```bash
   npm run build:kb
   npm run deploy:kb
   ```

### **Features**
- **Static Generation** - No server-side processing required
- **Access Control** - Users only see authorized content
- **Search** - Client-side fuzzy search with Fuse.js
- **Responsive** - Works on all devices
- **Fast** - Pre-built HTML files for instant loading

For detailed documentation, see [KB_README.md](KB_README.md).

## 🌐 Deployment

This application is optimized for deployment on **Cloudflare Pages** with seamless integration to Supabase for authentication and data storage.

### Environment Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Cloudflare Pages Deployment
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build:all`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare Pages settings

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue to Purple gradient (`from-blue-500 to-purple-500`)
- **Secondary**: Cyan accents (`cyan-500`)
- **Neutral**: Gray scale with proper contrast ratios
- **Glass Effects**: Subtle transparency with backdrop blur

### **Typography**
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif
- **Interactive**: Hover states and transitions

### **Components**
- **Buttons**: Multiple variants (primary, ghost, outlined)
- **Cards**: Glass morphism with subtle shadows
- **Forms**: Consistent styling with validation states

## 📊 Business Impact

### **Proven Results**
- **500+** Clients & Partners served
- **20+** Years of combined experience
- **80+** Solutions & Processes implemented
- **40%** Average process time reduction
- **60%** Onboarding efficiency improvement
- **$250K+** Annual savings uncovered through optimization

### **Services Offered**
- **Management & Operations** - Streamline daily operations
- **Process Improvement** - Optimize workflows and eliminate waste
- **HR & Workforce Optimization** - Enhance team productivity
- **Financial Acumen** - Improve financial processes and reporting
- **Technology & Systems Integration** - Connect and automate systems

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on how to submit pull requests, report issues, and suggest improvements.

### **Development Guidelines**
- Follow the existing code style and patterns
- Add tests for new features
- Update documentation for any changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**QiAlly Team**
- **Email**: [info@qially.me](mailto:info@qially.me)
- **Website**: [https://portal.qially.com](https://portal.qially.com)

---

<div align="center">
  <strong>Built with ❤️ by the QiAlly Team</strong><br>
  <em>Creating systems that breathe, one client at a time.</em>
</div>
