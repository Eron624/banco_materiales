<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');

$datos_request = json_decode(file_get_contents("php://input"), true);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$datos = array();

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
} else {
    try {
        $idPubli = $datos_request['idPubli'];

        $qry_comentarios = "SELECT comentarios.idComent, comentarios.contenido, comentarios.usuario, comentarios.idPubli, comentarios.fecha_coment, usuario.primer_nombre, usuario.apell_pat FROM comentarios, usuario WHERE idPubli = :idPubli AND usuario.usuario = comentarios.usuario ORDER BY fecha_coment ASC";

        $stmt = $conn->prepare($qry_comentarios);
        $stmt->bindParam(':idPubli', $idPubli);
        $stmt->execute();

        // Obtener TODOS los registros
        $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $count = count($registros);

        $datos['data'] = $registros;
        $datos['count'] = $count;
        $error = 0;
        $mensaje = "ENVÍO DE DATOS CORRECTO";
    } catch (PDOException $e) {
        $datos['error'] = "1";
        $datos['mensaje'] = $e->getMessage();

        echo json_encode($datos);
        exit;
    }
}
$datos['error'] = $error;
$datos['mensaje'] = $mensaje;
echo json_encode($datos);
?>