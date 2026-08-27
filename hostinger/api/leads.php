<?php
// POST /api/leads — save a "Chat With Us" form submission
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_error('Method not allowed', 405);

$b = read_json_body();
$name     = trim($b['name'] ?? '');
$email    = strtolower(trim($b['email'] ?? ''));
$whatsapp = trim($b['whatsapp'] ?? '');
$city     = trim($b['city'] ?? '');
$interest = ($b['interest'] ?? 'online') === 'offline' ? 'offline' : 'online';

if (strlen($name) < 2)                       json_error('Please enter your full name', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_error('Please enter a valid email', 422);
if (strlen($whatsapp) < 8 || strlen($whatsapp) > 15) json_error('Please enter a valid WhatsApp number', 422);
if (strlen($city) < 2)                       json_error('Please enter your city', 422);

$lead_id = 'LEAD-' . strtoupper(bin2hex(random_bytes(4)));

$stmt = db()->prepare('INSERT INTO leads (lead_id, name, email, whatsapp, city, interest, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
$stmt->execute([$lead_id, $name, $email, $whatsapp, $city, $interest, 'new', gmdate('c')]);

json_out(['status' => 'ok', 'lead_id' => $lead_id]);
