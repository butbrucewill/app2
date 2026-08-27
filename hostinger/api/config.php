<?php
// One Stock Academy — API configuration
// On Hostinger shared hosting the database lives on the same server: keep localhost.
// These can also be overridden with environment variables.

define('DB_HOST', getenv('OSA_DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('OSA_DB_NAME') ?: 'u763720042_onestock');
define('DB_USER', getenv('OSA_DB_USER') ?: 'u763720042_OSA2026');
define('DB_PASS', getenv('OSA_DB_PASS') ?: '@Onestock2026');

// Password for the /admin dashboard — change this to your own before going live.
define('ADMIN_PASSWORD', getenv('OSA_ADMIN_PASSWORD') ?: 'OneStock@Admin2026');

// Secret used to sign admin tokens — change to any long random string.
define('TOKEN_SECRET', getenv('OSA_TOKEN_SECRET') ?: 'change-this-to-a-long-random-string-9f3k2x');

$COURSES = [
    'online'  => ['id' => 'online',  'name' => 'Online — Live Virtual Classes', 'price_inr' => 49990],
    'offline' => ['id' => 'offline', 'name' => 'Offline — In-Person Classroom', 'price_inr' => 199990],
];

function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function json_error($msg, $code = 400) {
    json_out(['detail' => $msg], $code);
}

function read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
