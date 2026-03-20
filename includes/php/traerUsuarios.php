<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$busqueda = $datos_request['busqueda'];
$datos = [];

if (is_null($conn))
{
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
}
else
{
    try
    {
        $qry_usuarios = "SELECT usuario, contrase, primer_nombre, segundo_nombre, apell_pat, apell_mat, correo, celular, ctrl_intentos, flag, tipo_usr 
                                FROM usuario 
                                WHERE usuario LIKE ? 
                                OR primer_nombre LIKE ? 
                                OR segundo_nombre LIKE ? 
                                OR apell_pat LIKE ? 
                                OR apell_mat LIKE ?
                                ORDER BY usuario ASC";

        $stmt = $conn->prepare($qry_usuarios);
        $termino_busqueda = "%" . $busqueda . "%";

        $stmt->execute([
            $termino_busqueda,
            $termino_busqueda,
            $termino_busqueda,
            $termino_busqueda,
            $termino_busqueda
        ]);

        $registros = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $datos['data'] = $registros;
        $datos['total'] = count($registros);

        $error = 0;
        $mensaje = "ENVÍO DE DATOS CORRECTO";
    }
    catch(PDOException $e)
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