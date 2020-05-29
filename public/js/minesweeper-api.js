var minesweeperService = function($http) {
	return {
		createNewGame: function(rows, cols, mines) {
			let data = JSON.stringify({
				rowCount: rows,
				columnCount: cols,
				mineCount: mines
			});
			//return $http.post('http://localhost:8080/create', data);
			return $http.post('https://minesweeper-rest-service.herokuapp.com/create', data);
		},
		updateGame: function(id, index) {
			let data = JSON.stringify({
				id: id,
				square: index
			});
			//return $http.patch('http://localhost:8080/update', data);
			return $http.patch('https://minesweeper-rest-service.herokuapp.com/update', data);
		},
		flagSquare: function(id, index) {
			let data = JSON.stringify({
				id: id,
				square: index
			});
			//return $http.patch('http://localhost:8080/flag', data);
			return $http.patch('https://minesweeper-rest-service.herokuapp.com/flag', data);
		}
	}
};

var app = angular.module('minesweeperServiceModule', []);
app.service('MinesweeperService', minesweeperService);