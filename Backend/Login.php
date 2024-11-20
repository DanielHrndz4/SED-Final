<?php
include "connect.php";

// Definir la clave secreta (debe ser la misma que la usada para generar el JWT)
$secretKey = 'ASDFGhjq0192k@pqwjannaqnajnajsqinqinwnsanqunuwnnuwqnjJASNUQNJANQIW'; 

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
        // Obtener los datos enviados desde el frontend (login)
        $input = json_decode(file_get_contents("php://input"), true);

        if (empty($input['email']) || empty($input['password'])) {
            http_response_code(400);
            echo json_encode(["message" => "Todos los campos son obligatorios."]);
            exit;
        }

        // Consultar en ambas tablas, `student`, `teacher`, y `admin` para encontrar al usuario por su email
        $query = "SELECT * FROM student WHERE email = :email
                  UNION
                  SELECT * FROM teacher WHERE email = :email
                  UNION
                  SELECT * FROM admin WHERE email = :email";
        $stmt = $pdo->prepare($query);

        // Asignar el valor del email
        $stmt->bindParam(':email', $input['email']);
        $stmt->execute();

        // Obtener el usuario encontrado
        $result = $stmt->fetchAll();

        if ($result) {
            // Si se encontró al usuario, verificar la contraseña
            $user = $result[0]; // Suponemos que solo hay un usuario con el mismo email

            // Verificar la contraseña con password_verify
            if (password_verify($input['password'], $user['password'])) {
                // Si la contraseña es correcta, generar el JWT
                $payload = [
                    'username' => $user['firstname'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'iat' => time(),        // Fecha de emisión (issued at)
                    'exp' => time() + 3600  // Fecha de expiración (1 hora desde la emisión)
                ];

                // Crear el JWT
                $jwt = generateJWT($payload, $secretKey);

                // Responder con el token JWT
                http_response_code(200); // Código HTTP 200 para éxito
                echo json_encode([
                    "message" => "Inicio de sesión exitoso.",
                    "token" => $jwt,
                    "user" => $user
                ]);
            } else {
                // Si la contraseña es incorrecta
                http_response_code(401); // Código HTTP 401 para credenciales inválidas
                echo json_encode(["message" => "Email o contraseña incorrectos."]);
            }
        } else {
            http_response_code(401); // Código HTTP 401 para credenciales inválidas
            echo json_encode(["message" => "Email o contraseña incorrectos."]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error del servidor: " . $e->getMessage()]);
}

// Función para generar el JWT
function generateJWT($payload, $secretKey) {
    // Header
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
    // Payload
    $payload = json_encode($payload);
    // Codificar el header y el payload en Base64Url
    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);
    // Crear la firma
    $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secretKey, true);
    $base64UrlSignature = base64UrlEncode($signature);
    // Retornar el token completo
    return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
}

// Función para codificar en Base64Url (compatible con JWT)
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>