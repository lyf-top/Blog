---
title: Linux配置
description: linux学习之路开启
image: 'https://img.f3f3.top/img/2026/05/26/08ab27822845e43eccb51724ba1aaa7d.webp' #文章封面页
tags:
  - linux认识与进阶
category:  运维
  #永久连接id
abbrlink: "412258874"
# 文章置顶
pinned: false #文章置顶
published: 2026-07-04 20:19:03
updated: 2026-07-04 21:43:03
---

## Linux概述

![image.webp](https://imgbed.f3f3.top/file/picgo/1783153820529_image.webp)

![image.webp](https://imgbed.f3f3.top/file/picgo/1783153890769_image.webp)

### 远程工具

![image.webp](https://imgbed.f3f3.top/file/picgo/1783154017481_image.webp)

## 目录结构

![image.webp](https://imgbed.f3f3.top/file/picgo/1783154157779_image.webp)

![image.webp](https://imgbed.f3f3.top/file/picgo/1783154160294_image.webp)

## Linux常用命令

### 初体验

- Linux 命令格式：`command ``[``-options``] [``parameter``]`

- 说明：

  - command：命令名

  - [-options]：选项，可用来对命令进行控制，也可以省略 （可选）

  - [parameter]：参数，可以是零个、一个或多个（可选）

**使用技巧：**

- Tab键自动补全

- 连续两次Tab键，给出操作提示

- 使用上下箭头快速调出曾经使用过的命令

- 使用clear命令或Ctrl+l快捷键实现清屏

### 目录操作命令

#### ls显示目录

- 作用: 显示指定目录下的内容
- 语法: `ls [-al] ``[dir]`
- 说明:

​        `-a` 显示所有文件及目录 (. 开头的隐藏文件也会列出)

​        `-l` 除文件名称外，同时将文件型态(d表示目录，-表示文件)、权限、拥有者、文件大小等信息详细列出

- 注意:

​        由于我们使用ls命令时经常需要加入-l选项，所以Linux为 `ls -l` 命令提供了一种简写方式，即 `ll`   

- 常见用法:

​        `ls -al`           查看当前目录的所有文件及目录详细信息

​        `ls -al /etc`  查看/etc目录下所有文件及目录详细信息

​        `ll`                 查看当前目录文件及目录的详细信息 





#### cd切文件

- 作用: 用于切换当前工作目录，即进入指定目录
- 语法: cd [dirName]

​        

- 特殊说明:

​        ~        表示用户的home目录

​        .        表示目前所在的目录

​        ..       表示目前目录位置的上级目录

​        

- 举例:

​        cd         ..                切换到当前目录的上级目录

​        cd         ~                切换到用户的home目录

​        cd         /usr/local     切换到/usr/local目录

- 备注: 

​       用户的home目录 

​       root用户        /root

​       其他用户        /home/xxx

#### mkdir添目录

- 作用: 创建目录
- 语法: `mkdir [-p] dirName`
- 说明:

​        -p: 确保目录名称存在，不存在的就创建一个。通过此选项，可以实现多层目录同时创建

- 举例:

​    mkdir itcast  在当前目录下，建立一个名为itcast的子目录

​    mkdir -p itcast/test   在工作目录下的itcast目录中建立一个名为test的子目录，若itcast目录不存在，则建立一个

#### rm删除

- 作用: 删除文件或者目录
- 语法: `rm [-rf] name`
- 说明:

​    -r: 将目录及目录中所有文件（目录）逐一删除，即递归删除

​    -f: 无需确认，直接删除 

- 举例:

​    `rm -r itcast/`    删除名为itcast的目录和目录中所有文件，删除前需确认

​    `rm -rf itcast/`    无需确认，直接删除名为itcast的目录和目录中所有文件

   `rm -f hello.txt`   无需确认，直接删除hello.txt文件

### 文件操作命令

#### cat查看

- 作用: 用于显示文件内容
- 语法: `cat [-n] fileName`
- 说明:

​        `-n`: 由1开始对所有输出的行数编号

- 举例:

​        `cat /etc/profile`                查看/etc目录下的profile文件内容

#### more分页查看

- 作用: 以分页的形式显示文件内容
- 语法: `more fileName`
- 操作说明:
  - 回车键               向下滚动一行
  - 空格键               向下滚动一屏
  - b                       返回上一屏
  - q或者Ctrl+C        退出more 
- 举例：
  - more /etc/profile                以分页方式显示/etc目录下的profile文件内

#### head开头查看

- 作用：查看文件开头的内容
- 语法：`head`` [``-n``] ``fileName`
- 说明:
  - -n ：输出文件开头的n行内容
- 举例：
  - head 1.log  默认显示1.log文件开头的10行内容
  - head -20 1.log  显示1.log文件开头的20行内容

#### tail末尾查看

- 作用: 查看文件末尾的内容
- 语法: tail [-f] fileName
- 说明:

​        -f : 动态读取文件末尾内容并显示，通常用于日志文件的内容输出   

- 举例: 
  - tail /etc/profile                显示/etc目录下的profile文件末尾10行的内容
  - tail -20 /etc/profile           显示/etc目录下的profile文件末尾20行的内容
  - tail -f /itcast/my.log          动态读取/itcast目录下的my.log文件末尾内容并显示

#### cp拷贝

- 作用: 用于复制文件或目录
- 语法: cp [-r] source dest
- 说明:

​        -r: 如果复制的是目录需要使用此选项，此时将复制该目录下所有的子目录和文件

- 举例:

​    cp hello.txt itcast/            将hello.txt复制到itcast目录中

​    cp hello.txt ./hi.txt           将hello.txt复制到当前目录，并改名为hi.txt

​    cp -r itcast/ ./itheima/            将itcast目录和目录下所有文件复制到itheima目录下

​    cp -r itcast/* ./itheima/                  将itcast目录下所有文件复制到itheima目录

**如果拷贝的内容是目录，需要加上参数 -r** 

#### mv改名换位

- 作用: 为文件或目录改名、或将文件或目录移动到其它位置

- 语法: mv source dest

- 举例:
  - mv hello.txt hi.txt                   将hello.txt改名为hi.txt
  - mv hi.txt itheima/                   将文件hi.txt移动到itheima目录中
  - mv hi.txt itheima/hello.txt        将hi.txt移动到itheima目录中，并改名为hello.txt
  - mv itcast/ itheima/                 如果itheima目录不存在，将itcast目录改名为itheima
  - mv itcast/ itheima/                 如果itheima目录存在，将itcast目录移动到itheima目录中

- mv 命令既能够改名，又可以移动，具体是改名还是移动,

- 系统会根据我们输入的参数进行判定(如果第二个参数dest是一个已存在的目录,将执行移动操作,其他情况都是改名)

#### tar解压缩

- 作用: 对文件进行打包、解包、压缩、解压
- 语法: `tar  [-zcxvf]  ``fileName  ``[files]`

​    包文件后缀为.tar表示只是完成了打包，并没有压缩

​    包文件后缀为.tar.gz表示打包的同时还进行了压缩

- 说明:
  - -z: z代表的是gzip，通过gzip命令处理文件，gzip可以对文件压缩或者解压
  - -c: c代表的是create，即创建新的包文件
  - -x: x代表的是extract，实现从包文件中还原文件
  - -v: v代表的是verbose，显示命令的执行过程
  - -f: f代表的是file，用于指定包文件的名称
- 举例：
  - 打包
    - tar -cvf hello.tar ./*                                  将当前目录下所有文件打包，打包后的文件名为hello.tar
    - tar -zcvf hello.tar.gz ./*                          将当前目录下所有文件打包并压缩，打包后的文件名为hello.tar.gz
  - 解包
    - tar -xvf hello.tar                                          将hello.tar文件进行解包，并将解包后的文件放在当前目录
    - tar -zxvf hello.tar.gz                                  将hello.tar.gz文件进行解压，并将解压后的文件放在当前目录
    - tar -zxvf hello.tar.gz -C /usr/local     将hello.tar.gz文件进行解压，并将解压后的文件放在/usr/local目录

### 文本编辑

#### vi & vim介绍

- 作用: vi命令是Linux系统提供的一个文本编辑工具，可以对文件内容进行编辑，类似于Windows中的记事本
- 语法: vi fileName
- 说明:
  - 1). vim是从vi发展来的一个功能更加强大的文本编辑工具，编辑文件时可以对文本内容进行着色，方便我们对文件进行编辑处理，所以实际工作中vim更加常用。
  - 2). 要使用vim命令，需要我们自己完成安装。可以使用下面的命令来完成安装：`yum install vim`

```
yum install vim
```

#### vim使用

- 作用: 对文件内容进行编辑，vim其实就是一个文本编辑器

- 语法: vim fileName

- 说明:

  - 1). 在使用vim命令编辑文件时，如果指定的文件存在则直接打开此文件。如果指定的文件不存在则新建文件。
  - 2). vim在进行文本编辑时共分为三种模式，分别是 命令模式（Command mode），插入模式（Insert mode）和底行模式（Last line mode）。这三种模式之间可以相互切换。我们在使用vim时一定要注意我们当前所处的是哪种模式。

- 三种模式:

  - 命令模式

    - A. 命令模式下可以查看文件内容、移动光标（上下左右箭头、gg、G)

    - B. 通过vim命令打开文件后，默认进入命令模式

    - C. 另外两种模式需要首先进入命令模式，才能进入彼此

* * | **命令模式指令**      | **含义**                                   |
    | --------------------- | ------------------------------------------ |
    | **gg**                | 定位到文本内容的第一行                     |
    | **G**                 | 定位到文本内容的最后一行                   |
    | **dd**                | 删除光标所在行的数据                       |
    | **ndd**               | 删除当前光标所在行及之后的n行数据          |
    | **u**                 | 撤销操作                                   |
    | **i 或 a 或 o&#x20;** | 进入插入模式(进入后光标所处的位置不同而已) |
    
  * 插入模式
  
    * A. 插入模式下可以对文件内容进行编辑
  
    * B. 在命令模式下按下\[i,a,o]任意一个，可以进入插入模式。进入插入模式后，下方会出现【insert】字样
  
    * C. 在插入模式下按下ESC键，回到命令模式

&#x20;  &#x20;

* 底行模式

  * A. 底行模式下可以通过命令对文件内容进行查找、显示行号、退出等操作

  * B. 在命令模式下按下\[:,/]任意一个，可以进入底行模式

  * C. 通过/方式进入底行模式后，可以对文件内容进行查找

  * D. 通过:方式进入底行模式后，可以输入wq（保存并退出）、q!（不保存退出）、set nu（显示行号）

  | **底行模式指令** | **含义**                             |
  | ---------------- | ------------------------------------ |
  | **:wq**          | 保存并退出                           |
  | **:q!**          | 不保存退出                           |
  | **:set nu**      | 显示行号                             |
  | **:set nonu**    | 取消行号显示                         |
  | **:n**           | 定位到第n行，如 :10 就是定位到第10行 |

  ![image.webp](https://imgbed.f3f3.top/file/picgo/1783166069552_image.webp)

####  find

> * 作用: 在指定目录下查找文件
>
> * 语法: find dirName -option fileName
>
> * 举例:
>
>   * `find  .  –name "*.java`*`"`                        在当前目录及其子目录下查找.java结尾文件*
>
>   * `find  /itcast  -name "*.java"`             在/itcast目录及其子目录下查找.java结尾的文件



####  grep

> * 作用: 从指定文件中查找指定的文本内容
>
> * 语法: `grep word fileName`
>
> * 选项：
>
>   * <span style="color: rgb(36,91,219); background-color: inherit">-i</span>: 检索的关键字忽略(<span style="color: rgb(36,91,219); background-color: inherit">i</span>gnore)大小写
>
>   * <span style="color: rgb(36,91,219); background-color: inherit">-n</span>: 显示关键字所在的这一行的行号
>
>   * <span style="color: rgb(36,91,219); background-color: inherit">-A</span>: 输出关键字所在行及之后(<span style="color: rgb(36,91,219); background-color: inherit">A</span>fter)的几行记录 (如:-A5 表示输出关键字所在行之后的5行记录)
>
>   * <span style="color: rgb(36,91,219); background-color: inherit">-B</span>: 输出关键字所在行及之前(<span style="color: rgb(36,91,219); background-color: inherit">B</span>efore)的几行记录 (如:-B5 表示输出关键字所在行之前的5行记录)
>
> * 举例:
>
>   * grep Hello HelloWorld.java        查找HelloWorld.java文件中出现的Hello字符串的位置
>
>   * grep hello \*.java                        查找当前目录中所有.java结尾的文件中包含hello字符串的位置

##  软件安装

![image.webp](https://imgbed.f3f3.top/file/picgo/1783166145547_image.webp)

### 安装JDK

**上传安装包**

使用FinalShell自带的上传工具将jdk的二进制发布包上传到Linux

![image.webp](https://imgbed.f3f3.top/file/picgo/1783166766320_image.webp)

由于上述在进行文件上传时，选择的上传目录 /root，上传完毕后，我们执行指令 cd /root 切换到根目录下，查看上传的安装包。

**解压安装包**

执行如下指令，将上传上来的压缩包进行解压，并通过-C参数指定解压文件存放目录为 /usr/local。

```
tar -zxvf jdk-21_linux-x64_bin.tar.gz -C /usr/local/
```

**配置环境变量**

使用vim命令修改`/etc/profile`文件，在文件末尾加入如下配置

```
export JAVA_HOME=/usr/local/jdk-17.0.10
export PATH=$JAVA_HOME/bin:$PATH
```

```
1). 编辑/etc/profile文件，进入命令模式
    vim /etc/profile

2). 在命令模式中，输入指令 G ， 切换到文件最后
    G

3). 在命令模式中输入 i/a/o 进入插入模式，然后切换到文件最后一行
    i

4). 将上述的配置拷贝到文件中
    export JAVA_HOME=/usr/local/jdk-17.0.10
    export PATH=$JAVA_HOME/bin:$PATH
        
5). 从插入模式，切换到指令模式
    ESC
        
6). 按:进入底行模式，然后输入wq，回车保存
    :wq
```



**重新加载profile文件**

为了使更改的配置立即生效，需要重新加载profile文件，执行命令:

```
source /etc/profile
```

**检查安装是否成功**

```
java -version
```

###  安装MySQL

通过rpm相关指令，来**查询**当前系统中是否存在已安装的mysql软件包，执行指令如下：

* `rpm -qa`                                  查询当前系统中安装的所有软件

* `rpm -qa | grep mysql`            查询当前系统中安装的名称带mysql的软件

* `rpm -qa | grep mariadb`        查询当前系统中安装的名称带mariadb的软件

太多了，不方便查看，所以我们可以通过管道符 | 配合着grep进行过滤查询。

通过查询，我们发现在当前系统中存在mariadb数据库，是CentOS7中自带的，而这个数据库和MySQL数据库是冲突的，所以要想保证MySQL成功安装，需要卸载mariadb数据库。

> **RPM：**&#x5168;称为 Red-Hat Package Manager，RPM软件包管理器，是红帽Linux用于管理和安装软件的工具。

B. 通过 rpm 相关指令，来卸载对应的组件，：

在rpm中，卸载软件的语法为：`rpm -e --nodeps  软件名称`

rpm -e --nodeps mariadb-libs-5.5.60-1.el7_5.x86_64

**上传MySQL安装包**

在课程资料中，提供的有MySQL的安装包 ，我们需要将该安装包上传到Linux系统的根目录 /root 下面。

 **解压到 当前目录**

```
tar -xvf mysql-8.0.30-linux-glibc2.12-x86_64.tar.xz
```

**解压后的文件夹移动到 /usr/local 目录下， 并改名为 mysql**

```
mv mysql-8.0.30-linux-glibc2.12-x86_64 /usr/local/mysql

cd /usr/local/mysql
```

**配置系统环境变量**

配置MySQL的环境变量, 通过vi编辑器编辑 `/etc/profile` 文件, 在尾部追加:

```
export MYSQL_HOME=/usr/local/mysql
export PATH=$MYSQL_HOME/bin:$PATH
```

并执行如下指令, 注册MySQL为系统服务:

```
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql
chkconfig --add mysql
```

**初始化数据库**

```
#创建一个用户组, 组名就叫mysql
groupadd mysql

#创建一个系统用户 mysql, 并归属于用户组 mysql 
useradd -r -g mysql -s /bin/false mysql
```

```
#初始化mysql
mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data
```

执行上述指令时, 会输入如下日志，在日志中就输出了MySQL中root用户的一个临时密码【**<span style="color: rgb(216,57,49); background-color: inherit">记得复制出来，记录下来</span>**】：&#x20;

#### 启动

 **启动MySQL服务**

```
systemctl start mysql
```

 **通过命令, 登录MySQL**

```
#xxxxx 代表上述生成的root的临时密码
mysql -uroot -pxxxxx
```

#### 配置

 **修改root用户的密码**

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
```

**注意: 这个root账号仅仅能够在本机localhost上访问，我们在windows上是无法访问的。如果需要在window上或其他服务器上也能远程访问，需要创建一个账号，用于远程访问的。**

 **创建账号, 并授权远程访问**

```
CREATE USER 'root'@'%' IDENTIFIED BY '1234';

GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';

FLUSH PRIVILEGES;
```

我们已经开启了MySQL的远程访问的权限，为什么还是连接不上MySQL服务器呢？？ 这是因为Linux系统的防火墙，将我们的访问拦截了。

#### 防火墙

Linux系统安装完毕后，系统启动时，防火墙自动启动，防火墙拦截了所有端口的访问。接下来我们就需要学习一下，如何操作防火墙，具体指令如下：&#x20;

注意： 要想在windows上能够访问MySQL，需要开放防火墙的3306端口  或者 直接关闭防火墙 ，执行如下指令:

```
#开发防火墙的3306端口号
firewall-cmd --zone=public --add-port=3306/tcp --permanent

#重新加载
firewall-cmd --reload

#查看开放的端口号
firewall-cmd --zone=public --list-ports
```

**关闭防火墙**

```
systemctl stop firewalld
```

#### 连接

**客户端连接**

```
mysql -h192.168.200.128 -P3306 -uroot -p1234
```

打开DataGrip图形化工具连接

![image.webp](https://imgbed.f3f3.top/file/picgo/1783168781441_image.webp)



执行资料中提供的SQL脚本 `tlias.sql` 。

![image.webp](https://imgbed.f3f3.top/file/picgo/1783168832875_image.webp)



### 安装Nginx

####  安装

Nginx的安装包，从官方下载下来的是c语言的源码包，我们需要自己编译安装。具体操作步骤如下：

安装Nginx运行时需要的依赖

```
yum install -y pcre pcre-devel zlib zlib-devel openssl openssl-devel
```

安装C语言的编译环境.

```
yum install gcc-c++
```

2\). 上传Nginx的源码包

3\). 解压源码包到当前目录

```
tar -zxvf nginx-1.20.2.tar.gz
```

4\). 进入到解压目录后，执行指令

```
#进入解压目录
cd nginx-1.20.2

#执行命令配置, 生成Makefile文件
./configure --prefix=/usr/local/nginx
```

5\). 执行命令进行编译和安装

```
#编译
make

#编译安装
make install
```

#### 启动Nginx

进入到nginx安装目录`/usr/local/nginx`，启动nginx服务

```
cd /usr/local/nginx/
sbin/nginx
```

启动完毕之后，我们可以通过 `ps` 指令查询当前系统中的nginx进程，从而确认nginx是否启动 。

```
ps -eflgrep nginx
```

##  项目部署

### 前端部署

将nginx的安装目录的html中的静态资源文件先删除掉。

![image.webp](https://imgbed.f3f3.top/file/picgo/1783169205973_image.webp)



将资料中提供的 <span style="color: rgb(222,120,2); background-color: inherit">&quot;资料/06. 项目部署/前端/页面资源&quot;</span> 目录下的静态资源文件，全部上传到nginx安装目录下的 html 目录中.**



**修改资料中提供的 `nginx.conf` 配置文件，将其上传到nginx安装目录下的 conf 目录中.**

![image.webp](https://imgbed.f3f3.top/file/picgo/1783169236876_image.webp)



**重新加载nginx服务的配置文件**

```
#重新加载配置文件
sbin/nginx -s reload
```

> **nginx服务常见操作指令:&#x20;**
>
> * 启动: sbin/nginx
>
> * 重载: sbin/nginx -s reload
>
> * 停止: sbin/nginx -s stop



### 后端部署

#### yml

```
#配置数据库连接信息
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://192.168.100.128:3306/tlias
    username: root
    password: 1234
  servlet:
    multipart:
      max-file-size: 10MB #单个文件最大大小限制10MB
      max-request-size: 100MB #单个请求最大大小限制100MB

#配置mybatis的日志输出到控制台
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    #配置mybatis的驼峰命名的映射开关
    map-underscore-to-camel-case: true
#查看事务管理的日志
logging:
  level:
    org.springframework.jdbc.support.JdbcTransactionManager: debug

#阿里云oss配置
aliyun:
  oss:
    endpoint: https://oss-cn-beijing.aliyuncs.com
    bucketName: java422-web-ai
```

####  打包部署

执行 `package` 指令，进行打包操作，将当前的springboot项目，打成一个jar包。 (**跳过测试**)

![image.webp](https://imgbed.f3f3.top/file/picgo/1783167226699_image.webp)

在Linux服务器上创建一个目录，将jar包上传到服务器 。

```
mkdir -p /usr/local/app
```

```
#进入目录/usr/local/app 
cd /usr/local/app

#运行jar包
java -jar tlias-web-management-0.0.1-SNAPSHOT.jar 
```

#### 秘钥配置

由于在开发的时候，我们将访问阿里云OSS的AccessKeyId，AccessKeySecret都配置在了系统的环境变量中了。那现在项目部署到了Linux服务器中，调用阿里云OSS进行文件上传时，程序就会获取Linux系统中的环境变量。所以此时，我们需要将AccessKeyId，AccessKeySecret配置为Linux系统的环境变量。

查看Windows系统之前配置的环境变

```
echo %OSS_ACCESS_KEY_ID%

echo %OSS_ACCESS_KEY_SECRET%
```

我们将上述自己的 AccessKeyId 与  AccessKeySecret 复制出来，然后在linux系统中配置环境变量。

```
echo "export OSS_ACCESS_KEY_ID=你的AccessKeyId" >> /etc/profile

echo "export OSS_ACCESS_KEY_SECRET=你的AccessKeySecret" >> /etc/profile

source /etc/profile
```

<span style="color: rgb(216,57,49); background-color: inherit">执行完毕后，将finalShell的窗口关闭掉，重新打开一个新窗口（让环境变量生效），重新运行项目测试。 </span>

当前程序中存在的问题:&#x20;

* 线上程序不会采用控制台霸屏的形式运行程序，而是将程序在后台运行

* 线上程序不会将日志输出到控制台，而是输出到日志文件，方便运维查阅信息&#x20;

要解决上述这两个问题，我们就可以通过 nohup 指令让程序在后台运行。

#### 后台运行

后台运行程序

```
nohup java -jar tlias-web-management-0.0.1-SNAPSHOT.jar &> tlias.log &
```

 停止服务

```
#查看服务的进程信息
ps -ef|grep tlias

#杀掉进程
kill -9 xxxxx
```



> **nohup命令说明:**&#x20;
>
> * **nohup命令：**&#x82F1;文全称 no hang up（不挂起），用于不挂断地运行指定命令，退出终端不会影响程序的运行
>
> * **语法格式：** `nohup command [ args … ] [&]`
>
> * **参数说明：**
>
>   * command：要执行的命令
>
>   * args：一些参数，可以指定输出文件
>
>   * &：让命令在后台运行
>
> * **举例：**
>
>   * `nohup java -jar boot工程.jar &> hello.log &`
>
> &#x20;       上述指令的含义为： 后台运行 java -jar 命令，并将日志输出到hello.log文件

- 插入模式
  - A. 插入模式下可以对文件内容进行编辑
  - B. 在命令模式下按下[i,a,o]任意一个，可以进入插入模式。进入插入模式后，下方会出现【insert】字样
  - C. 在插入模式下按下ESC键，回到命令模式

​    

- 底行模式
  - A. 底行模式下可以通过命令对文件内容进行查找、显示行号、退出等操作
  - B. 在命令模式下按下[:,/]任意一个，可以进入底行模式
  - C. 通过/方式进入底行模式后，可以对文件内容进行查找
  - D. 通过:方式进入底行模式后，可以输入wq（保存并退出）、q!（不保存退出）、set nu（显示行号）
