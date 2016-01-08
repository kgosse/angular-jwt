/**
 * Created by kevin gosse on 07/01/2016.
 */

import angular from "angular";

var app = angular.module('app', [], function config($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainCtrl', function(RandomUserFactory, UserFactory){
    var vm = this;
    vm.getRandomUser = getRandomUser;
    vm.login = login;
    vm.logout = logout;

    function getRandomUser(){
        RandomUserFactory.getUser().then((response)=>{
            vm.randomUser = response.data;
        });
    }

    function login(username, password){
        UserFactory.login(username, password).then(function success(response){
            vm.user = response.data.user;
        }, handleError);
    }

    function logout() {
        UserFactory.logout();
        vm.user = null;
    }

    function handleError(response){
        alert('Error' + response.data);
    }
});

app.factory('UserFactory', function($http, API_URL, AuthTokenFactory){
    'use strict';

    return {
        login,
        logout
    };

    function login(username, password){
        return $http.post(API_URL + '/login', {
            username,
            password
        }).then(function success(response) {
            AuthTokenFactory.setToken(response.data.token);
            return response;
        });
    }

    function logout() {
        AuthTokenFactory.setToken();
    }
});

app.factory('RandomUserFactory', function($http, API_URL){
    return {
        getUser: getUser
    };

    function getUser(){
        return $http.get(API_URL + '/random-user');
    }
});

app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
    'use strict';
    var store = $window.localStorage;
    var key = 'auth-token';

    return {
        getToken,
        setToken
    };

    function getToken() {
        return store.getItem(key);
    }

    function setToken(token) {
        if (token) {
            store.setItem(key, token);
        } else {
            store.removeItem(key);
        }
    }

});

app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
    'use strict';
    return {
        request: addToken
    };

    function addToken(config) {
        var token = AuthTokenFactory.getToken();
        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    }
});

angular.element(document).ready(() => {
    angular.bootstrap(document, ["app"]);
});

