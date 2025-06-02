import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Input,
  Card,
  Space,
  Spin,
  message,
  Dropdown,
  Avatar,
  Divider,
  Badge,
  Typography,
} from 'antd'
import {
  RobotOutlined,
  SendOutlined,
  ClearOutlined,
  MoreOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  CodeOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import aiService, {
  ChatRequest,
  ChatResponse,
  ChatMessage,
} from '../../services/aiService'

const { TextArea } = Input
const { Text, Title } = Typography

interface AIAssistantProps {
  visible?: boolean
  onClose?: () => void
  noteContent?: string // 当前笔记内容，用于智能分析
}

interface ConversationMessage extends ChatMessage {
  id: string
  timestamp: Date
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  visible = true,
  onClose,
  noteContent,
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 快捷操作菜单
  const quickActions = [
    {
      key: 'summarize',
      label: '生成摘要',
      icon: <FileTextOutlined />,
      disabled: !noteContent,
    },
    {
      key: 'optimize',
      label: '优化内容',
      icon: <BulbOutlined />,
      disabled: !noteContent,
    },
    {
      key: 'explain-code',
      label: '解释代码',
      icon: <CodeOutlined />,
      disabled: !noteContent,
    },
    {
      key: 'suggest-tags',
      label: '建议标签',
      icon: <ThunderboltOutlined />,
      disabled: !noteContent,
    },
  ]

  // 滚动到底部
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.parentElement?.scrollTo({
        top: messagesEndRef.current.offsetTop,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送消息
  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (!textToSend) return

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const request: ChatRequest = {
        message: textToSend,
        sessionId,
      }

      const response: ChatResponse = await aiService.chat(request)

      if (response.success) {
        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setSessionId(response.sessionId)
      } else {
        message.error(response.errorMessage || 'AI响应失败')
      }
    } catch (error: any) {
      message.error(error.message || 'AI服务暂时不可用')
    } finally {
      setLoading(false)
    }
  }

  // 快捷操作处理
  const handleQuickAction = async (actionKey: string) => {
    if (!noteContent) {
      message.warning('请先选择或编辑笔记内容')
      return
    }

    setLoading(true)
    try {
      let response
      let promptMessage = ''

      switch (actionKey) {
        case 'summarize':
          response = await aiService.generateSummary(noteContent)
          promptMessage = '请为我的笔记生成摘要：'
          break
        case 'optimize':
          response = await aiService.optimizeContent(noteContent)
          promptMessage = '请帮我优化这个笔记内容：'
          break
        case 'explain-code':
          response = await aiService.explainCode(noteContent)
          promptMessage = '请解释这段代码：'
          break
        case 'suggest-tags':
          response = await aiService.suggestTags(noteContent)
          promptMessage = '请为我的笔记建议标签：'
          break
        default:
          return
      }

      if (response.success) {
        // 添加用户的隐式问题
        const userMessage: ConversationMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: promptMessage,
          timestamp: new Date(),
        }

        // 添加AI的回复
        const assistantMessage: ConversationMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.result,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage, assistantMessage])
      } else {
        message.error(response.errorMessage || '分析失败')
      }
    } catch (error: any) {
      message.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // 清除对话
  const clearConversation = async () => {
    if (sessionId) {
      try {
        await aiService.clearSession(sessionId)
      } catch (error) {
        console.error('清除会话失败:', error)
      }
    }
    setMessages([])
    setSessionId(undefined)
    message.success('对话已清除')
  }

  // 按键处理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!visible) return null

  return (
    <Card
      title={
        <Space>
          <Avatar
            icon={<RobotOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <Title level={5} style={{ margin: 0 }}>
            AI智能助手
          </Title>
          <Badge status="processing" text="在线" />
        </Space>
      }
      extra={
        <Space>
          <Dropdown
            menu={{
              items: quickActions.map((action) => ({
                ...action,
                onClick: () => handleQuickAction(action.key),
              })),
            }}
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<ThunderboltOutlined />}
              disabled={!noteContent}
            >
              快捷操作
            </Button>
          </Dropdown>
          <Button
            type="text"
            icon={<ClearOutlined />}
            onClick={clearConversation}
            disabled={messages.length === 0}
          />
          {onClose && (
            <Button type="text" onClick={onClose}>
              ×
            </Button>
          )}
        </Space>
      }
      style={{
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
      }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
      }}
    >
      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '12px',
          padding: '8px',
          background: '#fafafa',
          borderRadius: '6px',
          scrollBehavior: 'smooth',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#999',
              padding: '40px 20px',
            }}
          >
            <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>👋 你好！我是你的AI助手</div>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              可以问我技术问题、分析笔记内容，或使用快捷操作
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  gap: '8px',
                }}
              >
                <Avatar
                  size="small"
                  style={{
                    backgroundColor:
                      msg.role === 'user' ? '#52c41a' : '#1890ff',
                    flexShrink: 0,
                  }}
                  icon={msg.role === 'user' ? '我' : <RobotOutlined />}
                />
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor:
                      msg.role === 'user' ? '#1890ff' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#000000',
                    border:
                      msg.role === 'assistant' ? '1px solid #d9d9d9' : 'none',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#999',
                  textAlign: msg.role === 'user' ? 'right' : 'left',
                  marginTop: '4px',
                  marginLeft: msg.role === 'user' ? '0' : '32px',
                  marginRight: msg.role === 'user' ? '32px' : '0',
                }}
              >
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="small" />
            <Text style={{ marginLeft: '8px', color: '#999' }}>
              AI正在思考...
            </Text>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <Divider style={{ margin: '8px 0' }} />

      {/* 输入区域 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息... (Shift+Enter换行，Enter发送)"
          autoSize={{ minRows: 1, maxRows: 3 }}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={() => sendMessage()}
          loading={loading}
          disabled={!inputValue.trim()}
        />
      </div>
    </Card>
  )
}

export default AIAssistant
