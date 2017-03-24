(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'datatables','timer','base64','ui.bootstrap.datetimepicker','dndLists'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
                
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })



            .when('/home', {
                controller: 'HomeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
                
            })

            .when('/member', {
                controller: 'MemberController',
                templateUrl: 'member/member.view.html',
                controllerAs: 'vm'

            })

            .when('/exams', {
                controller: 'ExamsController',
                templateUrl: 'exams/exams.view.html',
                controllerAs: 'vm'

            })

            .when('/test', {
                controller: 'TestController',
                templateUrl: 'test/test.view.html',
                controllerAs: 'vm'

            })
            .when('/test/:test/result', {
                controller: 'ResultController',
                templateUrl: 'result/result.view.html',
                controllerAs: 'vm'

            })
            .when('/prepare/:topic_name/:topic_id', {
                controller: 'PrepareController',
                templateUrl: 'prepare/prepare.view.html',
                controllerAs: 'vm'

            })



            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/');
            }
        });
    }

})();