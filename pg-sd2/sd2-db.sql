-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 10, 2024 at 01:53 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_details`
--

CREATE TABLE `car_details` (
  `car_id` int NOT NULL,
  `model_name` varchar(100) NOT NULL,
  `year` varchar(50) DEFAULT NULL,
  `manufacturer` varchar(150) NOT NULL,
  `assembly_location` varchar(150) DEFAULT NULL,
  `class` varchar(50) DEFAULT NULL,
  `layout` varchar(100) DEFAULT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `related_models` text,
  `transmission` varchar(100) DEFAULT NULL,
  `description` text,
  `image_location` varchar(255) DEFAULT NULL,
  `rating` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `car_details`
--

INSERT INTO `car_details` (`car_id`, `model_name`, `year`, `manufacturer`, `assembly_location`, `class`, `layout`, `platform`, `related_models`, `transmission`, `description`, `image_location`, `rating`) VALUES
(1, 'Audi RS 6 quattro', '2002–2004, 2008–2010, 2013–present', 'Audi Sport GmbH for Audi AG', 'Germany, Neckarsulm', 'Executive car (E)', 'Front-engine, all-wheel-drive (quattro)', 'MLBevo series', 'Audi A6, Audi S6', 'Tiptronic automatic', 'High-performance luxury car.', 'audi_rs6.jpg', 4),
(2, 'Audi TT', '1998–2023', 'Audi AG', 'Hungary: Győr (engines and final assembly)', 'Sports car (S)', 'Front-engine, front-wheel-drive / Front-engine, all-wheel-drive (quattro)', 'Volkswagen Group A, Volkswagen Group MQB', 'N/A', '6-speed manual, 7-speed dual-clutch (M-DCT)', 'Sporty and dynamic with two body styles: coupé and roadster.', 'audi_tt.jpg', 5),
(3, 'Audi A3', '1996–present', 'Audi AG', 'Germany', 'Subcompact executive car', 'Front-engine, front-wheel-drive / all-wheel-drive (quattro)', 'N/A', 'Audi A3 Saloon, Audi S3', 'N/A', 'Compact luxury car with various body styles.', 'audi_a3.jpg', 3),
(4, 'Honda Accord', '1976–present', 'Honda', 'Various', 'Compact/Mid-size car', 'Front-engine, front-wheel-drive', 'N/A', 'Honda Civic, Honda CR-V', 'CVT, 6-speed manual, 7-speed dual-clutch', 'Popular sedan offering a blend of style and practicality.', 'honda_accord.webp', 5),
(5, 'Kia Sorento', '2002–present', 'Kia', 'Various', 'Compact SUV / Mid-size crossover SUV', 'Front-engine, rear-wheel-drive / front-engine, front-wheel-drive / front-engine, all-wheel-drive', 'N/A', 'Hyundai Santa Fe, Kia Sportage', '8-speed automatic', 'Spacious and versatile SUV.', 'kia_sorento.png', 5),
(6, 'Jaguar F-Type', '2013–2024', 'Jaguar Land Rover', 'United Kingdom', 'Grand Tourer (S)', 'Front-engine, rear-wheel-drive / all-wheel-drive', 'JLR D6a', 'Jaguar XK, Jaguar XKR', '8-speed automatic', 'Sleek, high-performance sports car.', 'jaguar_f-type.webp', 4),
(7, 'Jaguar XK', '1996–2014', 'Jaguar Cars', 'United Kingdom', 'Grand Tourer (S)', 'Front-engine, rear-wheel-drive', 'Jaguar XJS, Jaguar XJ', 'Jaguar XKR', '6-speed automatic', 'Luxury and performance in a coupé or convertible.', 'jaguar_xk.jpg', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_details`
--
ALTER TABLE `car_details`
  ADD PRIMARY KEY (`car_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_details`
--
ALTER TABLE `car_details`
  MODIFY `car_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
