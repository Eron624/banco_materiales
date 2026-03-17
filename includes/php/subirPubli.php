<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$titulo = $datos_request['titulo'];
$descripcion = $datos_request['descripcion'];
$urlImage = $datos_request['urlImage'];
$fecha = $datos_request['fecha'];
$usuario = $datos_request['usuario'];
$nombre = $datos_request['nombre'];

$datos['titulo'] = $titulo;
$datos['descripcion'] = $descripcion;
$datos['urlImage'] = $urlImage;
$datos['fecha'] = $fecha;
$datos['usuario'] = $usuario;
$datos['nombre'] = $nombre;

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$disponibilidad = 1;

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
}
else
{
    try
    {
        $qry_subir_publicacion = "INSERT INTO publicaciones(titulo, descripcion, urlImage, fecha, usuario, nombre, disponibilidad) VALUES (:titulo, :descripcion, :urlImage, :fecha, :usuario, :nombre, :disponibilidad)";

        $stmt = $conn->prepare($qry_subir_publicacion);
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':urlImage', $urlImage);
        $stmt->bindParam(':fecha', $fecha);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':disponibilidad', $disponibilidad);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $error = 0;
        $mensaje = "PUBLICACIÓN REGISTRADA CORRECTAMENTE";
    }
    catch(PDOException $e)
    {
        $datos['error'] = "1";
        $datos['mensaje'] = $e->getMessage();

        echo json_encode($datos);
    }
}
$datos['error'] = $error;
$datos['mensaje'] = $mensaje;
echo json_encode($datos);
?>