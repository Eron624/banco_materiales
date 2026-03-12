<?php
session_start();
$_SESSION = array();
session_destroy();
// header("Location: /Intendencia/index.html");
echo json_encode(['exito' => 1]);
exit;
?>