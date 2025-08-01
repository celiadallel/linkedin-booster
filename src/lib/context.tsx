import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from './storage';
import { aiService } from './ai-service';
import { 
  User, 
  Post, 
  Agent, 
  CommunityContact, 
  Analytics, 
  CommentGenerationRequest,
  CommentGenerationResponse,
  DashboardStats
} from '@/types';

// Define the application context interface
interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  
  // Posts
  posts: Post[];
  addPost: (url: string, content: string) => Promise<Post>;
  generateComments: (postId: string, content: string) => Promise<Post>;
  selectComment: (postId: string, commentIndex: number) => Promise<Post | null>;
  
  // Community
  communityContacts: CommunityContact[];
  
  // Stats
  stats: DashboardStats;
  
  // Loading states
  isLoading: boolean;
  
  // For exploration
  explorePosts: Post[];
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample data for demonstration
const MOCK_USER_ID = 'user-123';
const INITIAL_MOCK_DATA = {
  user: {
    id: MOCK_USER_ID,
    email: 'demo@example.com',
    name: 'Demo User',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    subscription_status: 'free' as const,
    settings: {}
  },
  posts: [
    {
      id: 'post-1',
      post_url: 'https://linkedin.com/post/sample1',
      post_content: 'Excited to share my thoughts on the latest AI innovations in the workplace!',
      date_added: new Date().toISOString(),
      comment_1: '',
      comment_2: '',
      comment_3: '',
      status: 'pending' as const,
      user_id: MOCK_USER_ID
    },
    {
      id: 'post-2',
      post_url: 'https://linkedin.com/post/sample2',
      post_content: 'Leadership in times of change: How to guide your team through digital transformation',
      date_added: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      comment_1: 'Have you explored using agile methodologies to ease this transition? Modern frameworks can reduce resistance.',
      comment_2: 'Your leadership insight shows valuable change management skills. Many companies are seeking this expertise.',
      comment_3: 'Resonates with our team\'s experience. Finding the balance between tradition and innovation is key.',
      status: 'commented' as const,
      user_id: MOCK_USER_ID
    }
  ],
  community: [
    {
      id: 'contact-1',
      name: 'Sophie Martin',
      linkedin_url: 'https://linkedin.com/in/sophiemartin',
      interactions: 12,
      recent_post: 'https://linkedin.com/post/sophielatest',
      last_interaction_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      engagement_score: 8.5,
      category: 'Industry Expert',
      user_id: MOCK_USER_ID
    },
    {
      id: 'contact-2',
      name: 'Thomas Dubois',
      linkedin_url: 'https://linkedin.com/in/thomasdubois',
      interactions: 5,
      recent_post: 'https://linkedin.com/post/thomaslatest',
      last_interaction_date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      engagement_score: 6.2,
      category: 'Potential Client',
      user_id: MOCK_USER_ID
    },
    {
      id: 'contact-3',
      name: 'Julie Lefevre',
      linkedin_url: 'https://linkedin.com/in/julielefevre',
      interactions: 8,
      recent_post: 'https://linkedin.com/post/julielatest',
      last_interaction_date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      engagement_score: 7.8,
      category: 'Colleague',
      user_id: MOCK_USER_ID
    }
  ]
};

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [communityContacts, setCommunityContacts] = useState<CommunityContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    posts_boosted: 0,
    comments_generated: 0,
    avg_engagement_rate: 0,
    recent_posts: [],
    top_contacts: []
  });

  // Initialize app with sample data
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      try {
        // Check if there's any existing data
        const users = await storage.getUsers();
        
        // If no users exist, add sample data
        if (users.length === 0) {
          // Add sample user
          await storage.createUser(INITIAL_MOCK_DATA.user);
          
          // Add sample posts
          for (const post of INITIAL_MOCK_DATA.posts) {
            await storage.createPost(post);
          }
          
          // Add sample community contacts
          for (const contact of INITIAL_MOCK_DATA.community) {
            await storage.createCommunityContact(contact);
          }
          
          // Create initial analytics
          await storage.createAnalytics({
            user_id: MOCK_USER_ID,
            date: new Date().toISOString(),
            posts_boosted: 1,
            comments_generated: 3,
            avg_engagement_rate: 2.5,
            metrics: {
              total_interactions: 4,
              comment_effectiveness: 0.75
            }
          });
        }
        
        // Load the demo user
        const user = await storage.getUserById(MOCK_USER_ID);
        setCurrentUser(user);
        
        // Load posts for this user
        const userPosts = await storage.getPosts(MOCK_USER_ID);
        setPosts(userPosts);
        
        // Load community contacts
        const contacts = await storage.getCommunityContacts(MOCK_USER_ID);
        setCommunityContacts(contacts);
        
        // Calculate dashboard stats
        updateStats(user?.id || '');
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  // Calculate and update dashboard stats
  const updateStats = async (userId: string) => {
    try {
      const allPosts = await storage.getPosts(userId);
      const allContacts = await storage.getCommunityContacts(userId);
      const analytics = await storage.getAnalytics(userId);
      
      // Get today's analytics or create new if not exists
      const today = new Date().toISOString().split('T')[0];
      let todayAnalytics = analytics.find(a => a.date.includes(today));
      
      if (!todayAnalytics) {
        todayAnalytics = await storage.createAnalytics({
          user_id: userId,
          date: today,
          posts_boosted: 0,
          comments_generated: 0,
          avg_engagement_rate: 0,
          metrics: {
            total_interactions: 0,
            comment_effectiveness: 0
          }
        });
      }
      
      // Calculate stats
      const boostedPosts = allPosts.filter(post => post.status === 'commented');
      const totalComments = boostedPosts.length * 3; // 3 comments per post
      
      // Sort contacts by engagement score
      const topContacts = [...allContacts]
        .sort((a, b) => b.engagement_score - a.engagement_score)
        .slice(0, 5);
      
      // Sort posts by date
      const recentPosts = [...allPosts]
        .sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
        .slice(0, 5);
      
      setStats({
        posts_boosted: boostedPosts.length,
        comments_generated: totalComments,
        avg_engagement_rate: todayAnalytics.avg_engagement_rate || 0,
        recent_posts: recentPosts,
        top_contacts: topContacts
      });
      
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    // In a real app, we would validate credentials against the database
    // For this demo, we just return the mock user
    return INITIAL_MOCK_DATA.user as User;
  };
  
  // Logout function
  const logout = () => {
    // In a real app, we would clear the auth token
    // For this demo, we just set the current user to null
    setCurrentUser(null);
  };
  
  // Add a new post
  const addPost = async (url: string, content: string): Promise<Post> => {
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const newPost = await storage.createPost({
      post_url: url,
      post_content: content,
      date_added: new Date().toISOString(),
      comment_1: '',
      comment_2: '',
      comment_3: '',
      status: 'pending',
      user_id: currentUser.id
    });
    
    setPosts(prev => [...prev, newPost]);
    return newPost;
  };
  
  // Generate comments for a post
  const generateComments = async (postId: string, content: string): Promise<Post> => {
    setIsLoading(true);
    
    try {
      const post = await storage.getPostById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      
      // Call AI service to generate comments
      const request: CommentGenerationRequest = {
        post_url: post.post_url,
        post_content: content
      };
      
      const response = await aiService.generateComments(request);
      
      // Update post with generated comments
      const updatedPost = await storage.updatePost(postId, {
        comment_1: response.comment_1,
        comment_2: response.comment_2,
        comment_3: response.comment_3
      });
      
      if (!updatedPost) {
        throw new Error("Failed to update post");
      }
      
      // Update local state
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      
      // Update analytics
      if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        const analytics = await storage.getAnalytics(currentUser.id);
        const todayAnalytics = analytics.find(a => a.date.includes(today));
        
        if (todayAnalytics) {
          await storage.updateAnalytics(todayAnalytics.id, {
            comments_generated: todayAnalytics.comments_generated + 3
          });
        }
        
        updateStats(currentUser.id);
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Error generating comments:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select a comment for a post
  const selectComment = async (postId: string, commentIndex: number): Promise<Post | null> => {
    try {
      const post = await storage.getPostById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      
      // Update post with selected comment
      const updatedPost = await storage.updatePost(postId, {
        selected_comment: commentIndex,
        status: 'commented'
      });
      
      if (!updatedPost) {
        return null;
      }
      
      // Update local state
      setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      
      // Update analytics
      if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        const analytics = await storage.getAnalytics(currentUser.id);
        const todayAnalytics = analytics.find(a => a.date.includes(today));
        
        if (todayAnalytics) {
          await storage.updateAnalytics(todayAnalytics.id, {
            posts_boosted: todayAnalytics.posts_boosted + 1
          });
        }
        
        updateStats(currentUser.id);
      }
      
      return updatedPost;
    } catch (error) {
      console.error('Error selecting comment:', error);
      return null;
    }
  };
  
  // Value for the context provider
  const value = {
    currentUser,
    login,
    logout,
    posts,
    addPost,
    generateComments,
    selectComment,
    communityContacts,
    stats,
    isLoading,
    explorePosts: posts.filter(p => p.status === 'pending')
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};