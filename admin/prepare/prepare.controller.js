(function () {
    'use strict';

    angular
        .module('app')
        .controller('PrepareController', PrepareController);

    PrepareController.$inject = ['UserService', '$cookieStore', 'CandidateService', '$routeParams', '$sce','$location'];
    function PrepareController(UserService, $cookieStore, CandidateService,  $routeParams, $sce,$location) {
        var vm = this;

        vm.user = null;
        vm.inUser = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.loadUser = loadUser;
        vm.whichMonth = {};
        vm.loadUser = loadUser;
        vm.currentMonthIndex = 0;
        vm.dataLoading = false;
        vm.subjectTotalQ = 0;

        initController();

        function initController() {
          //  loadCurrentUser();
           // loadAllUsers();

            //loadMonths();
            loadUser();
            loadToCallCandidates();

        }


        vm.logout = function(){
            vm.inUser = null;
            UserService.DeleteInUser();
            $location.path('#/login');
        };

        function loadUser(){
            vm.inUser = UserService.GetInUser();
            if(!vm.inUser.name)
                $location.path('/login');
            console.log("in user",vm.inUser);


        }



        vm.loadToCallCandidates = loadToCallCandidates;

        vm.date1 = new Date().getDate();
        vm.getFun = function(work){
           return Math.floor((Math.random() * (work/60/60)) + (work/60/60/4));
        };

        vm.videos = [];
        vm.others = [];
        function loadToCallCandidates(){
            vm.dataLoading = true;
            vm.topicName = $routeParams.topic_name;
            CandidateService.GetTopicMatter($routeParams.topic_id)
                .then(function (response) {
                    vm.matter = response.videos;


                    for(var i = 0; i < vm.matter.length; i++){
                        var temp = 0;
                        vm.matter[i].url = decodeURIComponent(vm.matter[i].url);
                        if(vm.matter[i].url.indexOf('youtube')) {
                            vm.matter[i].orgUrl = vm.matter[i].url;
                            vm.matter[i].url = vm.matter[i].url.replace('watch?v=','embed/');
                            var flag = 1;
                            for(var j=0;j< vm.videos.length;j++){
                                if(vm.videos[j].url == vm.matter[i].url) {

                                    flag = 0;
                                    break;
                                }


                            }
                            if(flag == 1)
                                vm.videos.push(vm.matter[i]);
                        }
                        else
                            vm.others.push(vm.matter[i]);
                    }

                    console.log('inside controller',vm.subjects);
                });

        }

        vm.getMetas =  function(url){
            var meta = {}
            $.get(url,
                function(data) {
                    meta.des = $(data).find('meta[name=adescription]').attr("content");
                    meta.title = $(data).find('meta[name=atitle]').attr("content");
                    meta.des = $(data).find('meta[name=adescription]').attr("content");
                });
            return meta;
        }

        vm.setProject = function (id) {

            vm.url =  $sce.trustAsResourceUrl(vm.videos[id].url);
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