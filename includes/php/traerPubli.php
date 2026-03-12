<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');

// $datos_request = json_decode(file_get_contents("php://input"), true);
// $datos_request = sanitizar($datos_request);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

if (is_null($conn))
{
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
}
else
{
    try
    {
        $qry_publicaciones = "SELECT titulo, descripcion, urlImage, fecha, nombre FROM publicaciones";

        $stmt = $conn->prepare($qry_publicaciones);
        $stmt->execute();

        // Obtener TODOS los registros
        $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $count = $stmt->rowCount();

        $datos['data'] = $registros;

        $error = 0;
        $mensaje = "ENVÍO DE DATOS CORRECTO";
    }
    catch(PDOException $e)
    {
        $datos['error'] = "1";
        $datos['mensaje'] = $e->getMessage();

        echo json_encode($datos);
    }
$datos['error'] = $error;
$datos['mensaje'] = $mensaje;
echo json_encode($datos);
}
?>