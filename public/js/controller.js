(function(angular) {
  'use strict';
angular.module('ngAppMinesweeper', ['minesweeperServiceModule']).controller('ngAppMinesweeperController', function($scope, $http, $interval, MinesweeperService) {
	$scope.rows = 8;
	$scope.cols = 8;
	$scope.mines = 8;
	$scope.status = 'Playing...';
	$scope.game = {};
	$scope.loadingGame = false;
	$scope.flagToggleOn = false;
	$scope.gamesLoaded = false;
	$scope.startTimer = function() {
		$scope.timerInterval = $interval(function() {
			$scope.game.playTime++;
		}, 1000);
	};
	$scope.stopTimer = function() {
		if ($scope.timerInterval !== undefined) {
			$interval.cancel($scope.timerInterval);
		}
	};
	$scope.handleError = function(error, isCreating) {
		if (response.status === -1) {
			alert('Destination unreachable.');
		}
		else if (response.status === 400) {
			let message = isCreating ? 'Invalid parameters! Please check rows, columns and mines.' : 'Invalid parameters, please do not tamper with arguments.';
			alert(message);
		}
		else {
			alert('Unknown error.');
		}
	};
	$scope.init = function() {
		$scope.gamesLoaded = false;
		MinesweeperService.loadAllGames().then(
			function(response) {
				$scope.games = response.data;
				$scope.gamesLoaded = true;
			}, 
			function(response) {
				$scope.handleError(response);
			}
		);
	};
	$scope.resume = function(id) {
		MinesweeperService.loadGame(id).then(
			function(response) {
				$scope.game = response.data[0];
				$('.nav-tabs a[href="#current-game"]').trigger('click');
			}, 
			function(response) {
				$scope.handleError(response);
			}
		);
	};
	$scope.erase = function(id) {
		MinesweeperService.deleteGame(id).then(
			function(response) {
				$scope.gamesLoaded = false;
				$scope.init();
			}, 
			function(response) {
				$scope.handleError(response);
			}
		);
	};
	$scope.toggleFlag = function() {
		$scope.flagToggleOn = !$scope.flagToggleOn;
	};
	$scope.newGame = function() {
		$scope.loadingGame = true;
		MinesweeperService.createNewGame($scope.rows, $scope.cols, $scope.mines).then( 
			function(response) { 
				$scope.game = response.data;
				$scope.status = 'Playing...';
				$scope.loadingGame = false;
			}, 
			function(response) {
				$scope.handleError(response);
				$scope.loadingGame = false;
			} 
		);
	};
	$scope.squareClick = function(evt, index) {
		if (evt.which !== 1) {
			return;
		}
		$scope.stopTimer();
		$scope.loadingGame = true;
		if ($scope.flagToggleOn) {
			MinesweeperService.flagSquare($scope.game, index).then(
				function(response) { 
					$scope.game = response.data;
					$scope.startTimer();
					$scope.loadingGame = false;
				}, 
				function(response) {
					$scope.handleError(response);
					$scope.loadingGame = false;
				}
			);
			return;
		}
		MinesweeperService.clickSquare($scope.game, index).then( 
			function(response) { 
				$scope.game = response.data;
				if ($scope.game.finished) {
					$scope.status = $scope.game.victory ? 'You win!' : 'You lose!';
				}
				else {
					$scope.startTimer();
				}
				$scope.loadingGame = false;
			}, 
			function(response) {
				$scope.handleError(response);
				$scope.loadingGame = false;
			}
		);
	}
	$scope.init();
});
})(window.angular);
