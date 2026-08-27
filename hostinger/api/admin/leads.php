<?php
// GET /api/admin/leads — newest first
require_once __DIR__ . '/auth.php';
require_admin();

$rows = db()->query('SELECT lead_id, name, email, whatsapp, city, interest, status, created_at FROM leads ORDER BY created_at DESC LIMIT 500')->fetchAll();
json_out(['leads' => $rows]);
