/*
SQLyog Ultimate v11.24 (32 bit)
MySQL - 5.5.47 : Database - nodesocketio
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`nodesocketio` /*!40100 DEFAULT CHARACTER SET utf8 */;

/*Table structure for table `chat` */

DROP TABLE IF EXISTS `chat`;

CREATE TABLE `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(100) DEFAULT NULL COMMENT '辨别聊天内容',
  `updatetime` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `chat` */

insert  into `chat`(`id`,`title`,`updatetime`) values (6,'1592898306891-1592898306890','2020-07-01 17:53:47'),(7,'1592898306892-1592898306890','2020-07-03 17:02:16'),(8,'1592898306892-1592898306891','2020-07-03 17:17:24');

/*Table structure for table `chatdata` */

DROP TABLE IF EXISTS `chatdata`;

CREATE TABLE `chatdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `title` varchar(100) DEFAULT NULL COMMENT '对应的唯一stampid',
  `chat` int(20) DEFAULT NULL COMMENT '判别是自己的还是别人的',
  `uid` int(11) DEFAULT NULL COMMENT 'uid',
  `content` text COMMENT '内容',
  `updatetime` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

/*Data for the table `chatdata` */

insert  into `chatdata`(`id`,`name`,`title`,`chat`,`uid`,`content`,`updatetime`) values (26,'test1','1592898306891',NULL,6,'臭弟弟 admin','2020-07-03 11:17:04'),(27,'admin','1592898306890',NULL,6,'臭妹妹 test1','2020-07-03 11:17:27'),(39,'test1','1592898306891',NULL,6,'渣渣admin','2020-07-03 16:37:49'),(40,'admin','1592898306890',NULL,6,'渣渣test1','2020-07-03 16:48:36'),(41,'test1','1592898306891',NULL,6,'你妹的admin','2020-07-03 16:52:31'),(42,'admin','1592898306890',NULL,6,'111','2020-07-03 16:58:00'),(43,'admin','1592898306890',NULL,6,'222','2020-07-03 16:58:51'),(44,'test1','1592898306891',NULL,6,'你妹的','2020-07-03 17:00:10'),(45,'admin','1592898306890',NULL,6,'你弟的','2020-07-03 17:00:55'),(46,'test2','1592898306892',NULL,7,'臭姐姐admin','2020-07-03 17:02:16'),(47,'admin','1592898306890',NULL,7,'微微','2020-07-03 17:02:35'),(48,'test2','1592898306892',NULL,8,'臭弟弟 test1','2020-07-03 17:17:24'),(49,'admin','1592898306890',NULL,7,'啦啦啦啦','2020-07-03 17:18:54'),(50,'admin','1592898306890',NULL,7,'','2020-07-04 17:51:19'),(51,'admin','1592898306890',NULL,7,'？？？','2020-07-04 17:51:30'),(52,'admin','1592898306890',NULL,7,'...','2020-07-07 10:13:36'),(53,'test2','1592898306892',NULL,7,'222','2020-07-07 15:15:17'),(54,'admin','1592898306890',NULL,7,'444','2020-07-07 15:24:14'),(55,'test2','1592898306892',NULL,7,'555','2020-07-07 15:24:19');

/*Table structure for table `groupdata` */

DROP TABLE IF EXISTS `groupdata`;

CREATE TABLE `groupdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `title` varchar(100) DEFAULT NULL COMMENT '对应的唯一stampid',
  `chat` int(20) DEFAULT NULL COMMENT '判别是自己的还是别人的',
  `uid` int(11) DEFAULT NULL COMMENT 'uid',
  `content` text COMMENT '内容',
  `updatetime` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `groupdata` */

insert  into `groupdata`(`id`,`name`,`title`,`chat`,`uid`,`content`,`updatetime`) values (1,'admin','1592898306890',NULL,29,'你妹的','2020-07-06 16:59:07'),(2,'admin','1592898306890',NULL,29,'你妹的，我的admin','2020-07-06 17:13:31'),(3,'admin','1592898306890',NULL,29,'111','2020-07-06 17:14:58'),(4,'admin','1592898306890',NULL,29,'333','2020-07-06 17:15:22'),(5,'test1','1592898306891',NULL,29,'444','2020-07-06 17:15:34'),(11,'admin','1592898306890',NULL,29,'111','2020-07-07 09:37:21');

/*Table structure for table `grouppeople` */

DROP TABLE IF EXISTS `grouppeople`;

CREATE TABLE `grouppeople` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `stampid` varchar(100) DEFAULT NULL COMMENT '唯一识别stampid',
  `groupid` varchar(100) DEFAULT NULL COMMENT '群私有id',
  `uid` int(11) DEFAULT NULL COMMENT '识别属于哪个群',
  `updatetime` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

/*Data for the table `grouppeople` */

insert  into `grouppeople`(`id`,`name`,`stampid`,`groupid`,`uid`,`updatetime`) values (43,'admin','1592898306890','1594004644196',27,'2020-07-06 11:04:04'),(44,'test2','1592898306892','1594004856330',28,'2020-07-06 11:07:36'),(45,'test1','1592898306891','1594004891145',29,'2020-07-06 11:08:11'),(46,'test1','1592898306891','1594004856330',28,'2020-07-06 11:08:13'),(47,'admin','1592898306890','1594004856330',28,'2020-07-06 11:08:18'),(48,'admin','1592898306890','1594004891145',29,'2020-07-06 11:35:59'),(50,'test2','1592898306892','1594004856330',28,'2020-07-06 17:46:54');

/*Table structure for table `groups` */

DROP TABLE IF EXISTS `groups`;

CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `groupleader` varchar(100) DEFAULT NULL COMMENT '群主',
  `groupstampid` varchar(100) DEFAULT NULL COMMENT '群主唯一标识',
  `joins` varchar(20) DEFAULT NULL COMMENT '是否可加入群',
  `groupid` varchar(100) DEFAULT NULL COMMENT '群唯一标识',
  `updatetime` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

/*Data for the table `groups` */

insert  into `groups`(`id`,`name`,`groupleader`,`groupstampid`,`joins`,`groupid`,`updatetime`) values (27,'admin群1','admin','1592898306890','是','1594004644196','2020-07-06 11:04:04'),(28,'test2群1','test2','1592898306892','是','1594004856330','2020-07-06 11:07:36'),(29,'test1群1','test1','1592898306891','是','1594004891145','2020-07-06 11:08:11');

/*Table structure for table `senddata` */

DROP TABLE IF EXISTS `senddata`;

CREATE TABLE `senddata` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(100) DEFAULT NULL COMMENT '名称',
  `title` varchar(100) DEFAULT NULL COMMENT '对应的唯一stampid',
  `chat` int(20) DEFAULT NULL COMMENT '判别是自己的还是别人的',
  `uid` int(11) DEFAULT NULL COMMENT 'uid',
  `content` text COMMENT '内容',
  `updatetime` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `senddata` */

insert  into `senddata`(`id`,`name`,`title`,`chat`,`uid`,`content`,`updatetime`) values (1,'admin','1592898306890',NULL,1,'111','2020-07-07 11:07:26'),(2,'test2','1592898306892',NULL,3,'122','2020-07-07 11:07:56'),(3,'test2','1592898306892',NULL,3,'111','2020-07-07 11:30:16'),(4,'test1','1592898306891',NULL,2,'444','2020-07-07 11:30:38'),(5,'admin','1592898306890',NULL,1,'111','2020-07-07 14:41:19'),(6,'admin','1592898306890',NULL,1,'222','2020-07-07 14:41:22'),(7,'admin','1592898306890',NULL,1,'111','2020-07-07 14:43:18'),(8,'admin','1592898306890',NULL,1,'222','2020-07-07 14:45:59'),(9,'admin','1592898306890',NULL,1,'222','2020-07-07 14:47:37'),(10,'admin','1592898306890',NULL,1,'333','2020-07-07 15:03:00'),(11,'test2','1592898306892',NULL,3,'444','2020-07-07 15:03:09'),(12,'test2','1592898306892',NULL,3,'333','2020-07-07 15:20:14');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `username` varchar(100) DEFAULT NULL COMMENT '用户名',
  `password` varchar(100) DEFAULT NULL COMMENT '密码',
  `stampid` varchar(50) DEFAULT NULL COMMENT '时间戳生成唯一标识',
  `socketid` varchar(100) NOT NULL COMMENT 'socketId',
  `online` varchar(50) DEFAULT NULL COMMENT '是否上线',
  `time` datetime DEFAULT NULL COMMENT '时间',
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`stampid`,`socketid`,`online`,`time`) values (2,'test1','e10adc3949ba59abbe56e057f20f883e','1592898306891','','否','2020-06-22 10:08:19'),(3,'test2','e10adc3949ba59abbe56e057f20f883e','1592898306892','','否','2020-06-22 10:09:26'),(4,'test3','e10adc3949ba59abbe56e057f20f883e','1592898306893','','否','2020-06-22 10:14:10'),(5,'test4','e10adc3949ba59abbe56e057f20f883e','1592898306894','','否','2020-06-22 15:47:16'),(6,'test5','e10adc3949ba59abbe56e057f20f883e','1592898306895','','否','2020-06-22 15:50:23'),(7,'test6','e10adc3949ba59abbe56e057f20f883e','1592898306896','','否','2020-06-22 15:53:26'),(1,'admin','e10adc3949ba59abbe56e057f20f883e','1592898306890','','否','2020-06-22 10:08:19'),(8,'weiwei','e10adc3949ba59abbe56e057f20f883e','1594093861566','','否','2020-07-07 11:51:01');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
