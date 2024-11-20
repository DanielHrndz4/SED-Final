<?php
    include "connect.php";

    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    try {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents("php://input"), true);

            if (empty($input['name']) || empty($input['type']) || empty($input['date']) || empty($input['message'])) {
                http_response_code(400);
                echo json_encode(["message" => "Todos los campos son obligatorios."]);
                exit;
            }
            $query = "INSERT INTO request (name, type, date, message) 
                        VALUES (:name, :type, :date, :message)";
            $stmt = $pdo->prepare($query);
            
            $stmt->execute([
                ":name" => $input['name'],
                ":type" => $input['type'],
                ":date" => $input['date'],
                ":message" => $input['message']
            ]);
            http_response_code(201);
            echo json_encode(["message" => "Request agregado exitosamente."]);
        } else {

        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error del servidor: " . $e->getMessage()]);
    }
?>