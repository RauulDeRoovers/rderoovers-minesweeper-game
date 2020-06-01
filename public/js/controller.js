(function(angular) {
  'use strict';
angular.module('ngAppMinesweeper', ['minesweeperServiceModule']).controller('ngAppMinesweeperController', function($scope, $http, $interval, MinesweeperService) {
	$scope.user = {
		id: undefined,
		user: 'Anonymous',
		password: undefined,
		signed: false,
		error: false
	};
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
	$scope.handleError = function(response, isCreating) {
		if (response.status === -1) {
			alert('Destination unreachable.');
		}
		else if (response.status === 400) {
			let message = isCreating ? 'Invalid parameters! Please check rows, columns and mines.' : 'Invalid parameters, please do not tamper with arguments.';
			alert(message);
		}
		else if (response.status === 405) {
			alert('Game is over, please click "New Game!" to start a new game.');
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
				$scope.handleError(response, true);
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
	};
	$scope.reload = function() {
		$scope.gamesLoaded = false;
		$scope.init();
	}
	$scope.login = function() {
		$scope.user.error = false;
		if ($scope.user.user === undefined || $scope.user.user === null || $scope.user.user.length < 4) {
			$scope.user.error = true;
			return;
		}
		if ($scope.user.password === undefined || $scope.user.password === null || $scope.user.user.password < 4) {
			$scope.user.error = true;
			return;
		}
		MinesweeperService.signIn($scope.user).then(
			function(response) {
				$scope.user.id = response.data.id;
				$scope.user.signed = true;
				$scope.reload();
			},
			function(response) {
				$scope.handleError(response);
			}
		);
	};
	$scope.logut = function() {
		$scope.user.id = undefined;
		$scope.user.user = 'Anonymous';
		$scope.user.password = undefined;
		$scope.user.signed = false;
		$scope.reload();
	};
	$scope.init();
});
})(window.angular);
