---
title: Redis总结
description: 🥧Redis学习之路开启
image: 'https://img.f3f3.top/img/1786553237128_image.webp'
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

##  基础与结构

***Redis中存储的数据都是以key.value对的形式存储，而value的形式多种多样，可以是字符串.数值.甚至json***

**NoSql**为**非关系型数据库**。

![image.webp](https://img.f3f3.top/picgo/1786319324054_image.webp)

- **缓存：减轻数据库压力**
- **分布式锁：解决并发问题**
- **消息队列：发布订阅，Stream**
- **计数器：UV/PV统计**
- **排行榜：Sorted Set**

**核心特性**：

- **单线程模型（Redis6.0之后引入了多线程IO）**
- **基于内存读写快（10w+QPS）**
- **支持持久化(RDB,AOF)**
- **支持主从复制,哨兵，集群**

## 命令

### 通用

![image.webp](https://img.f3f3.top/picgo/1792564196335_image.webp)

![image.webp](https://img.f3f3.top/picgo/1792564293091_image.webp)

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

SET NX：添加一个String类型的键值对，前提是这个key不存在，否则不执行
set name yifei nx

SET EX：添加一个String类型的键值对，并且指定有效期
set name liyifei ex 10

APPEND key value // 将指定的value追加到该key原来值value的末尾
```

### 层级结构

**Redis没有类似MySQL中的Table的概念，我们该如何区分不同类型的key呢？**

**我们的项目名称叫 heima，有user和product两种不同类型的数据，我们可以这样定义key**：

- ：**user相关的key：heima:user:1**
- **product相关的key：heima:product:1**

**如果Value是一个Java对象，例如一个User对象，则可以将对象序列化为JSON字符串后存储：**

```
**KEY	VALUE**

**heima:user:1	{"id":1, "name": "Jack", "age": 21}**

**heima:product:1	{"id":1, "name": "小米11", "price": 4999}
```

### Hash

- **Hash类型，也叫散列，其value是一个无序字典，类似于Java中的HashMap结构。**
- **String结构是将对象序列化为JSON字符串后存储，当需要修改对象某个字段时很不方便**

![image.webp](https://img.f3f3.top/picgo/1786322594961_image.webp)

**Hash结构可以将对象中的每个字段独立存储，可以针对单个字段做CRUD**

![image.webp](https://img.f3f3.top/picgo/1786322629480_image.webp)

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

![image.webp](https://img.f3f3.top/picgo/1786323979228_image.webp)

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

![image.webp](https://img.f3f3.top/picgo/1786325893036_image.webp)

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
        // 写入一条对象Hash数据
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
```

- **使用StringRedisTemplate**
- **写入Redis时，手动把对象序列化为JSON    writeValueAsString（）方法**

- **读取Redis时，手动把读取到的JSON反序列化为对象    readValue（获取到的字符串，转化的对象类）方法**

```
// Java + Jedis/Lettuce 示例
@Autowired
private StringRedisTemplate redisTemplate;

// 1. String - 缓存用户信息
public void cacheUser(User user) {
    String key = "user:" + user.getId();
    // 序列化为 JSON
    String json = JSON.toJSONString(user);
    redisTemplate.opsForValue().set(key, json, 30, TimeUnit.MINUTES);
}

// 2. Hash - 存储商品信息
public void cacheGoods(Goods goods) {
    String key = "goods:" + goods.getId();
    Map<String, String> map = new HashMap<>();
    map.put("name", goods.getName());
    map.put("price", goods.getPrice().toString());
    map.put("stock", String.valueOf(goods.getStock()));
    
    redisTemplate.opsForHash().putAll(key, map);
    redisTemplate.expire(key, 10, TimeUnit.MINUTES);
}

// 3. Sorted Set - 排行榜
public void updateScore(Long userId, Double score) {
    String key = "ranking:sales";
    redisTemplate.opsForZSet().add(key, userId.toString(), score);
}

// 获取 TOP 10
public List<Long> getTopUsers(int limit) {
    String key = "ranking:sales";
    Set<String> result = redisTemplate.opsForZSet()
            .reverseRange(key, 0, limit - 1);
    
    return result.stream()
            .map(Long::parseLong)
            .collect(Collectors.toList());
}

// 4. List - 消息队列
public void pushMessage(String message) {
    redisTemplate.opsForList().leftPush("queue:message", message);
}

public String popMessage() {
    return redisTemplate.opsForList().rightPop("queue:message");
}

// 5. Set - 共同好友
public Set<String> getCommonFriends(Long userId1, Long userId2) {
    String key1 = "friends:" + userId1;
    String key2 = "friends:" + userId2;
    
    return redisTemplate.opsForSet().intersect(key1, key2);
}
```

## 旁路缓存

### 更新DB后删缓存

**数据一致性**

- **先读缓存，缓存未命中再读数据库，然后回写缓存写流程**
- **先更新数据库，再删除缓存**

**先删除缓存，再更新数据库**

- **本质先查缓存，缓存中旧值被删除，查数据库查到旧值写入Redis**
- **更新数据库，数据库就是新值**

**先更新数据库，再删除缓存**

- **删除缓存前可能读到旧的缓存，但影响较少**

![image.webp](https://img.f3f3.top/picgo/1792565695030_image.webp)

```

删除缓存失败的概率远小于更新数据库失败
  即使删除失败，缓存有过期时间，最终会一致
  实现简单，性能好
@Service
public class GoodsService {
    @Autowired
    private GoodsMapper goodsMapper;
    
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @Transactional
    public void updatePrice(Long goodsId, BigDecimal newPrice) {
        String cacheKey = "goods:" + goodsId;
        
        // 1. 先更新数据库
        Goods goods = new Goods();
        goods.setId(goodsId);
        goods.setPrice(newPrice);
        goodsMapper.updateById(goods);
        
        // 2. 再删除缓存
        redisTemplate.delete(cacheKey);
        
        // 为什么不更新缓存？
        // 1. 删除操作更简单
        // 2. 避免并发写入导致的缓存脏数据
        // 3. 懒加载：下次读取时再写入最新数据
    }
    
    public Goods getGoods(Long goodsId) {
        String cacheKey = "goods:" + goodsId;
        
        // 1. 查缓存
        String json = redisTemplate.opsForValue().get(cacheKey);
        if (json != null) {
            return JSON.parseObject(json, Goods.class);
        }
        
        // 2. 缓存未命中，查数据库
        Goods goods = goodsMapper.selectById(goodsId);
        if (goods == null) {
            return null;
        }
        
        // 3. 写入缓存
        redisTemplate.opsForValue().set(
            cacheKey, 
            JSON.toJSONString(goods),
            10, TimeUnit.MINUTES
        );
        
        return goods;
    }
}
```

### 延迟双删

### ![image.webp](https://img.f3f3.top/picgo/1792566441247_image.webp)

```
@Service
public class GoodsService {
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @Autowired
    private GoodsMapper goodsMapper;
    
    @Transactional
    public void updatePrice(Long goodsId, BigDecimal newPrice) {
        String cacheKey = "goods:" + goodsId;
        
        // 1. 第一次删除缓存
        redisTemplate.delete(cacheKey);
        
        // 2. 更新数据库
        goodsMapper.updatePrice(goodsId, newPrice);
        
        // 3. 延迟双删（异步）
        CompletableFuture.runAsync(() -> {
            try {
                // 延迟 500ms
                Thread.sleep(500);
                
                // 第二次删除缓存
                redisTemplate.delete(cacheKey);
                
                log.info("延迟双删成功: {}", cacheKey);
            } catch (InterruptedException e) {
                log.error("延迟双删失败", e);
            }
        });
    }
}
```

- **先删缓存到数据库更新的时间，就会读到旧缓存，再次删除旧缓存，避免旧数据**
- **第二次删除也可能失败，建议加重试 / 补偿**

**延迟时间如何确定**

- **根据业务读操作的平均耗时决定**
- **一般设置为 300-1000ms**
- **可以通过监控统计 99 分位的查询耗时**

### **Canal监听**

**应用更新MySQL一MySQLBinlog一Canal监听一解析BinIog事件—删除对应缓存**

-  **业务代码无需关心缓存删除**

 * **数据库驱动，最终一致性**
 * **解耦业务逻辑和缓存维护**

```
// Canal 客户端监听器
@Component
public class CanalListener {
    @Autowired
    private StringRedisTemplate redisTemplate;
    
    @CanalListener
    public void onEvent(CanalEntry.Entry entry) {
        // 1. 解析 Binlog 事件
        String tableName = entry.getHeader().getTableName();
        CanalEntry.EventType eventType = entry.getHeader().getEventType();
        
        // 2. 只处理 UPDATE 和 DELETE 事件
        if (eventType != CanalEntry.EventType.UPDATE && 
            eventType != CanalEntry.EventType.DELETE) {
            return;
        }
        
        // 3. 解析行数据
        CanalEntry.RowChange rowChange = CanalEntry.RowChange.parseFrom(
            entry.getStoreValue()
        );
        
        for (CanalEntry.RowData rowData : rowChange.getRowDatasList()) {
            // 获取主键 ID
            String id = null;
            for (CanalEntry.Column column : rowData.getAfterColumnsList()) {
                if (column.getIsKey()) {
                    id = column.getValue();
                    break;
                }
            }
            
            // 4. 删除对应缓存
            if (id != null) {
                String cacheKey = tableName + ":" + id;
                redisTemplate.delete(cacheKey);
                log.info("Canal删除缓存: {}", cacheKey);
            }
        }
    }
}

```

## 缓存穿透

### 缓存空值

**恶意请求查询大量不存在的数据，缓存无法拦截，所有请求都打到数据库**

- **查询数据库之前先查询缓存，如果缓存数据存在，则直接从缓存中返回**
- **如果缓存数据不存在，再查询数据库，然后将数据存入redis**

****

| 问题     | 现象              | 原因               |      影响       |
| -------- | ----------------- | ------------------ | :-------------: |
| 缓存穿透 | 查询不存在的数据  | 缓存和 DB 都没有   | 大量请求打到 DB |
| 缓存击穿 | 热点数据过期      | 高并发访问过期 key |   瞬间压垮 DB   |
| 缓存雪崩 | 大量 key 同时过期 | 过期时间设置相同   | DB 瞬间压力激增 |

| 方案       | 实现方式          | 优点       | 缺点                 |   适用场景   |
| ---------- | ----------------- | ---------- | -------------------- | :----------: |
| 缓存空值   | 不存在也缓存 null | 简单有效   | 占用内存             |  ✅ 通用推荐  |
| 布隆过滤器 | Bitmap 判断存在性 | 内存占用小 | 有误判率             |   海量数据   |
| 参数校验   | 前置拦截非法参数  | 性能最好   | 无法防止合法 ID 穿透 | 配合其他方案 |

```
请求查询商品
    ↓
[1] 查缓存 → 命中？
    ├─ 是 → 值是空字符串？→ 返回 null（防穿透）
    └─ 否 → 值是正常JSON → 反序列化返回商品对象
    ↓
[2] 缓存未命中 → 查数据库
    ├─ 查到商品 → 缓存JSON，过期10分钟 → 返回商品
    └─ 没查到 → 缓存空字符串，过期2分钟 → 返回null
```

- **JSON.parseObject(json, Goods.class);和Shop shop =JSONUtil.toBean(shopJson,Shop.class);Redis的String格式转换为对象**
- **stringRedisTemplate.opsForValue().set(key,JSONUtil.toJsonStr(shop));将 Bean 等对象转换为 String类型，内容格式为JSon**

```
public Goods getGoods(Long goodsId) {
    String cacheKey = "goods:" + goodsId;
    
    // 1. 查缓存
    String json = redisTemplate.opsForValue().get(cacheKey);
    
    // 缓存命中
    if (json != null) {
        // 如果是空字符串，说明数据不存在
        if ("".equals(json)) {
            return null;
        }
        return JSON.parseObject(json, Goods.class);
    }
    
    // 2. 查数据库
    Goods goods = goodsMapper.selectById(goodsId);
    
    if (goods != null) {
        // 3.1 数据存在，缓存正常对象
        redisTemplate.opsForValue().set(
            cacheKey,
            JSON.toJSONString(goods),
            10, TimeUnit.MINUTES
        );
    } else {
        // 3.2 数据不存在，缓存空字符串，过期时间短一些
        redisTemplate.opsForValue().set(
            cacheKey,
            "",
            2, TimeUnit.MINUTES
        );
    }
    
    return goods;
}
```

- **空值时间设置较短节省内存**
- **定期清理空值缓存**

### 布隆过滤器

![image.webp](https://img.f3f3.top/picgo/1792569647596_image.webp)

- **用多个哈希函数将元素映射到位数组**
- **查询时检查所有位是否都为1**
- **不存在：100％准确**
- **存在：有一定误判率（可配置）**

**Redission实现**

```
@Configuration
public class BloomFilterConfig {
    @Bean
    public RBloomFilter<Long> goodsBloomFilter(RedissonClient redisson) {
        RBloomFilter<Long> bloomFilter = redisson.getBloomFilter("goods:bloom");
        // 预计元素数量 1000万，误判率 0.01
        bloomFilter.tryInit(10000000L, 0.01);
        return bloomFilter;
    }
    
    @PostConstruct
    public void initBloomFilter() {
        List<Long> allGoodsIds = goodsMapper.selectAllIds();
        for (Long id : allGoodsIds) {
            goodsBloomFilter.add(id);
        }
        log.info("布隆过滤器初始化完成，加载商品数: {}", allGoodsIds.size());
    }
}

@Service
public class GoodsService {
    @Autowired
    private RBloomFilter<Long> goodsBloomFilter;
    
    public Goods getGoods(Long goodsId) {
        // 1. 先用布隆过滤器判断
        if (!goodsBloomFilter.contains(goodsId)) {
            // 100% 不存在
            return null;
        }
        
        // 2. 可能存在，继续查缓存和DB
        String cacheKey = "goods:" + goodsId;
        String json = redisTemplate.opsForValue().get(cacheKey);
        if (json != null) {
            return JSON.parseObject(json, Goods.class);
        }
        
        Goods goods = goodsMapper.selectById(goodsId);
        if (goods != null) {
            redisTemplate.opsForValue().set(
                cacheKey,
                JSON.toJSONString(goods),
                10, TimeUnit.MINUTES
            );
        }
        
        return goods;
    }
    
    // 新增商品时添加到布隆过滤器
    public void addGoods(Goods goods) {
        goodsMapper.insert(goods);
        goodsBloomFilter.add(goods.getId());
    }
}
```

- **布隆过滤器不支持删除（需要用countingBloomFilter)**
- **需要在应用启动时加载所有数据**
- **新增数据要同步更新布隆过滤器**

## 缓存击穿















## 缓存雪崩

















## IO多路复用







## Lua脚本







## 分布式锁





## Redis持久化











## 性能优化
