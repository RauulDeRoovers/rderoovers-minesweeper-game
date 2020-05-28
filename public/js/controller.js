(function(angular) {
  'use strict';
angular.module('ngAppMinesweeper', ['minesweeperServiceModule']).controller('ngAppMinesweeperController', function($scope, $http, MinesweeperService) {
  $scope.rows = 8;
  $scope.cols = 8;
  $scope.mines = 8;
  $scope.status = 'Playing...';
  $scope.game = undefined;
  $scope.init = function() {$scope.newGame()};
	$scope.newGame = function() {
		MinesweeperService.createNewGame($scope.rows, $scope.cols, $scope.mines).then( 
			function(response) { 
				$scope.game = response.data;
				$scope.status = 'Playing...';
			}, 
			function(response) {
				if (response.status === -1) {
					alert('Destination unreachable.');
				}
				else {
					alert('Unknown error.');
				}
			} 
		);
	};
	$scope.squareClick = function(index) {
		MinesweeperService.updateGame($scope.game.id, index).then( 
			function(response) { 
				$scope.game = response.data;
				if ($scope.game.finished) {
					$scope.status = $scope.game.victory ? 'You win!' : 'You lose!';
				}
			}, 
			function(response) {
				if (response.status === -1) {
					alert('Destination unreachable.');
				}
				else if (response.status === 405) {
					alert('Game is over, please click "New Game!" to start a new game.');
				}
				else if (response.status === 400) {
					alert('Invalid parameters, please do not tamper with arguments.');
				}
				else {
					alert('Unknown error.');
				}
			}
		);
	}
	$scope.init();
});
})(window.angular);
