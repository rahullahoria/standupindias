<?php
/**
 * Created by PhpStorm.
 * User: spider-ninja
 * Date: 3/24/17
 * Time: 10:44 AM
 */

function getCompanyTypes(){
    $sql = "SELECT SUBSTRING(COLUMN_TYPE,5) as str
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA='standupindians'
    AND TABLE_NAME='users'
    AND COLUMN_NAME='company_type'";

    try {

        $db = getDB();
        $stmt = $db->prepare($sql);

        //$stmt->bindParam("topic_id", $topicId);

        $stmt->execute();
        $in = $stmt->fetchAll(PDO::FETCH_OBJ);
        $str = $in[0]->str;
        $str = rtrim($str,")");
        $str = ltrim($str,"(");
        $options = str_getcsv($str, ',', "'");
        $db = null;

        echo '{"company_type": ' . json_encode($options) . '}';



    } catch (Exception $e) {
        //error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":"' . $e->getMessage() . '"}}';
    }
}