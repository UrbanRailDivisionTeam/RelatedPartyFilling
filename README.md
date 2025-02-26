# 安全作业申请系统

## 项目简介

安全作业申请系统是一个基于 Vue.js 和 Node.js 的应用，旨在为用户提供一个便捷的安全作业申请流程。用户可以通过微信授权登录，提交安全作业申请，并查看历史记录。

## 技术栈

- 前端: Vue 3, Vite, Element Plus
- 后端: Node.js, Express, MongoDB
- 状态管理: Pinia
- 路由: Vue Router
- 微信授权: 微信 API

## 功能特性

- 用户通过微信授权登录
- 提交安全作业申请
- 查看历史申请记录
- 自动填充上次申请信息
- 响应式设计，适配移动端

## 项目结构

vue-project/
├── src/
│ ├── api/ # API 请求
│ ├── components/ # 组件
│ ├── router/ # 路由配置
│ ├── stores/ # 状态管理
│ ├── utils/ # 工具函数
│ ├── views/ # 视图
│ ├── App.vue # 主应用组件
│ └── main.js # 入口文件
├── safety-backend/ # 后端代码
│ ├── controllers/ # 控制器
│ ├── models/ # 数据模型
│ ├── routes/ # 路由
│ ├── config/ # 配置文件
│ ├── server.js # 服务器入口
│ └── package.json # 后端依赖
├── docker/ # Docker 配置
├── .dockerignore # Docker 忽略文件
├── docker-compose.yml # Docker Compose 配置
└── README.md # 项目说明文档

## 安装与运行

### 前端

1. 克隆项目：
   ```bash
   git clone <repository-url>
   cd vue-project
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

### 后端

1. 进入后端目录：
   ```bash
   cd safety-backend
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动后端服务器：
   ```bash
   npm run dev
   ```

### Docker 部署

1. 使用 Docker Compose 启动服务：
   ```bash
   docker-compose up --build
   ```

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

## 许可证

本项目采用 GNU 通用公共许可证（GPL）进行许可。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。