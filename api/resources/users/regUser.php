<?php
/**
 * Created by PhpStorm.
 * User: spider-ninja
 * Date: 3/4/17
 * Time: 8:06 AM
 */

function regUser(){
    $request = \Slim\Slim::getInstance()->request();

    $requestJson = json_decode($request->getBody());



    $sql = "INSERT INTO `users`
              (`full_name`, `designation`, `mobile`, `email`, `company`, `company_type`, `industry`, `turnover`)
              VALUES
              (:full_name, :designation, :mobile, :email, :company, :company_type, :industry, :turnover)";


    $updateOTP = 'update users set mobile_otp = :sms_otp where id = :id';


    try {

            $db = getDB();

            $stmt = $db->prepare($sql);

            $stmt->bindParam("full_name", $requestJson->full_name);
            $stmt->bindParam("designation", $requestJson->designation);
            $stmt->bindParam("mobile", $requestJson->mobile);
            $stmt->bindParam("email", $requestJson->email);
            $stmt->bindParam("company", $requestJson->company);
            $stmt->bindParam("company_type", $requestJson->company_type);
            $stmt->bindParam("industry", $requestJson->industry);
            $stmt->bindParam("turnover", $requestJson->turnover);

            $stmt->execute();


            $requestJson->id = $db->lastInsertId();
            if($requestJson->id){
                $optSMS = getOTP();
                $message = "Thank you for registring with ExamHans.com,\nyou Mobile OTP is\n".$optSMS;
                sendSMS($requestJson->mobile, $message);



                $stmt = $db->prepare($updateOTP);
                $stmt->bindParam("sms_otp", $optSMS);
                $stmt->bindParam("id", $requestJson->id);
                $stmt->execute();

            }
            $db = null;


            echo '{"results": ' . json_encode($requestJson) . '}';



    } catch (Exception $e) {
        $errorMessage = " Already Exists";
        $errors = array('username','mobile','email');
        $flag = false;
        foreach($errors as $error){
            if (strpos($e->getMessage(), $error) !== false) {
                echo '{"error":{"text":"' . $error.$errorMessage . '"}}';
                $flag = true;
            }

        }
        //error_log($e->getMessage(), 3, '/var/tmp/php.log');
        if(!$flag)
        echo '{"error":{"text":"' . $e->getMessage() . '"}}';
    }
}