-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jan 06, 2025 at 06:25 PM
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
  `rating` int NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `seater` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `car_details`
--

INSERT INTO `car_details` (`car_id`, `model_name`, `year`, `manufacturer`, `assembly_location`, `class`, `layout`, `platform`, `related_models`, `transmission`, `description`, `image_location`, `rating`, `type`, `price`, `seater`) VALUES
(1, 'Audi RS 6 quattro', '2002–2004, 2008–2010, 2013–present', 'Audi Sport GmbH for Audi AG', 'Germany, Neckarsulm', 'Executive car (E)', 'Front-engine, all-wheel-drive (quattro)', 'MLBevo series', 'Audi A6, Audi S6', 'Tiptronic automatic', 'High-performance luxury car.', 'audi_rs6.jpg', 4, 'Petrol', 85000.00, 5),
(2, 'Audi TT', '1998–2023', 'Audi AG', 'Hungary: Győr (engines and final assembly)', 'Sports car (S)', 'Front-engine, front-wheel-drive / Front-engine, all-wheel-drive (quattro)', 'Volkswagen Group A, Volkswagen Group MQB', 'N/A', '6-speed manual, 7-speed dual-clutch (M-DCT)', 'Sporty and dynamic with two body styles: coupé and roadster.', 'audi_tt.jpg', 5, 'Petrol', 35000.00, 2),
(3, 'Audi A3', '1996–present', 'Audi AG', 'Germany', 'Subcompact executive car', 'Front-engine, front-wheel-drive / all-wheel-drive (quattro)', 'N/A', 'Audi A3 Saloon, Audi S3', 'N/A', 'Compact luxury car with various body styles.', 'audi_a3.jpg', 3, 'Diesel', 25000.00, 5),
(4, 'Honda Accord', '1976–present', 'Honda', 'Various', 'Compact/Mid-size car', 'Front-engine, front-wheel-drive', 'N/A', 'Honda Civic, Honda CR-V', 'CVT, 6-speed manual, 7-speed dual-clutch', 'Popular sedan offering a blend of style and practicality.', 'honda_accord.webp', 5, 'Hybrid', 22000.00, 5),
(5, 'Kia Sorento', '2002–present', 'Kia', 'Various', 'Compact SUV / Mid-size crossover SUV', 'Front-engine, rear-wheel-drive / front-engine, front-wheel-drive / front-engine, all-wheel-drive', 'N/A', 'Hyundai Santa Fe, Kia Sportage', '8-speed automatic', 'Spacious and versatile SUV.', 'kia_sorento.png', 5, 'Petrol', 38000.00, 7),
(6, 'Jaguar F-Type', '2013–2024', 'Jaguar Land Rover', 'United Kingdom', 'Grand Tourer (S)', 'Front-engine, rear-wheel-drive / all-wheel-drive', 'JLR D6a', 'Jaguar XK, Jaguar XKR', '8-speed automatic', 'Sleek, high-performance sports car.', 'jaguar_f-type.webp', 4, 'Electric', 65000.00, 2),
(7, 'Jaguar XK', '1996–2014', 'Jaguar Cars', 'United Kingdom', 'Grand Tourer (S)', 'Front-engine, rear-wheel-drive', 'Jaguar XJS, Jaguar XJ', 'Jaguar XKR', '6-speed automatic', 'Luxury and performance in a coupé or convertible.', 'jaguar_xk.jpg', 3, 'Petrol', 55000.00, 4);

-- --------------------------------------------------------

--
-- Table structure for table `ContactUs`
--

CREATE TABLE `ContactUs` (
  `id` int NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `submittedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favourites`
--

CREATE TABLE `favourites` (
  `favourite_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `product_id` int NOT NULL,
  `added_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `favourites`
--

INSERT INTO `favourites` (`favourite_id`, `customer_id`, `product_id`, `added_date`) VALUES
(3, 1, 4, '2025-01-06 16:56:14');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` int NOT NULL,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text,
  `review_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `product_id`, `customer_id`, `rating`, `review_text`, `review_date`) VALUES
(1, 4, 1, 4, 'hello', '2025-01-06 17:09:41'),
(2, 4, 2, 1, 'hi', '2025-01-06 17:26:12');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contactNumber` varchar(15) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `email`, `password`, `contactNumber`, `address`, `created_at`, `updated_at`) VALUES
(1, '123@gmail.com', '$2a$10$AUGS.JM3hnANJrjgawgnVOAXU7WwymYqhd.HinKeM72vyjCsmOM2C', NULL, NULL, '2025-01-04 20:44:21', '2025-01-04 20:45:00'),
(2, '234@gmail.com', '$2a$10$8.AYlhEMeTr/0KzsADt57uklhoYA7VqTXoKKwLIJ3U0lealYKDofW', '123456789', 'london', '2025-01-04 20:53:48', '2025-01-04 20:53:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_details`
--
ALTER TABLE `car_details`
  ADD PRIMARY KEY (`car_id`);

--
-- Indexes for table `ContactUs`
--
ALTER TABLE `ContactUs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `favourites`
--
ALTER TABLE `favourites`
  ADD PRIMARY KEY (`favourite_id`),
  ADD UNIQUE KEY `customer_id` (`customer_id`,`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_details`
--
ALTER TABLE `car_details`
  MODIFY `car_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ContactUs`
--
ALTER TABLE `ContactUs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `favourites`
--
ALTER TABLE `favourites`
  MODIFY `favourite_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
