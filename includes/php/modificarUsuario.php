<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$datos = [];

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
} else {
    try
    {
        $usuario = $datos_request['usuario'];
        $contrase = $datos_request['contrase'];
        $primer_nombre = $datos_request['primer_nombre'];
        $segundo_nombre = $datos_request['segundo_nombre'];
        $apell_pat = $datos_request['apell_pat'];
        $apell_mat = $datos_request['apell_mat'];
        $celular = $datos_request['celular'];
        $flag = $datos_request['flag'];
        $tipo_usr = $datos_request['tipo_usr'];
        $ctrl_intentos = $datos_request['ctrl_intentos'];

        $qry_modificar_usuario = 
        "UPDATE usuario 
        SET contrase = :contrase, 
        primer_nombre = :primer_nombre, 
        segundo_nombre = :segundo_nombre, 
        apell_pat = :apell_pat, 
        apell_mat = :apell_mat,
        celular = :celular,
        flag = :flag,
        tipo_usr = :tipo_usr,
        ctrl_intentos = :ctrl_intentos 
        WHERE usuario = :usuario";

        $stmt = $conn->prepare($qry_modificar_usuario);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrase', $contrase);
        $stmt->bindParam(':primer_nombre', $primer_nombre);
        $stmt->bindParam(':segundo_nombre', $segundo_nombre);
        $stmt->bindParam(':apell_pat', $apell_pat);
        $stmt->bindParam(':apell_mat', $apell_mat);
        $stmt->bindParam(':celular', $celular);
        $stmt->bindParam(':flag', $flag);
        $stmt->bindParam(':tipo_usr', $tipo_usr);
        $stmt->bindParam(':ctrl_intentos', $ctrl_intentos);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $error = 0;
        $mensaje = "SE REALIZÓ LA MODIFICACIÓN EXITOSAMENTE";
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