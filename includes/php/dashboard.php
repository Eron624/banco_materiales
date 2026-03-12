<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/auth_check.php');

if(verificarAutenticacion())
{
    $usuario = obtenerDatosUsuario();
    echo json_encode($usuario);
}
else
{
    $usuario['error'] = 1;
    echo json_encode($usuario);
}
?>