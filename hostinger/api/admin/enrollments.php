<?php
// GET /api/admin/enrollments — newest first (kept for history; sales now happen on the course portal)
require_once __DIR__ . '/auth.php';
require_admin();

global $COURSES;
$rows = db()->query('SELECT * FROM enrollments ORDER BY created_at DESC LIMIT 500')->fetchAll();
$out = array_map(function ($d) use ($COURSES) {
    return [
        'order_ref'   => $d['order_ref'],
        'course_id'   => $d['course_id'],
        'course_name' => $COURSES[$d['course_id']]['name'] ?? $d['course_id'],
        'amount_inr'  => (int) $d['amount_inr'],
        'status'      => $d['status'],
        'name'        => $d['name'],
        'email'       => $d['email'],
        'phone'       => $d['phone'],
        'created_at'  => $d['created_at'],
        'paid_at'     => $d['paid_at'],
    ];
}, $rows);
json_out(['enrollments' => $out]);
