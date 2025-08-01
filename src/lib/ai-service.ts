import { CommentGenerationRequest, CommentGenerationResponse } from '@/types';

// Mock AI service for generating comments (simulates OpenAI API calls)
export class AiCommentService {
  async generateComments(request: CommentGenerationRequest): Promise<CommentGenerationResponse> {
    // In a real implementation, this would call the OpenAI API
    // For now, we'll simulate the response with pre-generated comments based on the post content
    
    const { post_content } = request;
    const content = post_content.toLowerCase();
    
    // Generate different types of comments based on keywords in the content
    let tech_comment = "Interesting use of technology. Have you considered exploring newer frameworks that might improve performance?";
    let recruiter_comment = "Great insights! This showcases your expertise in the field. Would love to discuss industry trends.";
    let peer_comment = "Thanks for sharing this valuable perspective. It resonates with challenges I've encountered too.";
    
    // Customize comments based on content keywords
    if (content.includes('innovation') || content.includes('technology') || content.includes('tech')) {
      tech_comment = "The innovation you've highlighted could be transformative. Have you seen the latest developments in this space?";
    } else if (content.includes('leadership') || content.includes('management')) {
      tech_comment = "Your leadership approach aligns with modern tech management philosophies. What tools support this framework?";
    } else if (content.includes('data') || content.includes('ai') || content.includes('machine learning')) {
      tech_comment = "Fascinating data insights. Have you tried implementing these with newer ML frameworks for better results?";
    }
    
    if (content.includes('hiring') || content.includes('recruitment') || content.includes('talent')) {
      recruiter_comment = "This perspective on talent acquisition is refreshing. Would be valuable to share with my network of candidates.";
    } else if (content.includes('career') || content.includes('professional')) {
      recruiter_comment = "This advice is gold for professionals in transition. Mind if I share with candidates seeking growth opportunities?";
    } else if (content.includes('team') || content.includes('collaboration')) {
      recruiter_comment = "Team dynamics you've described align with what top companies seek. Great insight for talent development.";
    }
    
    if (content.includes('challenge') || content.includes('problem')) {
      peer_comment = "I've faced similar challenges. Your approach offers a fresh perspective I hadn't considered before.";
    } else if (content.includes('success') || content.includes('achievement')) {
      peer_comment = "Congratulations on this achievement! Your journey inspires those of us working toward similar goals.";
    } else if (content.includes('question') || content.includes('advice')) {
      peer_comment = "Thoughtful questions. In my experience, exploring multiple viewpoints leads to the best solutions.";
    }
    
    // Simulate delay for a realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      comment_1: tech_comment,
      comment_2: recruiter_comment,
      comment_3: peer_comment
    };
  }
}

// Export a singleton instance
export const aiService = new AiCommentService();