<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$contrase = $datos_request['contrase'];
$usuario = $datos_request['usuario'];

$datos = [];

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
} else {
    try {
        $qry_cambio_contrase = "UPDATE usuario SET contrase = :contrase WHERE usuario = :usuario";

        $stmt = $conn->prepare($qry_cambio_contrase);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrase', $contrase);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $error = 0;
        $mensaje = "La Contraseña se Modificó con Éxito";
    } catch (PDOException $e) {
        $datos['error'] = 1;
        $datos['mensaje'] = $e->getMessage();

        echo json_encode($datos);
        exit;
    }
}
$datos['error'] = $error;
$datos['mensaje'] = $mensaje;
echo json_encode($datos);
?>