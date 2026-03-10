<?php
Class ConexionBD {
    //Parametros de la conexion
    
    private $dsn;
    private $username;
    private $password;
    private $conexion;
    private $mensaje;

	public function __construct( ) {
        $this->dsn = "mysql:host=localhost:3306; dbname=mantenimiento";
	    $this->username  = 'root';
	    $this->password  = 'Prueba123';

        try{ 
            $this->conexion = new PDO( $this->dsn, $this->username, $this->password);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->conexion->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        }
        catch(PDOException $e){
            //1045 error nombre de usuario o password
            //1049 error en la base de datos no existe
            //2002 host desconocido
            //0 driver desconocido

            //$msg =  "ERROR EN LA CONEXION EN LA LINEA: " . $e->getLine() . " <br>"; 
            //$msg .= "MENSAJE DE ERROR: " . $e->getMessage(). "<br>";
            //$msg .= "CODIGO DE LA EXCEPCION: ".$e->getCode();
            //$msg .= "SCRIPT CAUSANTE DE LA EXCEPCION: ".$e->getFile();
            //$msg .= "CADENA INFORMATIVA DE LA EXCEPCION: ".$e->__toString();              
            $this->mensaje = "ERROR EN LA CONEXIÓN";
        }
    }
    //Cierra la conexion a la Base de Datos
    public function __destruct() {
		$this->conexion = NULL;
	}

    //Funcion getConexion
    //Regresa una conexion a la Base de Datos usando PDO.
    public function getConexion() {
    	return $this->conexion;
    }

    public function getMensaje() {
    	return $this->mensaje;
    }
/*
    private function convertirUTF8($arreglo){
        array_walk_recursive($arreglo, function(&$elemento, $llave){
            if(!mb_detect_encoding($elemento, 'utf-8', true)){
                $elemento = utf8_encode($elemento);
            }
        });
    }
*/	
}
?>
