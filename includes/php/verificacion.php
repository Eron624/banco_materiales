<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$usuario = $datos_request['usuario'];
$datos = [];

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
} else {
    if (verificarUsuario($usuario)) {
        $error = 0;
        $mensaje = "USUARIO ENCONTRADO";
        $datos['data'] = verificarUsuario($usuario);
    } else {
        $error = 1;
        $mensaje = "USUARIO NO ENCONTRADO";
    }
}
$datos['error'] = $error;
$datos['mensaje'] = $mensaje;
echo json_encode($datos);
exit;

function verificarUsuario($usuario)
{
    try {
        $obj_conexion = new ConexionBD();
        $conn = $obj_conexion->getConexion();

        $qry_usuario = "SELECT usuario, contrase, flag FROM usuario WHERE usuario = :usuario";

        $stmt = $conn->prepare($qry_usuario);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        $registro = $stmt->fetch();
        $count = $stmt->rowcount();

        if ($count == 1) {
            return $registro;
        } else {
            return false;
        }
    } catch (PDOException $e) {
        $datos['error'] = 2;
        $datos['mensaje'] = $e->getMessage();

        echo json_encode($datos);
        exit;
    }
}
?>