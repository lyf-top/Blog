---
title: Docker配置
description: Docker学习之路开启
image: 'https://img.f3f3.top/img/2026/04/28/5c5119127bd1dce79e7c5bd4af9a0070.webp' #文章封面页
tags:
  - Docker初识与进阶
category:  运维
  #永久连接id
abbrlink: "41225412"
# 文章置顶
pinned: false #文章置顶
published: 2026-07-04 20:19:03
updated: 2026-07-04 21:43:03
---

## Docker 概述

- 一个“装应用的盒子”标准：镜像像模具，容器像成品，哪里都能稳定复现。

- 解决“我电脑能跑、他电脑跑不起来”的环境不一致问题

### 卸载旧版

```
yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine \
    docker-selinux 
```

### 安装Docker

#### 配置yum库

```
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

安装成功后，执行命令，配置Docker的yum源（已更新为阿里云源）

```
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
 
sudo sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
```

更新yum，建立缓存

```
sudo yum makecache fast
```

安装docker

```
yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### 启动和校验

```
配置镜像加速# 启动
Docker systemctl start docker 
# 停止
Docker systemctl stop docker 
# 重启 
systemctl restart docker 
# 设置开机自启 
systemctl enable docker 
# 执行docker ps命令，如果不报错，说明安装启动成功 
docker ps
```

#### 配置镜像加速

```
# 创建目录 
rm -f /etc/docker/daemon.json 
 
# 复制内容 
tee /etc/docker/daemon.json <<-'EOF' { 
"registry-mirrors": [ 
"http://hub-mirror.c.163.com", 
"https://mirrors.tuna.tsinghua.edu.cn",
"http://mirrors.sohu.com", 
"https://ustc-edu-cn.mirror.aliyuncs.com", 
"https://ccr.ccs.tencentyun.com", 
"https://docker.m.daocloud.io",
"https://docker.awsl9527.cn" ] } EOF 
 
# 重新加载配置 
systemctl daemon-reload 
 
# 重启
Docker systemctl restart docker
```

### 命令解读

```
docker run -d \ 
--name mysql \ 
-p 3306:3306 \ 
-e TZ=Asia/Shanghai \ 
-e MYSQL_ROOT_PASSWORD=123 \ 
mysql
```

- docker run -d :  创建并运行一个容器，-d 则是让容器以后台进程运行

- --name mysql : 自定义容器名
- -p 3306 : 3306: 设置端口映射
- 容器是隔离环境，外界不可访问。但是可以将宿主机端口映射容器内到端口，当访问宿主机指定端口时，就是在访问容器内的端口了。

- 容器内端口往往是由容器内的进程决定                                                                    例如MySQL进程默认端口是3306，因此容器内端口一定是3306；而宿主机端口则可以任意指定，一般与容器内保持一致。

- 格式： -p 宿主机端口:容器内端口，示例中就是将宿主机的3306映射到容器内的3306端口

- -e MYSQL_ROOT_PASSWORD=123 配置容器内进程运行时的一些参数
- 格式：-e KEY=VALUE，KEY和VALUE都由容器内进程决定

- 案例中，TZ=Asia/Shanghai是设置时区；MYSQL_ROOT_PASSWORD=123是设置MySQL默认密码

- mysql 设置镜像名称，Docker会根据这个名字搜索并下载镜像

- 格式：REPOSITORY:TAG，其中REPOSITORY可以理解为镜像名，TAG是版本号

- 在未指定TAG的情况下，默认是最新版本，也就是mysql:latest

## 基础命令

| 命令             |              说明              | 文档地址        |
| ---------------- | :----------------------------: | --------------- |
| `docker pull`    |            拉取镜像            | docker pull     |
| `docker push`    |   推送镜像到 Docker Registry   | docker push     |
| `docker images`  |          查看本地镜像          | docker images   |
| `docker rmi`     |          删除本地镜像          | docker rmi      |
| `docker run`     | 创建并运行容器（不能重复创建） | docker run      |
| `docker stop`    |          停止指定容器          | docker stop     |
| `docker start`   |          启动指定容器          | docker start    |
| `docker restart` |          重新启动容器          | docker restart  |
| `docker rm`      |          删除指定容器          | docs.docker.com |
| `docker ps`      |            查看容器            | docker ps       |
| `docker logs`    |        查看容器运行日志        | docker logs     |
| `docker exec`    |            进入容器            | docker exec     |
| `docker save`    |     保存镜像到本地压缩文件     | docker save     |
| `docker load`    |     加载本地压缩文件到镜像     | docker load     |
| `docker inspect` |        查看容器详细信息        | docker inspect  |

![image.webp](https://imgbed.f3f3.top/file/picgo/1783254465651_image.webp)

### Ngnix演示

```
# 第1步，去DockerHub查看nginx镜像仓库及相关信息
 
# 第2步，拉取Nginx镜像
docker pull nginx
 
# 第3步，查看镜像
docker images
# 结果如下：
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
nginx        latest    605c77e624dd   16 months ago   141MB
mysql        latest    3218b38490ce   17 months ago   516MB
 
# 第4步，创建并允许Nginx容器
docker run -d --name nginx -p 80:80 nginx
 
# 第5步，查看运行中容器
docker ps
# 也可以加格式化方式访问，格式会更加清爽
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"
 
# 第6步，访问网页，地址：http://虚拟机地址
 
# 第7步，停止容器
docker stop nginx
 
# 第8步，查看所有容器
docker ps -a --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"
 
# 第9步，再次启动nginx容器
docker start nginx
 
# 第10步，再次查看容器
docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"
 
# 第11步，查看容器详细信息
docker inspect nginx
 
# 第12步，进入容器,查看容器内目录
docker exec -it nginx bash
# 或者，可以进入MySQL
docker exec -it mysql mysql -uroot -p
 
# 第13步，删除容器
docker rm nginx
# 发现无法删除，因为容器运行中，强制删除容器
docker rm -f nginx
```



### 开机自启

```
# Docker开机自启
systemctl enable docker
 
# Docker容器开机自启
docker update --restart=always [容器名/容器id]
```

## 数据卷

### 问题引入

容器是隔离环境，容器内程序的文件、配置、运行时产生的容器都在容器内部，我们要读写容器内的文件非常不方便。大家思考几个问题：

如果要升级MySQL版本，需要销毁旧容器，那么数据岂不是跟着被销毁了？

MySQL、Nginx容器运行后，如果我要修改其中的某些配置该怎么办？

我想要让Nginx代理我的静态资源怎么办？

因此，容器提供程序的运行环境，但程序运行产生的数据、程序运行依赖的配置都应与容器解耦。

### 初识数据卷

- 数据卷（volume）是一个虚拟目录，是容器内目录与宿主机目录之间映射的桥梁。

- 以Nginx为例，我们知道Nginx中有两个关键的目录：

- html：放置一些静态资源   conf：放置配置文件

- 如果我们要让Nginx代理我们的静态资源，最好是放到html目录；如果我们要修改Nginx的配置，最好是找到conf下的nginx.conf文件。

- 容器运行的Nginx所有的文件都在容器内部。所以**利用数据卷将两个目录与宿主机目录关联**，方便我们操作。
  

![image.webp](https://imgbed.f3f3.top/file/picgo/1783255462385_image.webp)

- 我们创建了两个数据卷：conf、html

- Nginx容器内部的conf目录和html目录分别与两个数据卷关联。

- 而数据卷conf和html分别指向了宿主机的/var/lib/docker/volumes/conf/_data目录和/var/lib/docker/volumes/html/_data目录

- 容器内的conf和html目录就 与宿主机的conf和html目录关联起来，我们称为**挂载**。此时，我们操作宿主机的/var/lib/docker/volumes/html/_data就是在操作容器内的/usr/share/nginx/html/_data目录。只要我们将静态资源放入宿主机对应目录，就可以被Nginx代理了。

- /var/lib/docker/volumes这个目录就是默认的存放所有容器数据卷的目录，其下再根据数据卷名称创建新目录，格式为/数据卷名/_data。


**为什么不让容器目录直接指向宿主机目录呢？**

- 因为直接指向宿主机目录就与宿主机强耦合了，如果切换了环境，宿主机目录就可能发生改变了。由于容器一旦创建，目录挂载就无法修改，这样容器就无法正常工作了。

- 但是容器指向数据卷，一个逻辑名称，而数据卷再指向宿主机目录，就不存在强耦合。如果宿主机目录发生改变，只要改变数据卷与宿主机目录之间的映射关系即可。

- 由于数据卷目录比较深，不好寻找，通常我们也允许让容器直接与宿主机目录挂载而不使用数据卷

### 数据卷命令

|          命令           | 说明                 | 文档地址             |
| :---------------------: | -------------------- | -------------------- |
| `docker volume create`  | 创建数据卷           | docker volume create |
|   `docker volume ls`    | 查看所有数据卷       | docs.docker.com      |
|   `docker volume rm`    | 删除指定数据卷       | docs.docker.com      |
| `docker volume inspect` | 查看某个数据卷的详情 | docs.docker.com      |
|  `docker volume prune`  | 清除数据卷           | docker volume prune  |

容器与数据卷的挂载要在创建容器时配置，**对于创建好的容器，是不能设置数据卷的**。而且**创建容器的过程中，数据卷会自动创建**。

### 挂载html

```
# 1.首先创建容器并指定数据卷，注意通过 -v 参数来指定数据卷
docker run -d --name nginx -p 80:80 -v html:/usr/share/nginx/html nginx
 
# 2.然后查看数据卷
docker volume ls
# 结果
DRIVER    VOLUME NAME
local     29524ff09715d3688eae3f99803a2796558dbd00ca584a25a4bbc193ca82459f
local     html
 
# 3.查看数据卷详情
docker volume inspect html
# 结果
[
    {
        "CreatedAt": "2024-05-17T19:57:08+08:00",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/html/_data",
        "Name": "html",
        "Options": null,
        "Scope": "local"
    }
]
 
# 4.查看/var/lib/docker/volumes/html/_data目录
ll /var/lib/docker/volumes/html/_data
# 可以看到与nginx的html目录内容一样，结果如下：
总用量 8
-rw-r--r--. 1 root root 497 12月 28 2021 50x.html
-rw-r--r--. 1 root root 615 12月 28 2021 index.html
 
# 5.进入该目录，并随意修改index.html内容
cd /var/lib/docker/volumes/html/_data
vi index.html
 
# 6.打开页面，查看效果
 
# 7.进入容器内部，查看/usr/share/nginx/html目录内的文件是否变化
docker exec -it nginx bash
```

#### 本地挂载

```
# 挂载本地目录
-v 本地目录（虚拟机）:容器内目录
# 挂载本地文件
-v 本地文件（虚拟机）:容器内文件
-v mysql:/var/lib/mysql # 会被识别为一个数据卷叫mysql，运行时会自动创建这个数据卷
-v ./mysql:/var/lib/mysql # 会被识别为当前目录下的mysql目录，运行时如果不存在会创建目录
```

## 自定义镜像

### 镜像结构

自定义镜像的本质是依次准备好程序运行的基础环境、依赖、应用本身以及运行配置等文件，并将其打包而成。

镜像本质上是一组文件的集合。



但需要注意的是，镜像文件并不是随意堆叠的，而是按照操作步骤分层构建的。每一层生成的文件都会被单独打包，并赋予一个唯一的标识符，称为 **Layer（层）**。这种分层结构的优势在于，如果我们在构建镜像时使用了某些已经存在的层，就可以直接复用这些层

### Dockerfile

![image.webp](https://imgbed.f3f3.top/file/picgo/1783659729269_image.webp)

|    指令    | 说明                                           | 示例                          |
| :--------: | ---------------------------------------------- | ----------------------------- |
|    FROM    | 指定基础镜像                                   | `FROM centos:6`               |
|    ENV     | 设置环境变量，可在后面指令使用                 | `ENV key value`               |
|    COPY    | 拷贝本地文件到镜像的指定目录                   | `COPY ./xx.jar /tmp/app.jar`  |
|    RUN     | 执行 Linux 的 shell 命令，一般是安装过程的命令 | `RUN yum install gcc`         |
|   EXPOSE   | 指定容器运行时监听的端口，是给镜像使用者看的   | `EXPOSE 8080`                 |
| ENTRYPOINT | 镜像中应用的启动命令，容器运行时调用           | `ENTRYPOINT java -jar xx.jar` |

### 构建镜像

- 准备项目及对应的Dockerfile

- 拷贝到虚拟机的目录

- **执行命令，构建镜像：

- ```
  # 开始构建             名字 ：版本 位置
  docker build -t docker-demo: 1.0  .
  ```

  

- **查看镜像列表**

- ```
  # 查看镜像列表：
  docker images
  # 结果
  REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
  docker-demo   1.0       d6ab0b9e64b9   27 minutes ago   327MB
  nginx         latest    605c77e624dd   16 months ago    141MB
  mysql         latest    3218b38490ce   17 months ago    516MB
  ```

```
# 1.创建并运行容器
docker run -d --name dd -p 8080:8080 docker-demo:1.0
# 2.查看容器
dps
# 结果
CONTAINER ID   IMAGE             PORTS                                                  STATUS         NAMES
78a000447b49   docker-demo:1.0   0.0.0.0:8080->8080/tcp, :::8090->8090/tcp              Up 2 seconds   dd
f63cfead8502   mysql             0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   Up 2 hours     mysql
 
# 3.访问
curl localhost:8080/hello/count
# 结果：
<h5>欢迎访问黑马商城, 这是您第1次访问<h5>
```

### 网络

![image.webp](https://imgbed.f3f3.top/file/picgo/1783660042987_image.webp)

|            命令             | 说明                     |
| :-------------------------: | ------------------------ |
|   `docker network create`   | 创建一个网络             |
|     `docker network ls`     | 查看所有网络             |
|     `docker network rm`     | 删除指定网络             |
|   `docker network prune`    | 清除未使用的网络         |
|  `docker network connect`   | 使指定容器连接加入某网络 |
| `docker network disconnect` | 使指定容器连接离开某网络 |
|  `docker network inspect`   | 查看网络详细信息         |

```
# 1.首先通过命令创建一个网络
docker network create hmall
 
# 2.然后查看网络
docker network ls
# 结果：
NETWORK ID     NAME      DRIVER    SCOPE
639bc44d0a87   bridge    bridge    local
403f16ec62a2   hmall     bridge    local
0dc0f72a0fbb   host      host      local
cd8d3e8df47b   none      null      local
# 其中，除了hmall以外，其它都是默认的网络
 
# 3.让dd和mysql都加入该网络，注意，在加入网络时可以通过--alias给容器起别名
# 这样该网络内的其它容器可以用别名互相访问！
# 3.1.mysql容器，指定别名为db，另外每一个容器都有一个别名是容器名
docker network connect hmall mysql --alias db
# 3.2.db容器，也就是我们的java项目
docker network connect hmall dd
 
# 4.进入dd容器，尝试利用别名访问db
# 4.1.进入容器
docker exec -it dd bash
# 4.2.用db别名访问
ping db
# 结果
PING db (172.18.0.2) 56(84) bytes of data.
64 bytes from mysql.hmall (172.18.0.2): icmp_seq=1 ttl=64 time=0.070 ms
64 bytes from mysql.hmall (172.18.0.2): icmp_seq=2 ttl=64 time=0.056 ms
# 4.3.用容器名访问
ping mysql
# 结果：
PING mysql (172.18.0.2) 56(84) bytes of data.
64 bytes from mysql.hmall (172.18.0.2): icmp_seq=1 ttl=64 time=0.044 ms
64 bytes from mysql.hmall (172.18.0.2): icmp_seq=2 ttl=64 time=0.054 ms
```

## 项目部署



- 需求：将我们开发的 tlias-web-management 项目打包为镜像，并部署。

- 步骤：

  - 修改项目的配置文件，修改数据库服务地址，打成jar包。

  - 编写Dockerfile文件。

  - 构建Docker镜像，部署Docker容器，运行测试。

### 部署服务端

**修改项目的配置文件，修改数据库服务地址（打包package）**



![image.webp](https://imgbed.f3f3.top/file/picgo/1783660542919_image.webp)



**编写Dockerfile文件**

```
# 使用 CentOS 7 作为基础镜像
FROM centos:7
 
# 添加 JDK 到镜像中
COPY jdk17.tar.gz /usr/local/
RUN tar -xzf /usr/local/jdk17.tar.gz -C /usr/local/ &&  rm /usr/local/jdk17.tar.gz
 
# 设置环境变量
ENV JAVA_HOME=/usr/local/jdk-17.0.10
ENV PATH=$JAVA_HOME/bin:$PATH
 
# 阿里云OSS环境变量
ENV OSS_ACCESS_KEY_ID=your-access-key-id
ENV OSS_ACCESS_KEY_SECRET=your-access-key-secret
 
#统一编码
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
 
# 创建应用目录
RUN mkdir -p /tlias
WORKDIR /tlias
 
# 复制应用 JAR 文件到容器
COPY  tlias.jar  tlias.jar
 
# 暴露端口
EXPOSE 8080
 
# 运行命令
ENTRYPOINT ["java","-jar","/tlias/tlias.jar"]
```

**构建Docker镜像，部署Docker容器，运行测试**

```
docker build -t tlias:1.0 .
docker run -d --name tlias-server --network itheima -p 8080:8080  tlias:1.0
```

```
--network itheima ：将容器加入到itheima网络，就可以和itheima网络中的容器通信了。
```

```
docker logs -f tlias-server
通过 docker logs -f 容器名，就可以查看容器的运行日志。
```

### 部署前端

![image.webp](https://imgbed.f3f3.top/file/picgo/1783661402386_image.webp)

- 将资 **资料/04. 项目部署/前端项目** 中的 目录`html`和 配置文件存放目录 **`conf`**，上传至服务器端的 **`/usr/local/tlias-web`**目录下。

```
docker run -d \
--name nginx-tlias \
-v /usr/local/tlias-web/html:/usr/share/nginx/html \
-v /usr/local/tlias-web/conf/nginx.conf:/etc/nginx/nginx.conf \
--network itheima \
-p 80:80 \
nginx:1.20.2
```

## DockerCompose

![image.webp](https://imgbed.f3f3.top/file/picgo/1783661681738_image.webp)

| docker run 参数 | docker compose 指令 | 说明       |
| :-------------: | ------------------- | ---------- |
|    `--name`     | `container_name`    | 容器名称   |
|      `-p`       | `ports`             | 端口映射   |
|      `-e`       | `environment`       | 环境变量   |
|      `-v`       | `volumes`           | 数据卷配置 |
|   `--network`   | `networks`          | 网络       |

```
services:
  mysql:
    image: mysql:8
    container_name: mysql
    ports:
      - "3307:3306"
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 123
    volumes:
      - "/usr/local/app/mysql/conf:/etc/mysql/conf.d"
      - "/usr/local/app/mysql/data:/var/lib/mysql"
      - "/usr/local/app/mysql/init:/docker-entrypoint-initdb.d"
    networks:
      - tlias-net
  tlias:
    build: 
      context: .
      dockerfile: Dockerfile
    container_name: tlias-server
    ports:
      - "8080:8080"
    networks:
      - tlias-net
    depends_on:
      - mysql
  nginx:
    image: nginx:1.20.2
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - "/usr/local/app/nginx/conf/nginx.conf:/etc/nginx/nginx.conf"
      - "/usr/local/app/nginx/html:/usr/share/nginx/html"
    depends_on:
      - tlias
    networks:
      - tlias-net
networks:
  tlias-net:
    name: itheima
```

```
docker compose [OPTIONS] [COMMAND]
```

OPTIONS 和 COMMAND 都是可选参数，比较常见的有：

| 类型     | 参数或指令 | 说明                                                         |
| -------- | ---------- | ------------------------------------------------------------ |
| Options  | `-f`       | 指定 compose 文件的路径和名称                                |
| Options  | `-p`       | 指定 project 名称。project 就是当前 compose 文件中设置的多个 service 的集合，是逻辑概念 |
| Commands | `up`       | 创建并启动所有 service 容器                                  |
| Commands | `down`     | 停止并移除所有容器、网络                                     |
| Commands | `ps`       | 列出所有启动的容器                                           |
| Commands | `logs`     | 查看指定容器的日志                                           |
| Commands | `stop`     | 停止容器                                                     |
| Commands | `start`    | 启动容器                                                     |
| Commands | `restart`  | 重启容器                                                     |
| Commands | `top`      | 查看运行的进程                                               |
| Commands | `exec`     | 在指定的运行中容器中执行命令                                 |

```
# 1.进入root目录
cd /root
 
# 2.删除旧容器
docker rm -f $(docker ps -qa)
 
# 3.删除hmall镜像
docker rmi hmall
 
# 4.清空MySQL数据
rm -rf mysql/data
 
# 5.启动所有, -d 参数是后台启动
docker compose up -d
# 结果：
[+] Building 15.5s (8/8) FINISHED
 => [internal] load build definition from Dockerfile                                    0.0s
 => => transferring dockerfile: 358B                                                    0.0s
 => [internal] load .dockerignore                                                       0.0s
 => => transferring context: 2B                                                         0.0s
 => [internal] load metadata for docker.io/library/openjdk:11.0-jre-buster             15.4s
 => [1/3] FROM docker.io/library/openjdk:11.0-jre-buster@sha256:3546a17e6fb4ff4fa681c3  0.0s
 => [internal] load build context                                                       0.0s
 => => transferring context: 98B                                                        0.0s
 => CACHED [2/3] RUN ln -snf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo   0.0s
 => CACHED [3/3] COPY hm-service.jar /app.jar                                           0.0s
 => exporting to image                                                                  0.0s
 => => exporting layers                                                                 0.0s
 => => writing image sha256:32eebee16acde22550232f2eb80c69d2ce813ed099640e4cfed2193f71  0.0s
 => => naming to docker.io/library/root-hmall                                           0.0s
[+] Running 4/4
 ✔ Network hmall    Created                                                             0.2s
 ✔ Container mysql  Started                                                             0.5s
 ✔ Container hmall  Started                                                             0.9s
 ✔ Container nginx  Started                                                             1.5s
 
# 6.查看镜像
docker compose images
# 结果
CONTAINER           REPOSITORY          TAG                 IMAGE ID            SIZE
hmall               root-hmall          latest              32eebee16acd        362MB
mysql               mysql               latest              3218b38490ce        516MB
nginx               nginx               latest              605c77e624dd        141MB
 
# 7.查看容器
docker compose ps
# 结果
NAME                IMAGE               COMMAND                  SERVICE             CREATED             STATUS              PORTS
hmall               root-hmall          "java -jar /app.jar"     hmall               54 seconds ago      Up 52 seconds       0.0.0.0:8080->8080/tcp, :::8080->8080/tcp
mysql               mysql               "docker-entrypoint.s…"   mysql               54 seconds ago      Up 53 seconds       0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp
nginx               nginx               "/docker-entrypoint.…"   nginx               54 seconds ago      Up 52 seconds       80/tcp, 0.0.0.0:18080-18081->18080-18081/tcp, :::18080-18081->18080-18081/tcp
```























































部署后端































