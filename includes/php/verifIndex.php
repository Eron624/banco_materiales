<?php

header('Content-Type: application/json');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/auth_check.php');

if (yaTieneSesionActiva())
{
    $error = 6;
    $mensaje = "YA TIENES SESIÓN INICIADA";
    $datos['error'] = $error;
    $datos['mensaje'] = $mensaje;
    $usuarioLog = obtenerDatosUsuario();
    $datos['nombre'] = $usuarioLog['nombre'];
    $datos['usuario'] = $usuarioLog['usuario'];
    $datos['tipo_usr'] = $usuarioLog['tipo_usr'];

    echo json_encode($datos);
}
else
{
    $datos['error'] = 7;
    echo json_encode($datos);
}
?>