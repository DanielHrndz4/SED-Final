<?php
include "connect.php";

// Establecer los encabezados para CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function base64UrlDecode($data) {
    // Asegurarse de agregar el relleno para la decodificación
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function verifyJWT($jwt, $secretKey) {
    // Divide el JWT en 3 partes
    list($encodedHeader, $encodedPayload, $encodedSignature) = explode('.', $jwt);

    // Decodifica el encabezado y el payload
    $header = json_decode(base64UrlDecode($encodedHeader), true);
    $payload = json_decode(base64UrlDecode($encodedPayload), true);

    // Verifica que el encabezado y payload existan
    if (!$header || !$payload) {
        return "Error al decodificar el encabezado o el payload.";
    }

    // Verifica la firma
    $signature = base64UrlDecode($encodedSignature);
    $expectedSignature = hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $secretKey, true);

    // Compara la firma generada con la firma en el token
    if (!hash_equals($signature, $expectedSignature)) {
        return "La firma no coincide. Token inválido.";
    }

    // Verifica si el token ha expirado
    if (isset($payload['exp']) && time() > $payload['exp']) {
        return "El token ha expirado.";
    }

    // Si todo es válido, devuelve el payload decodificado
    return $payload;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Obtener el token del encabezado Authorization
        $headers = apache_request_headers();
        $token = null;
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
        }

        if (!$token) {
            http_response_code(403); // Forbidden
            echo json_encode(["message" => "Token no proporcionado."]);
            exit;
        }

        $secretKey = 'ASDFGhjq0192k@pqwjannaqnajnajsqinqinwnsanqunuwnnuwqnjJASNUQNJANQIW'; 

        // Verificar el token
        $verificationResult = verifyJWT($token, $secretKey);
        
        if (is_array($verificationResult)) {
            // Token válido, continuar con la lógica de agregar al profesor
            $input = json_decode(file_get_contents("php://input"), true);

            if (empty($input['firstName']) || empty($input['lastName']) || empty($input['email']) || empty($input['subject']) || empty($input['password'])) {
                http_response_code(400);
                echo json_encode(["message" => "Todos los campos son obligatorios."]);
                exit;
            }

            // Encriptar la contraseña
            $hashedPassword = password_hash($input['password'], PASSWORD_BCRYPT);

            // Aquí agregas al profesor en la base de datos, incluyendo la contraseña encriptada
            $query = "INSERT INTO student (firstname, lastname, email, phoneNumber, subject, password) 
                      VALUES (:firstName, :lastName, :email, :phoneNumber, :subject, :password)";

            $stmt = $pdo->prepare($query);

            $stmt->execute([
                ":firstName" => $input['firstName'],
                ":lastName" => $input['lastName'],
                ":email" => $input['email'],
                ":phoneNumber" => $input['phoneNumber'] ?? null,
                ":subject" => $input['subject'],
                ":password" => $hashedPassword
            ]);

            http_response_code(201);
            echo json_encode(["message" => "Profesor agregado exitosamente."]);
        } else {
            // Si el token no es válido
            http_response_code(401); // Unauthorized
            echo json_encode(["message" => $verificationResult]); // Mensaje de error del token
        }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error del servidor: " . $e->getMessage()]);
}
?>
