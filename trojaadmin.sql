-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 10 jan 2025 kl 13:58
-- Serverversion: 10.4.28-MariaDB
-- PHP-version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `trojaadmin`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`) VALUES
(3, 'SuperAdmin', '$2b$10$3P48AgggmFvnT/YfqRvRA.AUuyrgaGHHqi3gzNgc4UBbj6y5Ohf1O'),
(4, 'TestAdmin', '$2b$10$Tp98LWaLKU21.Oa8wdXv7OebE85eiyFq7xw/HwjZmbDaMsP0gAR4W');

-- --------------------------------------------------------

--
-- Tabellstruktur `campaign`
--

CREATE TABLE `campaign` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchaseId` int(11) DEFAULT NULL,
  `communicationId` varchar(50) DEFAULT NULL,
  `internalReference` varchar(50) DEFAULT NULL,
  `activationCode` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `customer`
--

CREATE TABLE `customer` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `userRefNo` varchar(50) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `postalAddress` varchar(255) DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `isCompany` tinyint(1) DEFAULT 0,
  `companyName` varchar(255) DEFAULT NULL,
  `acceptInfo` tinyint(1) DEFAULT 0,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `addition_date` datetime DEFAULT current_timestamp(),
  `createdUtc` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end` timestamp NULL DEFAULT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `eventId` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `goods`
--

CREATE TABLE `goods` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `artNo` varchar(50) DEFAULT NULL,
  `priceIncVatAfterDiscount` decimal(10,2) DEFAULT NULL,
  `eventId` varchar(255) DEFAULT NULL,
  `goodsId` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `purchase`
--

CREATE TABLE `purchase` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `crmId` varchar(50) NOT NULL,
  `userRefNo` varchar(50) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  `createdDateUTC` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `pointsProcessed` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `purchaseevent`
--

CREATE TABLE `purchaseevent` (
  `purchaseId` bigint(20) UNSIGNED NOT NULL,
  `eventId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `purchasegoods`
--

CREATE TABLE `purchasegoods` (
  `purchaseId` bigint(20) UNSIGNED NOT NULL,
  `goodsId` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index för tabell `campaign`
--
ALTER TABLE `campaign`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userRefNo` (`userRefNo`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index för tabell `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `eventId` (`eventId`);

--
-- Index för tabell `goods`
--
ALTER TABLE `goods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goodsId` (`goodsId`);

--
-- Index för tabell `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `crmId` (`crmId`);

--
-- Index för tabell `purchaseevent`
--
ALTER TABLE `purchaseevent`
  ADD PRIMARY KEY (`purchaseId`,`eventId`),
  ADD KEY `eventId` (`eventId`);

--
-- Index för tabell `purchasegoods`
--
ALTER TABLE `purchasegoods`
  ADD PRIMARY KEY (`purchaseId`,`goodsId`),
  ADD KEY `goodsId` (`goodsId`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT för tabell `campaign`
--
ALTER TABLE `campaign`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=678;

--
-- AUTO_INCREMENT för tabell `customer`
--
ALTER TABLE `customer`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9351;

--
-- AUTO_INCREMENT för tabell `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18394;

--
-- AUTO_INCREMENT för tabell `goods`
--
ALTER TABLE `goods`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35749;

--
-- AUTO_INCREMENT för tabell `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8617;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `purchaseevent`
--
ALTER TABLE `purchaseevent`
  ADD CONSTRAINT `purchaseevent_ibfk_1` FOREIGN KEY (`purchaseId`) REFERENCES `purchase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseevent_ibfk_2` FOREIGN KEY (`eventId`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `purchasegoods`
--
ALTER TABLE `purchasegoods`
  ADD CONSTRAINT `purchasegoods_ibfk_1` FOREIGN KEY (`purchaseId`) REFERENCES `purchase` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchasegoods_ibfk_2` FOREIGN KEY (`goodsId`) REFERENCES `goods` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
