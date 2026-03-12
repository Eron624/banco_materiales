<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

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
        $usuario = intval($datos_request['usuario']);
        $contrase = $datos_request['contrase'];
        $primer_nombre = $datos_request['primer_nombre'];
        $segundo_nombre = $datos_request['segundo_nombre'];
        $apell_pat = $datos_request['apell_pat'];
        $apell_mat = $datos_request['apell_mat'];
        $correo = $datos_request['correo'];
        $celular = $datos_request['celular'];
        $ctrl_intentos = 0;
        $flag = 1;

        $qry_registro = "INSERT INTO usuario 
            (usuario, contrase, primer_nombre, segundo_nombre, apell_pat, apell_mat, correo, celular, ctrl_intentos, flag) 
            VALUES (:usuario, :contrase, :primer_nombre, :segundo_nombre, :apell_pat, :apell_mat, :correo, :celular, :ctrl_intentos, :flag)";

        $stmt = $conn->prepare($qry_registro);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':contrase', $contrase);
        $stmt->bindParam(':primer_nombre', $primer_nombre);
        $stmt->bindParam(':segundo_nombre', $segundo_nombre);
        $stmt->bindParam(':apell_pat', $apell_pat);
        $stmt->bindParam(':apell_mat', $apell_mat);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':celular', $celular);
        $stmt->bindParam(':ctrl_intentos', $ctrl_intentos);
        $stmt->bindParam(':flag', $flag);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $error = 0;
        $mensaje = "EL USUARIO SE REGISTRO CORRECTAMENTE";
    }
    catch(PDOException $e)
    {
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