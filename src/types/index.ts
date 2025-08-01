// Database Models
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_login: string;
  subscription_status: 'free' | 'premium' | 'trial';
  settings: Record<string, unknown>;
}

export interface Post {
  id: string;
  post_url: string;
  post_content: string;
  date_added: string;
  comment_1: string;
  comment_2: string;
  comment_3: string;
  selected_comment?: number;
  status: 'pending' | 'commented' | 'skipped';
  engagement_metrics?: Record<string, unknown>;
  user_id: string;
}

export interface Agent {
  id: string;
  agent_name: string;
  email?: string;
  ip_proxy?: string;
  last_activity: string;
  daily_comment_count: number;
  daily_limit: number;
  user_id: string;
}

export interface CommunityContact {
  id: string;
  name: string;
  linkedin_url: string;
  interactions: number;
  recent_post?: string;
  last_interaction_date: string;
  engagement_score: number;
  notes?: string;
  category?: string;
  user_id: string;
}

export interface Analytics {
  id: string;
  user_id: string;
  date: string;
  posts_boosted: number;
  comments_generated: number;
  avg_engagement_rate: number;
  top_performing_comment?: string;
  metrics: Record<string, unknown>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Comment Generation
export interface CommentGenerationRequest {
  post_url: string;
  post_content: string;
}

export interface CommentGenerationResponse {
  comment_1: string;
  comment_2: string;
  comment_3: string;
}

// Dashboard Stats
export interface DashboardStats {
  posts_boosted: number;
  comments_generated: number;
  avg_engagement_rate: number;
  recent_posts: Post[];
  top_contacts: CommunityContact[];
}