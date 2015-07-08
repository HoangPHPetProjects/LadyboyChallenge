var app = angular.module('app');

app.controller('gameCtrl', ['$scope', '$http', 'ngAudio', function ($scope, $http, ngAudio) {
    $scope.point = 0;
    $scope.showImg = false;
    $scope.playerName = '';

    $scope.choices = [];
    $scope.leaderboard = [];

    var bingoSound = ngAudio.load("https://raw.githubusercontent.com/HoangPHPetProjects/LadyboyChallenge/gh-pages/sound/right.wav");
    var failSound = ngAudio.load("https://raw.githubusercontent.com/HoangPHPetProjects/LadyboyChallenge/gh-pages/sound/wrong.wav");
    failSound.volume = 0.3;

    var girls = [];
    var ladyboys = [];

    loadResources();

    $scope.choiceClick = function (item) {
        $scope.showImg = false;
        if (item.isGirl) {
            bingoSound.play();
            $scope.point++;
            $('#rightModal').openModal({
                complete: function () {
                    $scope.showImg = true;
                    $scope.$digest();
                }
            });
            loadImage($scope.point);
        } else {
            failSound.play();
            $('#wrongModal').openModal({
                complete: function () {
                    $scope.point = 0;
                    $scope.showImg = true;
                    $scope.$digest();
                }
            });
            loadImage(0);
        }
    };

    $scope.sendScore = function () {
        var scoreUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/leaderBoard?apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';
        var entry = { name: $scope.playerName, score: $scope.point };

        $http.post(scoreUrl, entry).then(function () {
            Materialize.toast('Your score has been submitted.', 3000);
            $('#wrongModal').closeModal();
            $scope.point = 0;
            $scope.showImg = true;
            $scope.playerName = '';
        });

    }

    function loadImage(point) {
        var items = [];
        items.push(getRandomItem(girls));

        if (point < 10) {
            items.push(getRandomItem(ladyboys));
        } else {
            items.push(getRandomItem(ladyboys));
            items.push(getRandomItem(ladyboys));
            items.push(getRandomItem(ladyboys));
        };

        if (point == 10) Materialize.toast('Things are getting harder. Be careful!!', 4000);
        $scope.choices = shuffleArray(items);
    };

    function loadResources() {
        var girlUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/girls?apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';
        var ldbUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/ladyboys?apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';

        $http.get(girlUrl).then(function (rs) {
            girls = rs.data;
            return ldbUrl;
        }).then($http.get).then(function (rs) {
            ladyboys = rs.data;
            return $scope.point;
        }).then(function () {
            loadImage($scope.point);
            $scope.showImg = true;
        });
    };
}
]);


app.controller('leaderboardCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.leaderboard = [];

    loadLeaderboard();

    function loadLeaderboard() {
        //Sort by score, only get top ten
        var scoreUrl = 'https://api.mongolab.com/api/1/databases/ladyboy_challenge/collections/' +
                       'leaderBoard?s={"score":-1}&l=10&apiKey=Rds2DpkLY7_VqsMfmgfSo_EdzafbQvOs';

        $http.get(scoreUrl).then(function (rs) {
            $scope.leaderboard = rs.data;
        });
    };
}]);

app.controller('menuCtrl', ['$scope', function ($scope) {
    //Nothing here
}]);