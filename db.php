<?php
$host = '127.0.0.1';
$db   = 'library_system';
$user = 'library_admin'; 
$pass = 'LibrarySecurePass2024!'; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>