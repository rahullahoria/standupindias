<?php

require_once "header.php";

include 'db.php';
require 'Slim/Slim.php';

//sms lib
require_once "includes/sms.php";

//email lib
require_once "includes/error.php";

//Random string lib
require_once "includes/getRandonString.php";

//user
require_once "resources/users/regUser.php";
require_once "resources/users/getAllUsers.php";
require_once "resources/users/checkOtp.php";

require_once "resources/company/getCompanyTypes.php";
require_once "resources/industry/getIndustryTypes.php";
require_once "resources/auth/postUserAuth.php";


//app
require_once "app.php";



?>