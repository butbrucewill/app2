<?php
require_once __DIR__ . '/auth.php';
require_admin();

$method = $_SERVER['REQUEST_METHOD'];
$blogId = trim($_GET['id'] ?? '');
$blogColumns = [
    'title', 'h1', 'slug', 'excerpt', 'cover_image', 'cover_alt', 'category', 'tags', 'author',
    'published_at', 'meta_title', 'meta_description', 'focus_keyword', 'secondary_keywords',
    'canonical_url', 'index_status', 'schema_type', 'og_title', 'og_description', 'og_image',
    'content', 'status',
];

function blog_input(array $input, array $columns): array {
    $title = trim($input['title'] ?? '');
    if (strlen($title) < 3 || strlen($title) > 200) json_error('Title must be 3 to 200 characters', 422);
    $status = $input['status'] ?? 'draft';
    if (!in_array($status, ['draft', 'published'], true)) json_error('Invalid blog status', 422);
    $slug = strtolower(trim($input['slug'] ?? ''));
    $slug = preg_replace('/^https?:\/\/[^\/]+/', '', $slug);
    $slug = trim(str_replace('/blog/', '', $slug), '/');
    $slug = trim(substr(preg_replace('/[^a-z0-9]+/', '-', $slug ?: $title), 0, 90), '-');
    if ($slug === '') $slug = 'post';

    $values = [];
    foreach ($columns as $column) $values[$column] = trim((string) ($input[$column] ?? ''));
    $values['title'] = $title;
    $values['slug'] = $slug;
    $values['tags'] = implode(', ', array_filter(array_map('trim', explode(',', $values['tags']))));
    $values['secondary_keywords'] = implode(', ', array_filter(array_map('trim', explode(',', $values['secondary_keywords']))));
    $values['index_status'] = in_array($values['index_status'], ['index', 'noindex'], true) ? $values['index_status'] : 'index';
    $values['schema_type'] = in_array($values['schema_type'], ['BlogPosting', 'Article'], true) ? $values['schema_type'] : 'BlogPosting';
    if ($values['published_at'] === '' && $status === 'published') $values['published_at'] = gmdate('Y-m-d');
    $values['status'] = $status;
    return $values;
}

function unique_blog_slug(PDO $pdo, string $slug, string $exceptId = ''): string {
    $base = $slug;
    $suffix = 2;
    while (true) {
        $stmt = $pdo->prepare('SELECT blog_id FROM blogs WHERE slug = ? AND blog_id <> ? LIMIT 1');
        $stmt->execute([$slug, $exceptId]);
        if (!$stmt->fetch()) return $slug;
        $slug = $base . '-' . $suffix++;
    }
}

if ($method === 'GET') {
    if ($blogId !== '') {
        $stmt = db()->prepare('SELECT * FROM blogs WHERE blog_id = ? LIMIT 1');
        $stmt->execute([$blogId]);
        $blog = $stmt->fetch();
        if (!$blog) json_error('Blog not found', 404);
        json_out(['blog' => $blog]);
    }
    $rows = db()->query('SELECT blog_id, slug, title, excerpt, cover_image, cover_alt, category, author,
        published_at, index_status, canonical_url, status, sort_order, created_at, updated_at
        FROM blogs ORDER BY sort_order ASC, created_at DESC LIMIT 500')->fetchAll();
    json_out(['blogs' => $rows]);
}

if ($method === 'POST' && $blogId === '') {
    $input = blog_input(read_json_body(), $blogColumns);
    $pdo = db();
    $input['slug'] = unique_blog_slug($pdo, $input['slug']);
    $input['blog_id'] = 'BLOG-' . strtoupper(bin2hex(random_bytes(5)));
    $input['sort_order'] = (int) $pdo->query('SELECT COALESCE(MIN(sort_order), 0) - 1 FROM blogs')->fetchColumn();
    $input['created_at'] = gmdate('c');
    $input['updated_at'] = $input['created_at'];
    $columns = array_merge(['blog_id'], $blogColumns, ['sort_order', 'created_at', 'updated_at']);
    $stmt = $pdo->prepare('INSERT INTO blogs (' . implode(',', $columns) . ') VALUES (' . implode(',', array_fill(0, count($columns), '?')) . ')');
    $stmt->execute(array_map(fn($column) => $input[$column], $columns));
    $stmt = $pdo->prepare('SELECT * FROM blogs WHERE blog_id = ?');
    $stmt->execute([$input['blog_id']]);
    json_out(['blog' => $stmt->fetch()], 201);
}

if ($method === 'PUT' && $blogId !== '') {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT * FROM blogs WHERE blog_id = ? LIMIT 1');
    $stmt->execute([$blogId]);
    $current = $stmt->fetch();
    if (!$current) json_error('Blog not found', 404);
    $input = blog_input(read_json_body(), $blogColumns);
    $input['slug'] = unique_blog_slug($pdo, $input['slug'], $blogId);
    if ($input['published_at'] === '' && $current['published_at'] !== '') $input['published_at'] = $current['published_at'];
    $input['updated_at'] = gmdate('c');
    $sets = array_map(fn($column) => $column . ' = ?', array_merge($blogColumns, ['updated_at']));
    $stmt = $pdo->prepare('UPDATE blogs SET ' . implode(',', $sets) . ' WHERE blog_id = ?');
    $stmt->execute(array_merge(array_map(fn($column) => $input[$column] ?? $input['updated_at'], array_merge($blogColumns, ['updated_at'])), [$blogId]));
    $stmt = $pdo->prepare('SELECT * FROM blogs WHERE blog_id = ?');
    $stmt->execute([$blogId]);
    json_out(['blog' => $stmt->fetch()]);
}

if ($method === 'DELETE' && $blogId !== '') {
    $stmt = db()->prepare('DELETE FROM blogs WHERE blog_id = ?');
    $stmt->execute([$blogId]);
    json_out(['ok' => true]);
}

json_error('Method not allowed', 405);