---
title: Ioc与DI
description: Ioc容器学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - Ioc容器初识
category:  JavaWeb
  #永久连接id
abbrlink: "q25885"
# 文章置顶
pinned: false #文章置顶
published: 2026-06-14 20:19:03
updated: 2026-06-18 21:43:03
---

## 定义

**控制反转（IOC，Inversion Of Control）**：对象的创建控制权由程序自身转移到外部（容器），即由Spring IOC容器负责创建和管理对象。

**依赖注入（DI，Dependency Injection）**：容器为应用程序提供运行时所需的资源（对象）。

**Bean对象**：IOC容器中创建和管理的对象。

## 核心思想

- 提供一个容器，容器中存储bean对象
- Controller程序从容器中获取所需类型的对象，而非直接new
- 将对象的创建权从程序员主动创建转移到容器管理

## 语法

### Bean的声明（IOC）

使用注解将类交给IOC容器管理：

| 注解          | 说明                 | 位置                 |
| ------------- | -------------------- | -------------------- |
| `@Component`  | 声明bean的基础注解   | 不属于以下三类时使用 |
| `@Controller` | @Component的衍生注解 | 控制层类             |
| `@Service`    | @Component的衍生注解 | 业务层类             |
| `@Repository` | @Component的衍生注解 | 数据访问层类         |

```
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;
    // ...
}

@Repository
public class UserDaoImpl implements UserDao {
    // ...
}

@RestController
public class UserController {
    @Autowired
    private UserService userService;
    // ...
}
```

### @ResponseBody注解

- **类型**：方法注解、类注解
- **位置**：书写在Controller方法上或类上
- **作用**：将方法返回值直接响应给浏览器，如果返回值类型是实体对象/集合，将转换为JSON格式后响应
- `@RestController` = `@Controller` + `@ResponseBody`，在类上加此注解后，所有方法自动带有@ResponseBody功能

### 组件扫描

- 声明bean的四大注解需要被`@ComponentScan`扫描才能生效
- `@SpringBootApplication`注解已包含`@ComponentScan`，默认扫描启动类所在包及其子包
- 因此只需将业务类放在启动类所在包的子包中即可

## @Autowired依赖注入（DI）三种方式

### **属性注入**

```
@RestController
public class UserController {
    @Autowired
    private UserService userService;
}
```

- 优点：代码简洁、快速开发
- 缺点：隐藏了类之间的依赖关系、可能破坏封装性

### **构造函数注入**

```
@RestController
public class UserController {
    private final UserService userService;

    @Autowired //如果只有一个构造函数，@Autowired可以省略
    public UserController(UserService userService) {
        this.userService = userService;
    }
}
```

- 优点：依赖关系清晰、代码安全性高
- 注意：如果只有一个构造函数，`@Autowired`可省略

### **setter注入**

```
@RestController
public class UserController {
    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
```

- 优点：保持封装性、依赖关系清晰
- 缺点：需要额外编写setter方法

## 多实现类注入冲突解决方案

当IOC容器中存在多个相同类型的bean时，使用以下方式指定：

| 方案         | 用法                          |        说明        |
| ------------ | ----------------------------- | :----------------: |
| `@Primary`   | 加在实现类上                  |    确定默认实现    |
| `@Qualifier` | 配合@Autowired使用            | 按bean名称指定注入 |
| `@Resource`  | JDK提供，name属性指定bean名称 |     按名称注入     |

```
// 方案一
@Primary
@Service
public class UserServiceImpl implements UserService { }

// 方案二
@Qualifier("userServiceImpl")
@Autowired
private UserService userService;

// 方案三
@Resource(name = "userServiceImpl")
private UserService userService;
```

## 常见场景

1. **解耦层与层之间的依赖**：Controller不再直接new Service，Service不再直接new Dao
1. **灵活切换实现类**：当业务需求变更需要替换Service实现时，只需将新实现类交给IOC容器管理，无需修改Controller代码
1. **依赖管理**：Spring容器统一管理对象的生命周期和依赖关系

## 注意事项

1. **声明控制器bean只能用@Controller**（在SpringBoot集成Web开发中）
1. **bean名称**：通过注解的value属性指定bean名字，默认类名首字母小写
1. **@Autowired vs @Resource**：@Autowired是Spring框架注解，默认按类型注入；@Resource是JDK注解，按名称注入
1. 官方推荐构造函数注入方式（更规范），但企业项目中属性注入也很常见（更简洁高效）
1. 只有被组件扫描到的注解才会生效，确保业务类在启动类的子包路径下

















































































