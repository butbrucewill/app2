<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') json_error('Method not allowed', 405);

$slug = trim($_GET['slug'] ?? '');
if ($slug !== '') {
    $stmt = db()->prepare("SELECT * FROM blogs WHERE slug = ? AND status = 'published' LIMIT 1");
    $stmt->execute([$slug]);
    $blog = $stmt->fetch();
    if (!$blog) json_error('Blog not found', 404);
    json_out(['blog' => $blog]);
}

$rows = db()->query("SELECT blog_id, slug, title, excerpt, cover_image, cover_alt, category, author,
    published_at, index_status, canonical_url, status, sort_order, created_at, updated_at
    FROM blogs WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC LIMIT 500")->fetchAll();
json_out(['blogs' => $rows]);