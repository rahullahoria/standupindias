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
              (`full_name`, `designation`, `mobile`, `email`, `company`, `company_type`, `industry`, `turnover`, creation)
              VALUES
              (:full_name, :designation, :mobile, :email, :company, :company_type, :industry, :turnover,:creation)";


    $updateOTP = 'update users set mobile_otp = :sms_otp where id = :id';
    $d =date("Y-m-d H:i:s");


    try {

            $db = getDB();

            $stmt = $db->prepare($sql);
        //var_dump($requestJson);

            $stmt->bindParam("full_name", $requestJson->full_name);
            $stmt->bindParam("designation", $requestJson->designation);
            $stmt->bindParam("mobile", $requestJson->mobile);
            $stmt->bindParam("email", $requestJson->email);
            $stmt->bindParam("company", $requestJson->company);
            $stmt->bindParam("company_type", $requestJson->company_type);
            $stmt->bindParam("industry", $requestJson->industry);
            $stmt->bindParam("turnover", $requestJson->turnover);
            $stmt->bindParam("creation", $d);

            $stmt->execute();




            $requestJson->id = $db->lastInsertId();
            if($requestJson->id){
                $optSMS = getOTP();
                $message = "$optSMS\nThank you for registring with www.StandupIndians.com,\nWe are thankful to be your Financial Advisers\n M.No. 9811669606 / 9899120768 ";
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
                echo '{"error":{"text":"' . $error.$errorMessage.'\nDetails'.$e->getMessage() . '"}}';
                $flag = true;
            }

        }
        //error_log($e->getMessage(), 3, '/var/tmp/php.log');
        if(!$flag)
        echo '{"error":{"text":"' . $e->getMessage() . '"}}';
    }
}