---
title: MybatisPlus
description: MybatisPlus学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - Mybatis进阶
category:  Java项目
  #永久连接id
abbrlink: "47256790"
# 文章置顶
pinned: false #文章置顶
published: 2026-08-09 20:19:03
updated: 2026-08-09 21:43:03
---

##  初识

**在MyBatis的基础上只做增强不做改变**

- **无侵入：只做增强不做改变，引入它不会对现有工程产生影响，如丝般顺滑**

- **损耗小：启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作**

- **强大的 CRUD 操作：内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作，更有强大的条件构造器，满足各类使用需求**

- **支持 Lambda 形式调用：通过 Lambda 表达式，方便的编写各类查询条件，无需再担心字段写错**

- **支持主键自动生成：支持多达 4 种主键策略（内含分布式唯一 ID 生成器 - Sequence），可自由配置，完美解决主键问题**

- **支持 ActiveRecord 模式：支持 ActiveRecord 形式调用，实体类只需继承 Model 类即可进行强大的 CRUD 操作**

- **支持自定义全局通用操作：支持全局通用方法注入（ Write once, use anywhere ）**

- **内置代码生成器：采用代码或者 Maven 插件可快速生成 Mapper 、 Model 、 Service 、 Controller 层代码，支持模板引擎，更有超多自定义配置等您来使用**

- **内置分页插件：基于 MyBatis 物理分页，开发者无需关心具体操作，配置好插件之后，写分页等同于普通 List 查询**

- **分页插件支持多种数据库：支持 MySQL、MariaDB、Oracle、DB2、H2、HSQL、SQLite、Postgre、SQLServer 等多种数据库**

- **内置性能分析插件：可输出 SQL 语句以及其执行时间，建议开发测试时启用该功能，能快速揪出慢查询**

- **内置全局拦截插件：提供全表 delete 、 update 操作智能分析阻断，也可自定义拦截规则，预防误操作**

## @TableName

- **作用**：指定实体类对应的数据库表名（解决 “实体类名 ≠ 表名” 的问题）。
- **默认规则**：若不标注，MP 会默认将实体类名按 “驼峰转下划线” 匹配表名（如 `UserInfo` → `user_info`）

```
// 场景1：实体类名 ≠ 表名（如实体类User对应表t_user）
@Data
@TableName("t_user") // 指定表名为t_user
public class User {
    private Long id;
    private String name;
}
 
// 场景2：全局配置表前缀（替代单个@TableName）
// 若项目中所有表都有前缀（如t_），可在application.yml中配置，无需每个实体加@TableName：
# application.yml
mybatis-plus:
  global-config:
    db-config:
      table-prefix: t_ # 所有实体类默认匹配 t_ + 实体类名（如User → t_user）
```

## @TableId

- **作用：指定实体类中对应数据库主键的字段，同时可配置主键生成策略。**

- **常用属性：type（主键类型，常用值如下）：**

- **IdType.AUTO：数据库自增（需确保数据库表主键已设置自增）；**

- **IdType.ASSIGN_ID：MP 自动生成雪花算法分布式唯一 ID（Long 类型，适合分布式系统）；**

- **IdType.ASSIGN_UUID：生成 UUID（String 类型，无主键自增场景）；**

- **IdType.NONE：无策略，需手动设置主键值。**

```
@Data
@TableName("t_user")
public class User {
    // 场景1：主键自增（数据库表id字段设为自增）
    @TableId(type = IdType.AUTO)
    private Long id;
 
    // 场景2：雪花算法生成分布式ID（无需数据库自增）
    // @TableId(type = IdType.ASSIGN_ID)
    // private Long id;
 
    private String name;
}
```

##  @TableField

- **作用：指定实体类字段与数据库列名的映射关系（解决 “字段名 ≠ 列名”、“字段不参与 CRUD” 等问题）。**
- **value：指定数据库列名（如实体字段 userName 对应列 user_name，若驼峰转下划线可省略）；**

- **exist：是否为数据库字段（默认 true，设为 false 则 MP 忽略该字段，不参与任何 SQL 操作）；**

- **fill：字段自动填充（如创建时间、更新时间，需配合自定义填充处理器）。**

```
@Data
@TableName("t_user") // 关联数据库表t_user
public class User {
    // 主键（自增策略）
    @TableId(type = IdType.AUTO)
    private Long id;
 
    // 场景1：成员变量名与数据库字段名不一致（实体userName → 数据库user_name）
    @TableField("user_name")
    private String userName;
 
    // 场景2：成员变量名以is开头（布尔值），避免getter方法歧义（实体isDeleted → 数据库is_deleted）
    @TableField("is_deleted")
    private Boolean isDeleted;
 
    // 场景3：成员变量名与数据库关键字冲突（实体order → 数据库order，用反引号包裹关键字）
    @TableField("`order`")
    private Integer order;
 
    // 场景4：成员变量不是数据库字段（仅内存使用，MP生成SQL时忽略该字段）
    @TableField(exist = false)
    private String tempData; // 临时业务字段，不映射数据库
 
    
    
    
    // 场景5：自动填充 - 仅插入时填充（创建时间）
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
 
    // 场景5：自动填充 - 插入+更新时填充（更新时间）
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
 
    // 常规字段（驼峰转下划线匹配，无需@TableField）
    private Integer age;
    private String email;
}
 
/**
 * 配套的字段自动填充处理器（配合@TableField(fill = ...)使用）
 */
@Component // 必须交给Spring容器管理
public class MyMetaObjectHandler implements MetaObjectHandler {
 
    /**
     * 插入操作时的自动填充逻辑
     */
    @Override
    public void insertFill(MetaObject metaObject) {
        // 填充createTime（插入时）
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        // 填充updateTime（插入时）
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
 
    /**
     * 更新操作时的自动填充逻辑
     */
    @Override
    public void updateFill(MetaObject metaObject) {
        // 填充updateTime（更新时）
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

## 条件构造器

![image.webp](https://img.f3f3.top/picgo/1786272682937_image.webp)

| 层级        | 核心角色                   |                           核心作用                           |
| ----------- | -------------------------- | :----------------------------------------------------------: |
| 顶层接口    | `Wrapper<T>`               |    最基础的条件接口，定义了条件容器规范，通常不直接使用。    |
| 抽象模板    | `AbstractWrapper<T>`       | 核心实现类，封装所有 `WHERE` 条件拼接逻辑，如 `eq`、`like`、`in`；是具体实现类的父类。 |
| 功能分支    | `QueryWrapper<T>`          | 查询、删除专用，侧重构建 `SELECT`、`DELETE` 语句的 `WHERE` 条件。 |
| 功能分支    | `UpdateWrapper<T>`         | 更新专用，除构建 `WHERE` 条件外，还扩展了 `SET` 字段赋值方法。 |
| Lambda 增强 | `AbstractLambdaWrapper<T>` |           为 Lambda 表达式条件提供支持的抽象父类。           |
| 最终常用    | `LambdaQueryWrapper<T>`    |       `QueryWrapper` 的 Lambda 版本，开发中推荐使用。        |
| 最终常用    | `LambdaUpdateWrapper<T>`   |       `UpdateWrapper` 的 Lambda 版本，开发中推荐使用。       |

- **最常用的LambdaQueryWrapper单表SELECT、UPDATE、DELETE语句都是由QueryWrapper分支构建WHERE条件**

- **UpdateWrapper以及它的Lambda版本只对于特殊Set语句设置条件时才可以使用，eg->SET balance = balance - 200 where id in (.....)，需要利用到UpdateWrapper分支扩展的SET字段赋值方法，**

### 查询

**查询年龄大于 18 岁，且名字包含 “张” 的用户列表**

```
// 1. 构建条件
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<User>()
    .gt(User::getAge, 18)        // gt = greater than (大于)
    .like(User::getName, "张");  // like (模糊查询)
 
// 2. 调用 BaseMapper 方法
List<User> userList = userMapper.selectList(queryWrapper);
```

**只查询 `id` 和 `name` 两个字段，且按照年龄倒序排序。**

```
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<User>()
    .select(User::getId, User::getName) // 只查询特定字段，避免 select *
    .orderByDesc(User::getAge);
 
List<User> userList = userMapper.selectList(queryWrapper);
```

### 更新

**将 ID 为 1 的用户的名字改为 “张三丰”，且年龄加 1**

```
// 方式 A：使用 UpdateWrapper (需要手动拼 SET)
UpdateWrapper<User> updateWrapper = new UpdateWrapper<User>()
    .set("name", "张三丰")
    .setSql("age = age + 1") // 支持自定义 SQL 片段
    .eq("id", 1);
 
// 方式 B：使用 LambdaUpdateWrapper (推荐)
LambdaUpdateWrapper<User> updateWrapper = new LambdaUpdateWrapper<User>()
    .set(User::getName, "张三丰")
    .setSql("age = age + 1")
    .eq(User::getId, 1);
 
// 注意：update 方法的第一个参数可以传 null，因为字段在 Wrapper 里设置了
userMapper.update(null, updateWrapper);
```

### 计数与删除

***统计所有邮箱不为空的用户数量***

```
LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<User>()
    .isNotNull(User::getEmail);
 
Long count = userMapper.selectCount(queryWrapper);
```

- **基于企业业务规范不允许使用UpdateWrapper分支的setSql方法，违背了在业务层中编写SQL语句**
- **复杂多表关联查询、复杂聚合、分组统计、特殊SQL、批量操作等方面的限制，需要使用半自动依赖MP框架，通过自定义SQL解决，即Wrapper写WHERE条件、用户自己定义SQL语句（区别于之前的全自动，全部交由MP解决）。**

### 自定义sql

![image.webp](https://img.f3f3.top/picgo/1786274629124_image.webp)

1. **取消使用BaseMapper中现成的API，自定义SQL方法，条件在业务层作为参数传入**
1. **Wrapper变量名称前必须用@Param("ew")声明，**
1. **Mapper层自定义SQL语句片段，WHERE条件则是以 ${ew.customSqlSegment} 引用 Wrapper 拼接的 WHERE 条件（注意是 ${} 而非 #{}），此方式适用于“固定多表关联 + 动态条件过滤” 的场景。**

## BaseMapper

**`BaseMapper` 是 MyBatis-Plus 提供的通用 Mapper 接口，内置了单表操作的所有核心 CRUD 方法（新增、删除、修改、查询），无需手动编写 Mapper 方法和 SQL，只需让自定义 Mapper 接口继承 `BaseMapper`**

**导入依赖，完成数据库连接和MP的基础配置。**

```
<!-- MyBatis-Plus 核心依赖 -->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version> <!-- 推荐使用稳定版 -->
</dependency>
```

```
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
 
# MyBatis-Plus 基础配置
mybatis-plus:
  mapper-locations: classpath:mapper/**/*.xml # 自定义XML文件路径（可选）
  type-aliases-package: com.example.demo.entity # 实体类包路径
  configuration:
    map-underscore-to-camel-case: true # 开启驼峰转下划线（默认开启）
```

### 实体类

```
@Data
@TableName("t_user") // 关联数据库表名
public class User {
    @TableId(type = IdType.AUTO) // 主键自增
    private Long id;
    
    @TableField("user_name") // 字段名映射（可选，驼峰转下划线可省略）
    private String userName;
    
    private Integer age;
    private String email;
    
    @TableLogic // 逻辑删除字段
    private Integer deleted;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}
```

### 自定义Mapper

```
// 必须加@Mapper注解（或在启动类加@MapperScan扫描包）
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 空接口即可，BaseMapper已内置所有单表CRUD方法
    // 若有自定义SQL，可在此添加（不影响BaseMapper功能）
}
```

### 业务层

```
@Service
public class UserService {
    // 注入Mapper（@Autowired或@Resource均可）
    @Resource
    private UserMapper userMapper;
 
    // ==================== 新增操作 ====================
    public void addUser() {
        User user = new User();
        user.setUserName("张三");
        user.setAge(20);
        user.setEmail("zhangsan@test.com");
        // 插入单条数据（返回受影响行数）
        int rows = userMapper.insert(user);
        // 插入后，主键会自动回显到user对象中（如自增id）
        System.out.println("新增用户ID：" + user.getId());
    }
 
    // ==================== 修改操作 ====================
    public void updateUser() {
        // 方式1：根据ID修改（只修改非null字段）
        User user = new User();
        user.setId(1L); // 主键
        user.setAge(21); // 要修改的字段
        int rows = userMapper.updateById(user);
 
        // 方式2：条件修改（配合Wrapper）
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName, "张三");
        User updateUser = new User();
        updateUser.setEmail("zhangsan_update@test.com");
        // 根据条件修改（返回受影响行数）
        userMapper.update(updateUser, wrapper);
    }
 
    // ==================== 删除操作 ====================
    public void deleteUser() {
        // 方式1：根据ID删除
        int rows = userMapper.deleteById(1L);
 
        // 方式2：批量删除（根据ID列表）
        List<Long> idList = List.of(1L, 2L, 3L);
        userMapper.deleteBatchIds(idList);
 
        // 方式3：条件删除
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getAge, 20);
        userMapper.delete(wrapper);
    }
 
    // ==================== 查询操作 ====================
    public void queryUser() {
        // 方式1：根据ID查询单条
        User user = userMapper.selectById(1L);
 
        // 方式2：批量查询（根据ID列表）
        List<Long> idList = List.of(1L, 2L, 3L);
        List<User> userList1 = userMapper.selectBatchIds(idList);
 
        // 方式3：条件查询单条（若有多条会抛异常）
        LambdaQueryWrapper<User> wrapper1 = new LambdaQueryWrapper<>();
        wrapper1.eq(User::getUserName, "张三");
        User userOne = userMapper.selectOne(wrapper1);
 
        // 方式4：条件查询列表
        LambdaQueryWrapper<User> wrapper2 = new LambdaQueryWrapper<>();
        wrapper2.gt(User::getAge, 18) // 年龄>18
                .like(User::getUserName, "张"); // 姓名含“张”
        List<User> userList2 = userMapper.selectList(wrapper2);
 
        // 方式5：条件查询总数
        LambdaQueryWrapper<User> wrapper3 = new LambdaQueryWrapper<>();
        wrapper3.eq(User::getDeleted, 0);
        long count = userMapper.selectCount(wrapper3);
 
        // 方式6：分页查询（需先配置分页插件）
        Page<User> page = new Page<>(1, 10); // 第1页，每页10条
        LambdaQueryWrapper<User> wrapper4 = new LambdaQueryWrapper<>();
        wrapper4.orderByDesc(User::getId);
        IPage<User> userPage = userMapper.selectPage(page, wrapper4);
        // 分页结果
        System.out.println("总条数：" + userPage.getTotal());
        System.out.println("总页数：" + userPage.getPages());
        System.out.println("当前页数据：" + userPage.getRecords());
    }
}
```

|                           方法名                            | 功能描述                           | 常用场景                       |
| :---------------------------------------------------------: | ---------------------------------- | ------------------------------ |
|                     `insert(T entity)`                      | 插入单条数据                       | 新增记录                       |
|                   `updateById(T entity)`                    | 根据主键修改，仅更新非 `null` 字段 | 单条记录更新                   |
|           `update(T entity, Wrapper<T> wrapper)`            | 根据条件修改数据                   | 批量更新、按条件更新           |
|                `deleteById(Serializable id)`                | 根据主键删除                       | 单条记录删除                   |
| `deleteBatchIds(Collection<? extends Serializable> idList)` | 根据主键集合批量删除               | 批量删除多条记录               |
|                `delete(Wrapper<T> wrapper)`                 | 根据条件删除数据                   | 按条件删除记录                 |
|                `selectById(Serializable id)`                | 根据主键查询                       | 查询单条记录                   |
| `selectBatchIds(Collection<? extends Serializable> idList)` | 根据 ID 列表批量查询               | 根据 ID 列表查询多条记录       |
|               `selectOne(Wrapper<T> wrapper)`               | 根据条件查询单条数据               | 条件能够唯一确定一条记录时使用 |
|              `selectList(Wrapper<T> wrapper)`               | 根据条件查询列表                   | 按条件查询多条记录             |
|              `selectCount(Wrapper<T> wrapper)`              | 根据条件查询总数                   | 统计符合条件的记录数           |
|       `selectPage(IPage<T> page, Wrapper<T> wrapper)`       | 分页查询                           | 分页展示数据                   |

## IService

I**Service 是 MyBatis-Plus 提供的通用服务层接口，基于 BaseMapper 做了进一步封装，补充了批量操作、链式查询、事务控制、分页查询（更简化） 等高级能力，是 MP 对 “Service 层” 的标准化封装，相比直接用 BaseMapper 更贴合实际业务开发习惯。**

- **完全兼容 BaseMapper 的所有功能，且提供更丰富的批量 / 高级方法；**

- **内置默认实现类 ServiceImpl<M extends BaseMapper<T>, T>，无需手动实现接口方法；**

- **支持 Lambda 链式调用（lambdaQuery()/lambdaUpdate()），简化条件构造。**

### 业务接口

```
// 继承IService<User>，获取所有通用服务方法
public interface UserService extends IService<User> {
    // 若有自定义业务方法，在此添加（如复杂联表查询、多表操作）
    // 示例：自定义根据年龄查询用户数量
    long countByAge(Integer age);
}
```

### 业务实现

```
// @Service 交给Spring容器管理
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
 
    // 实现自定义方法（可直接用baseMapper调用Mapper方法）
    @Override
    public long countByAge(Integer age) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getAge, age);
        // baseMapper 是ServiceImpl内置的Mapper对象，等价于注入的UserMapper
        return baseMapper.selectCount(wrapper);
    }
```

- **ServiceImpl 是 IService 的默认实现类，泛型参数：**

- **第一个参数：对应的 Mapper 接口（如 UserMapper）；**
- **第二个参数：实体类（如 User）；**

- **baseMapper 是 ServiceImpl 内置的 Mapper 对象，等价于 @Autowired 注入的 UserMapper，可直接使用**

### Controller

```
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.Resource;
import java.util.List;
 
@RestController
public class UserController {
    @Resource
    private UserService userService;
 
    // ==================== 新增/保存操作 ====================
    @GetMapping("/add")
    public String addUser() {
        User user = new User();
        user.setUserName("李四");
        user.setAge(22);
        user.setEmail("lisi@test.com");
 
        // 1. 新增单条（等价于baseMapper.insert）
        boolean saveFlag = userService.save(user); // 返回是否成功（boolean）
        // 2. 批量新增（效率高于循环insert）
        List<User> userList = List.of(
            new User(null, "王五", 23, "wangwu@test.com"),
            new User(null, "赵六", 24, "zhaoliu@test.com")
        );
        boolean saveBatchFlag = userService.saveBatch(userList); // 批量新增
        // 3. 新增或更新（根据主键判断：有主键则更新，无则新增）
        User saveOrUpdateUser = new User(1L, "张三更新", 21, "zhangsan_update@test.com");
        boolean saveOrUpdateFlag = userService.saveOrUpdate(saveOrUpdateUser);
 
        return "操作成功：" + saveFlag;
    }
 
    // ==================== 修改操作 ====================
    @GetMapping("/update")
    public String updateUser() {
        User user = new User();
        user.setId(1L);
        user.setAge(25);
        // 1. 根据ID修改（等价于baseMapper.updateById）
        boolean updateFlag = userService.updateById(user);
 
        // 2. 条件修改（Lambda链式调用，无需手动new Wrapper）
        boolean updateByWrapperFlag = userService.lambdaUpdate()
                .eq(User::getUserName, "李四")
                .set(User::getEmail, "lisi_update@test.com")
                .update(); // 直接执行更新
 
        return "修改成功：" + updateFlag;
    }
 
    // ==================== 删除操作 ====================
    @GetMapping("/delete")
    public String deleteUser() {
        // 1. 根据ID删除（等价于baseMapper.deleteById）
        boolean deleteFlag = userService.removeById(1L);
 
        // 2. 批量删除（等价于baseMapper.deleteBatchIds）
        boolean removeBatchFlag = userService.removeBatchByIds(List.of(2L, 3L));
 
        // 3. 条件删除（Lambda链式调用）
        boolean removeByWrapperFlag = userService.lambdaRemove()
                .eq(User::getAge, 20)
                .remove();
 
        return "删除成功：" + deleteFlag;
    }
 
    // ==================== 查询操作 ====================
    @GetMapping("/query")
    public String queryUser() {
        // 1. 根据ID查询（等价于baseMapper.selectById）
        User user = userService.getById(1L);
 
        // 2. 批量查询（等价于baseMapper.selectBatchIds）
        List<User> userList1 = userService.listByIds(List.of(1L, 2L, 3L));
 
        // 3. 条件查询单条（等价于baseMapper.selectOne，无数据返回null）
        User userOne = userService.getOne(userService.lambdaQuery().eq(User::getUserName, "张三"));
 
        // 4. 条件查询列表（等价于baseMapper.selectList）
        List<User> userList2 = userService.list(userService.lambdaQuery().gt(User::getAge, 18));
 
        // 5. 条件查询总数（等价于baseMapper.selectCount）
        long count = userService.count(userService.lambdaQuery().eq(User::getDeleted, 0));
 
        // 6. 分页查询（更简化，无需手动new Page后调用selectPage）
        Page<User> page = new Page<>(1, 10); // 第1页，每页10条
        IPage<User> userPage = userService.page(page, userService.lambdaQuery().orderByDesc(User::getId));
 
        // 7. Lambda链式查询（流式操作）
        List<User> lambdaList = userService.lambdaQuery()
                .eq(User::getAge, 22)
                .like(User::getUserName, "李")
                .list(); // 直接返回列表
 
        // 8. 调用自定义方法
        long ageCount = userService.countByAge(22);
 
        return "查询成功，总数：" + count;
    }
 
    // ==================== 批量操作（IService核心增强） ====================
    @GetMapping("/batch")
    public String batchOperate() {
        // 1. 批量新增（指定批次大小，默认1000条/批）
        List<User> bigList = List.of(); // 假设是10000条数据
        userService.saveBatch(bigList, 500); // 每500条提交一次
 
        // 2. 批量更新（根据ID批量更新）
        List<User> updateList = List.of(
            new User(1L, "批量更新1", 26, "batch1@test.com"),
            new User(2L, "批量更新2", 27, "batch2@test.com")
        );
        boolean updateBatchFlag = userService.updateBatchById(updateList);
 
        return "批量操作成功";
    }
}
```

|  方法分类   | IService 方法                             | 功能描述                     | 对应 BaseMapper 方法                            | 核心优势                                        |
| :---------: | ----------------------------------------- | ---------------------------- | ----------------------------------------------- | ----------------------------------------------- |
|    新增     | `save(T entity)`                          | 新增单条                     | `insert(T entity)`                              | 返回 `boolean` 结果，更直观                     |
|    新增     | `saveBatch(Collection<T> list)`           | 批量新增                     | 无（通常需循环 `insert`）                       | 分批提交，优化批量插入性能                      |
| 新增 / 更新 | `saveOrUpdate(T entity)`                  | 主键存在则更新，不存在则新增 | 无（通常需手动判断）                            | 简化“新增或更新”业务逻辑                        |
|    修改     | `updateById(T entity)`                    | 根据 ID 修改                 | `updateById(T entity)`                          | 返回 `boolean` 结果                             |
|    修改     | `lambdaUpdate()`                          | Lambda 链式条件更新          | `update(T entity, Wrapper<T> wrapper)`          | 无需手动创建 `Wrapper`，链式调用更简洁          |
|    删除     | `removeById(Serializable id)`             | 根据 ID 删除                 | `deleteById(Serializable id)`                   | 返回 `boolean` 结果                             |
|    删除     | `lambdaRemove()`                          | Lambda 链式条件删除          | `delete(Wrapper<T> wrapper)`                    | 链式调用，无需手动创建 `Wrapper`                |
|    查询     | `getById(Serializable id)`                | 根据 ID 查询                 | `selectById(Serializable id)`                   | 无数据时返回 `null`，便于统一处理               |
|    查询     | `list(Wrapper<T> wrapper)`                | 条件查询列表                 | `selectList(Wrapper<T> wrapper)`                | 命名更符合 Service 层语义                       |
|    查询     | `lambdaQuery()`                           | Lambda 链式条件查询          | `selectList(Wrapper<T> wrapper)`                | 链式调用，可直接执行 `list()`、`count()` 等操作 |
|    查询     | `page(IPage<T> page, Wrapper<T> wrapper)` | 分页查询                     | `selectPage(IPage<T> page, Wrapper<T> wrapper)` | 命名更符合 Service 层习惯                       |
|  批量操作   | `updateBatchById(Collection<T> list)`     | 根据 ID 批量更新             | 无（通常需循环 `updateById`）                   | 分批提交，优化批量更新性能                      |

### 事务控制

**`IService` 内置的批量方法（如 `saveBatch`、`updateBatchById`）默认不包含事务，若需要事务，需在 Service 方法上添加 `@Transactional` 注解：**

```
@Override
@Transactional // 开启事务
public boolean batchSaveUser(List<User> list) {
    return saveBatch(list); // 批量插入失败则整体回滚
}
```

### Lambda 链式调用

**`lambdaQuery()`/`lambdaUpdate()` 是 `IService` 最实用的增强，支持流式操作，无需手动创建 Wrapper 对象**

```
// 链式查询
User user = userService.lambdaQuery()
        .eq(User::getId, 1L)
        .eq(User::getDeleted, 0)
        .one(); // 查单条
 
// 链式更新
boolean updateFlag = userService.lambdaUpdate()
        .eq(User::getId, 1L)
        .set(User::getAge, 30)
        .set(User::getUpdateTime, LocalDateTime.now())
        .update();
```

**自定义方法兼容**
IService 不限制自定义方法，可在接口中添加任意业务方法，实现类中通过 baseMapper 调用 Mapper 自定义 SQL，完全兼容原生 MyBatis 功能。

**分页插件依赖**
使用 page() 方法需提前配置 MP 分页插件（与 BaseMapper 的 selectPage 要求一致），否则分页失效。

## DB静态工具

### 初识

**MP 提供的无 Mapper/Service 依赖的全局静态 CRUD 工具类，它封装了通用的单表操作方法，无需定义 Mapper 接口、Service 接口，直接通过静态方法即可完成数据库操作**

**`DB` 工具依赖 MP 核心环境，只需保证：**

- **已引入 MP 依赖（`mybatis-plus-boot-starter`）；**
- **已配置数据库连接和 MP 基础配置；**
- **实体类已通过 `@TableName`/`@TableId` 等注解完成数据库映射。**

**`DB` 工具的方法与 `BaseMapper` 高度一致，均为静态方法，直接通过 `Db.xxx()` 调用**

```
 
/**
 * DB 静态工具类使用示例
 */
public class DbToolDemo {
 
    // ==================== 新增操作 ====================
    public static void testInsert() {
        User user = new User();
        user.setUserName("测试DB工具");
        user.setAge(25);
        user.setEmail("db_test@test.com");
        
        // 新增单条数据（主键自动回显）
        boolean success = Db.save(user);
        System.out.println("新增用户ID：" + user.getId());
        
        // 批量新增
        List<User> userList = List.of(
            new User(null, "批量1", 26, "batch1@test.com"),
            new User(null, "批量2", 27, "batch2@test.com")
        );
        Db.saveBatch(userList);
    }
 
    // ==================== 修改操作 ====================
    public static void testUpdate() {
        User user = new User();
        user.setId(1L); // 主键
        user.setAge(28); // 要修改的字段
        
        // 根据ID修改（只改非null字段）
        boolean success = Db.updateById(user);
        
        // 条件修改（配合Lambda条件构造器）
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUserName, "测试DB工具");
        User updateUser = new User();
        updateUser.setEmail("db_update@test.com");
        Db.update(updateUser, wrapper);
    }
 
    // ==================== 删除操作 ====================
    public static void testDelete() {
        // 根据ID删除
        boolean success = Db.removeById(User.class, 1L);
        
        // 批量删除（ID列表）
        Db.removeByIds(User.class, List.of(2L, 3L));
        
        // 条件删除
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getAge, 25);
        Db.remove(wrapper);
    }
 
    // ==================== 查询操作 ====================
    public static void testQuery() {
        // 根据ID查询
        User user = Db.getById(User.class, 1L);
        
        // 批量查询（ID列表）
        List<User> userList1 = Db.listByIds(User.class, List.of(1L, 2L, 3L));
        
        // 条件查询列表
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.gt(User::getAge, 20)
               .like(User::getUserName, "测试");
        List<User> userList2 = Db.list(wrapper);
        
        // 条件查询总数
        long count = Db.count(wrapper);
        
        // 分页查询（需先配置分页插件）
        Page<User> page = new Page<>(1, 10);
        IPage<User> userPage = Db.page(page, wrapper);
        System.out.println("总条数：" + userPage.getTotal());
        System.out.println("当前页数据：" + userPage.getRecords());
    }
 
    // ==================== 新增或更新（核心便捷方法） ====================
    public static void testSaveOrUpdate() {
        // 有主键则更新，无主键则新增
        User user = new User(1L, "新增或更新", 29, "save_or_update@test.com");
        Db.saveOrUpdate(user);
    }
}
```

| 特性     | DB 静态工具                     | BaseMapper                       |             IService              |
| -------- | ------------------------------- | -------------------------------- | :-------------------------------: |
| 依赖     | 无需注入，直接静态调用          | 需定义 `Mapper` 接口             | 需定义 `Service` 和 `Mapper` 接口 |
| 使用方式 | 通过静态方法调用，如 `Db.xxx()` | 注入 `Mapper` 实例调用           |      注入 `Service` 实例调用      |
| 返回值   | 多为 `boolean`，结果更直观      | 写操作多为 `int`，表示受影响行数 |       写操作多为 `boolean`        |
| 批量操作 | 支持，如 `saveBatch` 等         | 通常需手动循环或自定义 SQL       |         内置批量操作方法          |
| 事务支持 | 需手动添加 `@Transactional`     | 需手动添加 `@Transactional`      |    可在 Service 层统一控制事务    |
| 适用场景 | 简单操作、工具类及快速开发      | 常规单表业务开发                 |    包含业务逻辑的复杂业务开发     |

## 逻辑删除

MP 的逻辑删除本质是**拦截删除操作，将 `DELETE` 语句转为 `UPDATE` 语句**，同时拦截查询操作，自动添加逻辑删除字段的过滤条件（只查未删除数据）。

![image.webp](https://img.f3f3.top/picgo/1786278024165_image.webp)

### 添加字段

```
-- 示例：给 t_user 表添加逻辑删除字段（MySQL）
ALTER TABLE t_user ADD COLUMN deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除';
```

### @TableLogic

```

@Data
@TableName("t_user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String userName;
    private Integer age;
    
    // 逻辑删除字段（核心注解）
    @TableLogic(
        value = "0",  // 未删除的值（默认 0）
        delval = "1"  // 已删除的值（默认 1）
    )
    private Integer deleted;
}
```

### 全局配置

**项目中所有表的逻辑删除字段规则统一（如均为 `deleted`、`0=未删/1=已删`），可在 `application.yml` 中全局配置，无需在每个实体类加注解属性：**

```
# application.yml
mybatis-plus:
  global-config:
    db-config:
      # 全局逻辑删除字段名（默认 null，指定后所有实体默认使用该字段）
      logic-delete-field: deleted
      # 逻辑未删除值（默认 0）
      logic-not-delete-value: 0
      # 逻辑已删除值（默认 1）
      logic-delete-value: 1
```

### 业务层

**调用 MP 的删除方法会自动转为逻辑删除，查询方法会自动过滤已删除数据**

```
@Service
public class UserBizService {
    @Resource
    private UserService userService;
 
    // 1. 逻辑删除：deleteById 转为 UPDATE
    public void testDelete() {
        // 原物理删除：DELETE FROM t_user WHERE id = 1
        // 现逻辑删除：UPDATE t_user SET deleted = 1 WHERE id = 1 AND deleted = 0
        boolean success = userService.removeById(1L);
    }
 
    // 2. 查询自动过滤：selectList 自动加 WHERE deleted = 0
    public void testQuery() {
        // 执行 SQL：SELECT id, user_name, age, deleted FROM t_user WHERE deleted = 0
        List<User> userList = userService.list();
    }
 
    // 3. 批量删除：同样转为批量 UPDATE
    public void testBatchDelete() {
        // 执行 SQL：UPDATE t_user SET deleted = 1 WHERE id IN (1,2,3) AND deleted = 0
        userService.removeBatchByIds(List.of(1L, 2L, 3L));
    }
}
```

- **基础配置：数据库加逻辑删除字段 + 实体类加 @TableLogic 注解（或全局配置）；**
- **自动拦截：MP 拦截删除操作转为 UPDATE，拦截查询操作自动加过滤条件，无需修改业务代码；**

- **灵活扩展：支持自定义删除值、手动查询已删除数据、兼容自定义 SQL（需手动加条件）。**

**逻辑删除是业务系统中最常用的删除策略（避免数据丢失），MP 的封装让逻辑删除实现零侵入，大幅简化开发工作。**











