import { 
  User, 
  Post, 
  Agent, 
  CommunityContact, 
  Analytics,
} from '@/types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'linkedin_booster_users',
  CURRENT_USER: 'linkedin_booster_current_user',
  POSTS: 'linkedin_booster_posts',
  AGENTS: 'linkedin_booster_agents',
  COMMUNITY: 'linkedin_booster_community',
  ANALYTICS: 'linkedin_booster_analytics',
};

// Interface for storage providers
export interface StorageProvider {
  // Users
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User | null>;
  createUser(user: Omit<User, 'id'>): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User | null>;
  
  // Posts
  getPosts(userId?: string): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  createPost(post: Omit<Post, 'id'>): Promise<Post>;
  updatePost(id: string, postData: Partial<Post>): Promise<Post | null>;
  
  // Agents
  getAgents(userId?: string): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | null>;
  createAgent(agent: Omit<Agent, 'id'>): Promise<Agent>;
  updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent | null>;
  
  // Community
  getCommunityContacts(userId?: string): Promise<CommunityContact[]>;
  getCommunityContactById(id: string): Promise<CommunityContact | null>;
  createCommunityContact(contact: Omit<CommunityContact, 'id'>): Promise<CommunityContact>;
  updateCommunityContact(id: string, contactData: Partial<CommunityContact>): Promise<CommunityContact | null>;
  
  // Analytics
  getAnalytics(userId?: string): Promise<Analytics[]>;
  createAnalytics(analytics: Omit<Analytics, 'id'>): Promise<Analytics>;
  updateAnalytics(id: string, analyticsData: Partial<Analytics>): Promise<Analytics | null>;
  
  // General
  clear(): Promise<void>;
}

// LocalStorage implementation
class LocalStorageProvider implements StorageProvider {
  // Helper method to generate UUID
  private generateId(): string {
    return crypto.randomUUID();
  }

  // Helper methods to get and set data
  private async getData<T>(key: string): Promise<T[]> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private async setData<T>(key: string, data: T[]): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Users
  async getUsers(): Promise<User[]> {
    return this.getData<User>(STORAGE_KEYS.USERS);
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const users = await this.getUsers();
    const newUser = { ...userData, id: this.generateId() };
    users.push(newUser as User);
    await this.setData(STORAGE_KEYS.USERS, users);
    return newUser as User;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const users = await this.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...userData };
    await this.setData(STORAGE_KEYS.USERS, users);
    return users[index];
  }

  // Posts
  async getPosts(userId?: string): Promise<Post[]> {
    const posts = await this.getData<Post>(STORAGE_KEYS.POSTS);
    return userId ? posts.filter(post => post.user_id === userId) : posts;
  }

  async getPostById(id: string): Promise<Post | null> {
    const posts = await this.getPosts();
    return posts.find(post => post.id === id) || null;
  }

  async createPost(postData: Omit<Post, 'id'>): Promise<Post> {
    const posts = await this.getPosts();
    const newPost = { ...postData, id: this.generateId() };
    posts.push(newPost as Post);
    await this.setData(STORAGE_KEYS.POSTS, posts);
    return newPost as Post;
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
    const posts = await this.getPosts();
    const index = posts.findIndex(post => post.id === id);
    
    if (index === -1) return null;
    
    posts[index] = { ...posts[index], ...postData };
    await this.setData(STORAGE_KEYS.POSTS, posts);
    return posts[index];
  }

  // Agents
  async getAgents(userId?: string): Promise<Agent[]> {
    const agents = await this.getData<Agent>(STORAGE_KEYS.AGENTS);
    return userId ? agents.filter(agent => agent.user_id === userId) : agents;
  }

  async getAgentById(id: string): Promise<Agent | null> {
    const agents = await this.getAgents();
    return agents.find(agent => agent.id === id) || null;
  }

  async createAgent(agentData: Omit<Agent, 'id'>): Promise<Agent> {
    const agents = await this.getAgents();
    const newAgent = { ...agentData, id: this.generateId() };
    agents.push(newAgent as Agent);
    await this.setData(STORAGE_KEYS.AGENTS, agents);
    return newAgent as Agent;
  }

  async updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent | null> {
    const agents = await this.getAgents();
    const index = agents.findIndex(agent => agent.id === id);
    
    if (index === -1) return null;
    
    agents[index] = { ...agents[index], ...agentData };
    await this.setData(STORAGE_KEYS.AGENTS, agents);
    return agents[index];
  }

  // Community
  async getCommunityContacts(userId?: string): Promise<CommunityContact[]> {
    const contacts = await this.getData<CommunityContact>(STORAGE_KEYS.COMMUNITY);
    return userId ? contacts.filter(contact => contact.user_id === userId) : contacts;
  }

  async getCommunityContactById(id: string): Promise<CommunityContact | null> {
    const contacts = await this.getCommunityContacts();
    return contacts.find(contact => contact.id === id) || null;
  }

  async createCommunityContact(contactData: Omit<CommunityContact, 'id'>): Promise<CommunityContact> {
    const contacts = await this.getCommunityContacts();
    const newContact = { ...contactData, id: this.generateId() };
    contacts.push(newContact as CommunityContact);
    await this.setData(STORAGE_KEYS.COMMUNITY, contacts);
    return newContact as CommunityContact;
  }

  async updateCommunityContact(id: string, contactData: Partial<CommunityContact>): Promise<CommunityContact | null> {
    const contacts = await this.getCommunityContacts();
    const index = contacts.findIndex(contact => contact.id === id);
    
    if (index === -1) return null;
    
    contacts[index] = { ...contacts[index], ...contactData };
    await this.setData(STORAGE_KEYS.COMMUNITY, contacts);
    return contacts[index];
  }

  // Analytics
  async getAnalytics(userId?: string): Promise<Analytics[]> {
    const analyticsData = await this.getData<Analytics>(STORAGE_KEYS.ANALYTICS);
    return userId ? analyticsData.filter(data => data.user_id === userId) : analyticsData;
  }

  async createAnalytics(analyticsData: Omit<Analytics, 'id'>): Promise<Analytics> {
    const analytics = await this.getAnalytics();
    const newAnalytics = { ...analyticsData, id: this.generateId() };
    analytics.push(newAnalytics as Analytics);
    await this.setData(STORAGE_KEYS.ANALYTICS, analytics);
    return newAnalytics as Analytics;
  }

  async updateAnalytics(id: string, analyticsData: Partial<Analytics>): Promise<Analytics | null> {
    const analytics = await this.getAnalytics();
    const index = analytics.findIndex(data => data.id === id);
    
    if (index === -1) return null;
    
    analytics[index] = { ...analytics[index], ...analyticsData };
    await this.setData(STORAGE_KEYS.ANALYTICS, analytics);
    return analytics[index];
  }

  // Clear all data
  async clear(): Promise<void> {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Factory to create the appropriate storage provider
export function createStorageProvider(): StorageProvider {
  // Here we would check if Supabase is enabled and return the appropriate provider
  // For now, we just return the LocalStorageProvider
  return new LocalStorageProvider();
}

// Create and export the storage instance
export const storage = createStorageProvider();