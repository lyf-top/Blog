---
title: Spring配置文件
description: Spring学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - Spring配置文件
category:  JavaWeb
  #永久连接id
abbrlink: "47257415"
# 文章置顶
pinned: false #文章置顶
published: 2026-06-14 20:19:03
updated: 2026-06-18 21:43:03
---

## 定义

SpringBoot项目支持两种配置文件格式：

| 格式       | 文件名                                 | 特点                             |
| ---------- | -------------------------------------- | -------------------------------- |
| properties | `application.properties`               | `key=value` 形式，层级不清晰     |
| yml        | `application.yml` / `application.yaml` | 以数据为中心，层级清晰，推荐使用 |

## 语法

### YML基本语法

- 大小写敏感
- 数值前必须有空格作为分隔符
- 使用缩进表示层级关系，不允许使用Tab键，只能用空格（IDEA中自动将Tab转换为空格）
- 相同层级的元素左侧对齐即可
- `#` 表示注释

### 定义对象/Map集合

```
user:
  name: zhangsan
  age: 18
  password: 123456
```

### 定义数组/List/Set集合

```
hobby:
  - java
  - game
  - sport
```

### 数据库连接配置对比

**properties 写法**：

```
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/web01
spring.datasource.username=root
spring.datasource.password=root@1234
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

**yml 写法**：

```
spring:
  application:
    name: tlias-web-management
  datasource:
    url: jdbc:mysql://localhost:3306/tlias
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
#上传到阿里云
servlet:
  multipart:
    max-file-size: 10MB
    max-request-size: 100MB

  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    serialization:
      write-dates-as-timestamps: false
    time-zone: Asia/Shanghai
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true
    logging:
      level:
        org.springframework.web.servlet.mvc.method.annotation: DEBUG

server:
  port: 8080
#配置事务管理日志级别
logging:
  level:
    org.springframework.jdbc.support.JdbcTransactionManager: debug
#配置oss存储
aliyun:
    oss:
        endpoint: http://oss-cn-beijing.aliyuncs.com
        bucketName: java-ai-tlias2026
        region: cn-beijing

```

## 注意事项

- 在项目开发中，推荐使用 `application.yml` 配置文件，简洁、明了。

- 如果配置项的值以 `0` 开头，值需要使用单引号引起来，因为以 `0` 开头在yml中表示八进制数据。

- `application.properties` 和 `application.yml` 可共存，优先级由SpringBoot加载顺序决定。

- 切换配置文件格式时，将原文件重命名（如改为 `_application.properties`）即可避免冲

