import { 
  type User, 
  type InsertUser, 
  type Client, 
  type InsertClient,
  type Project,
  type InsertProject,
  type KbFile,
  type InsertKbFile,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Invoice,
  type InsertInvoice,
  type ServiceRequest,
  type InsertServiceRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User>;

  // Clients
  getClient(slug: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(slug: string, updates: Partial<Client>): Promise<Client>;
  getClientUsers(clientSlug: string): Promise<User[]>;

  // Projects
  getProjects(clientSlug: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;

  // Knowledge Base
  getKbFiles(clientSlug: string): Promise<KbFile[]>;
  getKbFile(id: string): Promise<KbFile | undefined>;
  createKbFile(kbFile: InsertKbFile): Promise<KbFile>;
  updateKbFile(id: string, updates: Partial<KbFile>): Promise<KbFile>;
  searchKbFiles(clientSlug: string, query: string): Promise<KbFile[]>;

  // Conversations & Messages
  getConversations(clientSlug: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(conversationId: string, userId: string): Promise<void>;

  // Invoices
  getInvoices(clientSlug: string): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice>;

  // Service Requests
  getServiceRequests(clientSlug: string): Promise<ServiceRequest[]>;
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private clients: Map<string, Client> = new Map();
  private projects: Map<string, Project> = new Map();
  private kbFiles: Map<string, KbFile> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message> = new Map();
  private invoices: Map<string, Invoice> = new Map();
  private serviceRequests: Map<string, ServiceRequest> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create demo admin user
    const adminUser: User = {
      id: randomUUID(),
      email: "admin@qially.com",
      password: "hashed_password",
      role: "admin",
      clientSlug: null,
      name: "John Doe",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Create demo clients
    const acmeClient: Client = {
      id: randomUUID(),
      slug: "acme-corp",
      name: "Acme Corp",
      branding: { primaryColor: "#6366F1", logo: null },
      featureFlags: { projects: true, kb: true, messages: true, payments: true, aiChat: true },
      settings: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(acmeClient.slug, acmeClient);

    // Create demo client user
    const clientUser: User = {
      id: randomUUID(),
      email: "sarah@acmecorp.com",
      password: "hashed_password",
      role: "client_user",
      clientSlug: "acme-corp",
      name: "Sarah Miller",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(clientUser.id, clientUser);

    // Create demo projects
    const project1: Project = {
      id: randomUUID(),
      clientSlug: "acme-corp",
      title: "Website Redesign",
      description: "Complete redesign of company website",
      status: "in_progress",
      progress: 65,
      dueDate: new Date("2024-12-15"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(project1.id, project1);

    // Create demo KB files
    const kbFile1: KbFile = {
      id: randomUUID(),
      clientSlug: "acme-corp",
      path: "/brand/style-guide.md",
      title: "Brand Style Guide",
      content: "Complete brand guidelines including logo usage, colors, and typography...",
      tags: ["brand", "design", "guidelines"],
      visibility: "private",
      embedding: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.kbFiles.set(kbFile1.id, kbFile1);

    // Create demo invoice
    const invoice1: Invoice = {
      id: randomUUID(),
      clientSlug: "acme-corp",
      projectId: project1.id,
      invoiceNumber: "INV-001",
      amount: "3850.00",
      status: "pending",
      stripePaymentIntentId: null,
      dueDate: new Date("2024-12-15"),
      paidAt: null,
      createdAt: new Date(),
    };
    this.invoices.set(invoice1.id, invoice1);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: string, customerId: string, subscriptionId: string): Promise<User> {
    return this.updateUser(id, { stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId });
  }

  // Client methods
  async getClient(slug: string): Promise<Client | undefined> {
    return this.clients.get(slug);
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(client.slug, client);
    return client;
  }

  async updateClient(slug: string, updates: Partial<Client>): Promise<Client> {
    const client = this.clients.get(slug);
    if (!client) throw new Error("Client not found");
    const updatedClient = { ...client, ...updates, updatedAt: new Date() };
    this.clients.set(slug, updatedClient);
    return updatedClient;
  }

  async getClientUsers(clientSlug: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.clientSlug === clientSlug);
  }

  // Project methods
  async getProjects(clientSlug: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.clientSlug === clientSlug);
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Knowledge Base methods
  async getKbFiles(clientSlug: string): Promise<KbFile[]> {
    return Array.from(this.kbFiles.values()).filter(file => file.clientSlug === clientSlug);
  }

  async getKbFile(id: string): Promise<KbFile | undefined> {
    return this.kbFiles.get(id);
  }

  async createKbFile(insertKbFile: InsertKbFile): Promise<KbFile> {
    const id = randomUUID();
    const kbFile: KbFile = {
      ...insertKbFile,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.kbFiles.set(id, kbFile);
    return kbFile;
  }

  async updateKbFile(id: string, updates: Partial<KbFile>): Promise<KbFile> {
    const kbFile = this.kbFiles.get(id);
    if (!kbFile) throw new Error("KB file not found");
    const updatedKbFile = { ...kbFile, ...updates, updatedAt: new Date() };
    this.kbFiles.set(id, updatedKbFile);
    return updatedKbFile;
  }

  async searchKbFiles(clientSlug: string, query: string): Promise<KbFile[]> {
    const files = await this.getKbFiles(clientSlug);
    return files.filter(file => 
      file.title.toLowerCase().includes(query.toLowerCase()) ||
      file.content?.toLowerCase().includes(query.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Conversation methods
  async getConversations(clientSlug: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(conv => conv.clientSlug === clientSlug);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    for (const [id, message] of this.messages.entries()) {
      if (message.conversationId === conversationId && message.senderId !== userId) {
        this.messages.set(id, { ...message, isRead: true });
      }
    }
  }

  // Invoice methods
  async getInvoices(clientSlug: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.clientSlug === clientSlug);
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      createdAt: new Date(),
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const invoice = this.invoices.get(id);
    if (!invoice) throw new Error("Invoice not found");
    const updatedInvoice = { ...invoice, ...updates };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  // Service Request methods
  async getServiceRequests(clientSlug: string): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values()).filter(req => req.clientSlug === clientSlug);
  }

  async createServiceRequest(insertServiceRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = randomUUID();
    const serviceRequest: ServiceRequest = {
      ...insertServiceRequest,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.serviceRequests.set(id, serviceRequest);
    return serviceRequest;
  }

  async updateServiceRequest(id: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    const serviceRequest = this.serviceRequests.get(id);
    if (!serviceRequest) throw new Error("Service request not found");
    const updatedServiceRequest = { ...serviceRequest, ...updates, updatedAt: new Date() };
    this.serviceRequests.set(id, updatedServiceRequest);
    return updatedServiceRequest;
  }
}

export const storage = new MemStorage();
