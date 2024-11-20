<?php
$host = 'localhost';
$port = '5432';
$dbname = 'proyectoseguridad';
$user = 'postgres';
$password = 'root';

try {
    // Crear conexión usando PDO
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo "Error al conectar a la base de datos: " . $e->getMessage();
    exit;
}
?>