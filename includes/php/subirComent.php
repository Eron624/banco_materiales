<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$contenido = $datos_request['contenido'];
$usuario = $datos_request['usuario'];
$idPubli = $datos_request['idPubli'];
$fecha_coment = $datos_request['fecha_coment'];

$datos['contenido'] = $contenido;
$datos['usuario'] = $usuario;
$datos['idPubli'] = $idPubli;
$datos['fecha_coment'] = $fecha_coment;

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
} else {
    try {
        $qry_subir_comentario = "INSERT INTO comentarios(contenido, usuario, idPubli, fecha_coment) VALUES (:contenido, :usuario, :idPubli, :fecha_coment)";

        $stmt = $conn->prepare($qry_subir_comentario);
        $stmt->bindParam(':contenido', $contenido);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':idPubli', $idPubli);
        $stmt->bindParam(':fecha_coment', $fecha_coment);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $error = 0;
        $mensaje = "COMENTARIO REGISTRADO CORRECTAMENTE";
    } catch (PDOException $e) {
        $datos['error'] = "1";
        $datos['mensaje'] = $e->getMessage();

        echo json_encode($datos);
    }
}
$datos['error'] = $error;
$datos['mensaje'] = $mensaje;
echo json_encode($datos);
?>