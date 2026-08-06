---
title: http
description: http学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - http初识
category:  JavaWeb
  #永久连接id
abbrlink: "41225885"
# 文章置顶
pinned: false #文章置顶
published: 2026-06-14 20:19:03
updated: 2026-06-18 21:43:03
---

## 定义

HTTP协议分为**请求协议**和**响应协议**。请求协议规定了浏览器将数据发送到服务器的格式，包括请求行、请求头、请求体。响应协议规定了服务器将数据返回给浏览器的格式，包括响应行、响应头、响应体。

## 请求协议

### 请求协议格式

- **请求行**：`请求方式 资源路径 协议/版本`（如：`GET /brand/findAll?name=OPPO&status=1 HTTP/1.1`）
- **请求头**：`key: value` 格式，常见请求头如下：

| 请求头          | 含义                   |
| --------------- | ---------------------- |
| Host            | 请求的主机名           |
| User-Agent      | 浏览器版本             |
| Accept          | 能接收的资源类型       |
| Accept-Language | 偏好的语言             |
| Accept-Encoding | 支持的压缩类型         |
| Content-Type    | 请求主体的数据类型     |
| Content-Length  | 数据主体的大小（字节） |

- **请求体**：存储POST请求参数，与请求头之间有空行分隔

### GET与POST请求区别

| 区别方式     | GET请求               | POST请求   |
| ------------ | --------------------- | ---------- |
| 请求参数     | 在请求行中（URL可见） | 在请求体中 |
| 请求参数长度 | 有限制                | 无限制     |
| 安全性       | 较低                  | 相对较高   |

## 响应协议

- **响应行**：`协议/版本 响应状态码 状态码描述`（如：`HTTP/1.1 200 OK`）
- **响应头**：常见响应头有 `Content-Type`、`Content-Length`、`Content-Encoding`、`Cache-Control`、`Set-Cookie`
- **响应体**：存储响应数据，与响应头之间有空行分隔

### 获取请求数据（服务端）

```
@RestController
public class RequestController {
    @RequestMapping("/request")
    public String request(HttpServletRequest request){
        //1.获取请求参数
        String name = request.getParameter("name");
        String age = request.getParameter("age");
        //2.获取请求路径
        String uri = request.getRequestURI();
        String url = request.getRequestURL().toString();
        //3.获取请求方式
        String method = request.getMethod();
        //4.获取请求头
        String header = request.getHeader("User-Agent");
        return "request success";
    }
}
```

### 设置响应数据

```
@RestController
public class ResponseController {
    @RequestMapping("/response")
    public void response(HttpServletResponse response) throws IOException {
        response.setStatus(401);
        response.setHeader("name","itcast");
        response.setContentType("text/html;charset=utf-8");
        response.getWriter().write("<h1>hello response</h1>");
    }

    @RequestMapping("/response2")
    public ResponseEntity<String> response2() {
        return ResponseEntity
                .status(401)
                .header("name","itcast")
                .body("<h1>hello response</h1>");
    }
}
```

## 常见场景

服务端根据请求头中的User-Agent判断浏览器类型，处理浏览器兼容问题

1. 前后端分离项目中通过Content-Type指定JSON格式传输数据
1. 通过Cache-Control控制浏览器缓存策略

## 注意事项

1. **响应状态码和响应头通常不需要手动设定**，服务器会根据请求处理逻辑自动设置
1. Web服务器（Tomcat）已对HTTP协议数据进行封装（HttpServletRequest / HttpServletResponse），程序员无需直接操作协议