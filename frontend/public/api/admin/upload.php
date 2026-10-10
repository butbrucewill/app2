<?php
require_once __DIR__ . '/auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_error('Choose an image to upload', 422);
}

$file = $_FILES['file'];
if ($file['size'] > 8 * 1024 * 1024) json_error('Image must be 8 MB or smaller', 422);
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];
if (!isset($extensions[$mime])) json_error('Only JPEG, PNG, WebP, and GIF images are supported', 422);

$uploadDir = dirname(__DIR__, 2) . '/uploads';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    json_error('Image storage is unavailable', 500);
}
$filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
if (!move_uploaded_file($file['tmp_name'], $uploadDir . '/' . $filename)) {
    json_error('Image upload failed', 500);
}

json_out(['url' => '/uploads/' . $filename], 201);