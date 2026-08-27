<?php
require_once __DIR__ . '/config.php';

function db() {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
        bootstrap($pdo);
    }
    return $pdo;
}

function bootstrap(PDO $pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        lead_id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        whatsapp VARCHAR(30) NOT NULL,
        city VARCHAR(80) NOT NULL,
        interest VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'new',
        created_at VARCHAR(40) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    $pdo->exec("CREATE TABLE IF NOT EXISTS enrollments (
        order_ref VARCHAR(40) PRIMARY KEY,
        course_id VARCHAR(20) NOT NULL,
        amount_inr INT NOT NULL,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(190) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at VARCHAR(40) NOT NULL,
        paid_at VARCHAR(40) NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}
