# **智栈笔记**(intellij Notes) 🤖✨

卡码笔记是一个面向程序员的在线笔记分享和学习平台，集成了**智谱GLM-4-Air大模型**，为程序员提供一个高效的知识分享和交流空间。

## 🚀 AI功能特性

### 🤖 智能AI助手
- **💬 智能对话**: 与AI进行技术问题讨论，获得专业建议
- **📝 笔记分析**: 自动生成摘要、建议标签和分类
- **✨ 内容优化**: 智能优化笔记结构和表达方式
- **📋 大纲生成**: 自动生成清晰的内容大纲
- **🏷️ 标签推荐**: 基于内容智能推荐相关标签

### 🎯 AI驱动的工作流
```mermaid
graph LR
    A[编写笔记] --> B[AI分析]
    B --> C[获得建议]
    C --> D[优化内容]
    D --> E[完善笔记]
    E --> F[智能推荐]
```

## 项目特点

- 📝 支持Markdown格式的笔记编写
- 🔍 强大的笔记搜索功能
- 👥 用户互动和社交功能
- 📊 笔记数据统计和排行
- 🔔 实时消息通知系统
- 📱 响应式设计，支持多端访问
- 🤖 **AI智能助手** - 集成智谱GLM-4-Air模型
- ✨ **智能内容分析** - 自动摘要、标签、优化建议

## 技术栈

***后端技术****

- 核心框架：Spring Boot 3.4.3

- 安全框架：Spring Security

- 持久层：MyBatis

- 数据库：MySQL 8.0

- 缓存：Redis

- 消息推送：WebSocket

- 搜索：MySQL 全文索引 + Jieba 分词

- 文件存储：本地文件系统

- 日志系统：Log4j2

- 测试框架：JUnit

- 模板引擎：Thymeleaf

- Markdown：Flexmark

- 工具库：Hutool

- **AI服务：智谱GLM-4-Air + OkHttp3**

**前端技术**

- 构建工具：Vite
- 框架：React + TypeScript
- 路由管理：React Router DOM
- 状态管理：Redux Toolkit
- UI 库：Ant Design
- 样式：TailwindCSS
- HTTP 客户端：Axios
- WebSocket 客户端：原生 WebSocket
- Markdown 渲染
- 数据可视化
- 代码质量：ESLint, Prettier
- 版本控制：Husky, Lint-staged
- **AI组件：智能助手、智能编辑器**

## 快速开始

### 环境要求
- Node.js 16+
- JDK 17+
- MySQL 8.0+
- Maven 3.8+

### 开发环境搭建

1. 克隆项目
```bash
git clone https://github.com/Qi2yU/Notes.git
cd kama-notes
```

2. 前端启动
```bash
cd frontend
npm install
npm run dev
```

3. 后端启动
```bash
IDEA直接启动
或
cd backend
mvn spring-boot:run
```
4. 数据库文件请联系作者取得

   

## 🤖 AI功能使用指南

### 智能对话助手
1. 点击"打开助手"按钮
2. 输入技术问题或笔记内容
3. 获得AI的专业建议和解答
4. 支持多轮对话和上下文理解

### 智能笔记分析
1. 在笔记编辑器中输入内容
2. 选择要分析的文本（可选）
3. 点击"AI分析"选择功能：
   - 生成摘要：提取核心要点
   - 建议标签：推荐相关标签
   - 内容优化：改善表达结构
   - 生成大纲：创建内容结构

### 快捷操作
- **Ctrl+Enter**: 快速发送消息
- **选中文本**: 自动显示分析选项
- **一键应用**: 直接将AI建议应用到笔记

## 主要功能

### 1. 用户系统
- 用户注册和登录
- 个人信息管理
- 用户主页

### 2. 笔记管理
- 创建和编辑笔记
- 笔记分类和标签
- 笔记收藏
- 笔记搜索
- **AI智能分析和优化**

### 3. 社交功能
- 笔记评论
- 点赞功能
- 消息通知

### 4. 数据统计
- 用户活跃度
- 笔记热度排行
- 个人数据统计

### 5. **AI智能功能**
- 智能对话助手
- 笔记内容分析
- 自动摘要生成
- 智能标签推荐
- 代码解释服务
- 内容优化建议

## 项目结构

```
├── backend/                # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/qy/notes/
│   │   │   │       ├── annotation/   # 自定义注解
│   │   │   │       ├── aspect/       # AOP切面
│   │   │   │       ├── config/       # 配置类
│   │   │   │       ├── controller/   # 控制器
│   │   │   │       │   └── AIController   # AI功能API
│   │   │   │       ├── exception/    # 异常处理
│   │   │   │       ├── filter/       # 过滤器
│   │   │   │       ├── interceptor/  # 拦截器
│   │   │   │       ├── mapper/       # 数据访问层
│   │   │   │       ├── model/        # 数据模型
│   │   │   │       │   └── ai/       # AI相关模型
│   │   │   │       ├── scope/        # 作用域数据
│   │   │   │       ├── service/      # 业务逻辑层
│   │   │   │       │   └── ai/       # AI服务层
│   │   │   │       ├── task/         # 定时任务
│   │   │   │       └── utils/        # 工具类
│   │   │   └── resources/
│   │   │       ├── mapper/          # MyBatis映射文件
│   │   │       └── application.yml  # 配置文件
│   │   └── test/                    # 测试代码
│   └── pom.xml                      # 项目依赖管理
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── components/
│   │   │   └── ai/         # AI组件
│   │   │       ├── AIAssistant      # AI助手
│   │   │       └── SmartNoteEditor  # 智能编辑器
│   │   ├── services/
│   │   │   └── aiService.ts         # AI服务接口
│   │   └── pages/
│   │       └── AITestPage.tsx       # AI功能测试页面
│   └── package.json
```

## 🤖 AI服务配置

### 智谱AI配置
```yaml
zhipu:
  ai:
    api-key: f22b521f28ee4627be95303bf3e07b8c.LELtlyWKBWcFYRXe
    base-url: https://open.bigmodel.cn/api/paas/v4
    default-model: glm-4-air
    default-temperature: 0.7
    default-max-tokens: 1000
```

### API端点
- `POST /api/ai/chat` - 智能对话
- `POST /api/ai/summarize` - 生成摘要
- `POST /api/ai/suggest-tags` - 建议标签
- `POST /api/ai/optimize` - 内容优化
- `GET /api/ai/status` - 服务状态



