$(document).ready(function () {
	home.startGame();
});

var home = (function (parent, $, shared, game) {
	parent.func = {};
	parent.ajaxConfig = {};
	parent.data = {};
	
	parent.startGame = function () {
		parent.func = {
			'afterAjax': function (payload) {
				home.renderGame(payload);
			}
		};
		
		parent.ajaxConfig = {
			'url': '/sample1/home/start_game',
			'method': 'GET'
		}
		
		shared.ajax(parent.ajaxConfig, parent.data, parent.func);
	};
	
	parent.renderGame = function (payload) {
		$("#gameBoardCont").html(payload.gameBoard);
		parent.showWins(payload.wins);
		game.start();
	};
	
	parent.showWins = function (obj) {
		$("#compWins").html(obj.comp);
		$("#playerWins").html(obj.opp);
		$("#draws").html(obj.draw);
	};
	
	return parent;
})(home || {}, $, shared, game);