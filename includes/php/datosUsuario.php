<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
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
    try
    {
        $qry_datos_usuario = "SELECT usuario, contrase, primer_nombre, segundo_nombre, apell_pat, apell_mat, correo, celular 
                                FROM usuario WHERE usuario = :usuario";

        $stmt = $conn->prepare($qry_datos_usuario);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        $registro = $stmt->fetch();

        $datos['data'] = $registro;

        $error = 0;
        $mensaje = "ENVÍO DE DATOS CORRECTO";
    }
    catch (PDOException $e)
    {
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