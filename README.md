# Banco de Materiales Escolares

-- Inicio Copiar y Pegar para Crear DB banco_materiales

-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: banco_materiales
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicaciones` (
  `idPubli` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` varchar(250) DEFAULT NULL,
  `urlImage` varchar(250) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `usuario` int DEFAULT NULL,
  `nombre` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`idPubli`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicaciones`
--

LOCK TABLES `publicaciones` WRITE;
/*!40000 ALTER TABLE `publicaciones` DISABLE KEYS */;
INSERT INTO `publicaciones` VALUES (1,'awfaf','awfawf','','2026-03-11 22:50:27',1,'Ethan Acosta'),(2,'ssef','hola','','2026-03-11 23:24:11',1,'Ethan Acosta'),(3,'Nutria','Que Bonita','https://i.ibb.co/nNJ5BVH6/c5727066156e.jpg','2026-03-11 23:41:44',1,'Ethan Acosta'),(4,'hola','adiós','','2026-03-11 23:47:28',1,'Ethan Acosta');
/*!40000 ALTER TABLE `publicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `usuario` int NOT NULL,
  `contrase` varchar(45) DEFAULT NULL,
  `primer_nombre` varchar(45) DEFAULT NULL,
  `segundo_nombre` varchar(45) DEFAULT NULL,
  `apell_pat` varchar(45) DEFAULT NULL,
  `apell_mat` varchar(45) DEFAULT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `celular` varchar(15) DEFAULT NULL,
  `ctrl_intentos` int DEFAULT NULL,
  `flag` tinyint DEFAULT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'hola','Ethan','Levi','Acosta','Galindo','LC20550585@chihuahua2.tecnm.mx','6143435669',0,1),(2,'hola','Oliver','','Aiku','J','L12345@chihuahua2.tecnm.mx','6141234567',0,1),(4,'hi','hi','hi','hi','hi','L12345@chihuahua2.tecnm.mx','5643165',0,1),(20550585,'nice','Ethan','Levi','Acosta','Galindo','LC20550585@chihuahua2.tecnm.mx','6143435669',0,1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-12  1:15:56


-- Fin Copiar y Pegar para Crear DB banco_materiales