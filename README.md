# QiAlly Portal 🌟

> **Systems That Breathe** — Transforming chaos into clarity through modular systems, client portals, and operational revival.

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Auth-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/auth)

## 🚀 Overview

QiAlly Portal is a modern client portal and business operations platform that helps small teams transform their operational chaos into streamlined, breathing systems. Built with React and powered by Supabase's secure infrastructure, it provides role-based access to business intelligence, project management, and operational tools.

### 🎯 Mission
**"Systems That Breathe"** — We believe business systems should be living, adaptive, and effortless to use. The QiAlly Portal embodies this philosophy by providing intuitive interfaces that grow with your business.

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

### **Authentication & Security**
- **Supabase Auth** - Built-in authentication with email/password
- **JWT Tokens** - Secure session management
- **Protected Routes** - Role-based access control

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Cross-browser compatibility

## 🏗 Architecture

```
qiportal-client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ProtectedRoute.jsx   # Auth guard component
│   │   ├── ThemeProvider.jsx    # Theme management
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Dashboard.jsx       # Client dashboard
│   │   ├── AdminPanel.jsx      # Admin interface
│   │   └── ...
│   ├── context/            # React context providers
│   │   └── UserContext.jsx     # User state management
│   ├── utils/              # Utility functions
│   │   └── auth.js             # Authentication helpers
│   └── lib/                # API and external integrations
├── lib/                    # External integrations
│   ├── supabase.js         # Supabase client configuration
│   └── api.js              # API utilities
├── public/                 # Static assets
└── scripts/                # Development utilities
```

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

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

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
2. Set build command: `npm run build`
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
