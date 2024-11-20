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

        if (empty($input['firstName']) || empty($input['lastName']) || empty($input['email']) || empty($input['subject'])) {
            http_response_code(400);
            echo json_encode(["message" => "Todos los campos son obligatorios."]);
            exit;
        }

        $query = "INSERT INTO teacher (firstname, lastname, email, phoneNumber, subject) 
                  VALUES (:firstName, :lastName, :email, :phoneNumber, :subject)";

        $stmt = $pdo->prepare($query);

        $stmt->execute([
            ":firstName" => $input['firstName'],
            ":lastName" => $input['lastName'],
            ":email" => $input['email'],
            ":phoneNumber" => $input['phoneNumber'] ?? null,
            ":subject" => $input['subject']
        ]);

        http_response_code(201);
        echo json_encode(["message" => "Profesor agregado exitosamente."]);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Metodo no permitido."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error del servidor: " . $e->getMessage()]);
}
?>