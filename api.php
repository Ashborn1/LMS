<?php
require 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';

if ($action === 'load') {
    $data = [];
    $tables = ['users', 'books', 'requests', 'loans', 'history', 'rejections', 'extension_requests', 'tickets'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT * FROM $table");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($results as &$row) {
            if (isset($row['id'])) $row['id'] = (int)$row['id'];
            if (isset($row['bookId'])) $row['bookId'] = (int)$row['bookId'];
            if (isset($row['studentId'])) $row['studentId'] = (int)$row['studentId'];
            if (isset($row['borrowerId'])) $row['borrowerId'] = (int)$row['borrowerId'];
            if (isset($row['loanId'])) $row['loanId'] = (int)$row['loanId'];
            if (isset($row['userId']) && is_numeric($row['userId'])) $row['userId'] = (int)$row['userId'];

            if (isset($row['student_num'])) {
                $row['studentNum'] = $row['student_num'];
                unset($row['student_num']);
            }
            if (isset($row['extensions'])) $row['extensions'] = json_decode($row['extensions'], true) ?: [];
            if (isset($row['replies'])) $row['replies'] = json_decode($row['replies'], true) ?: [];
            if (isset($row['isWaitlist'])) $row['isWaitlist'] = (bool)$row['isWaitlist'];
            if (isset($row['is_archived'])) $row['is_archived'] = (bool)$row['is_archived'];
        }
        $data[$table] = $results;
    }
    echo json_encode($data);
    exit;
}

if ($action === 'sync') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        echo json_encode(["error" => "No data received"]);
        exit;
    }

    try {
        $pdo->beginTransaction();
        
        $pdo->exec("DELETE FROM users;");
        $pdo->exec("DELETE FROM books;");
        $pdo->exec("DELETE FROM requests;");
        $pdo->exec("DELETE FROM loans;");
        $pdo->exec("DELETE FROM history;");
        $pdo->exec("DELETE FROM rejections;");
        $pdo->exec("DELETE FROM extension_requests;");
        $pdo->exec("DELETE FROM tickets;");

        function insertData($pdo, $table, $rows, $dbColumns, $jsKeys = null) {
            if (empty($rows)) return;
            if ($jsKeys === null) $jsKeys = $dbColumns;

            $placeholders = implode(',', array_fill(0, count($dbColumns), '?'));
            $sql = "INSERT INTO $table (" . implode(',', $dbColumns) . ") VALUES ($placeholders)";
            $stmt = $pdo->prepare($sql);

            foreach ($rows as $row) {
                $values = [];
                foreach ($jsKeys as $jsKey) {
                    $val = $row[$jsKey] ?? null;
                    if (is_array($val)) $val = json_encode($val);
                    if (is_bool($val)) $val = $val ? 1 : 0;
                    $values[] = $val;
                }
                $stmt->execute($values);
            }
        }

        insertData($pdo, 'users', $input['users'], ['id','name','username','password','role','student_num','section','is_archived'], ['id','name','username','password','role','studentNum','section','is_archived']);
        insertData($pdo, 'books', $input['books'], ['id','title','cat','copies','author','published','icon','summary','is_archived']);
        insertData($pdo, 'requests', $input['requests'], ['id','bookId','studentId','studentName','reqStudentId','reqSection','reqContact','notes','isWaitlist','dateRequested']);
        insertData($pdo, 'loans', $input['loans'], ['id','bookId','borrowerId','borrower','due','notes','extensions']);
        insertData($pdo, 'history', $input['history'], ['id','bookId','borrowerId','borrower','due','returnedAt','notes','extensions','is_archived']);
        insertData($pdo, 'rejections', $input['rejections'], ['id','bookId','studentId','studentName','reqStudentId','reqSection','dateRequested','reason','dateProcessed','is_archived']);
        insertData($pdo, 'extension_requests', $input['extensionRequests'], ['id','loanId','bookName','studentName','reason']);
        
        insertData($pdo, 'tickets', $input['tickets'], ['id','userId','userName','subject','`desc`','date','time','status','replies']);

        $pdo->commit();
        echo json_encode(["success" => true]);

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        echo json_encode(["error" => $e->getMessage()]);
    }
    exit;
}
?>