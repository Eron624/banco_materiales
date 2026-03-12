<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');

function sanitizar($DATOS = null)
{
    $datos_limpios = [];
    if (is_array($DATOS))
    {
        foreach ($DATOS as $llave => $valor)
        {
            $valor = trim($valor);
            $valor = stripslashes($valor);
            $valor = strip_tags($valor);
            $valor = htmlspecialchars($valor);

            $datos_limpios[$llave] = $valor;
        }
    }
    return $datos_limpios;
}

// Función alternativa mejorada
function sanitizarMejorado($DATOS = null)
{
    // Si no es array, devolver el valor tal cual
    if (!is_array($DATOS))
    {
        return $DATOS;
    }

    $datos_limpios = [];
    foreach ($DATOS as $llave => $valor) {
        // Manejar arrays recursivamente
        if (is_array($valor)) {
            $datos_limpios[$llave] = sanitizarMejorado($valor);
        }
        // Manejar strings - aplicar sanitización
        else if (is_string($valor)) {
            $valor = trim($valor);
            $valor = stripslashes($valor);
            $valor = strip_tags($valor);
            $valor = htmlspecialchars($valor, ENT_QUOTES, 'UTF-8');
            $datos_limpios[$llave] = $valor;
        }
        // Para otros tipos (números, booleanos, null) - mantener sin cambios
        else {
            $datos_limpios[$llave] = $valor;
        }
    }

    return $datos_limpios;
}
?>