<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/conexionBD.php');

$datos_request = json_decode(file_get_contents("php://input"), true);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";

    $datos['error'] = $error;
    $datos['mensaje'] = $mensaje;
} else {
    try {
        $idPubli = $datos_request['idPubli'];
        $disponibilidad = $datos_request['disponibilidad'];

        $qry_disponibilidad = "UPDATE publicaciones SET disponibilidad = :disponibilidad WHERE idPubli = :idPubli";
        $stmt = $conn->prepare($qry_disponibilidad);
        $stmt->bindParam(':idPubli', $idPubli, PDO::PARAM_INT);
        $stmt->bindParam(':disponibilidad', $disponibilidad, PDO::PARAM_INT);
        $stmt->execute();

        $error = 0;
        $mensaje = "MODIFICACIÓN CON ÉXITO";
    }catch(PDOException $e)
    {
        $error = 1;
        $mensaje = "ENTRO AL CATCH: " . $e->getMessage();
    }

    $datos['error'] = $error;
    $datos['mensaje'] = $mensaje;
}

echo json_encode($datos);
?>