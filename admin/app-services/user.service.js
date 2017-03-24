(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', '$cookieStore'];
    function UserService($http, $cookieStore) {
        var service = {};

        service.Auth = Auth;





        service.GetInUser = function(){

            console.log('in user string',$cookieStore.get('inUser'));

            return JSON.parse($cookieStore.get('inUser'));

        }
        service.DeleteInUser = function(){

            $cookieStore.put('inUser', '{}');

        }

        function Auth(user) {

            return $http.post('https://api.examhans.com/auth', user).then(handleSuccess, handleError('Error creating user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
        return service;
    }

})();
