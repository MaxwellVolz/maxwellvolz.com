$(function() {
    // Handler for .ready() called.

    // inital positioning of canvas
    console.log($("body").css("width"));





    // create the module and name it mvolzApp


    // console.log("hash: " + hash);



});

var mvolzApp = angular.module('mvolzApp', ['ngRoute']);

// create the controller and inject Angular's $scope

// configure our routes
mvolzApp.config(function($routeProvider) {
    $routeProvider

    // route for the home page
    .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'mvolzController'
    })
    .when('/home', {
        templateUrl: 'pages/home.html',
        controller: 'mvolzController'
    })

    // route for the about page
    .when('/about', {
        templateUrl: 'pages/about.html',
        controller: 'aboutController'
    })

    .when('/contact', {
        templateUrl: 'pages/contact.html',
        controller: 'contactController'
    })

    .when('/projects', {
        templateUrl: 'pages/projects.html',
        controller: 'projectController'
    })

    // .when('/knights', {
    //     templateUrl: 'otherSites/knights/index.html'
    //     // controller: 'projectController'
    // })

    // route for the contact page
    .when('/agarioClone', {
        templateUrl: 'pages/agarioClone.html',
        controller: 'contactController'
    });
});

// create the controller and inject Angular's $scope
mvolzApp.controller('mvolzController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Hello World';
});

mvolzApp.controller('aboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

mvolzApp.controller('projectController', function($scope) {
    $scope.message = 'Look! I am an about page.';
});

mvolzApp.controller('contactController', function($scope) {
    $scope.email = 'MaxwellVolz@gmail';

    $scope.message = 'Contact us! JK. This is just a demo.';
});
