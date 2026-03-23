<?php
header('Content-Type: application/json');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/ConexionBD.php');

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$porPagina = 5;
$offset = ($pagina - 1) * $porPagina;

try {
    $stmtTotal = $conn->prepare("SELECT COUNT(*) as total FROM publicaciones");
    $stmtTotal->execute();
    $totalRegistros = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

    $qry = "SELECT p.*, u.primer_nombre, u.apell_pat 
        FROM publicaciones p
        INNER JOIN usuario u ON p.usuario = u.usuario
        ORDER BY p.fecha DESC
        LIMIT :limit OFFSET :offset";

    $stmt = $conn->prepare($qry);

    $stmt->bindParam(':limit', $porPagina, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $publicaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($publicaciones as &$pub) {
        $pub['fecha'] = date('d/m/Y H:i', strtotime($pub['fecha']));

        if (!isset($pub['urlImage']) || $pub['urlImage'] === null || $pub['urlImage'] === '') {
            $pub['urlImage'] = '';
        }
    }

    $hayMas = ($pagina * $porPagina) < $totalRegistros;

    echo json_encode([
        'error' => 0,
        'data' => $publicaciones,
        'hayMas' => $hayMas
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'error' => 1,
        'mensaje' => 'Error en la base de datos '.$e->getMessage()
    ]);
}
?>