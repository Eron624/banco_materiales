<?php
session_start();

header('Content-Type: application/json');

$datos_request = json_decode(file_get_contents("php://input"), true);
?>