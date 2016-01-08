/**
 * Created by kevin gosse on 07/01/2016.
 */

import angular from "angular";

var app = angular.module("app", []);

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainCtrl', function(RandomUserFactory, UserFactory){
    var vm = this;
    vm.getRandomUser = getRandomUser;
    vm.login = login;

    function getRandomUser(){
        RandomUserFactory.getUser().then((response)=>{
            vm.randomUser = response.data;
        });
    }

    function login(username, password){
        UserFactory.login(username, password).then(function success(response){
            vm.user = response.data;
        }, handleError);
    }

    function handleError(response){
        alert('Error' + response.data);
    }
});

app.factory('UserFactory', function($http, API_URL){
    'use strict';

    return {
        login
    };

    function login(username, password){
        return $http.post(API_URL + '/login', {
            username,
            password
        });
    }
})

app.factory('RandomUserFactory', function($http, API_URL){
    return {
        getUser: getUser
    };

    function getUser(){
        return $http.get(API_URL + '/random-user');
    }
});

angular.element(document).ready(() => {
    angular.bootstrap(document, ["app"]);
});

