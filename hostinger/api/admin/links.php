<?php
require_once __DIR__ . '/auth.php';
require_admin();

$method = $_SERVER['REQUEST_METHOD'];
$linkId = trim($_GET['id'] ?? '');
$linkColumns = ['title', 'slug', 'destination_url', 'page', 'section', 'button_label', 'is_active'];
$reservedLinkSlugs = ['admin', 'api', 'blog', 'enroll', 'login'];

function redirect_link_input(array $input, bool $creating): array {
    global $linkColumns, $reservedLinkSlugs;
    $values = [];
    foreach ($linkColumns as $column) {
        if (array_key_exists($column, $input)) $values[$column] = $input[$column];
    }
    if ($creating) {
        foreach (['title', 'slug', 'destination_url'] as $required) {
            if (!isset($values[$required]) || trim((string) $values[$required]) === '') {
                json_error(ucfirst(str_replace('_', ' ', $required)) . ' is required', 400);
            }
        }
        $values += ['page' => '', 'section' => '', 'button_label' => '', 'is_active' => true];
    }
    if (array_key_exists('title', $values)) {
        if (!is_string($values['title'])) json_error('Title must be text', 400);
        $values['title'] = trim($values['title']);
        if (strlen($values['title']) < 2) json_error('Title must be at least 2 characters', 400);
    }
    if (array_key_exists('slug', $values)) {
        if (!is_string($values['slug'])) json_error('Slug must be text', 400);
        $slug = trim($values['slug']);
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
            json_error('Slug must use lowercase letters, numbers, and hyphens', 400);
        }
        if (in_array($slug, $reservedLinkSlugs, true)) json_error('That slug is reserved', 400);
        $values['slug'] = $slug;
    }
    if (array_key_exists('destination_url', $values)) {
        if (!is_string($values['destination_url'])) json_error('Destination URL must be text', 400);
        $destination = trim($values['destination_url']);
        $parts = parse_url($destination);
        if (!is_array($parts) || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)
            || empty($parts['host'])) {
            json_error('Destination URL must be an http(s) URL', 400);
        }
        $values['destination_url'] = $destination;
    }
    foreach (['page', 'section', 'button_label'] as $field) {
        if (array_key_exists($field, $values)) {
            if (!is_string($values[$field])) json_error(ucfirst($field) . ' must be text', 400);
            $values[$field] = trim($values[$field]);
        }
    }
    if (array_key_exists('is_active', $values) && !is_bool($values['is_active'])) {
        json_error('is_active must be a boolean', 400);
    }
    return $values;
}

function assert_link_slug_available(PDO $pdo, string $slug, string $exceptId = ''): void {
    $stmt = $pdo->prepare('SELECT link_id FROM links WHERE slug = ? AND link_id <> ? LIMIT 1');
    $stmt->execute([$slug, $exceptId]);
    if ($stmt->fetch()) json_error('That slug is already in use', 409);
}

function is_duplicate_key(PDOException $exception): bool {
    return $exception->getCode() === '23000';
}

if ($method === 'GET' && $linkId === '') {
    $links = db()->query('SELECT * FROM links ORDER BY created_at DESC LIMIT 500')->fetchAll();
    json_out(['links' => $links]);
}

if ($method === 'POST' && $linkId === '') {
    $input = redirect_link_input(read_json_body(), true);
    $pdo = db();
    assert_link_slug_available($pdo, $input['slug']);
    $now = gmdate('c');
    $linkId = 'LINK-' . strtoupper(bin2hex(random_bytes(5)));
    $input += ['clicks' => 0, 'created_at' => $now, 'updated_at' => $now];
    $input['link_id'] = $linkId;
    $columns = ['link_id', 'title', 'slug', 'destination_url', 'page', 'section', 'button_label',
        'is_active', 'clicks', 'created_at', 'updated_at'];
    try {
        $stmt = $pdo->prepare('INSERT INTO links (' . implode(',', $columns) . ') VALUES ('
            . implode(',', array_fill(0, count($columns), '?')) . ')');
        $stmt->execute(array_map(fn($column) => $input[$column], $columns));
    } catch (PDOException $exception) {
        if (is_duplicate_key($exception)) json_error('That slug is already in use', 409);
        throw $exception;
    }
    $stmt = $pdo->prepare('SELECT * FROM links WHERE link_id = ?');
    $stmt->execute([$linkId]);
    json_out(['link' => $stmt->fetch()], 201);
}

if (($method === 'PUT' || $method === 'DELETE') && $linkId !== '') {
    $pdo = db();
    $stmt = $pdo->prepare('SELECT * FROM links WHERE link_id = ? LIMIT 1');
    $stmt->execute([$linkId]);
    $current = $stmt->fetch();
    if (!$current) json_error('Link not found', 404);

    if ($method === 'DELETE') {
        $stmt = $pdo->prepare('DELETE FROM links WHERE link_id = ?');
        $stmt->execute([$linkId]);
        json_out(['status' => 'deleted']);
    }

    $input = redirect_link_input(read_json_body(), false);
    if (isset($input['slug']) && $input['slug'] !== $current['slug']) {
        assert_link_slug_available($pdo, $input['slug'], $linkId);
    }
    if ($input) {
        $input['updated_at'] = gmdate('c');
        $sets = array_map(fn($column) => $column . ' = ?', array_keys($input));
        try {
            $stmt = $pdo->prepare('UPDATE links SET ' . implode(',', $sets) . ' WHERE link_id = ?');
            $stmt->execute(array_merge(array_values($input), [$linkId]));
        } catch (PDOException $exception) {
            if (is_duplicate_key($exception)) json_error('That slug is already in use', 409);
            throw $exception;
        }
    }
    $stmt = $pdo->prepare('SELECT * FROM links WHERE link_id = ?');
    $stmt->execute([$linkId]);
    json_out(['link' => $stmt->fetch()]);
}

json_error('Method not allowed', 405);