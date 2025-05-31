import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  message, 
  Row, 
  Col, 
  Typography, 
  Alert,
  Statistic,
  Tag
} from 'antd';
import { 
  RobotOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import AIAssistant from '../components/ai/AIAssistant';
import SmartNoteEditor from '../components/ai/SmartNoteEditor';
import aiService from '../services/aiService';

const { Title, Paragraph, Text } = Typography;

const AITestPage: React.FC = () => {
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
  const [noteContent, setNoteContent] = useState(`# 测试笔记

这是一个用于测试AI功能的示例笔记。

## 代码示例

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
\`\`\`

## 要点总结

1. 这个函数计算斐波那契数列
2. 使用递归实现
3. 时间复杂度较高，可以优化

## 技术标签

JavaScript, 算法, 递归, 数学
`);
  const [tags, setTags] = useState<string[]>(['JavaScript', '算法']);

  // 检查AI服务状态
  const checkServiceStatus = async () => {
    setLoading(true);
    try {
      const status = await aiService.getStatus();
      setServiceStatus(status);
      message.success('AI服务连接正常');
    } catch (error: any) {
      message.error(`AI服务连接失败: ${error.message}`);
      setServiceStatus({ status: '离线', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  // 测试AI连接
  const testAIConnection = async () => {
    setLoading(true);
    try {
      const response = await aiService.testConnection();
      if (response.success) {
        setTestResults(prev => ({ ...prev, connection: true }));
        message.success('AI连接测试成功');
      } else {
        setTestResults(prev => ({ ...prev, connection: false }));
        message.error('AI连接测试失败');
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, connection: false }));
      message.error(`连接测试失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 测试各项AI功能
  const testAIFunction = async (functionName: string, testFunction: () => Promise<any>) => {
    setLoading(true);
    try {
      await testFunction();
      setTestResults(prev => ({ ...prev, [functionName]: true }));
      message.success(`${functionName} 测试成功`);
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [functionName]: false }));
      message.error(`${functionName} 测试失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 测试所有功能
  const runAllTests = async () => {
    const tests = [
      {
        name: '生成摘要',
        test: () => aiService.generateSummary(noteContent)
      },
      {
        name: '建议分类',
        test: () => aiService.suggestCategories(noteContent)
      },
      {
        name: '建议标签',
        test: () => aiService.suggestTags(noteContent)
      },
      {
        name: '代码解释',
        test: () => aiService.explainCode('function test() { return "hello"; }')
      },
      {
        name: '内容优化',
        test: () => aiService.optimizeContent('这是一个简单的测试内容')
      }
    ];

    for (const test of tests) {
      await testAIFunction(test.name, test.test);
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '运行中': return 'success';
      case '离线': return 'error';
      default: return 'warning';
    }
  };

  const getTestIcon = (result: boolean | undefined) => {
    if (result === undefined) return null;
    return result ? 
      <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
      <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>
        <RobotOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
        AI功能测试中心
      </Title>
      
      <Paragraph type="secondary">
        这个页面用于测试卡码笔记的AI功能，包括智谱GLM-4-Air模型的各项能力。
      </Paragraph>

      <Row gutter={[16, 16]}>
        {/* 服务状态 */}
        <Col span={24}>
          <Card 
            title="AI服务状态" 
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={checkServiceStatus}
                loading={loading}
              >
                刷新状态
              </Button>
            }
          >
            <Row gutter={16}>
              <Col span={6}>
                <Statistic 
                  title="服务状态" 
                  value={serviceStatus?.status || '检查中'} 
                  valueStyle={{ color: serviceStatus?.status === '运行中' ? '#3f8600' : '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="AI模型" 
                  value={serviceStatus?.model || 'GLM-4-Air'} 
                />
              </Col>
              <Col span={6}>
                <Statistic 
                  title="活跃会话" 
                  value={serviceStatus?.activeSessions || 0} 
                />
              </Col>
              <Col span={6}>
                <Button 
                  type="primary" 
                  onClick={testAIConnection}
                  loading={loading}
                  style={{ marginTop: '16px' }}
                >
                  测试连接
                </Button>
              </Col>
            </Row>
            
            {serviceStatus?.error && (
              <Alert 
                message="服务异常" 
                description={serviceStatus.error} 
                type="error" 
                style={{ marginTop: '16px' }}
              />
            )}
          </Card>
        </Col>

        {/* 功能测试 */}
        <Col span={24}>
          <Card 
            title="功能测试" 
            extra={
              <Button 
                type="primary" 
                onClick={runAllTests}
                loading={loading}
              >
                运行所有测试
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {[
                { key: 'connection', name: 'AI连接测试' },
                { key: '生成摘要', name: '生成摘要' },
                { key: '建议分类', name: '建议分类' },
                { key: '建议标签', name: '建议标签' },
                { key: '代码解释', name: '代码解释' },
                { key: '内容优化', name: '内容优化' }
              ].map(test => (
                <Col span={8} key={test.key}>
                  <Card size="small">
                    <Space>
                      {getTestIcon(testResults[test.key])}
                      <Text>{test.name}</Text>
                      {testResults[test.key] === true && <Tag color="success">通过</Tag>}
                      {testResults[test.key] === false && <Tag color="error">失败</Tag>}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* AI助手测试 */}
        <Col span={12}>
          <AIAssistant noteContent={noteContent} />
        </Col>

        {/* 智能编辑器测试 */}
        <Col span={12}>
          <SmartNoteEditor 
            content={noteContent}
            onContentChange={setNoteContent}
            onTagsChange={setTags}
            existingTags={tags}
          />
        </Col>
      </Row>

      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Title level={4}>AI助手功能</Title>
            <ul>
              <li>智能对话：可以与AI进行技术问题讨论</li>
              <li>快捷操作：一键生成摘要、优化内容等</li>
              <li>上下文记忆：支持多轮对话</li>
              <li>实时响应：即时获得AI反馈</li>
            </ul>
          </Col>
          <Col span={12}>
            <Title level={4}>智能编辑器功能</Title>
            <ul>
              <li>文本选择分析：选择文本后可进行专项分析</li>
              <li>多种AI分析：摘要、优化、标签建议等</li>
              <li>结果应用：可直接将AI建议应用到笔记</li>
              <li>标签智能推荐：自动添加相关标签</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AITestPage; 