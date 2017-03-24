(function () {
    'use strict';

    angular
        .module('app')
        .controller('TestController', TestController);

    TestController.$inject = ['$scope', '$sce','UserService', '$cookieStore', 'CandidateService', '$rootScope', 'FlashService','$location'];
    function TestController($scope,$sce,UserService,  $cookieStore, CandidateService,  $rootScope, FlashService,$location) {
        var vm = this;

        vm.user = null;
        vm.inUser = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.loadUser = loadUser;
        vm.seenSet = [];

        vm.loadUser = loadUser;
        vm.currentMonthIndex = 0;
        vm.dataLoading = false;

        initController();

        function initController() {
          //  loadCurrentUser();
           // loadAllUsers();

            //loadMonths();
            loadUser();
            //loadToCallCandidates();
            loadTest();

        }

        $scope.$on('$locationChangeStart', function(event, next, current){
            // Here you can take the control and call your own functions:
            console.log(event, next, current);
            if(next.indexOf('result') !== -1){

            }else{

            alert('Sorry ! Back Button is disabled');
            // Prevent the browser default action (Going back):
            event.preventDefault();
            }
        });





        vm.logout = function(){
            vm.inUser = null;
            UserService.DeleteInUser();
            $location.path('#/login');
        };

        function loadUser(){
            console.log("loading in user");
            vm.inUser = UserService.GetInUser();
            /*if(!vm.inUser.name)
                $location.path('/login');
            */
            console.log("in user",vm.inUser);


        }

        vm.currentQuestionNo = 0;
        function loadTest(){
            vm.tests = JSON.parse($cookieStore.get('tests'));
            vm.topicName = $cookieStore.get('topic_name');
            vm.subjectName = $cookieStore.get('subject_name');

            vm.testStartTime = new Date(vm.tests.test_start_time.replace(/-/g,"/"));
            vm.timeRemaing = 10;

            loadQuestion(0);


            console.log('test controller',vm.tests);
        }
        vm.uncheck = function (event) {
            if (vm.currentQuestion.response == event.target.value)
                vm.currentQuestion.response = false
        }

        vm.submitResponse = function(){
            console.log('response',vm.response, vm.tests.questions[vm.currentQuestionNo].response_id);
            if(vm.currentQuestion.response != 0)
            vm.tests.questions[vm.currentQuestionNo].done = true;
            else
            vm.tests.questions[vm.currentQuestionNo].done = false;
            //$cookieStore.put('tests', JSON.stringify(vm.responseStatus));
            CandidateService.SubmitRespnse(
                vm.inUser.md5,
                vm.tests.test_id,
                vm.tests.questions[vm.currentQuestionNo].response_id,
                {response:vm.currentQuestion.response})
                .then(function (response) {
                    vm.loadQuestion(vm.currentQuestionNo + 1);
                });

        }

        //vm.currentQuestion = {};
        function loadQuestion(index){

            if(vm.seenSet.indexOf(index) == -1) {
                vm.seenSet.push(index);
                console.log('I am inside push', vm.seenSet);
            }

            CandidateService.GetQuestion(vm.inUser.md5, vm.tests.test_id, vm.tests.questions[index].id)
                .then(function (response) {
                    if(response.questions == undefined){
                        $location.path('/test/'+vm.tests.test_id+'/result');
                    } else {
                        vm.currentQuestion = response.questions[0];

                        var currentdate = new Date(vm.currentQuestion.question_fetch_time.replace(/-/g, "/"));
                        vm.timeRemaing = parseInt(50 * vm.tests.questions.length - (currentdate.getTime() - vm.testStartTime.getTime()) / 1000);
                        //console.log('time remaing', vm.timeRemaing);
                        $scope.$broadcast('timer-add-cd-seconds', vm.timeRemaing);
                        if (vm.timeRemaing <= 0) {
                            console.log('i am nagative');
                            vm.showResults();
                        }

                        /*$timeout(function() {
                         console.log('senting timeout for',vm.timeRemaing);
                         $timeout(function() {
                         vm.showResults();
                         }, vm.testStartTime*1000);
                         }, 5000);*/


                        //console.log(vm.currentQuestion.question);
                    }
                });

        }

        vm.replacements = function(str){
            if(str == undefined)
                return str;
            console.log(typeof(str) );
            str = str.replace(/\\n/g, '')
                .replace(/\\r/g, '')
                .replace(/\\/g, '')
                .replace(/�s/g, '\'s')
                .replace(/�/g, '\'')

                .replace(/src="/g, 'src="http://'+vm.currentQuestion.source);
            console.log(str );
            return str;

        };

        vm.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        vm.htmlDecode = function (value) {
            return $("<textarea/>").html(value).text();
        }

        vm.htmlEncode = function (value) {
            return $('<textarea/>').text(value).html();
        }

        vm.currentQuestion = {};
        vm.loadQuestion = function (index){
            if(vm.seenSet.indexOf(index) == -1)
                vm.seenSet.push(index);



            console.log(index,vm.seenSet);
            if( vm.tests.questions[index]) {
                CandidateService.GetQuestion(vm.inUser.md5, vm.tests.test_id, vm.tests.questions[index].id)
                    .then(function (response) {
                        vm.currentQuestion = response.questions[0];
                        vm.currentQuestionNo = index;

                        var currentdate = new Date(vm.currentQuestion.question_fetch_time.replace(/-/g, "/"));
                        vm.timeRemaing = parseInt(50 * vm.tests.questions.length - (currentdate.getTime() - vm.testStartTime.getTime()) / 1000);
                        //console.log('time remaing', vm.timeRemaing);
                        if (vm.timeRemaing <= 0) {
                           // console.log('i am nagative');
                            vm.showResults();
                        }



                        //console.log(vm.currentQuestion.question);
                    });
            }

        }


        vm.showResultsConf = function(){
            $("#showResultsConfModel").modal("show");

        }

        vm.showResults = function(){
            vm.submitResponse();
            CandidateService.ShowResults(vm.inUser.md5, vm.tests.test_id)
                .then(function (response) {

                    $cookieStore.put('tests', '');

                    console.log(response);
                    $location.path('/test/'+vm.tests.test_id+'/result');
                });

        }








        /*function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }*/

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }





    }

})();