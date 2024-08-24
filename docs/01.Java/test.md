---
title: test
date: 2024-08-24 11:27:24
permalink: /pages/22f765/
categories:
  - Java
tags:
  - JavaSE
---

## 1. Dubbo概述

> 官网地址：https://cn.dubbo.apache.org/zh-cn/

![image-20240622223431585](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222234718.png)

Apache Dubbo 是一款高性能的轻量级的Java RPC框架，可以和Spring框架无缝集成。

本地调用：本机调用，指同个JVM内部的方法调用，例如三层架构之间的方法调用。

***RPC：**远程过程调用 ，相对于本地调用而言的另外一种调用方式。它并不是某一种具体的技术实现，而是泛指一切远程调用的技术。指跨进程、跨服务器的程序调用。*

**RPC分类：**

- 同步调用：调用之后必须得到结果才会继续处理其它事情，比较严谨但是效率低。
- 异步调用：调用之后可以做任何事情而不会死等结果，效率更高但是不严谨。

实现RPC技术的框架：比如Dubbo、Feign、RestTemplate...

<br>

**Dubb的三大核心能力:**

- **面向接口的远程调用：被调用的类必须要有接口。**
- 智能容错和负载均衡
- 服务自动注册和发现

<br>

**Dubbo的发展史：**

- 2012年，由淘宝团队开源的一款产品，受到了市场的欢迎，很多互联网公司都在使用了，淘宝团队发现吃力不讨好，就不再升级维护了....所以就由当当牵头搞了dubbox，继续进行维护...
- 2015年，Spring家族推出了SpringCloud微服务架构（对netflix公司提供的一套产品再封装）
- 2018年，阿里重拾Dubbo框架，并捐献给了Apache基金会，成为了顶级项目。（性能很强）
- 2019年，阿里推出一套整合SpringCloud微服务架构的产品（SpringCloud Alibaba）
- ...

<br>

**Dubbo的架构：**

![image-20240622225912787](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222259186.png)

```
Dubbo的架构角色：
    Registry：注册中心，服务治理中心
    Provider：服务提供者，提供服务的一方（被访问的）
    Consumer：服务消费者，使用服务的一方
    Monitor：监控中心，非必须的，用于统计调用的次数
```

```java
Dubbo的启动运行过程：
	1. 先启动注册中心Registry
	2. 再启动服务提供者Provider：
   		Provider启动时，dubbo框架会自动把服务的远程访问地址，上报给Registry
	3. 然后启动服务消费者Consumer：
  		 Consumer启动时，dubbo框架会自动去Registry里订阅一些服务
  		 Registry会把服务的地址推送给订阅者	
	4. Consumer根据地址，进行远程调用
```

```
集群和分布式的概念：
   1.集群：把一个系统部署多分
   	作用：提高系统的可用性，提高系统的并发量
   2.分布式： 把一个系统拆成多个子系统，每个子系统提高不同的功能		
    作用：降低系统的耦合性
```

<br>

## 2. Dubbo准备工作

在使用dubbo框架之前，有一些必要的准备工作：

* 安装启动zookeeper
* 安装启动dubbo管理控制台（zookeeper的可视化管理界面，非必须，仅仅是方便查看zk里的服务信息）

### 2.1 启动zookeeper注册中心

---

> Dubbo官方推荐使用 zookeeper 作为注册中心。注册中心负责服务地址的注册与查找，相当于目录服务，服务提供者和消费者只在启动时与注册中心交互，注册中心不转发请求，压力较小。
>
> Zookeeper 是 Apacahe Hadoop 的子项目，是一个树型的目录服务，支持变更推送，适合作为Dubbox 服务的注册中心，工业强度较高，可用于生产环境。
>
> 注意：zookeeper默认端口2181。可能也会占用8080。

> 环境要求：要求JDK版本1.8；需要配置好JDK环境变量。

1、下载zk：https://archive.apache.org/dist/zookeeper/zookeeper-3.5.8/apache-zookeeper-3.5.8-bin.tar.gz

2、把zookeeper安装包，解压到一个不含中文、空格、特殊字符的目录里。

![image-20240622232921850](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222329917.png)

3、在zookeeper文件夹里新建个data文件夹。

![image-20240622232948690](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222329772.png)

4、在conf文件夹里，复制`zoo_sample.cfg`文件并重命名为`zoo.cfg`。

![image-20240622233150914](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222331970.png)

修改zoo.cfg配置，将dataDir设置为data文件夹的路径：

![image-20240622233443870](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222334982.png)

<br>

5、启动zookeeper服务：双击 `bin/zkServer.cmd`。

在zookeeper的`bin`目录下，有两个命令文件：

1. `zkServer.cmd`：用于启动zk服务
2. `zkCli.cmd`：用于启动zk客户端，会自动连接到本机的zk服务。然后通过命令操作zk里的数据

![image-20240622233635585](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222336680.png)

![image-20240623062145042](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230621133.png)

<br>

### 2.2 启动dubbo-admin 管理控制台（非必须）

1、使用前需要下载项目然后打jar包，我们这里提供好了： https://www.alipan.com/s/N163HYbMTuG

2、双击dubboAdmin.cmd文件启动管理后台

![image-20240622235749263](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222357323.png)

![image-20240622235841597](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406222358798.png)

启动失败，比如端口冲突，可以通过log文件排查问题。

3、访问dubbo管理控制台：http://localhost:7001/，账号/密码:root

![image-20240623000138799](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230001978.png)



## 3. Dubbo入门（Spring方式）

> 需求：浏览器发请求到Controller，Controlleri通过dubbo远程调用service。查询id为1的用户。

dubbo入门项目架构：

![image-20240623071828900](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230718059.png)

<br>

### 3.1 准备数据

执行sql脚本：

```sql
CREATE DATABASE dubbo_db;
USE dubbo_db;

CREATE TABLE `t_user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) DEFAULT NULL,
  `age` INT(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO t_user (username, age) VALUES ('张三', 30);
INSERT INTO t_user (username, age) VALUES ('李四', 40);
INSERT INTO t_user (username, age) VALUES ('王五', 50);
```

<br>

### 3.2 创建Maven父工程

> 或者直接拉取我代码也可以：https://gitee.com/aopmin/dubbo-demo1-spring.git

* 创建时不选择骨架构建
* 创建好以后，删除多余的src目录
* 然后在`pom.xml`中设置打包方式为pom，并锁定依赖如下：

```xml
<packaging>pom</packaging>

<properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <spring.version>5.0.5.RELEASE</spring.version>
    <dubbo.version>2.6.2</dubbo.version>
    <zookeeper.version>3.4.7</zookeeper.version>
    <curator.verion>4.0.1</curator.verion>
    <mybatis.version>3.4.5</mybatis.version>
    <mysql.version>5.1.47</mysql.version>
    <mybatis-spring.version>1.3.2</mybatis-spring.version>
    <druid.version>1.1.9</druid.version>
    <log.version>1.2.17</log.version>
    <slf4j.version>1.7.25</slf4j.version>
</properties>
<dependencyManagement>
    <dependencies>
        <!--SpringMVC-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <!--dubbo+zk-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>dubbo</artifactId>
            <version>${dubbo.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>${zookeeper.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-framework</artifactId>
            <version>${curator.verion}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-recipes</artifactId>
            <version>${curator.verion}</version>
        </dependency>

        <!--持久层-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>${mybatis-spring.version}</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>

        <!--日志-->
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>${log.version}</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

<br>

###  3.3 创建公用实体类模块

![](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230729075.png)

* 创建Module时，不选择骨架构建
* 创建好以后在pom.xml中暂不需要添加依赖
* 创建JavaBean：`User`类，注意：<font color="red">实体类要实现序列化接口</font>

```java
package cn.aopmin.domain;

import java.io.Serializable;
// 实体类要实现序列化接口 不然远程调用会报错 
public class User implements Serializable {
    private Integer id;
    private String username;
    private Integer age;

    //get/set...
}
```

<br>

### 3.4 创建公用接口模块

![image-20240623073647611](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230736732.png)

* 创建Module时，不选择骨架构建
* 创建好，修改pom.xml，添加依赖

```xml
<dependencies>
    <!-- 依赖于dubbo-domain -->
    <dependency>
        <groupId>cn.aopmin</groupId>
        <artifactId>dubbo1-domain</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

- 创建Service层接口

```java
package cn.aopmin.service;

import cn.aopmin.domain.User;

public interface UserService {
    User findById(Integer id);
}
```

<br>

### 3.5 创建服务提供者

这个模块是服务提供者，需要在容器启动时，把服务注册到zk，所以要引入spring-webmvc 和 zookeeper,以及客户端的依赖。

<img src="https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230748055.png" alt="image-20240623074806944" style="zoom:50%;" />

步骤如下：

1、准备工作：创建Module，不选择骨架，然后修改pom.xml，添加依赖

```xml
<!--不配置打包方式默认就是jar-->

<dependencies>
    <!--依赖于dubbo-interface-->
    <dependency>
        <groupId>cn.aopmin</groupId>
        <artifactId>dubbo1-interface</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.9.5</version>
    </dependency>

    <!--持久层的依赖-->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
    </dependency>
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
    </dependency>

    <!--dubbo和zk-->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>dubbo</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.zookeeper</groupId>
        <artifactId>zookeeper</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-framework</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-recipes</artifactId>
    </dependency>
</dependencies>
```

2、创建映射器UserDao接口，并创建映射配置文件，配置好findById功能

```java
package cn.aopmin.mapper;

import cn.aopmin.domain.User;
import org.apache.ibatis.annotations.Select;

/**
 * @author aopmin
 * @date 2024/06/23
 */
public interface UserMapper {
    @Select("select * from t_user where id = #{id}")
    User findById(Integer id);
}
```

3、创建UserServiceImpl类，实现UserService接口，使用dubbo的注解`@Service`注册到zk里

```java
package cn.aopmin.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import cn.aopmin.domain.User;
import cn.aopmin.mapper.UserMapper;
import cn.aopmin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * 注意：Service层的注解，使用dubbo框架的@Service，而不是Spring的@Service
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User findById(Integer id) {
        System.out.println("========20880============");
        return userMapper.findById(id);
    }
}
```

4、创建配置文件：

* `spring-dao.xml`，主要配置dao层Spring和Mybatis的整合

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--1.配置数据源-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <!--设置bean的属性-->
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql:///dubbo_db?useSSL=false"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

    <!--2.扫描映射器-->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="cn.aopmin.mapper"/>
    </bean>

    <!--3.SqlSessionFactoryBean-->
    <bean class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 注入数据源,ref表示引用id为dataSource的bean(引用类型)-->
        <property name="dataSource" ref="dataSource"/>
        <!--类型别名-->
        <property name="typeAliasesPackage" value="cn.aopmin.domain"/>
    </bean>
</beans>
```

* `spring-service.xml`，主要配置组件扫描和事务管理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <!--开启组件扫描,它只扫描spring的注解-->
    <context:component-scan base-package="cn.aopmin"/>
</beans>
```

* `spring-provider.xml`，spring整合dubbo的配置文件，需要配置dubbo，把服务暴露出去

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://dubbo.apache.org/schema/dubbo http://dubbo.apache.org/schema/dubbo/dubbo.xsd">

    <!--配置应用名称：不能重复-->
    <dubbo:application name="dubbo1-provider"/>

    <!--配置注册中心的地址：注册中心是zk-->
    <dubbo:registry address="zookeeper://localhost:2181"/>

    <!--配置注解扫描：扫描到一个dubbo的@Service注解，就把这个注解对应的服务暴露出去-->
    <dubbo:annotation package="cn.aopmin.service"/>
</beans>
```

* `log4j.properties`，日志配置文件

```properties
# Set root category priority to INFO and its only appender to CONSOLE.
#log4j.rootCategory=INFO, CONSOLE            debug   info   warn error fatal
log4j.rootCategory=info, CONSOLE

# Set the enterprise logger category to FATAL and its only appender to CONSOLE.
log4j.logger.org.apache.axis.enterprise=FATAL, CONSOLE

# CONSOLE is set to be a ConsoleAppender using a PatternLayout.
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} %-6r [%15.15t] %-5p %30.30c %x - %m\n
```

5、启动服务提供者

启动服务提供者常用有两种方式：

* 一：把提供者修改成war，然后部署到Tomcat，启动Tomcat后，IoC容器会始终存在，可以提供服务
* 二：通过main方法直接创建IoC容器，加载所有配置文件。但需要保持容器不关闭、不销毁

我们这里采用第二种方式：创建主类并运行起来

```java
package cn.aopmin;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import java.io.IOException;

public class ProviderApp {
    public static void main(String[] args) throws IOException {\
        //创建容器
        new ClassPathXmlApplicationContext("classpath:spring-*.xml");
        
        //保证容器不关闭：只要这个main方法不结束即可。可以把方法阻塞、也可以搞一个死循环
        //这个方法没有任何实际用处，仅仅是因为它是一个阻塞方法：如果在控制台不输出内容，方法就阻塞了->方法不会结束->容器会一直存在
        System.in.read();<---
    }
}
```

服务启动成功后，会把地址信息上报给注册中心：

> 注册中心：用于解决服务治理问题，因为微服务的地址可能是动态变化的，导致远程调用时获取地址不方便调用。

![image-20240623080555288](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230805403.png)

![image-20240623080607238](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406230806409.png)

<br>

### 3.6 创建服务消费者

![image-20240623111202558](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231112629.png)

此模块是服务消费者模块，是Web应用，需要引入spring-webmvc，并且在容器启动时，要去zookeeper注册中心订阅服务，需要引入zookeeper及客户端依赖。

步骤如下：

1、准备工作：创建Module，不选择骨架，修改`pom.xml`，设置打包方式为war，并添加依赖

```xml
<!-- 打包方式为war -->
<packaging>war</packaging>

<dependencies>
    <!--依赖于dubbo-interface-->
    <dependency>
        <groupId>cn.aopmin</groupId>
        <artifactId>dubbo1-interface</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!--web层依赖-->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.9.0</version>
    </dependency>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>servlet-api</artifactId>
        <version>2.5</version>
        <scope>provided</scope>
    </dependency>

    <!--dubbo和zk-->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>dubbo</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.zookeeper</groupId>
        <artifactId>zookeeper</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-framework</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-recipes</artifactId>
    </dependency>
</dependencies>
```

2、创建UserController类，并添加注解:

```java
package cn.aopmin.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import cn.aopmin.domain.User;
import cn.aopmin.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/user")
public class UserController {

    /**
     * 注意：要使用dubbo框架的@Reference注解，而一定不能用Spring的@Autowired
     * 导入进来的是：com.alibaba.dubbo.config.annotation.Reference
     */
    @Reference
    private UserService userService;

    @GetMapping("/{id}")
    public User findById(@PathVariable("id") Integer id){
        return userService.findById(id);
    }
}
```

3、创建配置文件:

- `spring-consumer.xml`，配置dubbo，配置要订阅的服务

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
         xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://dubbo.apache.org/schema/dubbo http://dubbo.apache.org/schema/dubbo/dubbo.xsd">
  
       <!--设置应用名称-->
      <dubbo:application name="dubbo-consumer"/>
  
       <!--设置注册中心的地址-->
      <dubbo:registry address="zookeeper://localhost:2181"/>
  
      <!--设置扫描的包：主要是扫描dubbo的@Service和@Reference-->
      <dubbo:annotation package="cn.aopmin.controller"/>
  </beans>
  ```

- `log4j.properties`，日志配置文件

```properties
# Set root category priority to INFO and its only appender to CONSOLE.
#log4j.rootCategory=INFO, CONSOLE            debug   info   warn error fatal
log4j.rootCategory=info, CONSOLE

# Set the enterprise logger category to FATAL and its only appender to CONSOLE.
log4j.logger.org.apache.axis.enterprise=FATAL, CONSOLE

# CONSOLE is set to be a ConsoleAppender using a PatternLayout.
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} %-6r [%15.15t] %-5p %30.30c %x - %m\n
```

- `spring-web.xml`，主要开启组件扫描，开启mvc注解驱动

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <!--开启组件扫描-->
    <context:component-scan base-package="cn.aopmin.controller"/>

    <!--开启mvc注解驱动-->
    <mvc:annotation-driven/>

    <!--处理静态资源-->
    <mvc:default-servlet-handler/>
</beans>
```

4、补全目录`src\main\webapp`， 在webapp里创建`WEB-INF`，在WEB-INF里创建web.xml

- 修改web.xml，配置前端控制器和编码过滤器

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    <!--1.配置前端控制器-->
    <servlet>
        <servlet-name>dispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath*:spring-*.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>dispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!--2.配置编码过滤器:解决乱码问题-->
    <filter>
        <filter-name>encodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```



5、启动服务消费者

配置小猫：端口改成18080，访问路径改成`/`。

![image-20240623112216005](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231122208.png)

然后以debug方式启动消费者服务。

![image-20240623112913196](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231129415.png)

我们的消费者服务也注册成功了：

![image-20240623113211886](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231132991.png)

<br>

### 3.7 功能测试

测试接口：http://localhost:18080/user/1

![image-20240623113634365](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231136428.png)

<br>

> 总结：

服务提供者：

* Service类上加注解：`dubbo框架的@Service注解`
* spring-provider.xml：

```xml
<!-- 设置应用名称：要求不重复 -->
<dubbo:application name="dubbo1-provider"/>

<!-- 设置注册中心的地址：zk的地址 -->
<dubbo:registry address="zookeeper://localhost:2181"/>

<!-- 设置扫描的包：Spring会扫描dubbo的@Service注解，扫到一个，就把它的地址向注册中心上报一下 -->
<dubbo:annotation package="cn.aopmin.service"/>
```

服务消费者：

* Controller类里，要注入Service时，使用`dubbo的@Reference`
* spring-consumer.xml：

```xml
<!-- 设置应用名称：要求不重复 -->
<dubbo:application name="dubbo1-consumer"/>

<!-- 设置注册中心的地址：zk的地址 -->
<dubbo:registry address="zookeeper://localhost:2181"/>

<!-- 设置扫描的包：Spring会扫描dubbo的@Reference和@Service -->
<dubbo:annotation package="cn.aopmin.controller"/>
```

<br>

## 4. Dubbo运行原理

> 服务暴露和服务订阅的过程。

> dubbo是怎么运行的，为什么浏览器一访问，controller就可以远程调用这个service呢？

![04.dubbo原理和rpc调用过程](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231156484.png)

> dubbo一次RPC调用的过程：

**分为四个角色：**

- Client：消费者
- Client Stub：客户端存档，由框架实现
- Server Stub：服务端存档，由框架实现
- Server：提供者

<img src="https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231201895.png" alt="image-20240623120102809" style="zoom: 67%;" />·

**调用过程：**

1. Client发起远程调用

   Client发起远程调用，实际上是由它的代理ClientStub实现的

   ClientStub把要调用目标类、目标方法、实参等等进行序列化，然后通过网络传递给ServerStub。

   ServerStub接收数据反序列化，再调用对应的目标类、目标方法，得到执行结果

   ServerStub把目标方法的结果进行序列化，通过网络返回给ClientStub

   ClientStub接收数据反序列化，得到结果。把这个结果返回给Client

2. Client得到执行的结果

<br>

## 5. Dubbo配置详解

### 5.1 RPC协议和端口

配置示例：在服务提供者一方进行配置。

```xml
<!--  实际开发中，通常使用默认的dubbo协议
            name：协议名，写dubbo
            port：端口，只要不冲突即可-->
<dubbo:protocol name="dubbo" port="20880"/>
```

<br>

#### 5.1.1 rpc协议

rpc协议：一次RPC通信时，ClientStub和ServerStub双方必须遵循的一些格式、规范。

支持的协议有：dubbo、rmi、hessian、http。

> dubbo协议：

```
dubbo协议：协议的名称就叫dubbo，是dubbo框架提供的，dubbo协议是dubbo框架默认使用的rpc协议。
    底层实现：单一长连接和NIO非阻塞通讯,传输数据采用hessian序列化方式。
    协议特性：适合小数据量、高并发的请求
    注意事项：不适合传输文件。
        如果要实现文件上传功能，要在服务消费者一方就直接保存文件（不要再rpc传输到提供者再保存了，会多一次rpc传输数据）
```

> rmi协议：

```java
rmi协议：jdk提供的
    底层实现：采用阻塞式短连接
    协议特性：比较消耗CPU资源，不适合于高并发的请求。适合请求次数很少、每次可以传输很大的数据
    注意事项：适合传输文件
```

> hessian协议:

```java
hessian协议：
    采用阻塞式短连接,使用Servlet暴露服务；传输数据采用hessian序列化方式
    使用的很少
```

> http协议:

```java
采用http协议进行通讯，使用json序列化方式。
    
dubbo也可以用，但是需要额外的配置
    SpringCloud使用的是http作为rpc协议使用的：http协议数据冗余，传输的速度会慢一些。
```

```
实际开发中，通常使用默认的dubbo协议
    name：协议名，写dubbo
    port：端口，只要不冲突即可
    
```

<br>

### 5.2 启动检查

配置示例：

```xml
<!--消费者配置
	check：表示是否开启"启动时检查"功能 true表示开启 false表示关闭。
		true 开启启动检查 按照顺序启动,先启动提供者后启动消费者
        false 关闭检查 先启动哪个都行 只要最终服务都启动就好
-->
<dubbo:consumer check="false"/>
```

<br>

> 启动检查的作用:

check属性默认值是true，它表示：

* 当消费者启动时，立即检查依赖的服务提供者是否可用。
* 如果服务不可用，就抛出异常，这样的话Spring初始化就会失败，报错 “No Provider” 找不到服务提供者。

![image-20211119232122590](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231209972.png)

<br>

> 如何使用启动检查:

* 在系统上线时，设置为true，可以帮我们尽早发现问题、解决问题；

  如果设置为true，必须先启动服务提供者，再启动服务消费者。

* 在开发阶段时，建议设置为false，关闭检查

  如果设置为false，可以先启动提供者，也可以先启动消费者。只要最终都启动了就可以。

<br>

### 5.3 调用超时

配置示例：

```xml
<!--消费者配置
	timeout：一次rpc调用的超时时间，单位毫秒
            如果一次rpc调用超过这个时间了，就直接失败
            是服务容错的一种手段
                避免提供者不能及时响应、而造成资源的长时间占用
                如果不能及时响应，越早断开，越早释放资源
-->
<dubbo:consumer timeout="1000"/>
```

配置说明：

- Dubbo在通信时，由于网络或服务端不可靠，会导致调用过程中出现不确定的阻塞状态（超时） 。为了避免超时导致客户端线程挂起处于一致等待状态，最终导致服务雪崩，我们必须要有一定的服务容错措施。
- 设置超时时间就是服务容错的一种方式
- dubbo的服务超时时间默认为1000ms
- 可以在消费者一方，通过timeout属性来设置全局的超时时间，单位：毫秒；
- 也可以提供者一方，在ServiceImpl类上通过`@Service(timeout=3000)`来指定某一个服务的超时时间

<br>

### 5.4 失败重试

配置示例：

```xml
<!--消费者配置
	retries：当rpc调用失败后，dubbo重试的次数
            有重试机制，可以提高程序的可用性
            但是需要注意：如果是一次插入功能，可能会重复插入
                第一次rpc调用：服务提供者插入保存成功了，但是因为某些原因，不能及时返回结果；
                第一次超时之后，dubbo会以为本次rpc调用失败，会尝试第二次rpc
                最终可能导致重复插入

             实际开发的时候，通常要开启重试机制，并且 需要开发人员保证 方法多次被调用，也不会重复插入、从而造成错误后果==>幂等性
-->
<dubbo:consumer retries="3"/>
```

配置说明：

- 失败重试，其实也是服务容错的一种措施：当远程调用失败时进行重试；

- Dubbo在通信时，客户端调用失败的话会自动切换并重试其它服务器，dubbo重试的默认值是2次，我们可以自行设置重试次数。注意：消费者第一次初始化连接不算重试次数。

![image-20211119232524515](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231209974.png)

但是有时候，失败重试也会造成一些问题，例如：新增操作时调用失败重试，最终可能新增两条数据。

dubbo允许我们通过配置修改重试次数：设置为0表示只调用一次 即不再重试。

<br>

### 5.5 负载均衡

#### 5.1  什么是负载均衡

负载均衡（Load Balance）：其实就是将请求分摊到多个系统上进行执行，从而共同完成工作任务。我们可以有多个服务提供者共同组建一个集群来提供服务，这样的话，消费者多次调用时，会调用到哪个服务提供者呢？这就是负载均衡要解决的问题。

<br>

#### 5.2 Dubbo的负载均衡策略

Dubbo 提供了多种均衡策略：

* `random`，随机策略，是默认值
* `roundrobin`，轮询策略
* `leastactive`，最少活跃调用数策略
* `consistenthash`，一致性Hash策略，相同参数的请求，调用同一个服务。

<br>

#### 5.3 如何配置负载均衡策略

* 可以在服务提供者一方，使用`@Service(loadbalance="负载均衡方案")`配置
* 也可以在服务消费者一方，使用`@Reference(loadbalance="负载均衡方案")`配置

<br>

#### 5.4 示例代码

下面以消费者一方配置负载均衡为例，做负载均衡效果的演示。

我们再创建一个服务提供者`dubbo-provider2`，里边的配置和`dubbo-provider`几乎完全相同，只要修改使用的rpc协议和端口，保证不冲突。

**(1)  准备服务提供者集群**

1. 创建maven模块：`dubbo-provider2`
2. 修改`dubbo-provider2`的pom.xml，从`dubbo-provider`里把依赖拷贝过来
3. 从`dubbo-provider`里把`src`文件夹拷贝过来，粘贴到`dubbo-provider2`里
4. 修改`dubbo-provider2`里的`spring-provider.xml`，设置rpc的协议为`dubbo`、端口`20881`

![image-20240623132703046](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231327262.png)

![image-20240623131224642](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231312900.png)

5. 运行`dubbo-provider2`里的`DubboProviderMain2`，启动服务提供者2

![image-20240623131332396](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231313554.png)

6. 为了能够区别到底哪个提供者的服务被调用到了，我们分别修改`dubbo-provider`和`dubbo-provider2`里的`UserServiceImpl`如下：

![image-20240623131519425](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231315596.png)

**(2)  配置负载均衡方案**

在消费者一方设置负载均衡方案，然后重启消费者服务：`dubbo-consumer`

![image-20240623131752199](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231317335.png)

![image-20240623132312522](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231323967.png)

<br>

**（3）测试效果**

客户端浏览器多次访问`http://localhost/user/1`，可以从idea控制台上看到`dubbo-provider`和`dubbo-provider2`被轮流访问了。

![image-20240623132331912](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231323986.png)

![image-20240623132339525](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231323602.png)

> 总结：

dubbo的使用：

* 准备工作：必须要启动zookeeper

* 项目代码：

    * 服务提供者：

      一个注解：dubbo的@Service

      一个配置文件：

      ```xml
      <!--设置应用名称：向zk里注册时，会把这个应用名称也上报上去。这个名称和其它应用名称不重复即可-->
      <dubbo:application name="dubbo1-provider"/>
      
      <!--设置注册中心的地址：要设置zk的地址。写法：zookeeper://ip:端口 -->
      <dubbo:registry address="zookeeper://localhost:2181"/>
      
      <!--扫描组件：主要是扫描dubbo的@Service注解-->
      <dubbo:annotation package="cn.aopmin.service"/>
      
      <!-- 配置rpc协议和端口：非必须，可以不配置。不配置的话就取默认的dubbo协议、20880端口-->
      <dubbo:protocol name="dubbo" port="20880"/>
      ```

    * 服务消费者：

      一个注解：dubbo的@Reference，可以设置负载均衡策略，默认就轮询。

      一个配置文件：

      ```xml
      <!--设置应用名称-->
      <dubbo:application name="dubbo1-consumer"/>
      
      <!--设置注册中心的地址-->
      <dubbo:registry address="zookeeper://localhost:2181"/>
      
      <!--设置扫描的包：主要是扫描dubbo的@Service和@Reference-->
      <dubbo:annotation package="cn.aopmin.controller"/>
      
      <!--
          消费者的配置：非必须。如果不配置，全部都有默认值（默认值不可靠）
              check：是否开启“启动时检查”功能
                 实际使用时：开启环境设置为false，生产环境设置为true
      
              retries：当rpc调用失败后，dubbo重试的次数
                  重试机制，可以提高程序的可用性
              timeout：一次rpc调用的超时时间，单位毫秒
                  如果一次rpc调用超过这个时间了，就直接失败
          -->
      <dubbo:consumer check="true" retries="0" timeout="3000"/>
      ```



<br>

## 6. SpringBoot整合Dubbo

1、创建父工程`dubbo-demo2-springboot`：打包方式pom，引入SpringBoot父工程坐标，锁定依赖版本，删除src目录。

```xml
<packaging>pom</packaging>

<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.1.3.RELEASE</version>
</parent>

<dependencyManagement>
    <dependencies>
        <!-- SpringBoot基础依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <!--dubbo的起步依赖-->
        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-spring-boot-starter</artifactId>
            <version>2.7.5</version>
        </dependency>

        <!-- zookeeper的api管理依赖 -->
        <dependency>
            <groupId>org.apache.curator</groupId>
            <artifactId>curator-recipes</artifactId>
            <version>4.2.0</version>
        </dependency>

        <!-- zookeeper依赖 -->
        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.4.12</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

2、创建公共子模块`dubbo2-domain`

- 创建实体类User，注意：实体类要实现Serializable接口

  ```java
  package cn.aopmin.domain;
  
  import java.io.Serializable;
  
  public class User implements Serializable {
  
      private Integer id;
      private String username;
      private Integer age;
  
      public Integer getId() {
          return id;
      }
  
      public void setId(Integer id) {
          this.id = id;
      }
  
      public String getUsername() {
          return username;
      }
  
      public void setUsername(String username) {
          this.username = username;
      }
  
      public Integer getAge() {
          return age;
      }
  
      public void setAge(Integer age) {
          this.age = age;
      }
  }
  ```

<br>

3、创建公共接口模块`dubbo2-interface`

- 引入公共实体类模块

```xml
<dependencies>
    <dependency>
        <groupId>cn.aopmin</groupId>
        <artifactId>dubbo2-domain</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

- 创建公共接口UserService，接口里定义方法`findById`

```java
package cn.aopmin.service;

import cn.aopmin.domain.User;

/**
 * @author aopmin
 * @date 2024/06/23
 */
public interface UserService {
    User findById(Integer id);
}

```

<br>

4、创建服务提供者`dubbo2-provider`

- 添加依赖：

```xml
<dependencies>
    <!-- 引入dubbo2-interface -->
    <dependency>
        <groupId>cn.aopmin</groupId>
        <artifactId>dubbo2-interface</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!--MybatisPlus起步依赖-->
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
        <version>3.2.0</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.49</version>
    </dependency>

    <!--dubbo起步依赖-->
    <dependency>
        <groupId>org.apache.dubbo</groupId>
        <artifactId>dubbo-spring-boot-starter</artifactId>
    </dependency>
    <!-- zookeeper的api管理依赖 -->
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-recipes</artifactId>
    </dependency>
    <!-- zookeeper依赖 -->
    <dependency>
        <groupId>org.apache.zookeeper</groupId>
        <artifactId>zookeeper</artifactId>
    </dependency>
</dependencies>
```

- 配置application.yml:

```yml
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql:///dubbo_db?useSSL=false
    username: root
    password: 123456
mybatis-plus:
  global-config:
    db-config:
      table-prefix: t_  #全局的表名称前缀。要求这个前缀+实体类名 要和 表名相同
      id-type: auto #主键策略，使用数据库自增
#dubbo服务提供者的配置：应用名称、注册中心地址、扫描的包；  可选配置：rpc协议和版本
dubbo:
  application:
    name: dubbo2-provider #应用名称，要求不重复
  registry:
    address: zookeeper://localhost:2181 #注册中心地址
  scan:
    base-packages: cn.aopmin.service #扫描的包
  protocol:
    name: dubbo  #rpc协议
    port: 20880  #rpc端口
```

- 创建mapper接口

```java
package cn.aopmin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import cn.aopmin.domain.User;

/**
 * @author aopmin
 * @date 2024/06/23
 */
public interface UserMapper extends BaseMapper<User> {
}

```

- 创建接口实现UserServiceImpl，把服务注册到注册中心

```java
package cn.aopmin.service.impl;

import cn.aopmin.service.UserService;
import cn.aopmin.domain.User;
import cn.aopmin.mapper.UserMapper;
import org.apache.dubbo.config.annotation.Service;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author aopmin
 * @date 2024/06/23
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User findById(Integer id) {
        return userMapper.selectById(id);
    }
}
```

- 创建引导类

```java
package cn.aopmin;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author aopmin
 * @date 2024/06/23
 */
@SpringBootApplication
@MapperScan("cn.aopmin.mapper")
public class ProviderApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProviderApplication.class, args);
    }
}
```

<br>

5、创建服务消费者`dubbo2-consumer`

- 添加依赖

```xml
<dependencies>
    <dependency>
        <groupId>cn.aopmin</groupId>
        <artifactId>dubbo2-interface</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!--web起步依赖-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!--dubbo起步依赖-->
    <dependency>
        <groupId>org.apache.dubbo</groupId>
        <artifactId>dubbo-spring-boot-starter</artifactId>
    </dependency>
    <!-- zookeeper的api管理依赖 -->
    <dependency>
        <groupId>org.apache.curator</groupId>
        <artifactId>curator-recipes</artifactId>
    </dependency>
    <!-- zookeeper依赖 -->
    <dependency>
        <groupId>org.apache.zookeeper</groupId>
        <artifactId>zookeeper</artifactId>
    </dependency>
</dependencies>
```

- 修改配置

```yml
server:
  port: 80
  servlet:
    context-path: /
#dubbo的消费者配置：应用名称、注册中心地址、扫描的包； 可选配置：启动时检查、超时时间、重试次数
dubbo:
  application:
    name: dubbo2-consumer #应用名称
  registry:
    address: zookeeper://localhost:2181 #注册中心地址
  scan:
    base-packages: cn.aopmin.controller #扫描的包
  consumer:
    check: false #启动时检查
    timeout: 3000 #rpc调用的超时时间
    retries: 0 #调用失败后的生效次数
```

- 编写引导类

```java
package cn.aopmin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author aopmin
 * @date 2024/06/23
 */
@SpringBootApplication
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }
}
```

- 创建UserController，远程调用UserService，根据id查询用户

```java
package cn.aopmin.controller;

import cn.aopmin.service.UserService;
import cn.aopmin.domain.User;
import org.apache.dubbo.config.annotation.Reference;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author aopmin
 * @date 2024/06/23
 */
@RestController
@RequestMapping("/user")
public class UserController {

    @Reference
    private UserService userService;

    @GetMapping("/{id}")
    public User findById(@PathVariable("id") Integer id) {
        return userService.findById(id);
    }
}
```

> 小结：

关于dubbo，需要记的内容：

* 注意：实体类必须实现序列化接口

* 两个注解：

    * dubbo的@Service：暴露服务的
    * dubbo的@Reference：订阅服务的

* 两类配置：

    * 提供者配置，可以在idea里配置模板如下：

  ```yaml
  dubbo:
    application:
      name: $applicationName$ #应用名称，要求不重复
    registry:
      address: $registryAddress$ #注册中心地址
    scan:
      base-packages: $scanPackage$ #扫描的包
    protocol:
      name: dubbo  #rpc协议
      port: 20880  #rpc端口
  ```

    * 消费者配置，可以在idea里配置模板如下：

  ```yaml
  dubbo:
    application:
      name: $applicationName$ #应用名称
    registry:
      address: $registryAddress$ #注册中心地址
    scan:
      base-packages: $scanPackage$ #扫描的包
    consumer:
      check: false #启动时检查
      timeout: 3000 #rpc调用的超时时间
      retries: 0 #调用失败后的生效次数
  ```


## 7. 常见问题

### 1、实体类没有实现序列化接口

在控制台可以看到报错信息

![image-20210120154058034](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231409054.png)

### 2、找不到服务提供者

去管理控制台dubbo-admin里检查一下有没有启动服务提供者。重启服务提供者和消费者，再测试

在控制台里会看到以下内容：

![image-20210120111450285](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231409063.png)

在控制台看到以下内容：

![image-20210120154259323](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231409064.png)



### 3、数据库驱动报错

说明数据库版本和驱动包版本不匹配。MySql软件用的是8.x版本，MySql驱动包用的5.x版本

MySql数据库用的5.7

数据库驱动包应该使用5.x

![image-20210605143439297](https://picgoblog.oss-cn-hangzhou.aliyuncs.com/img/202406231409073.png)

