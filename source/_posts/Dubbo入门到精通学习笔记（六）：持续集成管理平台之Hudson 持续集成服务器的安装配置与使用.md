---
title: Dubbo入门到精通学习笔记（六）：持续集成管理平台之Hudson 持续集成服务器的安装配置与使用
date: 2019-03-16 23:03:12
tags: []
category: ------------Hudson
---
版权声明：本文为作者原创，转载请注明出处，联系qq：32248827 https://blog.csdn.net/dataiyangu/article/details/88608183



* [安装Hudson]()
* [使用Hudson]()

* [tips：自动化部署]()
* [附录：两个脚本]()

# []()安装Hudson

IP:192.168.4.221 8G 内存(Hudson 多个工程在同时构建的情况下比较耗内存)
环境:CentOS 6.6、JDK7
**Hudson 不需要用到数据库**
Hudson 只是一个持续集成服务器(持续集成工具)，要想搭建一套完整的持续集成管理平台， 还需要用到前面课程中所讲到的 SVN、Maven、Sonar 等工具，按需求整合则可。
![在这里插入图片描述](../images/20190316212631882--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
上图可以看出hudson对项目进行构建，构建完成了之后需要装载到本地maven库，并发布到私有库所以需要在这里安装maven

1、 安装 JDK 并配置环境变量(略)

```js 
JAVA_HOME=/usr/local/java/jdk1.7.0_72
```
2、 Maven 本地仓库的安装(使用 Maven 作为项目构建与管理工具):
(1)下载 maven-3.0.5
(注意:建议不要下载 3.1 或更高版本的 Maven，因为与 Hudson 进行集成时会有问题， 之前有遇到过):
```js 
# wget http://mirrors.hust.edu.cn/apache/maven/maven-3/3.0.5/binaries/apache-maven- 3.0.5-bin.tar.gz
```

(2)解压:

```js 
# tar -zxvf apache-maven-3.0.5-bin.tar.gz # mv apache-maven-3.0.5 maven-3.0.5
```

(3)配置 Maven 环境变量:

```js 
# vi /etc/profile
## maven env
export MAVEN_HOME=/root/maven-3.0.5 export PATH=$PATH:$MAVEN_HOME/bin
# source /etc/profile
```

(4)Maven 本地库配置:settings.xml

```js 
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
   //配置本地库的路径
	<localRepository>/root/maven-3.0.5/.m2/repository</localRepository>
	<interactiveMode>true</interactiveMode>
    <offline>false</offline>
    <pluginGroups>
        <pluginGroup>org.mortbay.jetty</pluginGroup>
        <pluginGroup>org.jenkins-ci.tools</pluginGroup>
    </pluginGroups>
	
	<!--配置权限,使用默认用户-->
	<servers>
		<server>
			<id>nexus-releases</id>
			<username>deployment</username>
			<password>deployment123</password>
		</server>
		<server> 
			<id>nexus-snapshots</id>
			<username>deployment</username>
			<password>deployment123</password>
		</server>
	</servers>

    <mirrors>

    </mirrors>

	<profiles>
		<profile>
			<id>edu</id>
			<activation>
				<activeByDefault>false</activeByDefault>
				<jdk>1.6</jdk>
			</activation>
			<repositories>
				<!-- 私有库地址-->
				//因为私有库也在这个机器所以修改路径为localhost
				//当然视实际情况而定
				<repository>
					<id>nexus</id>
					<url>http://localhost:8081/nexus/content/groups/public/</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</repository>
			</repositories>      
			<pluginRepositories>
				<!--插件库地址-->
				<pluginRepository>
					<id>nexus</id>
					<url>http://localhost:8081/nexus/content/groups/public/</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
				   </snapshots>
				</pluginRepository>
			</pluginRepositories>
		</profile>
		
		//因为sonar也在本机，所以修改为localhost，当然视实际情况而定。
		//这里可以不用配置其实，因为hudson对sonar有一个插件
		//如果不用插件就打开配置
		<!--
		<profile>
			<id>sonar</id>
			<activation>
				<activeByDefault>true</activeByDefault>
			</activation>
			<properties>
				<!-- Example for MySQL-->
				<sonar.jdbc.url>
					jdbc:mysql://localhost:3306/sonarqube?useUnicode=true&amp;characterEncoding=utf8
				</sonar.jdbc.url>
				<sonar.jdbc.username>root</sonar.jdbc.username>
				<sonar.jdbc.password>wusc.123</sonar.jdbc.password>

				<!-- Optional URL to server. Default value is http://localhost:9000 -->
				<sonar.host.url>
					http://localhost:9090/sonarqube
				</sonar.host.url>
			</properties>
		</profile>
		-->
	</profiles>
	
	<!--激活profile-->
	<activeProfiles>
		<activeProfile>edu</activeProfile>
	</activeProfiles>
	
</settings>
```

将settings.xml上传上去，将原来的文件覆盖掉。

3、 配置 HudsonHome，在/root 目录下创建 HudsonHome 目录，并配置到环境变量
```js 
# mkdir HudsonHome
切换到 root 用户，在/etc/profile 中配置全局环境变量
# vi /etc/profile ## hudson env
export HUDSON_HOME=/root/HudsonHome
# source /etc/profile
```

4、 下载最新版 Tomcat7，当前最新版为 7.0.59:

```js 
# wget http://apache.fayea.com/tomcat/tomcat-7/v7.0.59/bin/apache-tomcat- 7.0.59.tar.gz
```

5、 解压安装 Tomcat:

```js 
# tar -zxvf apache-tomcat-7.0.59.tar.gz # mv apache-tomcat-7.0.59 hudson-tomcat
```

移除/root/hudson-tomcat/webapps 目录下的所有文件:

```js 
# rm -rf /root/hudson-tomcat/webapps/*
```

将 Tomcat 容器的编码设为 UTF-8:

```js 
# vi /root/hudson-tomcat/conf/server.xml <Connector port="8080" protocol="HTTP/1.1"
connectionTimeout="20000" redirectPort="8443" URIEncoding="UTF-8" />
```

**如果不把 Tomcat 容器的编码设为 UTF-8，在以后配置 Hudson 是有下面的提示:**
![在这里插入图片描述](../images/20190316212709659--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
设置 hudson-tomcat 的内存，因为hudson是比较消耗内存的

```js 
# vi /root/hudson-tomcat/bin/catalina.sh 
#!/bin/sh 下面增加: JAVA_OPTS='-Xms512m -Xmx2048m'
```

6、 下载最新版的 Hudson(这里是 3.2.2 版)包:

```js 
# wget http://mirror.bit.edu.cn/eclipse/hudson/war/hudson-3.2.2.war
```

将 war 包拷贝到 hudson-tomcat/weapps 目录，并重命名为 hudson.war

```js 
# cp /root/hudson-3.2.2.war /root/hudson-tomcat/webapps/hudson.war
```

7、 防火墙开启 8080 端口，用 root 用户修改/etc/sysconfig/iptables，

```js 
# vi /etc/sysconfig/iptables
增加:
## hudson-tomcat port:8080
-A INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
```

重启防火墙:

```js 
# service iptables restart
```

8、 设置 hudson-tomcat 开机启动: 在虚拟主机中编辑/etc/rc.local 文件，

```js 
# vi /etc/rc.local
```

加入:

```js 
/root/hudson-tomcat/bin/startup.sh
```
9、 启动 hudson-tomcat

```js 
# /root/hudson-tomcat/bin/startup.sh
```

10、 配置 Hudson:
(1)浏览器输入:[http://192.168.4.221:8080/hudson/](http://192.168.4.221:8080/hudson/)
![在这里插入图片描述](../images/2019031621273335--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
![在这里插入图片描述](../images/20190316212747140--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
初始化安装需要安装 3 个默认勾选中的插件(如上图红色部分)，其它插件可以等初始 化安装完成之后再选择安装。
点击“Install”安装按钮后，需要等待一会时间才能安装完成。安装完成后按“Finish”按钮。
安装的插件保存在 /root/HudsonHome/plugins 目录。
(2)初始化完成后就会进行 Hudson 的配置管理界面:
![在这里插入图片描述](../images/2019031621280240--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)

安全配置
![在这里插入图片描述](../images/20190316213711428--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
使用项目矩阵授权策略
因为可能注册新的用户，所以在允许用户注册前面打钩
![在这里插入图片描述](../images/20190316223501132--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
![在这里插入图片描述](../images/20190316223517731--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
注册成功后，在进入刚才的安全配置，发现刚才分配的admin用户前面的红线没有了，说明用户添加成功了

系统设置
![在这里插入图片描述](../images/20190316223213985--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)

配置系统信息、JDK、Maven
![在这里插入图片描述](../images/2019031622340828--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
**注意在hudson中右边的 问号 “？” 点击展开有关于配置的详细介绍的配置指南等**
Instantce Tag：给这个管理平台命名
系统消息：想用户发布一些系统泛微内的通知或公告。
执行者数量：这个项目允许同时构建的数量，并发数量
生成前等待时间：构建之前需要等待的时间
SCM签出重试次数：如果从版本库签出代码失败，hudson会按照这个指定的次数进行重试之后再放弃。
![在这里插入图片描述](../images/20190316224530403--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
上图是配置邮箱
SMTP服务器：配置为自己的邮箱
Hudson Url ：自己这个Hunson客户端在浏览器的路径（截止到项目名）
SMTP验证：自己邮箱的用户名，密码
端口：默认25
最后保存

保存后的效果

![在这里插入图片描述](../images/20190316224551418--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)

结合我们想要实现的持续集成功能，需要安装如下几个插件。如想集成更多功能，自行 添加插件并配置则可。(注意:现在我们使用了 SonarQube 质量管理不台，则不再需要在 Hudson 中单独去安装 CheckStyle、Findbugs、PMD、Cobertura 等 Sonar 中已有的插件) 逐个搜索你想要安装的插件并点击安装，安装完之后重启 Hudson。
如下图所示:
![在这里插入图片描述](../images/20190316225056198--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
需要安装的插件
![在这里插入图片描述](../images/20190316225115374--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
安装完之后点击右上角的restart重启，重启才会生效
installed就是已经安装好的插件，
这些插件安装完之后，上面配置过的系统配置信息中会多出这些插件的配置选项

在 Hudson 中配置 SonarQube 链接
![在这里插入图片描述](../images/2019031622513087--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
Server Url：之前sonar客户端首页的地址，因为是在本机安装的，所以可以是localhost
login：用户
password：密码
Server Public URL：也是sonar客户端的地址，但是不论局域网还是公网都能访问的ip，所以应该是真正的ip
Database URL：数据库连接
Database login：数据库用户
Database password：数据库密码
Database Driver：数据库驱动

以上就是 Hudson 的基本安装和配置，更多其它配置和功能可自行扩展。

# []()使用Hudson

Hudson 的使用(**使用 Hudson 来自动化编译、分析、打包、发布、部署项目**)
添加项目
![在这里插入图片描述](../images/20190316230152117--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
![在这里插入图片描述](../images/20190316230202884--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
创建svn连接，创建连接的时候可能出现报错，点击”enter credential“>选择 name/password进行授权，输入admin xxxx>保存之后，回到如下刚才的页面，还报错==>点击空白处，报错消失

poll SCM ：每过一段时间自动检测svn的代码时候有变动，有变动的话就自动进行构建，比如这里的设置就是每一分钟进行自动化构建。
Build peroidically：每天进行检测的策略。

![在这里插入图片描述](../images/20190316230231357--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
项目的pom：pom.xml
Goals and options : clean install deploy
E-mail 记得勾选Send a e-mial for every unstable build，每次构建失败发邮件提醒。

```js 
一般还要勾选sonar
```
，文章给出的图片没有勾选是因为，示例中要提交的项目是父项目，没有java文件，只有一个pom文件，不需要sonar

![在这里插入图片描述](../images/20190316230256320--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
上图中点击Dubbo视频教程–持续集成下方的Hudson，如果在上面进行了设置的话，每过一段时间会自动构建，这里可以点击图中右边箭头素质的图标进行主动构建，从图中箭头左面所示可以看到正在构建。
![在这里插入图片描述](../images/20190317062955933--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
点击左边箭头区域的项目名字，之后会出现一个黑点（长得有点像终端）>点击黑点>命令行输出==>看到从配置的私服maven中下载需要的依赖，直到build success说明构建成功了。

再构建一个项目，注意这里有点技巧
![在这里插入图片描述](../images/20190317063900964--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
因为刚才已经构建过一次了，这里只需要”复制现有任务“，选中刚才的任务即可。
进去之后只需要修改project name、 description、svn的url就行修改（当然还需要授权一次）

注意：上面的项目因为是父项目，没有java代码，所以没有勾选sonar，但是本次构建的项目中是有java代码的，所以这里需要勾选sonar，因为在上面的系统配置中已经配置了连接我们的sonarQube，所以这里不需要配置任何东西，
![在这里插入图片描述](../images/20190317064239147--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
保存后发现多了sonar的图标。
![在这里插入图片描述](../images/20190317064456743--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
接着按照第一个项目的步骤进行构建

上面的项目中没有用到sonar，所以构建完成就没有了，这里继承了sonar，从下图可以看到，构建完成之后，自动对代码进行了分析。
![在这里插入图片描述](../images/20190317064653789--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
这个时候进入sonar的客户端
![在这里插入图片描述](../images/20190317064920763--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
发现刚刚更新的项目

按照前面的方式将所有的项目构建进来（次省略）。

在构建service-user的时候注意
![在这里插入图片描述](../images/20190317065634539--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
因为service-user是服务的实现，依赖于facade-user这个接口项目，所以希望，facede-user构建之后希望触发service-user也自动构建，也只有这样才能引入最新的facade-user
设置如图
![在这里插入图片描述](../images/20190317070729786--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
上图中的Goals and options注意，改为clean install，因为这个项目是一个调用的接口，不需要被别人引用，所以不需要发布到私有maven库。

## []()tips：自动化部署

如何部署服务到其他的机器上？
首先在系统配置中增加ssh配置，如下图
![在这里插入图片描述](../images/20190317071834852--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
username是ssh 的时候需要填写的用户
remote directory：远程存放项目的根目录

上面添加了一个provider的ssh，再添加一个client的ssh

对provider进行自动化部署
![在这里插入图片描述](../images/20190317073013299--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
到Hudson部署的机器了解目录结构
![在这里插入图片描述](../images/20190317073602153--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
![在这里插入图片描述](../images/20190317073607550--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
name：是项目的名字（在项目的ssh中配置过的名字）
source files：Hudson的工作空间下的项目，即每次修改后的代码都自动构架到hudson的目录下面，通过上面聊姐hudson的工作目录，这里以上图中红色区域（即到workspace目录）为根目录开始，将下面target目录中的edu-service-user.jar 和依赖的lib目录（jar包）自动化部署到远端。
remote directory：这里因为之前在provider的项目配置中配置过了根目录（/Home/Wusc），所以这里只需要在后面的目录中进行填写，填写希望部署的目录
Exec command：自动化部署的脚本。

自己看一下自动化部署的效果，将远程机器中（部署provider的机器）的jar包删除掉。
自己手动构建一次providr看一下效果==>点击进入项目==>点击左侧的立即构建，去部署provider的机器中查看jar包是否出现，并通过dubbo的图形工具，查看项目是否已经部署完成。

同理设置自动华部署web项目（client）
![在这里插入图片描述](../images/2019031707542852--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
通过类似provider的方式自行测试client的自动化构建过程

测试项目自动化构建：
进入自己的项目中修改某处代码==>点击项目右键team==>更新==>填写一点备注（比如”测试自动糊构建“）>等待>进入hudson查看是否正在自动构建（因为我们上面设置了每一分钟自动化构建一次，如果检测到代码变化的话。）

测试自己配置的如果依赖的父目录构建了的话，自己也会自动构建
![在这里插入图片描述](../images/20190317080411147--x-oss-process=image-watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2RhdGFpeWFuZ3U=,size_16,color_FFFFFF,t_70.png)
上图中的facede-user我们手动构建一次，之后service-user就自己开始构建了，这样就保证了自己依赖的项目永远是最新的。

## []()附录：两个脚本

[restart.sh](http://restart.sh) (client脚本)
```js 
## java env
export JAVA_HOME=/usr/local/java/jdk1.7.0_72
export JRE_HOME=$JAVA_HOME/jre

## restart tomcat
/home/wusc/edu/web/boss-tomcat/bin/shutdown.sh
sleep 3
rm -rf /home/wusc/edu/web/boss-tomcat/webapps/edu-web-boss
/home/wusc/edu/web/boss-tomcat/bin/startup.sh
```

[service-user.sh](http://service-user.sh)（provider脚本）

```js 
#!/bin/sh

## java env
export JAVA_HOME=/usr/local/java/jdk1.7.0_72
export JRE_HOME=$JAVA_HOME/jre

## service name
APP_NAME=user

SERVICE_DIR=/home/wusc/edu/service/$APP_NAME
SERVICE_NAME=edu-service-$APP_NAME
JAR_NAME=$SERVICE_NAME\.jar
PID=$SERVICE_NAME\.pid

cd $SERVICE_DIR

case "$1" in

    start)
        nohup $JRE_HOME/bin/java -Xms256m -Xmx512m -jar $JAR_NAME >/dev/null 2>&1 &
        echo $! > $SERVICE_DIR/$PID
        echo "=== start $SERVICE_NAME"
        ;;

    stop)
        kill `cat $SERVICE_DIR/$PID`
        rm -rf $SERVICE_DIR/$PID
        echo "=== stop $SERVICE_NAME"

        sleep 5
        P_ID=`ps -ef | grep -w "$SERVICE_NAME" | grep -v "grep" | awk '{print $2}'`
        if [ "$P_ID" == "" ]; then
            echo "=== $SERVICE_NAME process not exists or stop success"
        else
            echo "=== $SERVICE_NAME process pid is:$P_ID"
            echo "=== begin kill $SERVICE_NAME process, pid is:$P_ID"
            kill -9 $P_ID
        fi
        ;;

    restart)
        $0 stop
        sleep 2
        $0 start
        echo "=== restart $SERVICE_NAME"
        ;;

    *)
        ## restart
        $0 stop
        sleep 2
        $0 start
        ;;
esac
exit 0
```

