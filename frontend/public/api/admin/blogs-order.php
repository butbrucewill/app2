<?php
require_once __DIR__ . '/auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') json_error('Method not allowed', 405);
$ids = read_json_body()['ids'] ?? null;
if (!is_array($ids)) json_error('Blog order must be an array', 422);

$pdo = db();
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE blogs SET sort_order = ? WHERE blog_id = ?');
    foreach (array_values($ids) as $order => $id) {
        if (is_string($id)) $stmt->execute([$order, $id]);
    }
    $pdo->commit();
} catch (Throwable $error) {
    $pdo->rollBack();
    throw $error;
}
json_out(['ok' => true]);