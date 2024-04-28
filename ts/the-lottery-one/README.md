根据您的要求，我已经将部署部分添加到了README文件中。以下是更新后的README文件内容：

# 企业年会抽奖程序

本项目采用Vue 3 + Vite开发的用于企业年会的抽奖的程序，包含前端和后端代码，可在后台配置待抽奖名单。

## 安装

1. 首先确保您已经安装了[Node.js](https://nodejs.org/)（推荐使用最新的长期支持版本）。
2. 在项目根目录下运行以下命令以安装依赖项：

```  bash
   npm install
```

## 使用

### 前端开发

1. 运行以下命令启动前端开发服务器：
``` bash
   npm run dev
```
2. 修改前端源代码并保存，浏览器将自动刷新以显示更改。

### 后端开发

1. 运行以下命令启动后端服务器：
``` bash
   node server.js
```

## 构建与部署

### 前端构建

1. 运行以下命令构建生产版本的前端项目：
``` bash
   npm run build
```
2. 将生成的`dist`文件夹上传到您的服务器，并在服务器上运行`index.html`。

### 部署

> 分为前端部署和后端部署两部分

#### 前端部署

以下是一个Nginx配置的例子，用于部署本项目前端：

下是一个Nginx配置的例子，用于部署本项目前端：

``` nginx
server {
    listen 80;
    location / {
        proxy_buffer_size 4096k;
        proxy_buffers 4 4096k;
        client_max_body_size 1000m;
        # 指向前端构建的dist目录
        root   /data/release/the-lottery-one/dist/;
        try_files  $uri $uri/ /index.html;
    }
    #使用root也可以
    # root /data/release/the-lottery-one/dist;
    # index index.html; 

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log error;


    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
    # 将/api请求转到到后端服务
    location /api/ {
        proxy_pass http://localhost:8081;
        # Proxy headers
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
    }
}
```

#### 后端部署

安装PM2

``` bash
npm install pm2 -g
```
启动项目(将本项目源码放到/data/release/the-lottery-one/， 默认启动8081端口)
``` bash
pm2 start ./server.js
```

