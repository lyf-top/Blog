---
title: Redis基础
description: 🥧Redis学习之路开启
image: 'https://img.f3f3.top/img/2026/04/28/87ab7f6d31b8b767723c61db968f171c.webp'#文章封面页
tags:
  - Redis实战
category: Redis 
  #永久连接id
abbrlink: "74812345"
# 文章置顶
pinned: true #文章置顶
published: 2026-08-10 18:19:03
updated: 2026-08-10 10:43:08
---

##  初识

***Redis中存储的数据都是以key.value对的形式存储，而value的形式多种多样，可以是字符串.数值.甚至json***

**NoSql**为**非关系型数据库**。

![image.webp](https://imgbed.f3f3.top/file/picgo/1786319324054_image.webp)

## 命令

### 通用

```
KEYS：查看符合模板的所有key
keys *;    keys a* 模糊查询，单线程可能会堵塞数据量大时

DEL：删除一个指定的key

EXISTS：判断key是否存在

EXPIRE：给一个key设置有效期，有效期到期时该key会被自动删除

TTL：查看一个KEY的剩余有效期

如果该值未设置有效期，则直接返回-1

如果该值设置有效期，未失效时返回剩余有效期，失效后则返回-2
```

### String

```
SET：添加或者修改已经存在的一个String类型的键值对
     如果key不存在则是新增，如果存在则是修改

GET：根据key获取String类型的value

MSET：批量添加多个String类型的键值对

MGET：根据多个key获取多个String类型的value

INCR：让一个整型的key自增1

INCRBY:让一个整型的key自增并指定步长，例如：incrby num 2 让num值自增2

SETNX：添加一个String类型的键值对，前提是这个key不存在，否则不执行
set name yifei ex

SETEX：添加一个String类型的键值对，并且指定有效期
set name liyifei ex 10
APPEND key value // 将指定的value追加到该key原来值value的末尾
```

### 层级结构

**Redis没有类似MySQL中的Table的概念，我们该如何区分不同类型的key呢？**

我们的项目名称叫 heima，有user和product两种不同类型的数据，我们可以这样定义key：

- user相关的key：**heima:user:1**
- product相关的key：**heima:product:1**

如果Value是一个Java对象，例如一个User对象，则可以将对象序列化为JSON字符串后存储：

- KEY	VALUE
- heima:user:1	{"id":1, "name": "Jack", "age": 21}
- heima:product:1	{"id":1, "name": "小米11", "price": 4999}

### Hash

- **Hash类型，也叫散列，其value是一个无序字典，类似于Java中的HashMap结构。**
- **String结构是将对象序列化为JSON字符串后存储，当需要修改对象某个字段时很不方便**

![image.webp](https://imgbed.f3f3.top/file/picgo/1786322594961_image.webp)

**Hash结构可以将对象中的每个字段独立存储，可以针对单个字段做CRUD**

![image.webp](https://imgbed.f3f3.top/file/picgo/1786322629480_image.webp)

```
HSET key field value：添加或者修改hash类型key的field的值
HSET heima:user:3 name Lucy

HGET key field：获取一个hash类型key的field的值
HGET heima:user:3 name

HMSET：批量添加多个hash类型key的field的值
HMSET heima:user:3 name LiLei age 20

HMGET：批量获取多个hash类型key的field的值
HMGET heima:user:3 name age

HGETALL：获取一个hash类型的key中的所有的field和value

HKEYS：获取一个hash类型的key中的所有的field

HINCRBY:让一个hash类型key的字段值自增并指定步长

HSETNX：添加一个hash类型的key的field值，前提是这个field不存在，否则不执行
```

### List

Redis中的List类型与Java中的LinkedList类似，可以看做是一个双向链表结构。既可以支持正向检索和也可以支持反向检索。

![image.webp](https://imgbed.f3f3.top/file/picgo/1786323979228_image.webp)

- **有序**
- **元素可以重复**
- **插入和删除快**
- **查询速度一般**

```
LPUSH key element ：向列表左侧插入一个或多个元素

LPOP key：移除并返回列表左侧的第一个元素，没有则返回nil

RPUSH key element ：向列表右侧插入一个或多个元素

RPOP key：移除并返回列表右侧的第一个元素

LRANGE key star end：返回一段角标范围内的所有元素

BLPOP和BRPOP：与LPOP和RPOP类似，只不过在没有元素时等待指定时间，而不是直接返回nil

```

### Set

**Redis的Set结构与Java中的HashSet类似，可以看做是一个value为null的HashMap。也是一个hash表，因此具备与HashSet类似的特征：**

- **无序**
- **元素不可重复**
- **查找快**
- **支持交集.并集.差集等功能**

```
SADD key member ：向set中添加一个或多个元素

SREM key member : 移除set中的指定元素

SCARD key： 返回set中元素的个数

SISMEMBER key member：判断一个元素是否存在于set中

SMEMBERS：获取set中的所有元素

SINTER key1 key2 ：求key1与key2的交集

SDIFF key1 key2 ：求key1与key2的差集

SUNION key1 key2 ：求key1和key2的并集
```

### SortedSet

R**edis的SortedSet是一个可排序的set集合，与Java中的TreeSet有些类似，但底层数据结构却差别很大。SortedSet中的每一个元素都带有一个score属性（可理解为权值），可以基于score属性对元素排序，底层的实现是一个跳表（SkipList）加 hash表。**

- **可排序 实现排行榜这样的功能**
- **元素不重复**
- **查询速度快**

```
ZADD key score member：添加一或多个元素,如已存在则更新其score值

ZCARD key：获取sorted set中的元素个数

ZREM key member：删除sorted set中的一个指定元素

ZSCORE key member : 获取sorted set中的指定元素的score值

ZRANK key member：获取sorted set 中的指定元素的排名

ZCOUNT key min max：统计score值在给定范围内的所有元素的个数

ZINCRBY key increment member：让sorted set中的指定元素自增，步长为increment

ZRANGE key min max：按照score排序后，获取指定排名范围内的元素

ZRANGEBYSCORE key min max：按照score排序后，获取指定score范围内的元素

ZDIFF.ZINTER.ZUNION：求差集.交集.并集

注意：所有的排名默认都是升序，如果要降序则在命令的Z后面添加REV即可

升序获取sorted set 中的指定元素的排名：ZRANK key member

降序获取sorted set 中的指定元素的排名：ZREVRANK key memebe

```

## 连接

### Jedis

Jedis和Lettuce：这两个主要是提供了Redis命令对应的API，方便我们操作Redis，而SpringDataRedis又对这两种做了抽象和封装，因此我们后期会直接以SpringDataRedis来学习。

Jedis本身是线程不安全的，并且频繁的创建和销毁连接会有性能损耗，因此我们推荐大家**使用Jedis连接池代替Jedis的直连方式**

```
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>3.7.0</version>
</dependency>
```

```
public class JedisConnectionFacotry {
     private static final JedisPool jedisPool;
     static {
         //配置连接池
         JedisPoolConfig poolConfig = new JedisPoolConfig();
         poolConfig.setMaxTotal(8);
         poolConfig.setMaxIdle(8);
         poolConfig.setMinIdle(0);
         poolConfig.setMaxWaitMillis(1000);
         //创建连接池对象
         jedisPool = new JedisPool(poolConfig,
                 "192.168.150.101",6379,1000,"123321");
     }
 
     public static Jedis getJedis(){
          return jedisPool.getResource();
     }
}
```

-  **JedisConnectionFacotry：工厂设计模式是实际开发中非常常用的一种设计模式，我们可以使用工厂，去降低代码的耦合，比如Spring中的Bean的创建，就用到了工厂设计模式**

- **静态代码块：随着类的加载而加载，确保只能执行一次，我们在加载当前工厂类的时候，就可以执行static的操作完成对 连接池的初始化**

-  **最后提供返回连接池中连接的方法**

```
    @BeforeEach
    void setUp(){
        //建立连接
        /*jedis = new Jedis("127.0.0.1",6379);*/
        jedis = JedisConnectionFacotry.getJedis();
         //选择库
        jedis.select(0);
    }
 
   @AfterEach
    void tearDown() {
        if (jedis != null) {
            jedis.close();
        }
    }
```

**在我们完成了使用工厂设计模式来完成代码编写后，我们在获得连接时，就可通过工厂来获得，而不用直接去new对象，降低耦合，并且使用的还是连接池对象。**

**当我们使用了连接池后，当我们关闭连接其实并不是关闭，而是将Jedis还回连接池的。**

### **Template**

![image.webp](https://imgbed.f3f3.top/file/picgo/1786325893036_image.webp)

```
 @Autowired
    private RedisTemplate<String, Object> redisTemplate;
 
    @Test
    void testString() {
        // 写入一条String数据
        redisTemplate.opsForValue().set("name", "虎哥");
        // 获取string数据
        Object name = redisTemplate.opsForValue().get("name");
        System.out.println("name = " + name);
```

**Object序列化为字节形式，默认是采用JDK序列化*****可读性差，内存占用较大**

```
//自定义序列化器
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory){
        // 创建RedisTemplate对象
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 设置连接工厂
        template.setConnectionFactory(connectionFactory);
        // 创建JSON序列化工具
        GenericJackson2JsonRedisSerializer jsonRedisSerializer = 
            							new GenericJackson2JsonRedisSerializer();
        // 设置Key的序列化
        template.setKeySerializer(RedisSerializer.string());
        template.setHashKeySerializer(RedisSerializer.string());
        // 设置Value的序列化
        template.setValueSerializer(jsonRedisSerializer);
        template.setHashValueSerializer(jsonRedisSerializer);
        // 返回
        return template;
    }
}
自定义RedisTemplate

修改RedisTemplate的序列化器为GenericJackson2JsonRedisSerializer
```

```
@Autowired
    private StringRedisTemplate stringRedisTemplate;
 
    @Test
    void testString() {
        // 写入一条String数据
        stringRedisTemplate.opsForValue().set("verify:phone:13600527634", "124143");
        // 获取string数据
        Object name = stringRedisTemplate.opsForValue().get("name");
        System.out.println("name = " + name);
    }
 
    private static final ObjectMapper mapper = new ObjectMapper();
 
    @Test
    void testSaveUser() throws JsonProcessingException {
        // 创建对象
        User user = new User("虎哥", 21);
        // 手动序列化
        String json = mapper.writeValueAsString(user);
        // 写入数据
        stringRedisTemplate.opsForValue().set("user:200", json);
 
        // 获取数据
        String jsonUser = stringRedisTemplate.opsForValue().get("user:200");
        // 手动反序列化
        User user1 = mapper.readValue(jsonUser, User.class);
        System.out.println("user1 = " + user1);
    }
//使用StringRedisTemplate

/写入Redis时，手动把对象序列化为JSON

读取Redis时，手动把读取到的JSON反序列化为对象
```







































