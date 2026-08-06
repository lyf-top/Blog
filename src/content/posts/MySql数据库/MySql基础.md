---

title: MySql基础
description: 🥧MySql学习之路开启
image: 'https://img.f3f3.top/img/2026/05/30/da45596576f04825512ee17c4ebb77c6.webp' #文章封面页
tags:
  - Mysql基础
category: MySql数据库 
  #永久连接id
abbrlink: "2582"
# 文章置顶
pinned: false #文章置顶
published: 2026-06-14 18:19:03
updated: 2026-06-14 20:43:03
---

## 数据库的相关概念

|                       名词                       |                             解释                             |
| :----------------------------------------------: | :----------------------------------------------------------: |
|               DB：数据库(Database)               | 即存储数据的“仓库”，其本质是一个文件系统。它保存了一系列有组织的数据。 |
| DBMS：数据库管理系统(Database Management System) | 是一种操纵和管理数据库的大型软件，用于建立、使用和维护数据库，对数据库进行统一管理和控制。用户通过数据库管理系统访问数据库中表内的数据。 |
|  SQL：结构化查询语言(Structured Query Language)  |                 专门用来与数据库通信的语言。                 |

```
net start mysql80 启动mysql服务
net stop mysql80 停止mysql服务
mysql -u root -p 连接mysql客户端
密码123456
```

1. DDL(Data Definition Languages、数据定义语言)，这些语句定义了不同的数据库、表、视图、索引等数据库对象，还可以用来创建、删除、修改数据库和数据表的结构。

   - 主要的语句关键字包括CREATE、DROP、ALTER、RENAME等。

1. DML(Data Manipulation Language、数据操作语言)，用于添加、删除、更新和查询数据库记录，并检查数据完整性。

   - 主要的语句关键字包括INSERT、DELETE、UPDATE、SELECT等。
   - SELECT是SQL语言的基础，最为重要。

1. DCL(Data Control Language、数据控制语言) ，用于定义数据库、表、字段、用户的访问权限和安全级别。

   - 主要的语句关键字包括 GRANT 、 REVOKE 、 COMMIT 、 ROLLBACK 、 SAVEPOINT 等。

## DDL语句

```
show databases;查询所有数据库
select datase();查询当前数据库
创建
create database [if not exists] 数据库名 [default charset 字符集][collate 排序规则];
删除
drop database [if exists] 数据库名;
使用
use 数据库名;
查询当前数据库所有标
show tables;
查询表结构
desc 表名;
查询指定表的建表语句
show create table 表名;
创建表
create table tb_user(
id int comment '编号'，
name varchar(50) comment '姓名',
age int comment '年龄',
gender varchar(1) comment '性别'
) comment '用户表';

```

```
添加字段
alter table 表名 add 字段名 类型(长度) [comment 注释] [约束];
修改数据类型
alter table 表名 modify 字段名 新的数据类型(长度);  
修改字段名和字段类型
alter table 表名 旧的字段名 新的字段名 数据类型(长度) [comment 注释] [约束];
删除字段
alter table 表名 drop 字段名;
修改表名
alter table 表名 rename to 新表名;
删除表
drop table  [if exists] 表名;
删除指定表并重新创建该表
truncate table 表名;
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1781404826667_image.webp)

```
create table emp()
id int comment '编号',
workno varchar(10) comment '工号' ，
name varchar(10) comment '姓名',
gender char(1) comment '性别',
age tinyint unsigned comment '年龄',
idcard char(18) comment '身份证',
entrydate date comment '入职时间'
) comment '员工表';
1.编号（纯数字）
2.员工工号(字符串类型，长度不超过10位)
3.员工姓名（字符串类型，长度不超过10位
4.性别（男/女，存储一个汉字)
5.年龄（正常人年龄，不可能存储负数）
6.身份证号（二代身份证号均为18位，身份
7.入职时间（取值年月日即可）

```

## DML语句

###  添加数据

```
给指定字段添加数据
insert into table(字段名1,字段名2)values(值1,值2);
给全部字段添加数据
INSERT INTO 表名 VALUES (值1,值2,…);
批量添加数据
INSERT INTO 表名 (字段名1,字段名2,…) VALUES (值1,值2,…),(值1,值2,….,(值1,值2,…)
INSERT INTO 表名 VALUES(值1,值2,…), (值1,值2,….,(值1,值2,….);

//插入数据时，指定的字段顺序需要与值的顺序是一一对应的。
//字符串和日期型数据应该包含在引号中。
//插入的数据大小，应该在字段的规定范围内。

```

### 修改数据

```
UPDATE 表名 SET字段名1=值1，字段名2=值2，……[WHERE 条件];
//修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据。
```

### 删除数据

```
DELETE FROM 表名 [WHERE条件] 
//DELETE 语句的条件可以有，也可以没有，如果没有条件，则会删除整张表的所有数据。 
//DELETE 语句不能删除某一个字段的值(可以使用UPDATE)。
```

## DQL 语句

```
查询多个字段
SELECT 字段1,字段2,字段3 FROM 表名;
SELECT * FROM 表名;
设置别名
SELECT 字段1[AS 别名1]，字段2[AS 别名2〕…FROM表名;
去除重复记录
SELECT DISTINCT 字段列表 FROM 表名;
//通配符的优势是，当不知道所需要的列的名称时，可以通过它获取它们。
在生产环境下，不推荐直接使用 SELECT ∗ 进行查询。
```

### 条件查询

```
SELECT 字段列表 FROM 表名 WHER E条件列表


between and 在某个范围之内(含最大值和最小值)
in() 在in 之后的列表中的值，多选一
like 占位符 模糊匹配（——匹配单个字符，%匹配任意字符）
is null 是null
and 并且（多个条件同时成立）
or 或者（多个条件任意一个成立)
not 非不是

```

```
10.查询姓名为两个字的员工信息_%
select * from emp where name like '__';
11.查询身份证号最后一位是X的员工信息
select * from emp where idcard like '%X';

12.查询last_name中第2个字符是_且第3个字符是a的员工信息
-- 需要使用转义字符：\
SELECT last_name,salary,department_id
FROM employees
WHERE last_name LIKE '_\_a%';
13.选择姓名中有字母a和k的员工姓名
SELECT last_name
FROM employees
WHERE last_name LIKE ("%a%") AND last_name LIKE ("%k%");
```

### 聚合函数

```
count 统计数量
max 最大值
min 最小值
avg 平均值
sum 求和

SELECT 聚合函数(字段列表) FROM表名
```

```
统计该企业员工的最大年龄
select max(age) from emp;
4.统计该企业员工的最小年龄
select min(age)from emp;
-5.统计西安地区员工的年龄之和
select sum(age) from emp where workaddress='西安';
```

### 分组查询

```
SELECT 字段列表 FROM 表名 [WHERE条件] GROUP BY分组字段名[HAVING 分组后过滤祭件]
where与having区别
执行时机不同：where是分组之前进行过滤，不满足where条件，不参与分组；而having是分组之后对结果进行过滤。
判断条件不同：where不能对聚合函数进行判断，而having可以。
执行顺序:where >聚合函数>having
分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义
```

```
1.根据性别分组，统计男性员工和女性员工的数量
select gender, count(*) from emp group by gender ;
2．根据性别分组，统计男性员工 和女性员工的平均年龄select gender, avg(age) from emp group by gender ;
3．查询年龄小于45的员工，并根据工作地址分组，获取员工数量大于等于3的工作地址
select workaddress, count(*) address_count from emp where age < 45 group by workaddress having address_count >= 3;
```

### 排序查询

```
SELECT 字段列表 FROM 表名 ORDER BY 字段1排序方式1，字段2排序方式2;
ASC：升序（默认值）DESC：降序
//如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序。
//列的别名只能在ORDER BY 中使用，不能在WHERE中使用，因为WHERE的执行顺序先于别名，故在WHERE使用时会报错
```

### 分页查询

```
SELECT 字段列表 FROM 表名 LIMIT 起始索引,查询记录数;
起始索引从0开始，起始索引=（查询页码-1）*每页显示记录数。
分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是LIMIT。
如果查询的是第一页数据，起始索引可以省略， 直接简写为imit 10。
```

```
询年龄为20，21，22，23岁的女性员工信息。
select * from emp where gender ='女' and age in(20,21,22,23);
2.查询性别为男，并且年龄在20-40岁（含）以内的姓名为三个字的员工。
select * from emp where gender =男' and ( age between 20 and 40) and name like '---';
3，统计员工表中，年龄小于60岁的，男性员工和女性员工的人数。
select gender, count(*) from emp where age < 6θ group by gender;
4，查询所有年龄小于等于35岁员工的姓名和年龄，并对查询结果按年龄升序排序，如果年龄相同按入职时间降序排序。select name , age from emp where age <= 35 order by age asc , entrydate desc;
5.查询性别为男，且年龄在20-40岁（含）以内的前5个员工信息，对查询的结果按年龄升序排序，年龄相同按入职时间升序排序。
select * from emp where gender ='男' and age between 20 and 40 order by age asc , entrydate asc limit 5;
```

```
-- 需求1：每页显示20条记录，此时显示第1页
SELECT employee_id,last_name
FROM employees
LIMIT 0,20;

-- 需求2：每页显示20条记录，此时显示第2页
SELECT employee_id,last_name
FROM employees
LIMIT 20,20;

-- 需求3：每页显示20条记录，此时显示第3页
SELECT employee_id,last_name
FROM employees
LIMIT 40,20;

-- 每页显示pageSize条记录，此时显示第pageNo页，公式：LIMIT (pageNo - 1) * pageSize,pageSize;

-- WHERE...ORDER BY... LIMIT 声明顺序如下：
SELECT last_name,salary,department_id
FROM employees
WHERE salary > 8000
ORDER BY salary ASC
LIMIT 0,20

-- 练习1：表里有 107 条数据，我们只想要显示第 32、33 条数据怎么办呢？
SELECT employee_id,last_name,salary,department_id
FROM employees
LIMIT 31,2;

-- MySQL8.0新特性：LIMIT  条目数 OFFSET 位置偏移量
-- 练习2：表里有 107 条数据，我们只想要显示第 32、33 条数据怎么办呢？
SELECT employee_id,last_name,salary,department_id
FROM employees
LIMIT 2 OFFSET 31;

-- 练习：查询员工表中工资最高的员工信息
SELECT employee_id,last_name,salary,department_id
FROM employees
ORDER BY salary DESC
LIMIT 1;
```

![image.webp](https://imgbed.f3f3.top/file/picgo/1781409129012_image.webp)

## 约束

### 初识

![image.webp](https://imgbed.f3f3.top/file/picgo/1781411128058_image.webp)

![image.webp](https://imgbed.f3f3.top/file/picgo/1781411374924_image.webp)

### 非空约束

- 默认，所有的类型的值都可以是NULL，包括INT、FLOAT等数据类型
- 非空约束只能出现在表对象的列上，`只能某个列单独限定非空，不能组合非空`
- 一个表可以有很多列都分别限定了非空
- 空字符串’’不等于NULL，0也不等于NULL

```
CREATE TABLE test1(
id INT NOT NULL,
last_name VARCHAR(25) NOT NULL,
email VARCHAR(50),
salary DECIMAL(10,2)
);
```

#### 删除约束

```
ALTER TABLE test1
MODIFY email VARCHAR(50) NULL;

INSERT INTO test1
VALUES(73,'赵六',NULL,4399);
-- 成功
```

### 唯一性约束

- 同一个表可以有多个唯一约束。

- 唯一约束可以是某一个列的值唯一，也可以多个列组合的值唯一。

- 唯一性约束允许列值为空。

- 在创建唯一约束的时候，如果不给唯一约束命名，就默认和列名相同。

- MySQL会给唯一约束的列上默认创建一个唯一索引。

```
CREATE TABLE test2(
id INT UNIQUE,		-- 列级约束
last_name VARCHAR(15),
email VARCHAR(25),
salary DECIMAL(10,2),
CONSTRAINT uk_test2_email UNIQUE(email) -- 表级约束
);
```

```
INSERT INTO test2
VALUES(1,'Tom','Tom@123.com',3500);

-- 错误：Duplicate entry '1' for key 'test2.id'
INSERT INTO test2
VALUES(1,'Jerry','Jerry@123.com',4000);

-- 错误：Duplicate entry 'Tom@123.com' for key 'test2.uk_test2_email'
INSERT INTO test2
VALUES(2,'Jerry','Tom@123.com',4500);

-- 可以向声明为UNIQUE的字段添加NULL值，且可以多次添加NULL值
INSERT INTO test2
VALUES(2,'Jerry',NULL,4500);

INSERT INTO test2
VALUES(3,'Coco',NULL,5000);
```

#### 添加约束

```
ALTER TABLE 表名称 
MODIFY 字段名 字段类型 UNIQUE;
```

```
ALTER TABLE 表名称 
ADD [CONSTRAINT 约束名] UNIQUE KEY(字段列表); --KEY 可以省略
```

#### 复合唯一约束

```
CREATE TABLE student(
sid INT, 	-- 学号
sname VARCHAR(20), -- 姓名
tel CHAR(11) UNIQUE KEY, -- 电话
cardid CHAR(18) UNIQUE KEY -- 身份证号
);
```

```
CREATE TABLE course(
cid INT, -- 课程编号
cname VARCHAR(20) -- 课程名称
);
```



```
CREATE TABLE student_course(
id INT,
sid INT,
cid INT,
score INT,
UNIQUE KEY(sid,cid) -- 复合唯一，每个学生的每门课只能有一次成绩 
);
```

#### 删除唯一约束

- 添加唯一性约束的列上也会自动创建唯一索引。
- 删除唯一约束只能通过删除唯一索引的方式删除。
- 删除时需要指定唯一索引名，唯一索引名就和唯一约束名一样。
- 如果创建唯一约束时未指定名称，如果是单列，就默认和列名相同；如果是组合列，那么默认和()中排在第一个的列名相同。也可以自定义唯一性约束名。

```
-- 查看都有哪些约束
SELECT * 
FROM information_schema.table_constraints 
WHERE table_name = '表名';

-- 根据查到的约束名来删除约束
ALTER TABLE 表名称
DROP INDEX 索引名;
```

```
ALTER TABLE test2
DROP INDEX uk_test2_email;
```

### PRIMARY KEY 约束

- 主键约束相当于唯一约束+非空约束的组合，主键约束列不允许重复，也不允许出现空值（举例：部门ID）

- 一个表最多只能有一个主键约束，建立主键约束可以在列级别创建，也可以在表级别上创建。

- 主键约束对应着表中的一列或者多列（复合主键）

- 如果是多列组合的复合主键约束，那么这些列都不允许为空值，并且组合的值不允许重复。

- MySQL的主键名总是PRIMARY，就算自己命名了主键约束名也没用。

- 当创建主键约束时，系统默认会在所在的列或列组合上建立对应的主键索引（能够根据主键查询的，就根据主键查询，效率更高）。如果删除主键约束了，主键约束对应的索引就自动删除了。

- 需要注意的一点是，不要修改主键字段的值。因为主键是数据记录的唯一标识，如果修改了主键的值，就有可能会破坏数据的完整性。

#### 添加主键约束

```
create table 表名称(
字段名 数据类型 primary key, -- 列级模式
字段名 数据类型,
字段名 数据类型
);

create table 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型,
[constraint 约束名] primary key(字段名) -- 表级模式
);
```

```
ALTER TABLE 表名称 
ADD PRIMARY KEY(字段列表); 
```

#### 复合主键

```
create table 表名称(
字段名 数据类型,
字段名 数据类型,
字段名 数据类型,
primary key(字段名1,字段名2) -- 表示字段1和字段2的组合是唯一的，也可以有更多个字段
);
```

删除主键约束，不需要指定主键名，因为一个表只有一个主键，删除主键约束后，非空约束还存在。

### 自增列 AUTO_INCREMENT

#### 创建

- 一个表最多只能有一个自增长列

- 当需要产生唯一标识或顺序符时，可设置自增长

- 自增长列约束的列必须是键列(主键列，唯一键列 )

自增约束的列的数据类型必须是整数类型

- 如果自增列指定了0和NULL，会在当前最大值的基础上自增
- 如果自增列手动指定了具体值，直接赋值为具体值

```
CREATE TABLE 表名称(
字段名 数据类型 PRIMARY KEY AUTO_INCREMENT,
字段名 数据类型 UNIQUE KEY NOT NULL,
字段名 数据类型 UNIQUE KEY,
字段名 数据类型 NOT NULL DEFAULT 默认值,
);

CREATE TABLE 表名称(
字段名 数据类型 DEFAULT 默认值 ,
字段名 数据类型 UNIQUE KEY AUTO_INCREMENT,
字段名 数据类型 NOT NULL DEFAULT 默认值,,
PRIMARY KEY(字段名)
);
```

```
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 AUTO_INCREMENT;
```

#### 删除自增约束

```
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 AUTO_INCREMENT;-- 给这个字段增加自增约束

ALTER TABLE 表名称 
MODIFY 字段名 数据类型; -- 去掉AUTO_INCREMENT相当于删除
```

### FOREIGN KEY 约束

#### 初识

- 主表（父表）：被引用的表，被参考的表

- 从表（子表）：引用别人的表，参考别人的表

- 例如：员工表的员工所在部门这个字段的值要参考部门表：部门表是主表，员工表是从表。

- 例如：学生表、课程表、选课表：选课表的学生和课程要分别参考学生表和课程表，学生表和课程表是主表，选课表是从表。

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">特点</summary>

- 从表的外键列，必须引用/参考主表的主键或唯一约束的列，因为被依赖/被参考的值必须是唯一的
- 在创建外键约束时，如果不给外键约束命名，默认名不是列名，而是自动产生一个外键名，但我们也可以指定外键约束名
- 创建(CREATE)表时就指定外键约束的话，先创建主表，再创建从表（因为从表必须参考主表的主键或唯一约束列，详情见第一条）
- 删表时，先删从表（或先删除外键约束），再删除主表（理由基本同上）
- 当主表的记录被从表参照时，主表的记录将不允许删除，如果要删除数据，需要先删除从表中依赖该记录的数据，然后才可以删除主表的数据（但也不绝对，下面有提及到可以直接删除主表数据的情况）
- 在从表中指定外键约束，并且一个表可以建立多个外键约束
- 从表的外键列与主表被参照的列名字可以不相同，但是数据类型必须一样，逻辑意义一致。
- 当创建外键约束时，系统默认会在所在的列上建立对应的普通索引。但是索引名是外键的约束名。（根据外键查询效率很高）
- 删除外键约束后，必须手动删除对应的索引

</details>

#### 添加外键约束

```
-- 先创建主表
CREATE TABLE 主表名称(
字段1 数据类型 PRIMARY KEY,
字段2 数据类型
);

-- 再创建从表
CREATE TABLE 从表名称(
字段1 数据类型 PRIMARY KEY,
字段2 数据类型,
-- 引用主表的主键或唯一约束列
[CONSTRAINT <外键约束名称>] 
FOREIGN KEY（从表的某个字段) 
REFERENCES 主表名(被参考字段)
);
```

```
ALTER TABLE 从表名 
ADD [CONSTRAINT 约束名] 
FOREIGN KEY (从表的字段) 
REFERENCES 主表名(被引用字段) 
[ON UPDATE xx][ON DELETE xx];
添加外键
alter table emp add constraint fk_emp_dept_id foreign key (dept_id) references dept(id);
aLter table emp drop foreign key fk_emp_dept_id;
```

#### 演示问题

```
CREATE TABLE dept(
did INT , #部门编号
dname VARCHAR(50) #部门名称
);

CREATE TABLE emp(
eid INT PRIMARY KEY, #员工编号
ename VARCHAR(5), #员工姓名
deptid INT, #员工所在的部门
FOREIGN KEY (deptid) REFERENCES dept(did)
);
//被引用的字段不是主键，也没有唯一约束，故添加失败
```

```
CREATE TABLE dept(
did INT PRIMARY KEY, #部门编号
dname VARCHAR(50) #部门名称
);

CREATE TABLE emp(
eid INT PRIMARY KEY, #员工编号
ename VARCHAR(5), #员工姓名
deptid CHAR, #员工所在的部门
FOREIGN KEY (deptid) REFERENCES dept(did)
);
//从表的外键列与主表被参照的列名字可以不相同，但是数据类型必须一样，逻辑意义一致。

//deptid为CHAR类型，did为INT类型，数据类型不一致
```

- 在从表上建立外键，要求主表必须存在
- 删除主表时，要求从表从表先删除，或将从表中外键引用该主表的关系先删除

#### 删除外键约束

```
-- 1. 查看约束名和删除外键约束
SELECT * 
FROM information_schema.table_constraints -- 查看某个表的约束名
WHERE table_name = '表名称';

ALTER TABLE 从表名 
DROP FOREIGN KEY 外键约束名;

-- 2. 查看索引名和删除索引
SHOW INDEX FROM 表名称; -- 查看某个表的索引名
ALTER TABLE 从表名 DROP INDEX 索引名;
```

### 约束等级

- Cascade方式 ：在父表上update/delete记录时，同步update/delete掉子表的匹配记录
- Set null方式 ：在父表上update/delete记录时，将子表上匹配记录的列设为null，但是要注意子表的外键列不能为not null
- No action方式 ：如果子表中有匹配的记录，则不允许对父表对应候选键进行update/delete操作
- Restrict方式 ：同No action， 都是立即检查外键约束
- Set default方式 ：（在可视化工具SQLyog中可能显示空白）：父表有变更时，子表将外键列设置成一个默认的值，但Innodb不能识别
- 如果没有指定等级，就相当于Restrict方式。所以默认情况下，我们不能直接对主表中的数据进行更新和删除操作
- 对于外键约束，最好是采用: ON UPDATE CASCADE ON DELETE RESTRICT 的方式。(对主表中的数据更新时，同时更新从表中的数据，对主表中的数据删除时，将从表对应数据的列设为NULL)

### DEFAULT 约束

给某个字段/某列指定默认值，一旦设置默认值，在插入数据时，如果此字段没有显式赋值，则赋值为默认值。

#### 给字段加默认值

```
-- 说明：默认值约束一般不在唯一键和主键列上加
CREATE TABLE 表名称(
字段名 数据类型 PRIMARY KEY,
字段名 数据类型 UNIQUE KEY NOT NULL,
字段名 数据类型 UNIQUE KEY,
字段名 数据类型 NOT NULL DEFAULT 默认值,
);

CREATE TABLE 表名称(
再举例：
字段名 数据类型 DEFAULT 默认值 ,
字段名 数据类型 NOT NULL DEFAULT 默认值,
字段名 数据类型 NOT NULL DEFAULT 默认值,
PRIMARY KEY(字段名),
UNIQUE KEY(字段名)
);
```

```
-- 如果这个字段原来有非空约束，你还想保留非空约束，那么在加默认值约束时，也得保留非空约束，否则非空约束就被删除了
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 DEFAULT 默认值;  -- 没加NOT NULL，非空约束就没了

-- 同理，在给某个字段加非空约束也一样，如果这个字段原来有默认值约束，你想保留，也要在modify语句中保留默认值约束，否则就删除了
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 DEFAULT 默认值 NOT NULL; -- 如果想保留非空约束，后面记得加上
```

#### 删除约束

```
-- 删除默认值约束，也不保留非空约束
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 ;

-- 删除默认值约束，保留非空约束
ALTER TABLE 表名称 
MODIFY 字段名 数据类型 NOT NULL; 
```

<details>
<summary style="cursor:pointer; font-weight:bold; color:var(--primary);">问题</summary>

为什么建表时，加 not null default 或 default 0
不想让表中出现null值。
为什么不想要 null 的值
不好比较。null是一种特殊值，比较时只能用专门的is null 和 is not null来比较。碰到运算符，通常返回null。
效率不高。影响提高索引效果。因此，我们往往在建表时 not null default ‘’ 或 default 0
带AUTO_INCREMENT约束的字段值是从1开始的吗？
在MySQL中，默认AUTO_INCREMENT的初始值是1，每新增一条记录，字段值自动加1。设置自增属性（AUTO_INCREMENT）的时候，还可以指定第一条插入记录的自增字段的值，这样新插入的记录的自增字段值从初始值开始递增，如在表中插入第一条记录，同时指定id值为5，则以后插入的记录的id值就会从6开始往上增加。添加主键约束时，往往需要设置字段自动增加属性。
并不是每个表都可以任意选择存储引擎？
外键约束（FOREIGN KEY）不能跨引擎使用。
MySQL支持多种存储引擎，每一个表都可以指定一个不同的存储引擎，

需要注意的是：外键约束是用来保证数据的参照完整性的，如果表之间需要关联外键，却指定了不同的存储引擎，那么这些表之间是不能创建外键约束的。所以说，存储引擎的选择也不完全是随意的。

</details>

## 多表查询

连接查询
内连接：相当于查询A、B交集部分数据
外连接：
左外连接：查询左表所有数据，以及两张表交集部分数据
右外连接：查询右表所有数据，以及两张表交集部分数据
自连接：当前表与自身的连接查询，自连接必须使用表别名

### 内连接

```
内连接演示
1，查询每一个员工的姓名，及关联的部门的名称（隐式内连接实现）表结构：emp，dept
连接条件：emp.dept_id=dept.id
select emp.name , dept.name from emp , dept where emp.dept_id = dept.id
select e.name,d.name from emp e , dept d where e.dept_id = d.id;
2，查询每一个员工的姓名，及关联的部门的名称（显式内连接实现）表结构：emp，dept
INNER JOIN...ON
连接条件：emp.dept_id=dept.id
select e.name, d.name from emp e inner join dept d on e.dept_id =d.id;
select e.name, d.name from emp e join dept d on e.dept_id=d.id;
```

### 外连接

```
1.查询emp表的所有数据，和对应的部门信息（左外连接)表结构：emp，dept
连接条件：emp.dept_id=dept.id
select e.*, d.name from emp e left outer join dept d on e.dept_id = d.id;
select e.*, d.name from emp e left join dept d on e.dept_id = d.id;
2.查询dept表的所有数据，和对应的员工信息(右外连接)
select d.*, e.* from emp e right outer join dept d on e.dept_id = d.id;
select d.*, e.* from dept d Left outer join emp e on e.dept_id = d.id;
```

## 事务

**事务**是一组操作的集合，它是一个不可分割的工作单位，事务会把所有的操作作为一个整体一起向系统提交或撤销操作请求，即这些操作**要么同时成功，要么同时失败** 默认MySQL的事务是自动提交的，也就是说，当执行一条DML语句，MySQL会自动隐式的提交事务。

### 示例

- 查看/设置事务提交方式

```
SELECT @@autocommit;
SET @@autocommit = 0;

开启事务
START TRANSACTION 或 BEGIN;


```

- 提交事务

  ```
  COMMIT;
  
  ```

  

- 回滚事务

  ```
  ROLLBACK;
  
  ```

  
