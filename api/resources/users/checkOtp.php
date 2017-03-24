<?php
/**
 * Created by PhpStorm.
 * User: spider-ninja
 * Date: 3/4/17
 * Time: 10:43 AM
 */

function checkOtp($mobile, $otp){


    $sql = "SELECT *
                FROM users
                 WHERE
                  mobile =:mobile
                 and mobile_otp =:otp ;";


    $updateOTP = "update users set mobile_verified = 1 where 1";


    try {
        $db = getDB();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("mobile", $mobile);
        $stmt->bindParam("otp", $otp);

        // var_dump($user);die();

        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_OBJ);




        if(count($users) == 1) {
            $stmt = $db->prepare($updateOTP);

            $stmt->execute();

            echo '{"user": ' . json_encode($users[0]) . ',"auth": "true"}';
        }
        else
            echo '{"auth": "false"}';
        $db = null;


    } catch (PDOException $e) {
        //error_log($e->getMessage(), 3, '/var/tmp/php.log');
        echo '{"error":{"text":' . $e->getMessage() . '}}';
    }

}