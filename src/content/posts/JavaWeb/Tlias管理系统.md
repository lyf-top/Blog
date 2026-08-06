---
title: Tlias管理系统
description: web系统学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - Tlias管理系统初识与进阶
category:  JavaWeb
  #永久连接id
abbrlink: "47257565"
# 文章置顶
pinned: false #文章置顶
published: 2026-06-14 20:19:03
updated: 2026-06-18 21:43:03
---

## 项目需求

- 部门管理：查询、新增、修改、删除

- 员工管理：

  - 查询、新增、修改、删除
  - 文件上传

- 报表统计

- 登录认证

- 日志管理

- 班级管理（自己实战内容）

- 学员管理（自己实战内容）

![image.webp](https://imgbed.f3f3.top/file/picgo/1781930618184_image.webp)

**基于REST风格URL如下：**

- http://localhost:8080/users/1       GET：查询id为1的用户
- http://localhost:8080/users          POST：新增用户
- http://localhost:8080/users          PUT：修改用户
- http://localhost:8080/users/1       DELETE：删除id为1的用户

其中总结起来，就一句话：通过URL定位要操作的资源，通过HTTP动词(请求方式)来描述具体的操作。

## 工程搭建

创建SpringBoot工程并引入web开发起步依赖、mybatis、mysql驱动、lombok

![image.webp](https://imgbed.f3f3.top/file/picgo/1781931767293_image.webp)

```
spring:
  application:
    name: tlias-web-management
  datasource:
    url: jdbc:mysql://localhost:3306/tlias
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

## 部门管理

### 统一响应结果

```
package com.itheima.pojo;

import lombok.Data;
import java.io.Serializable;

/**
 * 后端统一返回结果
 */
@Data
public class Result {

    private Integer code; //编码：1成功，0为失败
    private String msg; //错误信息
    private Object data; //数据

    public static Result success() {
        Result result = new Result();
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static Result success(Object object) {
        Result result = new Result();
        result.data = object;
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static Result error(String msg) {
        Result result = new Result();
        result.msg = msg;
        result.code = 0;
        return result;
    }

}
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1781934894097_image.webp)

### 部门表查询

#### 前置数据

**创建部门数据库表**

```
CREATE TABLE dept (
  id int unsigned PRIMARY KEY AUTO_INCREMENT COMMENT 'ID, 主键',
  name varchar(10) NOT NULL UNIQUE COMMENT '部门名称',
  create_time datetime DEFAULT NULL COMMENT '创建时间',
  update_time datetime DEFAULT NULL COMMENT '修改时间'
) COMMENT '部门表';

INSERT INTO dept VALUES (1,'学工部','2023-09-25 09:47:40','2024-07-25 09:47:40'),
                      (2,'教研部','2023-09-25 09:47:40','2024-08-09 15:17:04'),
                      (3,'咨询部','2023-09-25 09:47:40','2024-07-30 21:26:24'),
                      (4,'就业部','2023-09-25 09:47:40','2024-07-25 09:47:40'),
                      (5,'人事部','2023-09-25 09:47:40','2024-07-25 09:47:40'),
                      (6,'行政部','2023-11-30 20:56:37','2024-07-30 20:56:37');
```

- 在 `application.yml` 配置文件中配置数据库的连接信息。

```
spring:
  application:
    name: tlias-web-management
  datasource:
    url: jdbc:mysql://localhost:3306/tlias
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: 123456
mybatis:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

#### 部门实体类

```
package com.itheima.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dept {
    private Integer id;
    private String name;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1781932502244_image.webp)

- Controller层，负责接收前端发起的请求，并调用service查询部门数据，然后响应结果。

- Service层，负责调用Mapper接口方法，查询所有部门数据。

- Mapper层，执行查询所有部门数据的操作。

#### mybatis属性封装

![image.webp](https://imgbed.f3f3.top/file/picgo/1781934894097_image.webp)

部门的数据中，id、name两个属性是有值的，但是createTime、updateTime两个字段值并未成功封装，而数据库中是有对应的字段值的，这是为什么呢？

- 实体类属性名和数据库表查询返回的字段名一致，mybatis会自动封装。
- 如果实体类属性名和数据库表查询返回的字段名不一致，不能自动封装。

![image.webp](https://imgbed.f3f3.top/file/picgo/1781934178351_image.webp)

##### 手动映射

在DeptMapper接口方法上，通过 @Results及@Result 进行手动结果映射。

```
@Results({@Result(column = "create_time", property = "createTime"),
          @Result(column = "update_time", property = "updateTime")})
@Select("select id, name, create_time, update_time from dept")
public List<Dept> findAll();
```

##### 起别名

```
@Select("select id, name, create_time createTime, update_time updateTime from dept")
public List<Dept> findAll();
```

##### 驼峰命名（推荐）

如果字段名与属性名符合驼峰命名规则，mybatis会自动通过驼峰命名规则映射。驼峰命名规则：   abc_xyz    =>   abcXyz

- 表中字段名：abc_xyz
- 类中属性名：abcXyz

在application.yml中做如下配置，开启开关。

```
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

**请求路径**/depts
  **请求方式**：GET
  **接口描述**：该接口用于部门列表数据查询

#### Controller

```
@RestController   //RestController=Controller+RestBody
public class DeptController {

    @Autowired
    private DeptService deptService;

    /**
     * 查询部门列表
     */
    @GetMapping("/depts")
    public Result list(){
        List<Dept> deptList = deptService.findAll();
        return Result.success(deptList);
    }
}
```

- GET方式：@GetMapping
- POST方式：@PostMapping
- PUT方式：@PutMapping
- DELETE方式：@DeleteMapping

#### Service

```
public interface DeptService {
    /**
     * 查询所有部门
     */
    public List<Dept> findAll();
}
```

```
@Service
public class DeptServiceImpl implements DeptService {
    
    @Autowired
    private DeptMapper deptMapper;

    public List<Dept> findAll() {
        return deptMapper.findAll();
    }
}
```

#### Mapper

```
@Mapper
public interface DeptMapper {
    /**
     * 查询所有部门
     */
    @Select("select * from dept")
    public List<Dept> findAll();
    
}
```

#### 前后端联调

![image.webp](https://imgbed.f3f3.top/file/picgo/1781935470226_image.webp)

1.浏览器发起请求，请求的是localhost:90 ，那其实请求的是nginx服务器。

2.在nginx服务器中呢，并没有对请求直接进行处理，而是将请求转发给了后端的tomcat服务器，最终由tomcat服务器来处理该请求。

**通过nginx的反向代理实现**的。 那为什么浏览器不直接请求后端的tomcat服务器，而是直接请求nginx服务器呢

安全：由于后端的tomcat服务器一般都会搭建集群，会有很多的服务器，把所有的tomcat暴露给前端，让前端直接请求tomcat，对于后端服务器是比较危险的。

灵活：基于nginx的反向代理实现，更加灵活，后端想增加、减少服务器，对于前端来说是无感知的，只需要在nginx中配置即可。

负载均衡：基于nginx的反向代理，可以很方便的实现后端tomcat的负载均衡操作。

### 部门删除

#### **`@RequestParam`**

```
@DeleteMapping("/depts")
public Result delete(@RequestParam("id") Integer deptId){
    System.out.println("根据ID删除部门: " + deptId);
    return Result.success();
}
```

```
@DeleteMapping("/depts")
public Result delete(Integer id){
    System.out.println("根据ID删除部门: " + deptId);
    return Result.success();
}
//如果请求参数名与形参变量名相同，直接定义方法形参即可接收。（省略@RequestParam）
```



#### Controller

```
/**
 * 根据id删除部门 - delete http://localhost:8080/depts?id=1
 */
@DeleteMapping("/depts")
public Result delete(Integer id){
    System.out.println("根据id删除部门, id=" + id);
    deptService.delete(id);
    return Result.success();
}
```

#### Service

```
/**
 * 根据id删除部门
 */
package com.itheima.service;

import com.itheima.pojo.Dept;

import java.util.List;

public interface DeptService {
    List<Dept> findAll();
    void delete(Integer id);
```

```
package com.itheima.service.impl;

import com.itheima.mapper.DeptMapper;
import com.itheima.pojo.Dept;
import com.itheima.service.DeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeptServiceimpl implements DeptService {
    @Autowired
    private DeptMapper deptMapper;
    @Override
    public List<Dept> findAll() {
        return deptMapper.findAll();
    }

    @Override
    public void delete(Integer id) {
       deptMapper.delete(id);
    }
```



#### Mapper

```
package com.itheima.mapper;
import com.itheima.pojo.Dept;
import org.apache.ibatis.annotations.*;
import java.util.List;
//操作增删改功能
@Mapper
public interface DeptMapper {
    @Select("select id, name, create_time createTime, update_time updateTime from dept")
    public List<Dept> findAll();
    @Delete("delete from dept where id = #{id}")
    public void delete(Integer id);
```

### 新增部门

#### @RequestBody

在controller中，需要接收前端传递的请求参数。 那接下来，我们就先来看看在服务器端的Controller程序中，如何获取json格式的参数。 

- JSON格式的参数，通常会使用一个实体对象进行接收 。
- 规则：JSON数据的键名与方法形参对象的属性名相同，并需要使用`@RequestBody`注解标识。

前端传递的请求参数格式为json，内容如下：`{"name":"研发部"}`。这里，我们可以通过一个对象来接收，只需要保证对象中有name属性即可。

#### Controller

```
@RequestMapping("/depts")
@RestController   //交由io容器管理
public class DeptController {

//新增部门 - POST http://localhost:8080/depts   请求参数：{"name":"研发部"}
@PostMapping
    public Result add(@RequestBody Dept dept)
    {
        log.info("保存的部门数据为：{}" ,dept);
        deptService.add(dept);
        return Result.success();
    }
    }
```

#### Service

```
 @Override
    public void add(Dept dept) {
        LocalDateTime now = LocalDateTime.now();
        dept.setCreateTime(now);
        dept.setUpdateTime(now);
        deptMapper.add(dept);
    }
```

```
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dept {
    private Integer id;
    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Shanghai")
    private LocalDateTime updateTime;
}
```

#### Mapper

```
/**
 * 保存部门
 */
@Insert("insert into dept(name,create_time,update_time) values(#{name},#{createTime},#{updateTime})")
void insert(Dept dept);
```

在mapper接口中，需要传递多个参数，可以把多个参数封装到一个对象中。 在SQL语句中获取参数的时候，`#{...}` 里面写的是对象的属性名【注意是属性名，不是表的字段名】

### 修改部门

#### 根据id查询部门

##### @PathVariable

`/depts/1`，`/depts/2` 这种在url中传递的参数，我们称之为**路径参数**。 那么如何接收这样的路径参数呢 ？

路径参数：通过请求URL直接传递参数，使用{…}来标识该路径参数，需要使用 **`@PathVariable`**获取路径参数

##### Controller

```
 @GetMapping("/{id}")
    public Result getinfo(@PathVariable ("id") Integer deptsid){
       log.info("根据id查询的部门id为：{}" ,deptsid);
        Dept dept = deptService.findinfo(deptsid);
        return Result.success(dept);
    }
```

##### Service

```
package com.itheima.service;

import com.itheima.pojo.Dept;

import java.util.List;

public interface DeptService {
    List<Dept> findAll();
    void delete(Integer id);
    void add(Dept dept);
    Dept findinfo(Integer id);
```



```
  @Override
    public Dept findinfo(Integer id) {
        return deptMapper.findinfo(id);
    }
```

##### Mapper

```
  @Select("select id, name, create_time createTime, update_time updateTime from dept where id = #{id}")
    public Dept findinfo(Integer id);
```

#### 修改部门

![image.webp](https://imgbed.f3f3.top/file/picgo/1781938770333_image.webp)

##### @RequestBody

##### Controller

```
 @PutMapping
    public Result update(@RequestBody Dept dept) {
       log.info("修改的部门数据为：{}" , dept);
        deptService.update(dept);
        return Result.success();
    }
```



##### Service

```
  package com.itheima.service;

import com.itheima.pojo.Dept;

import java.util.List;

public interface DeptService {
    List<Dept> findAll();
    void delete(Integer id);
    void add(Dept dept);
    Dept findinfo(Integer id);

    void getinfo(Dept dept);
    void update(Dept dept);
}

```



```
@Override
    public void update(Dept dept) {
        LocalDateTime now = LocalDateTime.now();
        dept.setUpdateTime(now);
        deptMapper.update(dept);
    }
```



##### Mapper

```
package com.itheima.mapper;
import com.itheima.pojo.Dept;
import org.apache.ibatis.annotations.*;
import java.util.List;
//操作增删改功能
@Mapper
public interface DeptMapper {
    @Select("select id, name, create_time createTime, update_time updateTime from dept")
    public List<Dept> findAll();
    @Delete("delete from dept where id = #{id}")
    public void delete(Integer id);
    @Insert("insert into dept(name, create_time, update_time) values(#{name}, #{createTime}, #{updateTime})")
    public void add(Dept dept);
    
    //根据id查询回显并修改部门
    @Select("select id, name, create_time createTime, update_time updateTime from dept where id = #{id}")
    public Dept findinfo(Integer id);
    @Update("update dept set name = #{name}, update_time = #{updateTime} where id = #{id}")
    public void update(Dept dept)
```

#### @RequstMapping

```
// 文件路径：src/main/java/com/itheima/controller/DeptController.java
package com.itheima.controller;

import com.itheima.anno.LogOperation;
import com.itheima.pojo.Dept;
import com.itheima.pojo.Result;
import com.itheima.service.DeptService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import java.io.File;
import java.util.List;
import java.util.logging.Logger;
@Slf4j
@RequestMapping("/depts")
@RestController   //交由io容器管理
public class DeptController {

    @Autowired
    private DeptService deptService;
    @LogOperation
    // 查询所有部门信息
    @GetMapping
    public Result list() {
        List<Dept> deptList = deptService.findAll();
        return Result.success(deptList);
    }

    // 删除部门
//    @DeleteMapping("/depts")
//    public Result delete(HttpServletRequest request) {
//        String id = request.getParameter("id");
//        int deptId = Integer.parseInt(id);
//        System.out.println("删除的部门id为：" + deptId);
//        return Result.success();
//    }
    @LogOperation
    @DeleteMapping
    public Result delete( Integer id) {
        log.info("删除的部门id为：{}", id);
        deptService.delete(id);
        return Result.success();
    }
    @LogOperation
    @PostMapping
    public Result add(@RequestBody Dept dept)
    {
        log.info("保存的部门数据为：{}" ,dept);
        deptService.add(dept);
        return Result.success();
    }
    @LogOperation
    @GetMapping("/{id}")
    public Result getinfo(@PathVariable ("id") Integer deptsid){
       log.info("根据id查询的部门id为：{}" ,deptsid);
        Dept dept = deptService.findinfo(deptsid);
        return Result.success(dept);
    }
    @LogOperation
    @PutMapping
    public Result update(@RequestBody Dept dept) {
       log.info("修改的部门数据为：{}" , dept);
        deptService.update(dept);
        return Result.success();
    }
}
```

### 日志技术

#### 定义

日志用于记录应用程序的运行信息、状态信息和错误信息。专业的日志框架（如 Logback）替代 `System.out.println`，提供灵活的日志级别控制、多种输出目标（控制台/文件）和格式化能力。

#### 日志框架

使用 `System.out.println(...)` 记录日志的缺陷：

- **硬编码**：无法灵活控制输出与否，只能删除代码
- **输出受限**：只能输出到控制台
- **不便于扩展维护**：无法按级别过滤、按格式输出

#### 对比

| 框架    | 特点                                                |
| ------- | --------------------------------------------------- |
| JUL     | JavaSE 官方日志框架，配置简单但不够灵活，性能较差   |
| Log4j   | 流行的日志框架，灵活的配置选项，支持多种输出目标    |
| Logback | 基于 Log4j 升级，更多功能和配置选项，性能优于 Log4j |
| Slf4j   | 简单日志门面，提供标准接口，允许切换底层日志框架    |

#### Logback 依赖引入

SpringBoot 已内置传递 Logback 依赖，无需额外引入。若单独使用：

```
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.4.11</version>
</dependency>
```

#### 配置文件 logback.xml

放置在 `src/main/resources` 目录下：

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}-%msg%n</pattern>
        </encoder>
    </appender>

<!-- 系统文件输出 -->
	<appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
		<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
			<!-- 日志文件输出的文件名, %i表示序号 -->
			<FileNamePattern>/usr/local/tlias-app/tlias-%d{yyyy-MM-dd}-%i.log</FileNamePattern>
			<!-- 最多保留的历史日志文件数量 -->
			<MaxHistory>30</MaxHistory>
			<!-- 最大文件大小，超过这个大小会触发滚动到新文件，默认为 10MB -->
			<maxFileSize>10MB</maxFileSize>
		</rollingPolicy>

		<encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
			<!--格式化输出：%d 表示日期，%thread 表示线程名，%-5level表示级别从左显示5个字符宽度，%msg表示日志消息，%n表示换行符 -->
			<pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{50}-%msg%n</pattern>
		</encoder>
	</appender>
    
    
    <!-- 日志输出级别 -->
    <root level="ALL">
        <appender-ref ref="STDOUT" />
    </root>
</configuration>
```

Pattern 格式化占位符说明：

| 占位符        |            含义             |
| ------------- | :-------------------------: |
| `%d`          |            日期             |
| `%thread`     |           线程名            |
| `%-5level`    | 日志级别，左对齐 5 字符宽度 |
| `%logger{50}` |  Logger 名称，最长 50 字符  |
| `%msg`        |          日志消息           |
| `%n`          |           换行符            |

#### 日志级别

级别由低到高：**TRACE → DEBUG → INFO → WARN → ERROR**

`<root level="info">` 表示仅输出大于等于 INFO 级别的日志（INFO / WARN / ERROR），DEBUG 和 TRACE 不会输出。

| 配置值 | 效果                                     |
| :----: | ---------------------------------------- |
|  ALL   | 输出所有级别日志                         |
|  OFF   | 关闭所有日志                             |
|  INFO  | 仅输出 INFO、WARN、ERROR（生产环境推荐） |
| DEBUG  | 输出 DEBUG 及以上（开发调试推荐）        |

#### 常见场景

```
// 文件路径：src/main/java/com/itheima/controller/DeptController.java
package com.itheima.controller;

import com.itheima.anno.LogOperation;
import com.itheima.pojo.Dept;
import com.itheima.pojo.Result;
import com.itheima.service.DeptService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import java.io.File;
import java.util.List;
import java.util.logging.Logger;
@Slf4j
@RequestMapping("/depts")
@RestController   //交由io容器管理
public class DeptController {

    @Autowired
    private DeptService deptService;
    @LogOperation
    // 查询所有部门信息
    @GetMapping
    public Result list() {
        List<Dept> deptList = deptService.findAll();
        return Result.success(deptList);
    }

    // 删除部门
//    @DeleteMapping("/depts")
//    public Result delete(HttpServletRequest request) {
//        String id = request.getParameter("id");
//        int deptId = Integer.parseInt(id);
//        System.out.println("删除的部门id为：" + deptId);
//        return Result.success();
//    }
    @LogOperation
    @DeleteMapping
    public Result delete( Integer id) {
        log.info("删除的部门id为：{}", id);
        deptService.delete(id);
        return Result.success();
    }
    @LogOperation
    @PostMapping
    public Result add(@RequestBody Dept dept)
    {
        log.info("保存的部门数据为：{}" ,dept);
        deptService.add(dept);
        return Result.success();
    }
    @LogOperation
    @GetMapping("/{id}")
    public Result getinfo(@PathVariable ("id") Integer deptsid){
       log.info("根据id查询的部门id为：{}" ,deptsid);
        Dept dept = deptService.findinfo(deptsid);
        return Result.success(dept);
    }
    @LogOperation
    @PutMapping
    public Result update(@RequestBody Dept dept) {
       log.info("修改的部门数据为：{}" , dept);
        deptService.update(dept);
        return Result.success();
    }
}
```



- 生产环境设为 INFO 级别记录关键业务操作
- 开发调试时设为 DEBUG 级别查看详细执行过程
- 将日志输出到文件并按日期/大小滚动，便于持久化追踪

#### 注意事项

- SpringBoot 已内置 Logback，无需额外引入依赖
- `logback.xml` 需放在 `src/main/resources` 下
- 使用 `@Slf4j` 注解可省略手动定义 Logger
- 日志消息推荐使用 `{}` 占位符而非字符串拼接
- 生产环境不建议使用 `System.out.println`，应统一使用日志框架

## 员工管理

### 前置数据

```
-- 员工表
create table emp(
    id int unsigned primary key auto_increment comment 'ID,主键',
    username varchar(20) not null unique comment '用户名',
    password varchar(50) default '123456' comment '密码',
    name varchar(10) not null comment '姓名',
    gender tinyint unsigned not null comment '性别, 1:男, 2:女',
    phone char(11) not null unique comment '手机号',
    job tinyint unsigned comment '职位, 1 班主任, 2 讲师 , 3 学工主管, 4 教研主管, 5 咨询师',
    salary int unsigned comment '薪资',
    image varchar(300) comment '头像',
    entry_date date comment '入职日期',
    dept_id int unsigned comment '部门ID',
    create_time datetime comment '创建时间',
    update_time datetime comment '修改时间'
) comment '员工表';


INSERT INTO emp VALUES 
    (1,'shinaian','123456','施耐庵',1,'13309090001',4,15000,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2000-01-01',2,'2023-10-20 16:35:33','2023-11-16 16:11:26'),
    (2,'songjiang','123456','宋江',1,'13309090002',2,8600,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2015-01-01',2,'2023-10-20 16:35:33','2023-10-20 16:35:37'),
    (3,'lujunyi','123456','卢俊义',1,'13309090003',2,8900,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2008-05-01',2,'2023-10-20 16:35:33','2023-10-20 16:35:39'),
    (4,'wuyong','123456','吴用',1,'13309090004',2,9200,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2007-01-01',2,'2023-10-20 16:35:33','2023-10-20 16:35:41'),
    (5,'gongsunsheng','123456','公孙胜',1,'13309090005',2,9500,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2012-12-05',2,'2023-10-20 16:35:33','2023-10-20 16:35:43'),
    (6,'huosanniang','123456','扈三娘',2,'13309090006',3,6500,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2013-09-05',1,'2023-10-20 16:35:33','2023-10-20 16:35:45'),
    (7,'chaijin','123456','柴进',1,'13309090007',1,4700,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2005-08-01',1,'2023-10-20 16:35:33','2023-10-20 16:35:47'),
    (8,'likui','123456','李逵',1,'13309090008',1,4800,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2014-11-09',1,'2023-10-20 16:35:33','2023-10-20 16:35:49'),
    (9,'wusong','123456','武松',1,'13309090009',1,4900,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2011-03-11',1,'2023-10-20 16:35:33','2023-10-20 16:35:51'),
    (10,'linchong','123456','林冲',1,'13309090010',1,5000,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2013-09-05',1,'2023-10-20 16:35:33','2023-10-20 16:35:53'),
    (11,'huyanzhuo','123456','呼延灼',1,'13309090011',2,9700,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2007-02-01',2,'2023-10-20 16:35:33','2023-10-20 16:35:55'),
    (12,'xiaoliguang','123456','小李广',1,'13309090012',2,10000,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2008-08-18',2,'2023-10-20 16:35:33','2023-10-20 16:35:57'),
    (13,'yangzhi','123456','杨志',1,'13309090013',1,5300,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2012-11-01',1,'2023-10-20 16:35:33','2023-10-20 16:35:59'),
    (14,'shijin','123456','史进',1,'13309090014',2,10600,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2002-08-01',2,'2023-10-20 16:35:33','2023-10-20 16:36:01'),
    (15,'sunerniang','123456','孙二娘',2,'13309090015',2,10900,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2011-05-01',2,'2023-10-20 16:35:33','2023-10-20 16:36:03'),
    (16,'luzhishen','123456','鲁智深',1,'13309090016',2,9600,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2010-01-01',2,'2023-10-20 16:35:33','2023-10-20 16:36:05'),
    (17,'liying','12345678','李应',1,'13309090017',1,5800,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2015-03-21',1,'2023-10-20 16:35:33','2023-10-20 16:36:07'),
    (18,'shiqian','123456','时迁',1,'13309090018',2,10200,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2015-01-01',2,'2023-10-20 16:35:33','2023-10-20 16:36:09'),
    (19,'gudasao','123456','顾大嫂',2,'13309090019',2,10500,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2008-01-01',2,'2023-10-20 16:35:33','2023-10-20 16:36:11'),
    (20,'ruanxiaoer','123456','阮小二',1,'13309090020',2,10800,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2018-01-01',2,'2023-10-20 16:35:33','2023-10-20 16:36:13'),
    (21,'ruanxiaowu','123456','阮小五',1,'13309090021',5,5200,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2015-01-01',3,'2023-10-20 16:35:33','2023-10-20 16:36:15'),
    (22,'ruanxiaoqi','123456','阮小七',1,'13309090022',5,5500,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2016-01-01',3,'2023-10-20 16:35:33','2023-10-20 16:36:17'),
    (23,'ruanji','123456','阮籍',1,'13309090023',5,5800,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2012-01-01',3,'2023-10-20 16:35:33','2023-10-20 16:36:19'),
    (24,'tongwei','123456','童威',1,'13309090024',5,5000,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2006-01-01',3,'2023-10-20 16:35:33','2023-10-20 16:36:21'),
    (25,'tongmeng','123456','童猛',1,'13309090025',5,4800,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2002-01-01',3,'2023-10-20 16:35:33','2023-10-20 16:36:23'),
    (26,'yanshun','123456','燕顺',1,'13309090026',5,5400,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2011-01-01',3,'2023-10-20 16:35:33','2023-11-08 22:12:46'),
    (27,'lijun','123456','李俊',1,'13309090027',2,6600,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2004-01-01',2,'2023-10-20 16:35:33','2023-11-16 17:56:59'),
    (28,'lizhong','123456','李忠',1,'13309090028',5,5000,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2007-01-01',3,'2023-10-20 16:35:33','2023-11-17 16:34:22'),
    (30,'liyun','123456','李云',1,'13309090030',NULL,NULL,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2020-03-01',NULL,'2023-10-20 16:35:33','2023-10-20 16:36:31'),
    (36,'linghuchong','123456','令狐冲',1,'18809091212',2,6800,'https://web-framework.oss-cn-hangzhou.aliyuncs.com/2023/1.jpg','2023-10-19',2,'2023-10-20 20:44:54','2023-11-09 09:41:04');
    

-- 员工工作经历信息
create table emp_expr(
    id int unsigned primary key auto_increment comment 'ID, 主键',
    emp_id int unsigned comment '员工ID',
    begin date comment '开始时间',
    end  date comment '结束时间',
    company varchar(50) comment '公司名称',
    job varchar(50) comment '职位'
)comment '工作经历';

```

### 实体类

```
package com.itheima.pojo;

import lombok.Data;

import java.time.LocalDate;

/**
 * 工作经历
 */
@Data
public class EmpExpr {
    private Integer id; //ID
    private Integer empId; //员工ID
    private LocalDate begin; //开始时间
    private LocalDate end; //结束时间
    private String company; //公司名称
    private String job; //职位
}
```

```
package com.itheima.pojo;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Emp {
    private Integer id; //ID,主键
    private String username; //用户名
    private String password; //密码
    private String name; //姓名
    private Integer gender; //性别, 1:男, 2:女
    private String phone; //手机号
    private Integer job; //职位, 1:班主任,2:讲师,3:学工主管,4:教研主管,5:咨询师
    private Integer salary; //薪资
    private String image; //头像
    private LocalDate entryDate; //入职日期
    private Integer deptId; //关联的部门ID
    private LocalDateTime createTime; //创建时间
    private LocalDateTime updateTime; //修改时间

    //封装部门名称数
    private String deptName; //部门名称
}

```

### 分页查询

![image.webp](https://imgbed.f3f3.top/file/picgo/1781941764600_image.webp)

```
package com.itheima.pojo;

import lombok.Data;

import java.util.List;
@Data
public class PageResult< T> {
    //定义格式进行封装
    private Long total;
    private List<T> rows;
    // 添加带参数的构造函数
    public PageResult(Long total, List<T> rows) {
        this.total = total;
        this.rows = rows;
    }
    // 无参构造函数
    public PageResult() {
    }
}

```

请求路径：/emps

请求方式：GET

请求参数：跟随在请求路径后的参数字符串。  例：/emps?page=1&pageSize=10

响应数据：json格式



![image.webp](https://imgbed.f3f3.top/file/picgo/1781942268802_image.webp)

#### 引入依赖

```
<!--分页插件PageHelper-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.4.7</version>
</dependency>
```

#### Mapper

```
package com.itheima.mapper;
import com.itheima.pojo.Emp;
import com.itheima.pojo.EmpQueryParam;
import com.itheima.pojo.JobOption;
import com.itheima.pojo.Result;
import org.apache.ibatis.annotations.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

//mybatis操作数据库员工基本信息
//查询总记录数
@Mapper
public interface EmpMapper {
    //原始方法
//    @Select("select count(*) from emp e left join dept d on e.dept_id =d.id ")
//    public Long count();
//    //分页查询 记录起始索引，每页记录数
//    @Select("select e.*,d.name from emp e left join dept d " +
//            "on e.dept_id =d.id limit #{start},#{pageSize}  ")
//    public List<Emp> list(Integer start, Integer pageSize);

   //利用pagehelper分页插件简化书写
@Select("select e.*,d.name from emp e left join dept d "+"on e.dept_id =d.id  ")

```

#### Controller

```
@Slf4j
@RequestMapping("/emps")
@RestController
public class EmpController {
    @Autowired
    private EmpService empService;

*分页查询
@GetMapping
public Result page(Integer page, Integer pageSize){
log.info("分页查询：{},{}"，page，pagesize)；
PageResult<Emp> pageResult = empService.page(page, pagesize);
return Result.success(pageResult);
    
```

#### Service

```
@Slf4j
@Service
public class EmpServiceImpl implements EmpService {
    @Autowired
    private EmpMapper empMapper;
    @Autowired
    private EmpExprMapper empExprMapper;
    @Autowired
    private EmpLogService empLogService;


    //    @Override
//    public PageResult<Emp> page(Integer page, Integer pageSize) {
//        //查询总记录数
//        Long total = empMapper.count();
//        //计算起始索引
//        Integer start = (page - 1) * pageSize;
//        List<Emp> rows = empMapper.list(start, pageSize);
//        return new PageResult<Emp>(total, rows);
//    }
    // 利用pagehelper分页插件简化书写
    @Override
    public PageResult<Emp> page(page,pageSize) {
        //设置分页参数
     PageHelper.startPage(page,pageSize);
     //存入ThreadLocal线程局部变量绑定当前线程
        
        //执行查询
        List<Emp> list = empMapper.list();
        //自定义拦截器Mybatis的Executor.query执行点
        //拼接分页语句limit ?,?
        //同时执行count(*)语句
        
        //page是arraylist 的子类，自带参数
        //将普通的list包装成Mybatis的page对象
        //ThreadLocal清理分页参数,避免下次查询污染
        Page<Emp> p = (Page<Emp>) list;//与pagehelper一起使用
        
        
        
        return new PageResult<>(p.getTotal(), p.getResult());
    }
```

- PageHelper实现分页查询时，SQL语句的结尾一定不要加分号(;).。

- PageHelper只会对紧跟在其后的第一条SQL语句进行分页处理。

- pagehelper是对原有的sql语句进行拦截改造拼接 多态编译page类，执行右边查询进行封装强转

PageHelper在进行分页查询时，会执行上述两条SQL语句，并将查询到的总记录数，与数据列表封装到了 `Page<Emp>` 对象中，我们再获取查询结果时，只需要调用Page对象的方法就可以获取。

### 条件查询

#### 需求

员工查询
1.1输入员工名称进行搜索，支持模糊查询。
1.2选择员工性别进行精确查询
1.3选择入职时间的开始时间和结束时间，可以进行范围查询。
1.4 对查询结果根据修改时间倒序排序，并对查询结果进行分页展示。

![image.webp](https://imgbed.f3f3.top/file/picgo/1782004261118_image.webp)

#### 初始

```
@GetMapping
public Result list(@RequestParam(defaultValue = "1")Integer page, @RequestParam(defaultValue = "1e") Integer pageSize, String name, Integer gender,
//注解保证请求头中日期格式转换
@DataTimeFormat(pattern = "yyyy-MM-dd"） LocalDate begin,@DataTimeFormat(pattern = "yyyy-MM-dd")LocalDate end） {
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1782005176618_image.webp)

sql语句太长要用xml文件映射，在resouces创建目录名同包名创建xml文件 在mybatis中文网找映射代码cv

利用mybatisx插件进行sql语句alt+enter

#### 优化

##### 实体类

```
package com.itheima.pojo;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
@Data
public class EmpQueryParam {
    private Integer page=1;
    private Integer pageSize=10;
    private String name;
    private Integer gender;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate begin;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate end;
}

```

```
package com.itheima.pojo;

import lombok.Data;

import java.util.List;
@Data
public class PageResult< T> {
    //定义格式进行封装
    private Long total;
    private List<T> rows;
    // 添加带参数的构造函数
    public PageResult(Long total, List<T> rows) {
        this.total = total;
        this.rows = rows;
    }
    // 无参构造函数
    public PageResult() {
    }
}
```



##### Controller

```
    @GetMapping
    public Result list(EmpQueryParam param) {
        log.info("分页查询{}，{},{},{}",param);
        //返回前端封装的实体类的属性，封装在PageResult类中
        PageResult<Emp> pageResult= empService.page( param);
        return Result.success(pageResult);
    }
```

##### Service

```
   @Override
    public PageResult<Emp> page(EmpQueryParam param) {
        //设置分页参数
        PageHelper.startPage(param.getPage(), param.getPageSize());
        //执行查询
        List<Emp> list = empMapper.list(param);
        //page是arraylist 的子类
        Page<Emp> p = (Page<Emp>) list;//与pagehelper一起使用
        return new PageResult<>(p.getTotal(), p.getResult());
    }
```

#### 动态sql

```
  //分页查询
   public List<Emp> list(EmpQueryParam param);
```

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.itheima.mapper.EmpMapper">      
<!--namespace必须和mapper接口全类名一致-->
    
    <!--分页查询员工信息-->
    <!--id对应着mapper接口的方法名list()-->
    <!--ResultType查询结果自动封装成Emp对象-->
    <!--SQL字段别名必须严格等于实体类属性名，才能自动映射；-->
     <!--返回对象为emp实体类，在emp实体类加入deptName别名属性实现自动映射-->
     <!--封装部门名称private String deptName;-->
     
     <select id="list" resultType="com.itheima.pojo.Emp">
        select e.*,d.name deptName from emp e left join dept d on e.dept_id =d.id
        <!--test字段是EmpQueryParam param 里的字段，后面的字段为数据库字段-->
        <where>
            <if test="name != null and name != ''">
                and e.name like concat('%',#{name},'%')
            </if>
            
            <if test="gender != null">
                and e.gender = #{gender}
            </if>
            
            <if test="begin != null">
                and e.entry_date= #{begin}
            </if>
            
            <if test="end != null">
                and e.entry_date= #{end}
            </if>
        </where>
        order by e.create_time desc
    </select>
```

1.Mybatis中动态SQL的使用场景？
如果SQL语句是不固定的，是随着用户的输入或外部条件的变化而变化的
2。MyBatis中动态SQL的<if>及<where>标签的作用？
<if>标签：条件判断，如果条件成立，则拼接对应的sql片段
<where>：根据查询条件，来生成where关键字，并会自动去除条件前面多余的and或or。

### 新增员工

#### 新增字段

![image.webp](https://imgbed.f3f3.top/file/picgo/1782008591945_image.webp)

```
//员工基本信息表
@Data
public class Emp {
    private Integer id; //ID,主键
    private String username; //用户名
    private String password; //密码
    private String name; //姓名
    private Integer gender; //性别, 1:男, 2:女
    private String phone; //手机号
    private Integer job; //职位, 1:班主任,2:讲师,3:学工主管,4:教研主管,5:咨询师
    private Integer salary; //薪资
    private String image; //头像
    private LocalDate entryDate; //入职日期
    private Integer deptId; //关联的部门ID
    private LocalDateTime createTime; //创建时间
    private LocalDateTime updateTime; //修改时间



    //封装部门名称
    private String deptName;
    //封装员工工作经历信息
    private List<EmpExpr> exprList;

}
```

**返回对象都是emp员工实体类**

#### Controller

```
   //新增员工
    @PostMapping
    //@RequestBody需要传入一段json数据
    public Result add(@RequestBody Emp emp) {
     {
            log.info("请求参数emp: {}", emp);
            empService.save(emp);
            return Result.success();
        }}
```

#### Service

```
@Override
public voidsave(Emp emp）{
//1.保存员工基本信息
emp.setCreateTime(LocalDateTime.now());
emp.setUpdateTime(LocalDateTime.now());
empMapper.insert(emp);
//2.保存员工工作经历信息
List<EmpExpr> exprList = emp.getExprList();
if(!CollectionUtils.isEmpty(exprList)){//遍历集合，为empId赋值
//Landom表达式list.forEach(形参->{方法体})
exprList.forEach(empExpr->{
empExpr.setEmpId(emp.getId( )});
empExprMapper.insertBatch(exprList);
}
```

#### Mapper

```
/**
    * 新增员工数据
    */
   //新增员工基本信息并且用@Options(useGeneratedKeys = true, keyProperty = "id")获取id属性
   @Options(useGeneratedKeys = true, keyProperty = "id")

   @Insert("insert into emp(username, name, gender, phone, job, salary, image, entry_date, dept_id, create_time, update_time) " +
  "values (#{username},#{name},#{gender},#{phone},#{job},#{salary},#{image},{entryDate},#{deptId},#{createTime},#{updateTime})")
   void insert(Emp emp);
```

```
package com.itheima.mapper;
import com.itheima.pojo.EmpExpr;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

//操作员工经历
    @Mapper
    public interface EmpExprMapper {

        /**
         * 批量插入员工工作经历信息
         */
        void insertBatch(List<EmpExpr> exprList);
```

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.itheima.mapper.EmpExprMapper">
<!--    批量插入员工工作经历信息-->
    <！--批量保存员工工作经历信息
    foreach标签：
collection：遍历的集合item：遍历出来的元素
separator：每次循环之间的分隔符-->
    
    <insert id="insertBatch">
    insert into emp_expr(emp_id,begin,end,company,job) values
    <foreach collection="exprList" item="item" separator=",">
     (#{item.empId},#{item.begin},#{item.end},#{item.company},#{item.job})
    </foreach>

    </insert>
```

###  Spring事务

#### 初识

事务 是一组操作的集合，它是一个不可分割的工作单位。事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作要么同时成功，要么同时失败。

```
//开启事务
start transaction; / begin;
//提交事务（全部成功）/回滚事务（有一个失败）
commit;/ rollback;
```

```
注解：@Transactional
作用：将当前方法交给spring进行事务管理，方法执行前，开启事务；成功执行完毕，提交事务；出现异常，回滚事务
位置：业务（service）层的方法上、类上、接口上

默认出现运行时异常RuntimeException才会回滚
```

#### 进阶

##### 事务传播

```
//新增员工信息
//事务传播行为：指的就是当一个事务方法被另一个事务方法调用时，这个事务方法应该如何进行事务控制。
//常见的传播行为及应用场景？REQUIRED：大部分场景 需要事务，有则加入，无则创建新事务
REQUIRES_NEW：希望两个方法在独立的事务中运行，互不影响   需要新事务，无论有，总是创建新事务  
     @Transactional(rollbackFor = Exception.class)//事务注解
     //所有异常都回滚
    @Override
    public void save(Emp emp) {
        try {
            //1.补全基础属性
            emp.setCreateTime(LocalDateTime.now());
            emp.setUpdateTime(LocalDateTime.now());

            //2.保存员工基本信息
            empMapper.insert(emp);
            //3. 保存员工的工作经历信息 - 批量
            Integer empId = emp.getId();
            //获取员工工作经历信息
            List<EmpExpr> exprList = emp.getExprList();
//            判断是否为空遍历赋值员工id批量插入员工经历信息<foreach
            if(!CollectionUtils.isEmpty(exprList)){
                exprList.forEach(empExpr -> empExpr.setEmpId(empId));
                empExprMapper.insertBatch(exprList);
            }
        } finally {
            //记录操作日志
            EmpLog empLog = new EmpLog(null, LocalDateTime.now(), emp.toString());
            empLogService.insertLog(empLog);
        }
    }
    
```

### 文件上传

#### Controller

```
public class UploadController {

    @Autowired
    private AliyunOSSOperator aliyunOSSOperator;

    @PostMapping("/upload")
    public Result upload(MultipartFile file) throws Exception {
        log.info("上传文件：{}", file);
        if (!file.isEmpty()) {
            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extName=originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFileName = UUID.randomUUID().toString().replace("-", "") + extName;
            // 上传文件
            String url = aliyunOSSOperator.upload(file.getBytes(), uniqueFileName);
            return Result.success(url);
        }
        return Result.error("上传失败");
    }

}
```

#### yml文件

```
#配置oss存储
aliyun:
    oss:
        endpoint: http://oss-cn-beijing.aliyuncs.com
        bucketName: java-ai-tlias2026
        region: cn-beijing
```

#### 工具类

```
package com.itheima.Utils;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
@Data
@Component
@ConfigurationProperties(prefix = "aliyun.oss")
public class AliyunOSSProperties {
    private String endpoint;
    private String bucketName;
    private String region;
}

```

```
package com.itheima.Utils;

import com.aliyun.oss.*;
import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.comm.SignVersion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class AliyunOSSOperator {

    @Autowired
    private AliyunOSSProperties aliyunOSSProperties;
    public String upload(byte[] content, String originalFilename) throws Exception {

        String endpoint = aliyunOSSProperties.getEndpoint();
        String bucketName = aliyunOSSProperties.getBucketName();
        String region = aliyunOSSProperties.getRegion();
        // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量 OSS_ACCESS_KEY_ID 和 OSS_ACCESS_KEY_SECRET。
        EnvironmentVariableCredentialsProvider credentialsProvider = CredentialsProviderFactory.newEnvironmentVariableCredentialsProvider();

        // 填写 Object 完整路径，例如 202406/1.png。Object 完整路径中不能包含 Bucket 名称。
        //获取当前系统日期的字符串，格式为 yyyy/MM
        String dir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        //生成一个新的不重复的文件名
        String newFileName = UUID.randomUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));
        String objectName = dir + "/" + newFileName;

        // 创建 OSSClient 实例。
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(credentialsProvider)
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();

        try {
            ossClient.putObject(bucketName, objectName, new ByteArrayInputStream(content));
        } finally {
            ossClient.shutdown();
        }

        return endpoint.split("//")[0] + "//" + bucketName + "." + endpoint.split("//")[1] + "/" + objectName;
    }

}

```

![image.webp](https://imgbed.f3f3.top/file/picgo/1782015136291_image.webp)



```
@Component
public class'Aliyunossoperator {
@Value("${aliyun.oss.endpoint} ")
private String endpoint;
Value("${aliyun.oss . bucketName} ")
private String bucketName;
@value("${aliyun.oss.region} ")
private String region;
```

注入外部配置文件中的配置项的两种方式？

- @Value：一个属性一个属性的注入
- @ConfigurationProperties：批量将多个属性注入到bean对象中
- 两种方式各自的使用场景？
- 如果属性较少，建议@Value注入即可
- 如果属性较多,考虑复用，建议使用@ConfigurationProperties

### 删除员工

#### Controller

```
    //删除员工信息
    @DeleteMapping
    public Result delete(@RequestParam("ids") List<Integer> ids)
    {
        log.info("删除员工信息{}",ids);
        empService.delete(ids);
        return Result.success();
    }
```

#### Service

```
//批量删除员工信息
    @Transactional(rollbackFor = Exception.class)//事务注解 任何错误都回滚
    @Override
    public void delete(List<Integer> ids) {
        //1.删除员工基本信息
        empMapper.deleteByIds(ids);
        //2.删除员工的工作经历信息
        empExprMapper.deleteByEmpIds(ids);
    }
```

#### Mapper

```
   //批量删除员工的基本信息
   void deleteByIds(List<Integer> ids);
```

```
    <!--    //批量删除员工的基本信息-->
    <delete id="deleteByIds">
        delete from emp where id in
        <foreach collection="ids" item="id" separator="," open="(" close=")">
            #{id}
        </foreach>
    </delete>

```



```
//操作员工经历
    @Mapper
    public interface EmpExprMapper {

   /**
         * 批量插入员工工作经历信息
         */
        void insertBatch(List<EmpExpr> exprList);
//批量删除员工工作经历信息
    void deleteByEmpIds(List<Integer> empIds);
}

```

```
<!--    //批量删除员工经历信息（1，2，3，）-->
    <delete id="deleteByEmpIds">
        delete from emp_expr where emp_id in
         <foreach collection="empIds" item="empId" separator="," open="(" close=")">
            #{empId}
        </foreach>
    </delete>
```

**多个id的接收可采用数组和集合进行接收，集合方法多推荐使用但是需要@RequestParam注解**

### 修改员工

#### 回显数据

![image.webp](https://imgbed.f3f3.top/file/picgo/1782016739902_image.webp)

##### Controller

```

    //员工信息回显
   @GetMapping("/{id}")
    public Result getInfo(@PathVariable Integer id)
   {
       log.info("查询员工信息{}",id);
       //放入单个对象里封装
       Emp emp = empService.getinfo(id);
       return Result.success(emp);
   }
```

##### Service

```
    //查询回显
    @Override
    public Emp getinfo(Integer id) {
        return empMapper.getById(id);
    }
```

##### Mapper

```
//查询回显员工数据认识到了resultmap和resulttype的区别
   Emp getById(Integer id);
```

```
    <!--    //编辑员工信息 查询回显-->
    <select id="getById" resultMap="empResultMap">
        select e.*,
               ee.id ee_id,
               ee.company ee_company,
               ee.job ee_job,
               ee.begin ee_begin,
               ee.end ee_end,
               ee.emp_id ee_empid
        from emp e left join emp_expr ee on e.id = ee.emp_id
        where e.id = #{id}
    </select>
```

```

    <!--    查询回显-->
    <!--    定义resultMap类-->
    <resultMap id="empResultMap" type="com.itheima.pojo.Emp">
        <id column="id" property="id"/>
        <result column ="username" property="username"/>
        <result column ="password" property="password"/>
        <result column ="name" property="name"/>
        <result column ="gender" property="gender"/>
        <result column ="phone" property="phone"/>
        <result column ="job" property="job"/>
        <result column ="salary" property="salary"/>
        <result column ="image" property="image"/>
        <result column ="entry_date" property="entryDate"/>
        <result column ="dept_id" property="deptId"/>
        <result column ="create_time" property="createTime"/>
        <result column ="update_time" property="updateTime"/>
        <!--封装exprList-->
        <collection property="exprList" ofType="com.itheima.pojo.EmpExpr">
            <id column="ee_id" property="id"/>
            <result column ="ee_empid" property="empId"/>
            <result column ="ee_company" property="company"/>
            <result column ="ee_job" property="job"/>
            <result column ="ee_begin" property="begin"/>
            <result column ="ee_end" property="end"/>
        </collection>
    </resultMap>
 <!--一个员工有两段经历封装成一个对象但mybatis会封装成两个需要手动封装resultMap, 首先要定义每个属性property为实体类,自动封装用resultype, 外连接字段重复需要取别名-->
```

Mybatis中封装查询结果，什么时候用resultType，什么时候用resultMap?

- 如果查询返回的字段名与实体的属性名可以直接对应上，用resultType。
- 如果查询返回的字段名与实体的属性名对应不上，或实体属性比较复杂，可以通过resultMap手动封装。

#### 修改数据

##### Controller

```
  //更改员工信息
    @PutMapping  //@RequestBody需要传入一段json数据
    public Result update(@RequestBody Emp emp){
        log.info("更新员工信息{}",emp);
        empService.update(emp);
        return Result.success();
    }
```

##### Service

```
  //编辑员工信息
    @Transactional(rollbackFor = Exception.class)
    @Override
    public void update(Emp emp) {
        emp.setUpdateTime(LocalDateTime.now());
        empMapper.updateById(emp);
       //根据ID修改需要先删除后增加
        //1.批量删除  根据 ID删除原有的工作经历信息m
        empExprMapper.deleteByEmpIds(Arrays.asList(emp.getId()));
        //asList()将数组转换成List可变参数
        //2.批量插入  根据员工ID插入新的工作经历信息
        List<EmpExpr> exprList = emp.getExprList();
        if (!CollectionUtils.isEmpty(exprList)) {
            exprList.forEach(empExpr -> empExpr.setEmpId(emp.getId()));
            empExprMapper.insertBatch(exprList);
        }
    }
```

##### Mapper

```
    <!--    动态sql防止输入一个信息报错-->
    <!--    更新员工的基本信息-->
    <update id="updateById">
        update emp
        <set>
            <if test="username != null and username != ''">
                username=#{username},
            </if>
            <if test="password != null and password != ''">
                password=#{password},
            </if>
            <if test="name != null and name != ''">
                name=#{name},
            </if>
            <if test="gender != null">
                gender=#{gender},
            </if>
            <if test="phone != null and phone != ''">
                phone=#{phone},
            </if>
            <if test="job != null and job != ''">
                job=#{job},
            </if>
            <if test="salary != null">
                salary=#{salary},
            </if>
            <if test="image != null and image != ''">
                image=#{image},
            </if>
            <if test="entryDate != null">
                entry_date=#{entryDate},
            </if>
            <if test="deptId != null">
                dept_id=#{deptId},
            </if>
            <if test="updateTime != null">
                update_time=#{updateTime},
            </if>
        </set>
        where id=#{id}
    </update>
    <--set标签：会自动生成set关键字；会自动的删除掉更新字段后多余,->
```



## 全局异常处理

- @RestControllerAdvice = @ControllerAdvice + @ResponseBody
- 处理异常的方法返回值会转换为json后再响应给前端

- @RestControllerAdvice  //表示当前类为全局异常处理器

- @ExceptionHandler  //指定可以捕获哪种类型的异常进行处理

```
package com.itheima.exception;

import com.itheima.pojo.Result;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //处理通用异常
    @ExceptionHandler(Exception.class)
    public Result handleException(Exception e){
        e.printStackTrace();
        return Result.error("对不起，操作失败，请联系管理员");
    }

    //处理参数类型转换异常
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Result handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e){
        e.printStackTrace();
        return Result.error("参数类型错误，请检查请求参数");
    }

    //处理缺少请求参数异常
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public Result handleMissingServletRequestParameterException(MissingServletRequestParameterException e){
        e.printStackTrace();
        return Result.error("缺少必要的请求参数");
    }

    //处理手机号重复异常
    @ExceptionHandler(PhoneRepeatException.class)
    public Result handlePhoneRepeatException(PhoneRepeatException e){
        e.printStackTrace();
        return Result.error("手机号重复，请重新输入");
    }

}
```

```
package com.itheima.exception;

public class PhoneRepeatException extends RuntimeException {
    public PhoneRepeatException() {
        super();
    }
    
    public PhoneRepeatException(String message) {
        super(message);
    }
    
    public PhoneRepeatException(String message, Throwable cause) {
        super(message, cause);
    }
}

```

## 数据可视化

### 返回实体类

![image.webp](https://imgbed.f3f3.top/file/picgo/1782020262645_image.webp)

```
package com.itheima.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
//数据传入参数的实体类
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOption {
    private List jobList;
    private List dataList;

}
```

### Controller

```
package com.itheima.controller;

import com.itheima.pojo.JobOption;
import com.itheima.pojo.Result;
import com.itheima.service.ReportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RequestMapping("/report")
@RestController
public class ReportController {

    @Autowired
    private ReportService reportService;

    /**
     * 统计各个职位的员工人数
     */
    @GetMapping("/empJobData")
    public Result getEmpJobData(){
        log.info("统计各个职位的员工人数");
        JobOption jobOption = reportService.getEmpJobData();
        return Result.success(jobOption);
    }
    /**
     * 统计员工性别信息
     */
    @GetMapping("/empGenderData")
    public Result getEmpGenderData(){
        log.info("统计员工性别信息");
        List<Map> genderList = reportService.getEmpGenderData();
        return Result.success(genderList);
    }
}
```

### Service

```
package com.itheima.service.impl;

import com.itheima.mapper.EmpMapper;
import com.itheima.pojo.JobOption;
import com.itheima.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
    // ... existing code ...
    @Service
    public class ReportServiceImpl implements ReportService {

        @Autowired
        private EmpMapper empMapper;
     //统计各个职工的人数
        @Override
        public JobOption getEmpJobData() {
            List<Map<String,Object>> list = empMapper.countEmpJobData();
            List<Object> jobList = list.stream().map(dataMap ->
            dataMap.get("pos")).toList();
            List<Object> dataList = list.stream().map(dataMap ->         dataMap.get("num")).toList();
            return new JobOption(jobList, dataList);
        }
      //统计员工性别
        @Override
        public List<Map> getEmpGenderData() {
            return empMapper.countEmpGenderData();
        }
    }

```

### Mapper

```
   //统计员工人数
   List<Map<String,Object>> countEmpJobData();
   // 统计男女员工人数
   /**
    * 统计员工性别信息
    */
   @MapKey("name")
   List<Map> countEmpGenderData();
   
  // 如果查询的记录往Map中封装，可以通过@MapKey注解指定返回的map中的唯一标识是那个字段。
```

```
 <!--    统计员工人数-->
    <select id="countEmpJobData" resultType="java.util.Map">
select (case when job=1 then '班主任'
    when job=2 then '讲师'
    when job=3 then '学工主管'
    when job=4 then '教研主管'
    when job=5 then '咨询师'
    else '其他' end) pos,count(*) num
from emp
group by job order by num
     
    </select>
    <!-- 统计员工的性别信息 -->
    <select id="countEmpGenderData" resultType="java.util.Map">
        select
            if(gender = 1, '男', '女') as name,
            count(*) as value
        from emp group by gender ;
    </select>
```

**case流程控制函数：**

- 语法一：case when cond1 then res1 [ when cond2 then res2 ] else res end ;
- 含义：如果 cond1 成立， 取 res1。  如果 cond2 成立，取 res2。 如果前面的条件都不成立，则取 res。

- 语法二（仅适用于等值匹配）：case expr when val1 then res1 [ when val2 then res2 ] else res end ;
- 含义：如果 expr 的值为 val1 ， 取 res1。  如果  expr 的值为 val2 ，取 res2。 如果前面的条件都不成立，则取 res。

if函数语法：`if(条件, 条件为true取值, 条件为false取值)`

if null函数语法：`ifnull(expr, val1)`    如果expr不为null，取自身，否则取val1

## 登录认证

### 前置数据

![image.webp](https://imgbed.f3f3.top/file/picgo/1782021361441_image.webp)

```
package com.itheima.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@   AllArgsConstructor
public class LoginInfo {
    private Integer id;
    private String username;
    private String name;
    private String token;
}
```

### Controller

```
package com.itheima.controller;

import com.itheima.pojo.Emp;
import com.itheima.pojo.LoginInfo;
import com.itheima.pojo.Result;
import com.itheima.service.EmpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/login")
public class LoginController {
    @Autowired
    private EmpService empService;
    //登录服务
    //emp实体类中有username和password属性
    @PostMapping
    public Result login(@RequestBody Emp emp){
        log.info("员工登录，参数：{}",emp);
        LoginInfo info =empService.login(emp);
        if(info != null){
            return Result.success(info);
        }else{
            return Result.error("用户名或密码错误");
        }
    }
}

```

### Mapper

```
    //根据用户名和密码查询员工信息
   @Select("select id,username, name from emp where username=#{username} and password=#{password} ")
    Emp selectByUsernameAndPassword(Emp emp);
}
```

### 登录校验

- 会话：用户打开浏览器，访问web服务器的资源，会话建立，直到有一方断开连接，会话结束。在一次会话中可以包含多次请求和响应
- 会话跟踪：一种维护浏览器状态的方法，服务器需要识别多次请求是否来自于同一浏览器，以便在同一次会话的多次请求间共享数据。
- 会话跟踪方案：
- 客户端会话跟踪技术：Cookie
- 服务端会话跟踪技术：Session
- 令牌技术
- HTTP协议是无状态协议无状态，指的是每一次请求都是独立的

#### cookie

服务器端在给客户端在响应数据的时候，会**自动**的将 cookie 响应给浏览器，浏览器接收到响应回来的 cookie 之后，会**自动**的将 cookie 的值存储在浏览器本地。接下来在后续的每一次请求当中，都会将浏览器本地所存储的 cookie **自动**地携带到服务端

```
@Slf4j
@RestController
public class SessionController {

    //设置Cookie
    @GetMapping("/c1")
    public Result cookie1(HttpServletResponse response){
        response.addCookie(new Cookie("login_username","itheima")); //设置Cookie/响应Cookie
        return Result.success();
    }
        
    //获取Cookie
    @GetMapping("/c2")
    public Result cookie2(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if(cookie.getName().equals("login_username")){
                System.out.println("login_username: "+cookie.getValue()); //输出name为login_username的cookie
            }
        }
        return Result.success();
    }
}    
```

- 优点：HTTP协议中支持的技术（像Set-Cookie 响应头的解析以及 Cookie 请求头数据的携带，都是浏览器自动进行的，是无需我们手动操作的）

- 缺点：

  - 移动端APP(Android、IOS)中无法使用Cookie

  - 不安全，用户可以自己禁用Cookie

  - Cookie不能跨域
  
  - 区分跨域的维度（三个维度有任何一个维度不同，那就是跨域操作）：
  
    - 协议
    - IP/协议
    - 端口
  
    举例：
  
    - http://192.168.150.200/login.html ----------> https://192.168.150.200/login                    [协议不同，跨域]
    - http://192.168.150.200/login.html ----------> http://192.168.150.100/login                     [IP不同，跨域]
    - http://192.168.150.200/login.html ----------> http://192.168.150.200:8080/login             [端口不同，跨域]
    - http://192.168.150.200/login.html ----------> http://192.168.150.200/login                     [不跨域]   

#### session



#### jwt令牌

##### 初识

JWT的组成： （JWT令牌由三个部分组成，三个部分之间使用英文的点来分割）

- 第一部分：Header(头）， 记录令牌类型、签名算法等。 例如：{"alg":"HS256","type":"JWT"}

- 第二部分：Payload(有效载荷），携带一些自定义信息、默认信息等。 例如：{"id":"1","username":"Tom"}

- 第三部分：Signature(签名），防止Token被篡改、确保安全性。将header、payload，并加入指定秘钥，通过指定签名算法计算而来。

- 签名的目的就是为了防jwt令牌被篡改，而正是因为jwt令牌最后一个部分数字签名的存在，
- 所以整个jwt 令牌是非常安全可靠的。一旦jwt令牌当中任何一个部分、任何一个字符被篡改了，整个令牌在校验的时候都会失败，所以它是非常安全可靠的。

##### 初识令牌

```
//生成令牌
@Test
public void genJwt(){
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", 10);
    claims.put("username", "itheima");

    String jwt = Jwts.builder().signWith(SignatureAlgorithm.HS256, "aXRjYXN0")//指定加密
        .addClaims(claims) //添加自定义信息
        .setExpiration(new Date(System.currentTimeMillis() + 60 * 1000)) //有效期60s
        .compact(); //生成令牌
    System.out.println(jwt);
    
    //输出结果：eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjczMDA5NzU0fQ.RcVIR65AkGiax-ID6FjW60eLFH3tPTKdoK7UtE4A1ro
}

@Test
public void parseJwt(){
    Claims claims = Jwts.parser()
        .setSigningKey("aXRjYXN0")//指定签名密钥
        .parseClaimsJws("eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjczMDA5NzU0fQ.RcVIR65AkGiax-ID6FjW60eLFH3tPTKdoK7UtE4A1ro")  //解析令牌
        .getBody(); //获取自定义信息

    System.out.println(claims);
}
```

##### 依赖引入

```
<!-- JWT依赖-->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

```
package com.itheima.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.Map;

public class JwtUtils {

    private static String signKey = "SVRIRUlNQQ==";
    private static Long expire = 43200000L;
    /**
     * 生成JWT令牌
     * @return
     */
    public static String generateJwt(Map<String,Object> claims){
        String jwt = Jwts.builder()
                .addClaims(claims)//添加自定义属性
                .signWith(SignatureAlgorithm.HS256, signKey)//签名算法
                .setExpiration(new Date(System.currentTimeMillis() + expire))//设置令牌过期时间
                .compact();
        return jwt;
    }
    /**
     * 解析JWT令牌
     * @param jwt JWT令牌
     * @return JWT第二部分负载 payload 中存储的内容
     */
    public static Claims parseJWT(String jwt){
        Claims claims = Jwts.parser()
                .setSigningKey(signKey)//签名算法
                .parseClaimsJws(jwt)//解析JWT令牌
                .getBody();//获取负载
        return claims;
    }
}
```

##### Service

```
@Override
public LoginInfo login(Emp emp) {
    //调用mapper接口查询账号密码是否匹配
    Emp empLogin = empMapper.getUsernameAndPassword(emp);
    if(empLogin != null){
        //1. 生成JWT令牌
        Map<String,Object> dataMap = new HashMap<>();
        dataMap.put("id", empLogin.getId());
        dataMap.put("username", empLogin.getUsername());
        
        String jwt = JwtUtils.generateJwt(dataMap);////传入自定义对象的集合并生成jwt令牌
        LoginInfo loginInfo = new LoginInfo(empLogin.getId(), empLogin.getUsername(), empLogin.getName(), jwt);
        return loginInfo;
    }
    return null;
}
```

- 服务器响应的JWT令牌存储在本地浏览器哪里了呢？

- - 在当前案例中，JWT令牌存储在浏览器的本地存储空间 `localstorage`中了。 `localstorage` 是浏览器的本地存储，在移动端也是支持的。
  - 此时我们可以看到在请求头中包含一个token(JWT令牌)，后续的每一次请求当中，都会将这个令牌携带到服务端。


### 过滤器

- 概念：Filter过滤器，是JavaWeb三大组件（Servlet、Filter、Listener）之一。
- 过滤器可以把对资源的请求拦截下来，从而实现一些特殊的功能。
- 过滤器一般完成一些通用的操作，比如：登录校验、统一编码处理、敏感字符处理等。

1. 定义Filter：定义一个类，实现Filter接口，并实现其所有方法。

1. 配置Filter：Filter类上加@WebFilter注解，配置拦截路径。引导类上加 aServletComponentScan 开启Servlet组件支持。

```
public class DemoFilter implements Filter {

    // 初始化方法，web服务器启动，创建Filter实例时调用，只调用一次
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("init ...");
    }

    // 拦截到请求时，调用该方法，可以调用多次
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws Exception {
        System.out.println("拦截到了请求...");
        chain.doFilter(servletRequest, servletResponse);
    }

    // 销毁方法，web服务器关闭时调用，只调用一次
    public void destroy() {
        System.out.println("destroy ...");
    }
}
```

#### 登录校验

- 所有的请求，拦截到了之后，都需要校验令牌吗？有一个例外，登录请求
- 拦截到请求后，什么情况下才可以放行，执行业务操作？有令牌，且令牌校验通过（合法）；否则都返回未登录错误结果

```
/**
 * 令牌校验过滤器
 */
@Slf4j
@WebFilter(urlPatterns = "/*")
public class TokenFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) resp;
        //1. 获取请求url。
        String url = request.getRequestURL().toString();

        //2. 判断请求url中是否包含login，如果包含，说明是登录操作，放行。
        if(url.contains("login")){ //登录请求
            log.info("登录请求 , 直接放行");
            chain.doFilter(request, response);
            return;
        }

        //3. 获取请求头中的令牌（token）。
        String jwt = request.getHeader("token");

        //4. 判断令牌是否存在，如果不存在，返回错误结果（未登录）。
        if(!StringUtils.hasLength(jwt)){ //jwt为空
            log.info("获取到jwt令牌为空, 返回错误结果");
            response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return;
        }

        //5. 解析token，如果解析失败，返回错误结果（未登录）。
        try {
            Claims claims = JwtUtils.parseJWT(jwt);
           Integer empId=Integer.valueOf( claims.get("id").toString());
           CurrentHolder.setCurrentId(empId);
           log.info("当前用户id为将其导入ThreadLocal中：{}",empId);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("解析令牌失败, 返回错误结果");
            response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return;
        }

        //6. 放行。
        log.info("令牌合法, 放行");
        chain.doFilter(request , response);
        //移除ThreadLocal中的数据
        CurrentHolder.remove();
    }

}
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1782909316905_image.webp)

### 拦截器

• 定义：实现HandlerInterceptor接口

  1. preHandle

  2. postHandle

  3. afterCompletion

• 配置：定义一个配置类实现WebMvcConfigurer接口，注册拦截器(/**)

```
//自定义拦截器
//@Component
public class DemoInterceptor implements HandlerInterceptor {
    //目标资源方法执行前执行。返回 true：放行    返回 false：不放行
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle .... ");

        return true; //true 表示放行
    }

    //目标资源方法执行后执行
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle ... ");
    }

    //视图渲染完毕后执行，最后执行
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion .... ");
    }
}

```

```
//@Component
@Slf4j
public class TokenInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //获取url
        //1. 获取请求url。
        String url = request.getRequestURL().toString();

        //2. 判断请求url中是否包含login，如果包含，说明是登录操作，放行。
        if(url.contains("login")){ //登录请求
            log.info("登录请求 , 直接放行");
            return true;
        }

        //3. 获取请求头中的令牌（token）。
        String jwt = request.getHeader("token");

        //4. 判断令牌是否存在，如果不存在，返回错误结果（未登录）。
        if(!StringUtils.hasLength(jwt)){ //jwt为空
            log.info("获取到jwt令牌为空, 返回错误结果");
            response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return false;
        }

        //5. 解析token，如果解析失败，返回错误结果（未登录）。
        try {
            JwtUtils.parseJWT(jwt);
        } catch (Exception e) {
            e.printStackTrace();
            log.info("解析令牌失败, 返回错误结果");
            response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            return false;
        }

        //6. 放行。
        log.info("令牌合法, 放行");
  return true;
    }
    }
```



```
//@Configuration
public class WebConfig implements WebMvcConfigurer {

    //自定义的拦截器对象
    @Autowired
    private TokenInterceptor demoInterceptor;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //注册自定义拦截器对象
        registry.addInterceptor(demoInterceptor).addPathPatterns("/**").excludePathPatterns("/login");//设置拦截器拦截的请求路径（ /** 表示拦截所有请求）
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 禁用默认的资源处理器，避免将未知路径当作静态资源处理
        registry.setOrder(1);
    }
}
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1782912807995_image.webp)

![image.webp](https://imgbed.f3f3.top/file/picgo/1782912355672_image.webp)

## SpringAop

###  初识

AOP 是面向切面编程，适合把一些和业务逻辑无关、但很多方法都需要的公共功能抽取出来统一处理，比如：

- 统计方法执行耗时

- 日志记录

- 权限校验

- 事务管理

- 异常处理

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

`@Aspect`：声明当前类是切面类

`@Component`：把切面类交给 Spring 管理

`@Around`：环绕通知，可以在目标方法前后都执行代码

`joinPoint.proceed()`：执行原始目标方法

`execution(...)`：指定哪些方法需要被增强

![image.webp](https://imgbed.f3f3.top/file/picgo/1782914432999_image.webp)

### 通知

**@Pointcut 的作用**

如果切点表达式很长，或者多个通知都要用同一个表达式，可以用 `@Pointcut` 抽取出来。

```
@Slf4j
@Aspect
@Component
public class RecordTimeAspect {

    @Pointcut("execution(* com.itheima.service.impl.DeptServiceImpl.*(..))")
    public void pt() {
    }
    @Around("pt()")
    
    public Object recordTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long begin = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long end = System.currentTimeMillis();

        log.info("方法 {} 执行耗时: {}ms", joinPoint.getSignature(), end - begin);

        return result;
    }
}
```

#### 通知类型

![image.webp](https://imgbed.f3f3.top/file/picgo/1782915586026_image.webp)



### 切入点表达式

#### execution

`execution` 主要根据方法的返回值、包名、类名、方法名、参数等信息来匹配方法。

```
execution(public void com.itheima.service.DeptService.delete(java.lang.Integer))

com.itheima.service.DeptService
public void delete(Integer id)
```

```
execution(* com.*.service.*.update*(*))
```

- 任意返回值
- `com` 下一级任意包
- `service` 包
- 任意类
- 以 `update` 开头的方法
- 方法有一个任意类型参数

`..` 表示多个连续任意符号。

 ```
  execution(* com.itheima..DeptService.*(..))
 ```

- com.itheima` 包及其任意子包下的 `DeptService`

-  `DeptService` 中任意方法

- 任意参数个数和类型

```
@Before("execution(* com.itheima.service.impl.DeptServiceImpl.list(..)) || " +
        "execution(* com.itheima.service.impl.DeptServiceImpl.delete(..))")
public void before() {
    log.info("before ...");
}
//匹配多个方法
```

#### annotation

`@annotation` 用来匹配加了指定注解的方法。

```
@Around("@annotation(com.itheima.anno.LogOperation)")
public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
    long startTime = System.currentTimeMillis();

    Object result = joinPoint.proceed();
}
```

```
@LogOperation
@DeleteMapping
public Result delete(Integer id) {
    System.out.println("根据ID删除部门数据：" + id);
    deptService.delete(id);
    return Result.success();
}
```

哪个方法需要增强，就在哪个方法上加 `@LogOperation`

### 连接点

`JoinPoint` 可以获取目标方法运行时的信息。

```
@Before("execution(* com.itheima.service.*.*(..))")
public void before(JoinPoint joinPoint) {
    Object target = joinPoint.getTarget();
    log.info("目标对象: {}", target);

    String className = joinPoint.getTarget().getClass().getName();
    log.info("目标类名: {}", className);

    String methodName = joinPoint.getSignature().getName();
    log.info("目标方法名: {}", methodName);

    Object[] args = joinPoint.getArgs();
    log.info("目标方法参数: {}", Arrays.toString(args));
}
```

- `@Around` 通知使用 `ProceedingJoinPoint`
- 其他通知一般使用 `JoinPoint`
- `ProceedingJoinPoint` 是 `JoinPoint` 的子接口
- 只有 `ProceedingJoinPoint` 才能调用 `proceed()` 执行原始方法

### 执行顺序

```
@Slf4j
@Order(2)
@Aspect
@Component
public class SecondAspect {
}
```

- 目标方法执行前：`@Order` 数字小的先执行
- 目标方法执行后：`@Order` 数字小的后执行

```
Order(1) 前置
    Order(2) 前置
        目标方法
    Order(2) 后置
Order(1) 后置
```

```
@Around("execution(* com.itheima.service.impl.*.*(..))")
public Object recordTime(ProceedingJoinPoint joinPoint) throws Throwable {
    long begin = System.currentTimeMillis();
    Object result = joinPoint.proceed();
    long end = System.currentTimeMillis();
    log.info("方法 {} 执行耗时: {}ms", joinPoint.getSignature(), end - begin);
    return result;
}
```

**`execution` 适合批量匹配一批方法，`@annotation` 适合精确控制哪些方法需要增强。**

## 操作日志

![image.webp](https://imgbed.f3f3.top/file/picgo/1783663956439_image.webp)

### 实体类

```
package com.itheima.pojo;

import lombok.Data;
import java.time.LocalDateTime;
//操作人员日志
@Data
public class OperateLog {
    private Integer id; //ID
    private Integer operateEmpId; //操作人ID
    private LocalDateTime operateTime; //操作时间
    private String className; //操作类名
    private String methodName; //操作方法名
    private String methodParams; //操作方法参数
    private String returnValue; //操作方法返回值
    private Long costTime; //操作耗时
}

```

### Mapper

```
package com.itheima.mapper;

import com.itheima.pojo.OperateLog;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OperateLogMapper {

    //插入日志数据
    @Insert("insert into operate_log (operate_emp_id, operate_time, class_name, method_name, method_params, return_value, cost_time) " +
            "values (#{operateEmpId}, #{operateTime}, #{className}, #{methodName}, #{methodParams}, #{returnValue}, #{costTime});")
    public void insert(OperateLog log);

}

```

### 自定义注解

```
package com.itheima.anno;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 *  自定义注解，用于标识哪些方法需要记录日志
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogOperation {
}
```

### 实现类

```
ackage com.itheima.Aop;

import com.itheima.Utils.CurrentHolder;
import com.itheima.anno.LogOperation;
import com.itheima.mapper.OperateLogMapper;
import com.itheima.pojo.OperateLog;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.Arrays;
@Aspect
@Component
public class OperationLogAspect {
    @Autowired
    private OperateLogMapper operateLogMapper;
    // 环绕通知
    @Around("@annotation(log)")
    public Object around(ProceedingJoinPoint joinPoint, LogOperation log) throws Throwable {
    //拦截所有加了 @LogOperation 注解的方法。
        // 记录开始时间
        //1.方法执行前
        long startTime = System.currentTimeMillis();
        //2. 执行方法
        //调用原方法
        Object result = joinPoint.proceed();
        3.方法执行后
        // 当前时间
        long endTime = System.currentTimeMillis();
        // 耗时
        long costTime = endTime - startTime;
        // 构建日志对象
        OperateLog operateLog = new OperateLog();
        operateLog.setOperateEmpId(getCurrentUserId()); // 需要实现 getCurrentUserId 方法
        operateLog.setOperateTime(LocalDateTime.now());
        operateLog.setClassName(joinPoint.getTarget().getClass().getName());
        operateLog.setMethodName(joinPoint.getSignature().getName());
        operateLog.setMethodParams(Arrays.toString(joinPoint.getArgs()));
        operateLog.setReturnValue(result.toString());
        operateLog.setCostTime(costTime);
        // 插入日志
        operateLogMapper.insert(operateLog);
        return result;
    }
      
    // 示例方法，获取当前用户ID
    private int getCurrentUserId() {
        // 这里应该根据实际情况从认证信息中获取当前登录用户的ID
        return CurrentHolder.getCurrentId(); // 示例返回值
    }
}
```

## 获取操作人ID

### TreadLocal

![image.webp](https://imgbed.f3f3.top/file/picgo/1783666951626_image.webp)

![image.webp](https://imgbed.f3f3.top/file/picgo/1783667072333_image.webp)

### 工具类

```
package com.itheima.Utils;

public class CurrentHolder {

    private static final ThreadLocal<Integer> CURRENT_LOCAL = new ThreadLocal<>();
    //每个线程自己独有的一份变量副本

    public static void setCurrentId(Integer employeeId) {
        CURRENT_LOCAL.set(employeeId);
    }

    public static Integer getCurrentId() {
        return CURRENT_LOCAL.get();
    }

    public static void remove() {
        CURRENT_LOCAL.remove();
    }
}
```

```
SpringBoot原理package com.itheima.filter;

import com.itheima.utils.CurrentHolder;
import com.itheima.utils.JwtUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import java.io.IOException;

@Slf4j
@WebFilter(urlPatterns = "/*")
public class TokenFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        //1. 获取请求的url地址
        String uri = request.getRequestURI(); // /employee/login
        //String url = request.getRequestURL().toString(); // http://localhost:8080/employee/login

        //2. 判断是否是登录请求, 如果url地址中包含 login, 则说明是登录请求, 放行
        if (uri.contains("login")) {
            log.info("登录请求, 放行");
            filterChain.doFilter(request, response);
            return;
        }

        //3. 获取请求中的token
        String token = request.getHeader("token");

        //4. 判断token是否为空, 如果为空, 响应401状态码
        if (token == null || token.isEmpty()) {
            log.info("token为空, 响应401状态码");
            response.setStatus(401); // 响应401状态码
            return;
        }

        //5. 如果token不为空, 调用JWtUtils工具类的方法解析token, 如果解析失败, 响应401状态码
        try {
            Claims claims = JwtUtils.parseJWT(token);
            Integer empId = Integer.valueOf(claims.get("id").toString());
            CurrentHolder.setCurrentId(empId);
            log.info("token解析成功, 放行");
        } catch (Exception e) {
            log.info("token解析失败, 响应401状态码");
            response.setStatus(401);
            return;
        }

        //6. 放行
        filterChain.doFilter(request, response);

        //7. 清空当前线程绑定的id
        CurrentHolder.remove();
    }
}
```

## 原理篇

### 配置优先级

#### 基本配置

- application.properties
- application.yml
- application.yaml

```
properties、yaml、yml三种配置文件，优先级最高的是properties
yaml、yml 两种配置文件，优先级最高的是yml。
配置文件优先级排名（从高到低）：
1. properties配置文件
2. yml配置文件
3. yaml配置文件
```
#### 高级配置

1. Java系统属性配置 （格式： -Dkey=value）

   ```
   -Dserver.port=9000
   ```
1. ```
   2. 命令行参数 （格式：--key=value）
    --server.port=10010
   ```
   

![image.webp](https://imgbed.f3f3.top/file/picgo/1783669041851_image.webp)

**打包上线**

```
java -Dserver.port=9000 -jar XXXXX.jar --server.port=10010
```

### Bean管理

#### @Scope

IOC容器当中，默认bean对象是单例的 (只有一个实例对象)。在Spring中支持五种作用域，后三种在web环境才生效

| 作用域      |                      说明                       |
| ----------- | :---------------------------------------------: |
| singleton   | 容器内同名称的bean只有一个实例（单例）（默认）  |
| prototype   |    每次使用该bean时会创建新的实例（非单例）     |
| request     | 每个请求范围内会创建新的实例（web环境中，了解） |
| session     | 每个会话范围内会创建新的实例（web环境中，了解） |
| application | 每个应用范围内会创建新的实例（web环境中，了解） |

默认singleton的bean，在容器启动时被创建，可以使用@Lazy注解来延迟初始化(延迟到第一次使用时)

```
@Scope("prototype") //bean作用域为非单例
@RestController
@RequestMapping("/depts")
public class DeptController {

    @Autowired
    private DeptService deptService;

    public DeptController(){
        System.out.println("DeptController constructor ....");
    }

    //省略其他代码...
}
//- prototype的bean，每一次使用该bean的时候都会创建一个新的实例。
```

#### 第三方Bean

```
package com.itheima.config;

import com.itheima.utils.AliyunOSSOperator;
import com.itheima.utils.AliyunOSSProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OSSConfig {
    @Bean
    public AliyunOSSOperator aliyunOSSOperator(AliyunOSSProperties ossProperties) {
        return new AliyunOSSOperator(ossProperties);
    }
}
//通过 @Configuration 注解声明一个配置类
```

### 起步依赖

![image.webp](https://imgbed.f3f3.top/file/picgo/1783670281745_image.webp)

起步依赖的原理就是Maven的依赖传递。

- 比如：springboot-starter-web，这是web开发的起步依赖，在web开发的起步依赖当中，就集成了web开发中常见的依赖：json、web、webmvc、tomcat等。我们只需要引入这一个起步依赖，其他的依赖都会自动的通过Maven的依赖传递进来。

### 自动配置

#### @import

```
@Import导入
- 导入形式主要有以下几种：
  1. 导入普通类
  2. 导入配置类
  3. 导入ImportSelector接口实现类
```

**引入进来的第三方依赖当中的bean以及配置类为什么没有生效？**

- 在类上添加`@Component`注解来声明bean对象时，还需要保证`@Component`注解能被Spring的组件扫描到。
- SpringBoot项目中的`@SpringBootApplication`注解，具有包扫描的作用，但是它只会扫描启动类所在的当前包以及子包。 

































































































































