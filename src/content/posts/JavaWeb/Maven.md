---
title: Maven
description: Maven学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - Maven初识
category:  JavaWeb
  #永久连接id
abbrlink: "p25885"
# 文章置顶
pinned: false #文章置顶
published: 2026-06-14 20:19:03
updated: 2026-06-18 21:43:03
---

## Maven的作用

### **依赖管理**

方便快捷的管理项目依赖的资源(jar包)，避免版本冲突问题

当使用maven进行项目依赖(jar包)管理，则很方便的可以解决这个问题。 我们只需要在maven项目的pom.xml文件中，添加一段如下图所示的配置即可实现



### 项目构建

我们开发了一套系统，代码需要进行编译、测试、打包、发布，这些操作如果需要反复进行就显得特别麻烦，而Maven提供了一套简单的命令来完成



## 相关配置

Maven仓库：用于存储资源，管理各种jar包.

下载maven后进行解压，解压后的目录结构：

- bin目录 ： 存放的是可执行命令。（mvn 命令重点关注）
- conf目录 ：存放Maven的配置文件。（settings.xml配置文件后期需要修改）
- lib目录 ：存放Maven依赖的jar包。（Maven也是使用java开发的，所以它也依赖其他的jar包）

进入到conf目录下修改settings.xml配置文件

1). 使用超级记事本软件，打开settings.xml文件，定位到53行

2). 复制标签，粘贴到注释的外面（55行）

3). 复制之前新建的用来存储jar包的路径，替换掉标签体内容

4）定位到160行左右，配置阿里云私服

```
<mirror>  
    <id>alimaven</id>  
    <name>aliyun maven</name>  
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>          
</mirror>
```

```
注: 只可配置一个(另一个要注释!) ，不然两个可能发生冲突，导致jar包无法下载

在系统变量处新建一个变量MAVEN_HOME

PATH环境变量的值，新建一个，设置为：%MAVEN_HOME%\bin

在cmd中执行mvn-v查看。Maven3.6.1要JDK8才行，之前用JDK6就会报错

设置IDEA使用本地安装的Maven，并修改配置文件及本地仓库路径
```

### 1. 配置本地仓库

在 `conf/settings.xml` 中配置 `<localRepository>` 标签，指定本地仓库路径，用于存储下载的 jar 包。

```
<localRepository>E:/maven/repository</localRepository>
```

### 2. 配置阿里云私服

中央仓库在国外，下载速度较慢。在 `conf/settings.xml` 的 `<mirrors>` 标签中添加：

```
<mirror>

    <id>alimaven</id>

    <name>aliyun maven</name>

    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>

    <mirrorOf>central</mirrorOf>

</mirror>
```

### 3. 配置环境变量

- 新建系统变量 `MAVEN_HOME`，值为 Maven 解压安装目录
- 在 `Path` 中添加 `%MAVEN_HOME%\bin`
- 验证安装：命令行执行 `mvn -v`，输出版本信息表示安装成功

### 4. 配置关联 JDK 版本（可选）

在 `conf/settings.xml` 的 `<profiles>` 中添加：

```
<profile>

    <id>jdk-17</id>

    <activation>

        <activeByDefault>true</activeByDefault>

        <jdk>17</jdk>

    </activation>

    <properties>

        <maven.compiler.source>17</maven.compiler.source>

        <maven.compiler.target>17</maven.compiler.target>

        <maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>

    </properties>

</profile>
```

### 常见问题：依赖下载失败

**问题现象**：Maven 项目中添加的依赖未正确下载，右侧 Maven 面板中依赖报红，reload 重新加载也不会再下载。

**产生原因**：由于网络原因，依赖下载不完整，Maven 仓库中生成了 `xxx.lastUpdated` 文件，该文件不删除则不会重新下载。

**解决方案**：

1. 根据 Maven 依赖坐标，找到仓库中对应的 `xxx.lastUpdated` 文件并删除，然后重新加载项目。
1. 通过命令 `del /s *.lastUpdated` 批量递归删除指定目录下的所有 `xxx.lastUpdated` 文件。
1. 依赖下载完成后，若 Maven 面板仍然报红，可关闭 IDEA 后重新打开加载项目。

### 注意事项

- 安装路径中避免包含中文和空格。
- 配置 `settings.xml` 时注意标签的嵌套层级，`<mirror>` 必须在 `<mirrors>` 内部。
- 首次下载依赖时耗时较长，需耐心等待。

## 项目配置与坐标

全局设置一些信息

选择 IDEA中 File => close project

打开 All settings , 选择 Build,Execution,Deployment => Build Tools => Maven

创建Maven项目

填写模块名称，坐标信息，点击finish，创建完成

POM (Project Object Model) ：指的是项目对象模型，用来描述当前的maven项目。

- 使用pom.xml文件来实现

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- POM模型版本 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- 当前项目坐标 -->
    <groupId>com.itheima</groupId>
    <artifactId>maven_project1</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <!-- 打包方式 -->
    <packaging>jar</packaging>
 
</project>
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1781767313386_image.webp)



- `src/main/java`：源代码文件
- `src/main/resources`：源代码配置文件
- `src/test/java`：测试代码文件
- `src/test/resources`：测试代码配置文件
- `target`：编译、打包生成文件存放目录



## Maven仓库

仓库本质是一个目录（文件夹），用于存储开发中所有依赖（jar 包）和插件。

Maven 仓库分为三类：

| 仓库类型             | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| **本地仓库**         | 自己计算机上的目录，用来存储 jar 包                          |
| **中央仓库**         | 由 Maven 团队维护的全球唯一仓库，地址：https://repo1.maven.org/maven2/ |
| **远程仓库（私服）** | 一般由公司团队搭建的私有仓库                                 |

### jar 包查找顺序

当项目中使用坐标引入依赖 jar 包后：

1. 先查找**本地仓库**中是否有对应的 jar 包
   - 有 → 项目直接引用
   - 没有 → 去中央仓库下载到本地仓库
1. 如果搭建了远程仓库（私服），查找顺序变为：**本地仓库 → 远程仓库 → 中央仓库**

## 生命周期

| 阶段      | 说明                              |
| --------- | --------------------------------- |
| `clean`   | 移除上一次构建生成的文件          |
| `compile` | 编译项目源代码                    |
| `test`    | 使用单元测试框架运行测试（JUnit） |
| `package` | 将编译后的文件打包（jar、war 等） |
| `install` | 安装项目到本地仓库                |

**执行顺序**：同一套生命周期中，阶段是有顺序的，后面的阶段依赖于前面的阶段。执行后面的生命周期时，前面的生命周期都会执行。

**跨生命周期**：`package` 和 `compile` 属于同一套生命周期，执行 `package` 时 `compile` 会自动运行；但 `clean` 与 `package` 不属于同一套，执行 `package` 时 `clean` 不会运行。

### 插件机制

Maven 的生命周期是抽象的，生命周期本身不做任何实际工作。**实际任务（如源代码编译）都交由插件来完成。**

生命周期顺序：`clean` → `validate` → `compile` → `test` → `package` → `verify` → `install` → `site` → `deploy`

日常开发重点关注：`clean` → `compile` → `test` → `package` → `install`

```
mvn compile    # 编译
mvn test       # 测试
mvn package    # 打包
mvn install    # 安装到本地仓库
```

- 同一套生命周期中，执行后面的阶段会自动执行前面所有阶段。
- 不同套的生命周期互不影响（如 `clean` 和 `default` 互不触发）。
- 生命周期本身是抽象定义，具体工作由插件实现。

## 继承

- jar：普通模块打包，springboot项目基本都是jar包，默认的打包方式就是jar

- war：普通web程序打包，需要部署在外部的tomcat服务器中运行

- pom：父工程或者聚合工程，该模块不写代码，仅进行依赖管理

工程之间的继承不支持多继承，但是支持多重继承

![image.webp](https://imgbed.f3f3.top/file/picgo/1785245425184_image.webp)

### 版本锁定

- **通过dependencyManagement标签实现**
- **可以在properties标签中直接设置依赖版本，在下面直接通过${依赖名.version}引用版本**

![image.webp](https://imgbed.f3f3.top/file/picgo/1785245578518_image.webp)

- <dependencyManagement> 与 <dependencies>的区别是什么?
  <dependencies>是直接依赖，在父工程配置了依赖,子工程会直接继承下来。
  <dependencyManagement>是统一管理依赖版本，不会直接依赖，还需要在子工程中
  引入所需依赖(无需指定版本)

## 聚合

1.什么是聚合

聚合就是将多个模块组织成一个整体，同时进行项目的构建

2.什么是聚合工程

一个不具有业务功能的空功能（有且仅有一个pom文件）

3.聚合的作用

快速构建项目（无需根据依赖关系手动构建，直接在聚合工程上构建即可）

4.聚合的实现

<modules>
<module>../tlias-pojo</module>
<module>../tlias-utils</module>
<module>../tlias-web-management</module>
</modules>

- 继承与聚合的区别与联系
  maven中继承与聚合的联系与区别？
  联系：继承与聚合都属于设计型模块，打包方式都为pom，常将两种关系制作到同一个pom文件中
- **继承用于简化依赖配置、统一管理依赖版本，是在子工程中配置继承关系**
- **聚合用于快速构建项目，是在父工程(聚合工程)中配置聚合的模块**

























