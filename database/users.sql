-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : mer. 10 jan. 2024 à 09:35
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `NOTIMAIL`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `firm_name` varchar(25) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(25) NOT NULL,
  `password` varchar(400) DEFAULT NULL,
  `last_received_mail` datetime DEFAULT NULL,
  `last_picked_up` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `has_mail` tinyint(1) DEFAULT '0',
  `is_admin` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`firm_name`, `first_name`, `last_name`, `email`, `phone_number`, `password`, `last_received_mail`, `last_picked_up`, `has_mail`, `is_admin`, `createdAt`, `updatedAt`) VALUES
('ABC Industries', 'Alice', 'Johnson', 'alice.johnson@abc.com', '9876543210', '$2b$10$dDKNanYLhLec49Pfp2n8QeBOLAeA1YigWLWW86ytNMaqYUXFreTNq', '2023-12-15 00:00:00', '2023-12-10 00:00:00', 1, 0, '2024-01-10 09:32:41', '2024-01-10 09:32:41'),
('ACME Corporation', 'John', 'Smith', 'john.smith@acme.com', '1234567890', '$2b$10$HeHLS2SlRYTeA9iTOGk0KOQiGybM5DcrUk.DvO.E4jOeQC5aB8Acq', '2023-12-24 00:00:00', '2023-12-26 00:00:00', 1, 0, '2024-01-10 09:32:38', '2024-01-10 09:32:38'),
('Antoine', NULL, NULL, 'Antoine@example.com', '09-06-06-06-06', '$2b$10$BHpyfJk5EL8ni/qIIbfHg.G6D.n35kxttNonIa7GJsUv9HocXqiRy', NULL, '2024-01-09 11:38:18', 0, 0, '2024-01-09 11:38:18', '2024-01-09 11:38:18'),
('Globex Corporation', 'Emma', 'Brown', 'emma.brown@globex.com', '5555555555', '$2b$10$PY8iJwdw9abFpAjtMM89zO/AYFPg6Liiq8lnqmCyLn/4gHtQBw8M.', '2023-12-16 00:00:00', '2023-12-18 00:00:00', 1, 0, '2024-01-10 09:32:44', '2024-01-10 09:32:44'),
('IMTS', 'Clothilde', 'Sophie', 'imts@example.com', '00-00-00-00-00', '$2b$10$W0xGkCHEm8fLRCn.TjW0BuQE3jf1LwEEKzNbCpljfh1lSjj8yQhgW', NULL, '2024-01-09 11:37:31', 0, 1, '2024-01-09 11:37:31', '2024-01-09 11:37:31'),
('Soylent Corporation', 'Robert', 'Thorn', 'robert.thorn@soylent.com', '8889990000', '$2b$10$.DfATouFvNFPh1n4HGUKCuZs9mcQsPE3SY7DW0w116bJedJrzlQ5.', '2023-01-10 00:00:00', '2023-12-31 00:00:00', 1, 0, '2024-01-10 09:34:13', '2024-01-10 09:34:13'),
('Stark Industries', 'Tony', 'Stark', 'tony.stark@starkind.com', '4445556666', '$2b$10$/1vUKSupITpne.6T/S78Y.y7JaX0OpPbMQyUceZnpsZsaw9i9pvEe', '2023-01-05 00:00:00', '2023-01-07 00:00:00', 1, 0, '2024-01-10 09:32:48', '2024-01-10 09:32:48'),
('Tanguy', NULL, NULL, 'tanguy@example.com', '08-06-06-06-06', '$2b$10$PqO96exoWo7GtgKxjCGCAu.Fil/WQdBc15lQCA4/I0GmdPBt2dl0S', NULL, '2024-01-09 11:37:56', 0, 0, '2024-01-09 11:37:56', '2024-01-09 11:37:56'),
('Tyrell Corporation', 'Eldon', 'Tyrell', 'eldon.tyrell@tyrellcorp.com', '1112223333', '$2b$10$wrdt6/bOLQnPRo7dhxll1Ol27ttJmDnVHw0y.zb1oZEhkTzqrc1hC', '2023-01-02 00:00:00', '2023-01-05 00:00:00', 1, 0, '2024-01-10 09:34:18', '2024-01-10 09:34:18'),
('Umbrella Corporation', 'Alice', 'Redfield', 'alice.redfield@umbcorp.com', '7778889999', '$2b$10$stEXBtW0V9ES21bUUpAbiu51FLpdPqip8uR2BaAAP1fQG8h9/BdxG', '2023-12-31 00:00:00', '2023-12-14 00:00:00', 1, 0, '2024-01-10 09:32:51', '2024-01-10 09:32:51'),
('Wayne Enterprises', 'Bruce', 'Wayne', 'bruce.wayne@wayneent.com', '1112223333', '$2b$10$TeQe1TBL2gPlQTvXDQm0vOrXjrEzz8gNckND2LSxE3.VyeH/BS5dK', '2023-12-31 00:00:00', '2023-01-10 00:00:00', 1, 0, '2024-01-10 09:32:46', '2024-01-10 09:32:46'),
('Weyland Corporation', 'Ellen', 'Ripley', 'ellen.ripley@weyland.com', '3334445555', '$2b$10$/s3in9bSHSxAv/eMKOBO3eZW4PsjLM7dZiFvwmSOBXznrkKxaqmDm', '2023-12-31 00:00:00', '2023-12-15 00:00:00', 1, 0, '2024-01-10 09:34:33', '2024-01-10 09:34:33');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`firm_name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
