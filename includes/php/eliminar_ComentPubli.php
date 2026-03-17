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

        $conn->exec("SET SQL_SAFE_UPDATES = 0");

        $qry_eliminar = "DELETE FROM comentarios WHERE idPubli = :idPubli";
        $stmt = $conn->prepare($qry_eliminar);
        $stmt->bindParam(':idPubli', $idPubli);
        $stmt->execute();

        $conn->exec("SET SQL_SAFE_UPDATES = 1");

        $error = 0;
        $mensaje = "LOS COMENTARIOS SE ELIMINARON CON ÉXITO";
    } catch (PDOException $e) {
        $error = 1;
        $mensaje = "ENTRO AL CATCH";
    }

    $datos['error'] = $error;
    $datos['mensaje'] = $mensaje;
}
echo json_encode($datos);
