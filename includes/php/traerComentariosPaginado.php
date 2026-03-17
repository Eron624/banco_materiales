<?php
header('Content-Type: application/json');
require_once($_SERVER['DOCUMENT_ROOT'] . '/banco_materiales/includes/php/conexionBD.php');

$obj_conexion = new ConexionBD();
$conn = $obj_conexion->getConexion();

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['idPubli']) || !isset($data['pagina'])) {
    echo json_encode([
        'error' => 1,
        'mensaje' => 'Faltan parámetros'
    ]);
    exit;
}

$idPubli = (int)$data['idPubli'];
$pagina = (int)$data['pagina'];
$porPagina = 3;
$offset = ($pagina - 1) * $porPagina;

try {
    $stmtTotal = $conn->prepare("
        SELECT COUNT(*) as total 
        FROM comentarios 
        WHERE idPubli = :idPubli
    ");
    $stmtTotal->bindParam(':idPubli', $idPubli, PDO::PARAM_INT);
    $stmtTotal->execute();
    $totalComentarios = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total'];

    $stmt = $conn->prepare("
        SELECT c.*, u.primer_nombre, u.apell_pat 
        FROM comentarios c
        INNER JOIN usuario u ON c.usuario = u.usuario
        WHERE c.idPubli = :idPubli
        ORDER BY c.fecha_coment DESC
        LIMIT :limit OFFSET :offset
    ");

    $stmt->bindParam(':idPubli', $idPubli, PDO::PARAM_INT);
    $stmt->bindParam(':limit', $porPagina, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $comentarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($comentarios as &$coment) {
        $coment['fecha_coment'] = date('d/m/Y H:i', strtotime($coment['fecha_coment']));
    }

    $hayMas = ($pagina * $porPagina) < $totalComentarios;

    echo json_encode([
        'error' => 0,
        'data' => $comentarios,
        'hayMas' => $hayMas
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'error' => 1,
        'mensaje' => 'Error en la base de datos '.$e->getMessage()
    ]);
}
?>