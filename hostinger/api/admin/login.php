<?php
// POST /api/admin/login — {password} -> {token}
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);

$b = read_json_body();
if (empty($b['password']) || !hash_equals(ADMIN_PASSWORD, $b['password'])) {
    json_error('Invalid password', 401);
}

$payload = ['sub' => 'admin', 'exp' => time() + 12 * 3600];
$b64 = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
$sig = hash_hmac('sha256', $b64, TOKEN_SECRET);
json_out(['token' => $b64 . '.' . $sig]);
