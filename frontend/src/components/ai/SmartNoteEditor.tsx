import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Dropdown, 
  Tag, 
  Modal, 
  message, 
  Tooltip,
  Row,
  Col,
  Divider,
  Typography
} from 'antd';
import { 
  RobotOutlined, 
  ThunderboltOutlined,
  BulbOutlined,
  TagsOutlined,
  FileTextOutlined,
  CodeOutlined,
  CheckOutlined,
  CopyOutlined,
  EditOutlined
} from '@ant-design/icons';
import aiService, { NoteAnalysisResponse } from '../../services/aiService';
import AIAssistant from './AIAssistant';

const { Text, Paragraph } = Typography;

interface SmartNoteEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  onTagsChange?: (tags: string[]) => void;
  existingTags?: string[];
}

interface AIResult {
  type: string;
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

const SmartNoteEditor: React.FC<SmartNoteEditorProps> = ({
  content,
  onContentChange,
  title,
  onTitleChange,
  onTagsChange,
  existingTags = []
}) => {
  const [aiResults, setAiResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  // AI分析菜单项
  const aiActions = [
    {
      key: 'summarize',
      label: '生成摘要',
      icon: <FileTextOutlined />,
      description: '为当前笔记生成简洁摘要'
    },
    {
      key: 'optimize',
      label: '优化内容',
      icon: <BulbOutlined />,
      description: '优化笔记结构和表达'
    },
    {
      key: 'suggest-tags',
      label: '建议标签',
      icon: <TagsOutlined />,
      description: '智能推荐相关标签'
    },
    {
      key: 'explain-code',
      label: '解释代码',
      icon: <CodeOutlined />,
      description: '解释代码片段功能'
    },
    {
      key: 'generate-outline',
      label: '生成大纲',
      icon: <EditOutlined />,
      description: '生成内容大纲结构'
    }
  ];

  // 执行AI分析
  const performAIAnalysis = async (actionType: string, textToAnalyze?: string) => {
    const targetContent = textToAnalyze || selectedText || content;
    
    if (!targetContent.trim()) {
      message.warning('请选择要分析的内容或确保笔记不为空');
      return;
    }

    setLoading(prev => ({ ...prev, [actionType]: true }));

    try {
      let response: NoteAnalysisResponse;
      
      switch (actionType) {
        case 'summarize':
          response = await aiService.generateSummary(targetContent);
          break;
        case 'optimize':
          response = await aiService.optimizeContent(targetContent);
          break;
        case 'suggest-tags':
          response = await aiService.suggestTags(targetContent);
          break;
        case 'explain-code':
          response = await aiService.explainCode(targetContent);
          break;
        case 'generate-outline':
          response = await aiService.generateOutline(targetContent);
          break;
        default:
          throw new Error('不支持的分析类型');
      }

      if (response.success) {
        const newResult: AIResult = {
          type: actionType,
          content: response.result,
          suggestions: response.suggestedTags || response.suggestedCategories,
          timestamp: new Date()
        };

        setAiResults(prev => [newResult, ...prev]);

        // 如果是标签建议，自动更新标签
        if (actionType === 'suggest-tags' && response.suggestedTags && onTagsChange) {
          const newTags = [...existingTags];
          response.suggestedTags.forEach(tag => {
            if (!newTags.includes(tag)) {
              newTags.push(tag);
            }
          });
          onTagsChange(newTags);
          message.success('已自动添加建议的标签');
        }

        message.success('AI分析完成');
      } else {
        message.error(response.errorMessage || '分析失败');
      }
    } catch (error: any) {
      message.error(error.message || 'AI服务暂时不可用');
    } finally {
      setLoading(prev => ({ ...prev, [actionType]: false }));
    }
  };

  // 处理文本选择
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  // 应用AI建议
  const applySuggestion = (suggestion: string, type: string) => {
    if (type === 'optimize') {
      Modal.confirm({
        title: '应用优化建议',
        content: '是否要将优化后的内容替换当前笔记内容？',
        onOk: () => {
          onContentChange(suggestion);
          message.success('内容已更新');
        }
      });
    } else {
      // 其他类型的建议添加到内容末尾
      const newContent = `${content}\n\n## AI建议 (${type})\n${suggestion}`;
      onContentChange(newContent);
      message.success('建议已添加到笔记末尾');
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  // 获取AI动作的标题
  const getActionTitle = (type: string) => {
    const action = aiActions.find(a => a.key === type);
    return action?.label || type;
  };

  return (
    <div>
      {/* AI工具栏 */}
      <Card 
        size="small" 
        style={{ marginBottom: '16px' }}
        bodyStyle={{ padding: '12px' }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <RobotOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
              <Text strong>AI智能助手</Text>
              {selectedText && (
                <Tag color="blue" style={{ margin: 0 }}>
                  已选择 {selectedText.length} 个字符
                </Tag>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Dropdown
                menu={{
                  items: aiActions.map(action => ({
                    key: action.key,
                    label: (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {action.icon}
                          <span>{action.label}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                          {action.description}
                        </div>
                      </div>
                    ),
                    onClick: () => performAIAnalysis(action.key)
                  }))
                }}
                trigger={['click']}
                placement="bottomRight"
              >
                <Button 
                  type="primary" 
                  icon={<ThunderboltOutlined />}
                  loading={Object.values(loading).some(Boolean)}
                  disabled={!content.trim()}
                >
                  AI分析
                </Button>
              </Dropdown>
              
              <Button
                icon={<RobotOutlined />}
                onClick={() => setShowAIAssistant(!showAIAssistant)}
              >
                {showAIAssistant ? '隐藏助手' : '打开助手'}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 笔记编辑区域 */}
      <div onMouseUp={handleTextSelection}>
        {/* 这里应该是你的笔记编辑器组件 */}
        <Card 
          title="笔记内容" 
          style={{ marginBottom: '16px' }}
          extra={
            selectedText && (
              <Dropdown
                menu={{
                  items: aiActions.map(action => ({
                    key: action.key,
                    label: `${action.label} (选中文本)`,
                    icon: action.icon,
                    onClick: () => performAIAnalysis(action.key, selectedText)
                  }))
                }}
                trigger={['click']}
              >
                <Button size="small" type="primary" ghost>
                  分析选中内容
                </Button>
              </Dropdown>
            )
          }
        >
          <div style={{ minHeight: '200px', border: '1px solid #d9d9d9', padding: '12px' }}>
            {content || '在这里编写你的笔记...'}
          </div>
        </Card>
      </div>

      {/* AI分析结果 */}
      {aiResults.length > 0 && (
        <Card 
          title="AI分析结果" 
          size="small"
          style={{ marginBottom: '16px' }}
          extra={
            <Button 
              size="small" 
              onClick={() => setAiResults([])}
            >
              清空结果
            </Button>
          }
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {aiResults.map((result, index) => (
              <Card 
                key={index} 
                size="small"
                title={
                  <Space>
                    <Tag color="blue">{getActionTitle(result.type)}</Tag>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {result.timestamp.toLocaleTimeString()}
                    </Text>
                  </Space>
                }
                extra={
                  <Space>
                    <Tooltip title="复制结果">
                      <Button 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(result.content)}
                      />
                    </Tooltip>
                    <Tooltip title="应用到笔记">
                      <Button 
                        size="small" 
                        icon={<CheckOutlined />}
                        onClick={() => applySuggestion(result.content, result.type)}
                      />
                    </Tooltip>
                  </Space>
                }
              >
                <Paragraph 
                  style={{ marginBottom: '8px', whiteSpace: 'pre-wrap' }}
                  ellipsis={{ rows: 3, expandable: true }}
                >
                  {result.content}
                </Paragraph>
                
                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <Text strong style={{ fontSize: '12px' }}>建议项：</Text>
                    <div style={{ marginTop: '4px' }}>
                      {result.suggestions.map((suggestion, idx) => (
                        <Tag 
                          key={idx} 
                          style={{ marginBottom: '4px', cursor: 'pointer' }}
                          onClick={() => {
                            if (result.type === 'suggest-tags' && onTagsChange) {
                              const newTags = [...existingTags];
                              if (!newTags.includes(suggestion)) {
                                newTags.push(suggestion);
                                onTagsChange(newTags);
                                message.success(`已添加标签: ${suggestion}`);
                              }
                            }
                          }}
                        >
                          {suggestion}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </Space>
        </Card>
      )}

      {/* AI助手面板 */}
      {showAIAssistant && (
        <div style={{ position: 'fixed', right: '20px', top: '20px', zIndex: 1000, width: '400px' }}>
          <AIAssistant 
            visible={showAIAssistant}
            onClose={() => setShowAIAssistant(false)}
            noteContent={content}
          />
        </div>
      )}
    </div>
  );
};

export default SmartNoteEditor; 