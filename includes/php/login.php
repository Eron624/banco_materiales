<?php
session_start();

header('Content-Type: application/json');

require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/seguridad.php');

$datos_request = json_decode(file_get_contents("php://input"), true);
$datos_request = sanitizar($datos_request);

$usuario = $datos_request['usuario'];
$contrase = $datos_request['contrase'];

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

if (is_null($conn)) {
    $error = 100;
    $mensaje = "ERROR REPORTARLO A LC20550585@chihuahua2.tecnm.mx";
}
else
{
    try
    {
        $qry_ingresar = "SELECT usuario, contrase, primer_nombre, apell_pat, flag, ctrl_intentos FROM usuario WHERE usuario = :usuario";// and contrase = :contrase";

        $stmt = $conn->prepare($qry_ingresar);
        $stmt->bindParam(':usuario', $usuario);
        //$stmt->bindParam(':contrase', $contrase);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        $registro = $stmt->fetch();
        $count = $stmt->rowcount();

        if($count == 1)
        {
            $activo = $registro['flag'];
            if ($activo == 1)
            {
                $intentos = $registro['ctrl_intentos'];
                if ($intentos > 5)
                {
                    $qry_desactivar_usuario = "UPDATE usuario set flag = 0 where $usuario = :usuario";
                    $stmt = $conn->prepare($qry_desactivar_usuario);
                    $stmt->bindParam(':usuario', $usuario);
                    $stmt->execute();

                    //ERROR {TU CUENTA HA SIDO BLOQUEADA}
                    $error = 2;
                    $mensaje = "ERROR EN LA CUENTA";
                }
                else
                {
                    if($registro['contrase'] == $contrase)
                    {
                        //REINICIAR INTENTOS
                        $qry_reiniciar_intentos = "UPDATE usuario SET ctrl_intentos = 0 WHERE $usuario = :usuario";
                        $stmt = $conn->prepare($qry_reiniciar_intentos);
                        $stmt->bindParam(':usuario', $usuario);
                        $stmt->setFetchMode(PDO::FETCH_ASSOC);
                        $stmt->execute();

                        //INGRESARLO
                        $nombre = $registro['primer_nombre'] . " " . $registro['apell_pat'];
                        $_SESSION["autentificado"] = "MUY_BIEN";
                        $_SESSION["nombre"]        = $nombre;
                        $_SESSION["usuario"] = $registro['usuario'];

                        $datos['nombre'] = $nombre;

                        $error = 0;
                        $mensaje = "DATOS CORRECTOS";
                    }
                    else
                    {
                        $intentos++;
                        $qry_incrementar_intentos = "UPDATE usuario set ctrl_intentos = $intentos where $usuario = :usuario";
                        $stmt = $conn->prepare($qry_incrementar_intentos);
                        $stmt->bindParam(':usuario', $usuario);
                        $stmt->execute();

                        //ERROR {CONTRASEÑA ERRÓNEA}
                        $error = 3;
                        $mensaje = "DATOS INCORRECTOS";
                    }
                }
            }
            else
            {
                //ERROR {TU CUENTA HA SIDO BLOQUEADA}
                $error = 2;
                $mensaje = "ERROR EN LA CUENTA";
            }
        }
        else
        {
            //ERROR {USUARIO ERRÓNEO}
            $error = 5;
            $mensaje = "DATOS INCORRECTOS";
        }
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