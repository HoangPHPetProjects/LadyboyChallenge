var app = angular.module('app', ['ngAnimate', 'ngAudio', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/menu', {
        templateUrl: 'menu.html',
        controller: 'menuCtrl'
    }).
    when('/game', {
        templateUrl: 'game.html',
        controller: 'gameCtrl'
    }).
    when('/leaderboard', {
        templateUrl: 'leaderboard.html',
        controller: 'leaderboardCtrl'
    }).
    otherwise({
        redirectTo: '/menu'
    });
}]);