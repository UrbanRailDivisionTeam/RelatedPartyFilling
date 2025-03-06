FROM bitnami/node:18

WORKDIR /app

# 设置 npm 镜像源为淘宝源
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

EXPOSE 3000

CMD ["npm", "start"] 