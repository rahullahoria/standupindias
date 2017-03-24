(function () {
    'use strict';

    angular
        .module('app')
        .controller('ExamsController', ExamsController);

    ExamsController.$inject = ['$scope','UserService', '$cookieStore', 'CandidateService', '$rootScope', 'FlashService','$location'];
    function ExamsController($scope, UserService, $cookieStore, CandidateService,  $rootScope, FlashService,$location) {
        var vm = this;

        vm.user = null;
        vm.inUser = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        vm.loadUser = loadUser;

        $scope.models = [
            {listName: "Topics Inside", items: [], dragging: false},
            {listName: "Topics Not Inside", items: [], dragging: false}
        ];

        /**
         * dnd-dragging determines what data gets serialized and send to the receiver
         * of the drop. While we usually just send a single object, we send the array
         * of all selected items here.
         */
        $scope.getSelectedItemsIncluding = function(list, item) {
            item.selected = true;
            return list.items.filter(function(item) { return item.selected; });
        };

        /**
         * We set the list into dragging state, meaning the items that are being
         * dragged are hidden. We also use the HTML5 API directly to set a custom
         * image, since otherwise only the one item that the user actually dragged
         * would be shown as drag image.
         */
        $scope.onDragstart = function(list, event) {
            list.dragging = true;
            if (event.dataTransfer.setDragImage) {
                var img = new Image();
                img.src = 'framework/vendor/ic_content_copy_black_24dp_2x.png';
                event.dataTransfer.setDragImage(img, 0, 0);
            }
        };

        /**
         * In the dnd-drop callback, we now have to handle the data array that we
         * sent above. We handle the insertion into the list ourselves. By returning
         * true, the dnd-list directive won't do the insertion itself.
         */
        $scope.onDrop = function(list, items, index) {
            angular.forEach(items, function(item) { item.selected = false; });
            list.items = list.items.slice(0, index)
                .concat(items)
                .concat(list.items.slice(index));
            return true;
        }

        /**
         * Last but not least, we have to remove the previously dragged items in the
         * dnd-moved callback.
         */
        $scope.onMoved = function(list) {
            list.items = list.items.filter(function(item) { return !item.selected; });
        };



        // Model to JSON for demo purpose
        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);

        initController();

        function initController() {
          //  loadCurrentUser();
           // loadAllUsers();

            //loadMonths();
            loadUser();
            loadToCallCandidates();

        }

        vm.setCurrentMon = function(){
            //console.log("i am in setCurrentMonth",vm.currentMonthIndex);

            vm.whichMonth.name = vm.threeMonths[vm.currentMonthIndex].name;
            vm.whichMonth.num = vm.threeMonths[vm.currentMonthIndex].num;
            console.log("i am in setCurrentMonth",vm.whichMonth);
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




        vm.loadSubject = function (id){
            vm.loadedExamId = id;
            CandidateService.GetExamSubjects(id
                )
                .then(function (response) {
                    vm.subjects = response.subjects;


                });
        };

        vm.loadSubjectTopics = function (examId, SubjectId){

            vm.loadedSubjectId = SubjectId;
            CandidateService.GetExamSubjectTopics(examId, SubjectId
                )
                .then(function (response) {
                    vm.topics = response.topics;
                    console.log(vm.topics.topics_in_exams);
                    $scope.models[0].items = vm.topics.topics_in_exams;
                    $scope.models[1].items = vm.topics.topics_not_in_exams;


                });

        };



        vm.loadToCallCandidates = loadToCallCandidates;

        vm.date1 = new Date().getDate();
        vm.getFun = function(work){
           return Math.floor((Math.random() * (work/60/60)) + (work/60/60/4));
        };



        function loadToCallCandidates(){
            vm.dataLoading = true;

            CandidateService.GetExams(''
                )
                .then(function (response) {
                    console.log("resp",response);

                    vm.exams = response.exams;
                    console.log("exams",vm.exams);
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