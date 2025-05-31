import axios, { AxiosResponse } from 'axios';

// AI服务接口类型定义
export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: ChatMessage[];
  modelParams?: ModelParams;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelParams {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface ChatResponse {
  content: string;
  sessionId: string;
  timestamp: string;
  model: string;
  success: boolean;
  errorMessage?: string;
}

export interface NoteAnalysisRequest {
  content: string;
  title?: string;
  analysisType: AnalysisType;
  userId?: number;
  noteId?: number;
}

export type AnalysisType = 
  | 'SUMMARY' 
  | 'CATEGORY' 
  | 'TAGS' 
  | 'OPTIMIZE' 
  | 'EXPLAIN_CODE' 
  | 'GENERATE_OUTLINE' 
  | 'FIND_ERRORS' 
  | 'RELATED_TOPICS';

export interface NoteAnalysisResponse {
  result: string;
  analysisType: AnalysisType;
  suggestedCategories?: string[];
  suggestedTags?: string[];
  relatedTopics?: string[];
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  confidenceScore?: number;
}

// AI服务类
class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  }

  // 创建axios实例
  private createAxiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // AI请求可能较慢，设置60秒超时
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * AI聊天
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<ChatResponse> = await api.post('/api/ai/chat', request);
      return response.data;
    } catch (error) {
      console.error('AI聊天请求失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 笔记分析 - 通用接口
   */
  async analyzeNote(request: NoteAnalysisRequest): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/analyze-note', request);
      return response.data;
    } catch (error) {
      console.error('笔记分析失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 生成笔记摘要
   */
  async generateSummary(content: string): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/summarize', { content });
      return response.data;
    } catch (error) {
      console.error('生成摘要失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 建议分类
   */
  async suggestCategories(content: string): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/suggest-categories', { content });
      return response.data;
    } catch (error) {
      console.error('建议分类失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 建议标签
   */
  async suggestTags(content: string): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/suggest-tags', { content });
      return response.data;
    } catch (error) {
      console.error('建议标签失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 代码解释
   */
  async explainCode(content: string): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/explain-code', { content });
      return response.data;
    } catch (error) {
      console.error('代码解释失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 优化内容
   */
  async optimizeContent(content: string): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/optimize', { content });
      return response.data;
    } catch (error) {
      console.error('优化内容失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 生成大纲
   */
  async generateOutline(content: string): Promise<NoteAnalysisResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<NoteAnalysisResponse> = await api.post('/api/ai/generate-outline', { content });
      return response.data;
    } catch (error) {
      console.error('生成大纲失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 清除会话
   */
  async clearSession(sessionId: string): Promise<void> {
    const api = this.createAxiosInstance();
    try {
      await api.delete(`/api/ai/session/${sessionId}`);
    } catch (error) {
      console.error('清除会话失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 获取AI服务状态
   */
  async getStatus(): Promise<any> {
    const api = this.createAxiosInstance();
    try {
      const response = await api.get('/api/ai/status');
      return response.data;
    } catch (error) {
      console.error('获取AI服务状态失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 测试AI连接
   */
  async testConnection(): Promise<ChatResponse> {
    const api = this.createAxiosInstance();
    try {
      const response: AxiosResponse<ChatResponse> = await api.post('/api/ai/test');
      return response.data;
    } catch (error) {
      console.error('测试AI连接失败:', error);
      throw this.handleError(error);
    }
  }

  /**
   * 错误处理
   */
  private handleError(error: any): Error {
    if (error.response) {
      // 服务器响应错误
      const message = error.response.data?.message || error.response.data?.errorMessage || '服务器错误';
      return new Error(`${message} (${error.response.status})`);
    } else if (error.request) {
      // 网络错误
      return new Error('网络连接失败，请检查网络连接');
    } else {
      // 其他错误
      return new Error(error.message || '未知错误');
    }
  }
}

// 导出单例实例
export const aiService = new AIService();
export default aiService; 