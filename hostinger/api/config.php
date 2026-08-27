<?php
// ============================================
// One Stock Academy — Database Configuration
// Fill in your Hostinger MySQL details below.
// (hPanel -> Databases -> Management shows these)
// ============================================

// Database host — on Hostinger shared hosting this is usually: localhost
define('DB_HOST', '');

// Database name — example: u763720042_onestock
define('DB_NAME', '');

// Database username — example: u763720042_OSA2026
define('DB_USER', '');

// Database password — the one you set when creating the database
define('DB_PASS', '');

// ============================================
// Admin dashboard password (/admin page)
// Change this to your own password.
// ============================================
define('ADMIN_PASSWORD', 'OneStock@Admin2026');

// Secret used to sign admin login tokens.
// Change this to any long random string (e.g. mash your keyboard).
define('TOKEN_SECRET', 'change-this-to-a-long-random-string');

// ---------- No need to edit below this line ----------

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
