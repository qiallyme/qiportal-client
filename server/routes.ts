import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import Stripe from "stripe";
import OpenAI from "openai";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertKbFileSchema, insertMessageSchema, insertInvoiceSchema, insertServiceRequestSchema } from "@shared/schema";
import { z } from "zod";

// Initialize services
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

// Simple session tracking for demo
const sessions = new Map<string, { userId: string; clientSlug?: string }>();

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.session = sessions.get(sessionId);
  next();
}

// WebSocket clients map
const wsClients = new Map<string, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionId = Math.random().toString(36);
      sessions.set(sessionId, { userId: user.id, clientSlug: user.clientSlug || undefined });
      
      res.json({ 
        sessionId, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          clientSlug: user.clientSlug,
          name: user.name 
        } 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      const sessionId = Math.random().toString(36);
      sessions.set(sessionId, { userId: user.id, clientSlug: user.clientSlug || undefined });
      
      res.json({ 
        sessionId, 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role, 
          clientSlug: user.clientSlug,
          name: user.name 
        } 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out" });
  });

  // User routes
  app.get("/api/user/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        clientSlug: user.clientSlug,
        name: user.name 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Client routes
  app.get("/api/clients", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user?.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
      }
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/clients/:slug", requireAuth, async (req, res) => {
    try {
      const { slug } = req.params;
      const user = await storage.getUser(req.session.userId);
      
      if (user?.role !== "admin" && user?.clientSlug !== slug) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const client = await storage.getClient(slug);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let projects;
      if (user.role === "admin") {
        const clientSlug = req.query.clientSlug as string;
        if (!clientSlug) {
          return res.status(400).json({ message: "Client slug required for admin" });
        }
        projects = await storage.getProjects(clientSlug);
      } else {
        if (!user.clientSlug) {
          return res.status(400).json({ message: "User has no associated client" });
        }
        projects = await storage.getProjects(user.clientSlug);
      }
      
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const project = await storage.updateProject(id, updates);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Knowledge Base routes
  app.get("/api/kb", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let clientSlug;
      if (user.role === "admin") {
        clientSlug = req.query.clientSlug as string;
        if (!clientSlug) {
          return res.status(400).json({ message: "Client slug required for admin" });
        }
      } else {
        clientSlug = user.clientSlug;
      }
      
      if (!clientSlug) {
        return res.status(400).json({ message: "No client associated" });
      }
      
      const files = await storage.getKbFiles(clientSlug);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/kb/search", requireAuth, async (req, res) => {
    try {
      const { q, clientSlug: queryClientSlug } = req.query;
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let clientSlug;
      if (user.role === "admin") {
        clientSlug = queryClientSlug as string;
      } else {
        clientSlug = user.clientSlug;
      }
      
      if (!clientSlug || !q) {
        return res.status(400).json({ message: "Client slug and query required" });
      }
      
      const files = await storage.searchKbFiles(clientSlug, q as string);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/kb", requireAuth, async (req, res) => {
    try {
      const kbFileData = insertKbFileSchema.parse(req.body);
      const kbFile = await storage.createKbFile(kbFileData);
      res.json(kbFile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", requireAuth, async (req, res) => {
    try {
      if (!openai) {
        return res.status(503).json({ message: "OpenAI service not available" });
      }

      const { message, clientSlug: queryClientSlug } = req.body;
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let clientSlug;
      if (user.role === "admin") {
        clientSlug = queryClientSlug;
      } else {
        clientSlug = user.clientSlug;
      }
      
      if (!clientSlug) {
        return res.status(400).json({ message: "No client associated" });
      }

      // Get relevant KB files for context
      const kbFiles = await storage.searchKbFiles(clientSlug, message);
      const context = kbFiles.slice(0, 3).map(file => 
        `Title: ${file.title}\nContent: ${file.content?.substring(0, 500)}...`
      ).join('\n\n');

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for ${clientSlug}. Use the following knowledge base context to answer questions. If the answer isn't in the context, say so politely.\n\nContext:\n${context}`
          },
          {
            role: "user",
            content: message
          }
        ],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content || '{"response": "I apologize, but I cannot process your request at the moment."}');
      
      res.json({ 
        response: aiResponse.response,
        sources: kbFiles.slice(0, 3).map(file => ({
          title: file.title,
          path: file.path
        }))
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Message routes
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let clientSlug;
      if (user.role === "admin") {
        clientSlug = req.query.clientSlug as string;
        if (!clientSlug) {
          return res.status(400).json({ message: "Client slug required for admin" });
        }
      } else {
        clientSlug = user.clientSlug;
      }
      
      if (!clientSlug) {
        return res.status(400).json({ message: "No client associated" });
      }
      
      const conversations = await storage.getConversations(clientSlug);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        conversationId: id,
        senderId: req.session.userId
      });
      
      const message = await storage.createMessage(messageData);
      
      // Broadcast to WebSocket clients
      const wsMessage = JSON.stringify({
        type: "new_message",
        data: message
      });
      
      wsClients.forEach((ws, clientId) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(wsMessage);
        }
      });
      
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Invoice routes
  app.get("/api/invoices", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let clientSlug;
      if (user.role === "admin") {
        clientSlug = req.query.clientSlug as string;
        if (!clientSlug) {
          return res.status(400).json({ message: "Client slug required for admin" });
        }
      } else {
        clientSlug = user.clientSlug;
      }
      
      if (!clientSlug) {
        return res.status(400).json({ message: "No client associated" });
      }
      
      const invoices = await storage.getInvoices(clientSlug);
      res.json(invoices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe service not available" });
      }

      const { amount, invoiceId } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: { invoiceId }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post("/api/invoices/:id/pay", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { paymentIntentId } = req.body;
      
      const invoice = await storage.updateInvoice(id, {
        status: "paid",
        stripePaymentIntentId: paymentIntentId,
        paidAt: new Date()
      });
      
      res.json(invoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Service Request routes
  app.get("/api/service-requests", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      let clientSlug;
      if (user.role === "admin") {
        clientSlug = req.query.clientSlug as string;
        if (!clientSlug) {
          return res.status(400).json({ message: "Client slug required for admin" });
        }
      } else {
        clientSlug = user.clientSlug;
      }
      
      if (!clientSlug) {
        return res.status(400).json({ message: "No client associated" });
      }
      
      const requests = await storage.getServiceRequests(clientSlug);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/service-requests", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user?.clientSlug) {
        return res.status(400).json({ message: "User has no associated client" });
      }
      
      const requestData = insertServiceRequestSchema.parse({
        ...req.body,
        clientSlug: user.clientSlug,
        userId: user.id
      });
      
      const serviceRequest = await storage.createServiceRequest(requestData);
      res.json(serviceRequest);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws, req) => {
    const clientId = Math.random().toString(36);
    wsClients.set(clientId, ws);
    
    ws.on('close', () => {
      wsClients.delete(clientId);
    });
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        // Handle real-time message events
        console.log('WebSocket message:', message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
  });

  return httpServer;
}
