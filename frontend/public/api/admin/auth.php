<?php
// Shared admin auth check (Bearer token signed in admin/login.php)
require_once __DIR__ . '/../db.php';

function require_admin() {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (strpos($auth, 'Bearer ') !== 0) json_error('Not authenticated', 401);
    $token = substr($auth, 7);
    $parts = explode('.', $token);
    if (count($parts) !== 2) json_error('Invalid or expired token', 401);
    [$b64, $sig] = $parts;
    if (!hash_equals(hash_hmac('sha256', $b64, TOKEN_SECRET), $sig)) json_error('Invalid or expired token', 401);
    $payload = json_decode(base64_decode(strtr($b64, '-_', '+/')), true);
    if (!$payload || ($payload['sub'] ?? '') !== 'admin' || ($payload['exp'] ?? 0) < time()) {
        json_error('Invalid or expired token', 401);
    }
}
