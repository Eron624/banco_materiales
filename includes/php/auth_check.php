<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function verificarAutenticacion()
{
    if (!isset($_SESSION["autentificado"]) || $_SESSION["autentificado"] !== "MUY_BIEN") {
        return false;
        exit;
    }
    return true;
}

function yaTieneSesionActiva()//LOGIN
{
    if (!isset($_SESSION["autentificado"]) || $_SESSION["autentificado"] !== "MUY_BIEN") {
        return false; // NO HAY sesión activa
    }
    return true; // YA HAY sesión activa
}

function obtenerDatosUsuario()
{
        return [
            'nombre' => $_SESSION["nombre"] ?? null,
        'usuario' => $_SESSION["usuario"] ?? null,
        'tipo_usr' => $_SESSION["tipo_usr"] ?? null
        ];
}
?>