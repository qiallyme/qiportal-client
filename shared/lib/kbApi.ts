import { apiRequest } from "./queryClient";

export interface KbFile {
  id: string;
  clientSlug: string;
  path: string;
  title: string;
  content?: string;
  tags?: string[];
  visibility: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiChatResponse {
  response: string;
  sources: Array<{
    title: string;
    path: string;
  }>;
}

export const kbApi = {
  async getFiles(clientSlug?: string): Promise<KbFile[]> {
    const params = new URLSearchParams();
    if (clientSlug) params.append("clientSlug", clientSlug);
    
    const res = await apiRequest("GET", `/api/kb?${params}`);
    return res.json();
  },

  async searchFiles(query: string, clientSlug?: string): Promise<KbFile[]> {
    const params = new URLSearchParams({ q: query });
    if (clientSlug) params.append("clientSlug", clientSlug);
    
    const res = await apiRequest("GET", `/api/kb/search?${params}`);
    return res.json();
  },

  async createFile(fileData: {
    clientSlug: string;
    path: string;
    title: string;
    content: string;
    tags?: string[];
    visibility?: string;
  }): Promise<KbFile> {
    const res = await apiRequest("POST", "/api/kb", fileData);
    return res.json();
  },

  async chatWithAi(message: string, clientSlug?: string): Promise<AiChatResponse> {
    const res = await apiRequest("POST", "/api/ai/chat", { message, clientSlug });
    return res.json();
  },
};
