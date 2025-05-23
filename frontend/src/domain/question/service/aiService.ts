/**
 * AI笔记生成服务
 */
export const fetchAINoteStream = async (
  questionId: number, 
  onDataChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    // 使用自定义URL允许测试不同后端服务
    const apiUrl = `http://localhost:8080/api/AI/${questionId}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取响应的可读流
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    // 用于累积未完整的UTF-8字符
    let buffer = '';
    
    // 处理流式数据
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            // 处理可能存在的最后数据块
            if (buffer.length > 0) {
              onDataChunk(buffer);
              buffer = '';
            }
            onComplete();
            break;
          }
          
          // 将Uint8Array转换为字符串
          const chunk = new TextDecoder().decode(value);
          buffer += chunk;
          onDataChunk(buffer);
        }
      } catch (error) {
        reader.cancel();
        onError(error as Error);
      }
    };

    processStream();
  } catch (error) {
    onError(error as Error);
  }
};