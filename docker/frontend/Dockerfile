# 构建阶段
FROM bitnami/node:18 as build

WORKDIR /app

# 设置 npm 镜像源为淘宝源
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖，并特别安装 rollup 的 linux 依赖
RUN npm install && \
    npm install @rollup/rollup-linux-x64-gnu

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 运行阶段
FROM bitnami/nginx:latest

# 复制构建产物到 Nginx 目录
COPY --from=build /app/dist /app

# 复制 Nginx 配置
COPY docker/frontend/nginx.conf /opt/bitnami/nginx/conf/server_blocks/default.conf

EXPOSE 80  

CMD ["nginx", "-g", "daemon off;"] 