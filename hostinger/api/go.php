<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_error('Method not allowed', 405);
$slug = trim($_GET['slug'] ?? '');
if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) json_error('Link not found', 404);

$pdo = db();
$stmt = $pdo->prepare('SELECT destination_url FROM links WHERE slug = ? AND is_active = 1 LIMIT 1');
$stmt->execute([$slug]);
$link = $stmt->fetch();
if (!$link) json_error('Link not found', 404);

if (($_GET['check'] ?? '') === '1') json_out(['available' => true]);

$stmt = $pdo->prepare('UPDATE links SET clicks = clicks + 1 WHERE slug = ? AND is_active = 1');
$stmt->execute([$slug]);
if ($stmt->rowCount() !== 1) json_error('Link not found', 404);
header('Cache-Control: no-store');
header('Location: ' . $link['destination_url'], true, 302);
exit;