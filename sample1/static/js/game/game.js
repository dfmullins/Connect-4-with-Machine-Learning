$(document).ready(function () {
	$("#msgCont").html("Player 1 Begin");
});

$(document).on("click", ".cell", function (evt) {
	if (false === $("#msgCont").hasClass("done") && false == globals.disableClick) {
		game.cellClicked(evt.target.id);
	}
});

var globals = {
	disableClick: false
};

var game = (function (parent, $, globals) {
	parent.turn = 1;
	parent.order = 1;
	parent.vsComputer = 1;
	parent.disableClick = false;
	
	parent.start = function () {
		parent.updateBoard();
	};
	
	parent.cellClicked = function (id) {
		if ("" === $("#" + id).attr('data-chosenBy') 
		    && 0 === Number($("#" + id).attr('data-blocked'))) {
			$("#" + id).attr('data-chosenBy', parent.turn);
			$("#" + id).attr('data-order', parent.order);
			$("[data-chosenBy='1']")
				.css("background-color", "red")
				.html("1");
			$("[data-chosenBy='2']")
				.css("background-color", "blue")
				.html("2");
			parent.unBlockAboveCell(id);
			parent.changeTurn();
			$("#msgCont").html("Player " + parent.turn + " choose a square");
			parent.initWinCheck();
		}
	};
	
	parent.unBlockAboveCell = function (id) {
		var row = id.split("r")[1].split("c")[0] - 1;
		var cell = id.split("c")[1];
		if (0 !== row) {
			$("#r" + row + "c" + cell)
				.css("background-color", "#ffffff")
				.attr('data-blocked', 0);
		}
	};
	
	parent.changeTurn = function () {
		parent.turn = (1 === parent.turn) ? 2 : 1;
		if (1 === Number(parent.turn)) {
			parent.order = Number(parent.order) + 1;
		}
		
		if (2 === Number(parent.turn) && 1 === parent.vsComputer) {
			globals.disableClick = true;
			setTimeout(function(){
				parent.initComputerTurn();
			}, 1000);
		}
	};
	
	parent.updateBoard = function () {
		$(".cell").not("[id^=r6]").css("background-color", "#cccccc");
		$("[id^=r6]").attr('data-blocked', 0);
	};
	
	parent.initWinCheck = function () {
		logic.getChosenCells();
		parent.checkForWin(1);
		parent.checkForWin(2);
		parent.checkForStaleMate();
		logic.clearMemory();
	};
	
	parent.checkForStaleMate = function () {
		if (42 === Number(logic.noCells)) {
			$("#msgCont").addClass("done");
			$("#msgCont").html("It's a Draw!");
			parent.sendWinToApp(3);
		}
	};
	
	parent.initWin = function () {
		var winner = (1 === Number(parent.turn)) ? 2 : 1;
		$("#msgCont").addClass("done");
		$("#msgCont").html("Player " + winner + " Wins!");
		if (1 === Number(parent.vsComputer)) {
			parent.sendWinToApp(winner);
		}
	};
	
	parent.sendWinToApp = function (winner) {
		var data = {
			"winner": winner,
			"orderedChoices": logic.orderedChoices
		}
		
		var func = {
			'afterAjax': function (payload) {
				game.saveWinComplete(payload);
			}
		};
		
		var ajaxConfig = {
			'url': '/sample1/logic/win',
			'method': 'GET'
		}
		
		shared.ajax(ajaxConfig, data, func);
	};
	
	parent.saveWinComplete = function (payload) {
		if (0 === Number(payload.saved)) {
			alert("Win could not be saved to database");
		}
	};
	
	parent.checkForWin = function (user) {
		var arr = logic.opponentCells;
		if (2 === Number(user)) {
			arr = logic.computerCells;
		}
		arr.sort(function(a, b) {
			return a - b;
		});
		for (var i = 0; i <= arr.length; i++) {
			var id = arr[i];
			if (typeof id !== "undefined") {
				var r = id.split("r")[1].split("c")[0];
				var c = id.split("c")[1];
				var hRWin = parent.horizontalRightWin(r, c, arr);
				var hLWin = parent.horizontalLeftWin(r, c, arr);
				var vertWin = parent.verticalWin(r, c, arr);
				var pDiagWin = parent.positiveDiagnolWin(r, c, arr);
				var nDiagWin = parent.negativeDiagnolWin(r, c, arr);
				
				if (true === hRWin 
					|| true === hLWin
					|| true === vertWin
					|| true === pDiagWin
					|| true === nDiagWin) {
						parent.initWin();
						return true;
				}
			}
		}
	};
	
	parent.negativeDiagnolWin = function (r, c, arr) {
		var win = true;
		for (var i = 1; i <= 3; i++) {
			var newR = Number(r) - i;
			var newC = Number(c) - i;
			var nextCell = "r" + newR + "c" + newC;
			if (-1 === $.inArray(nextCell, arr)) {
				win = false;
			}
		}
		
		return win;
	};	
	
	parent.positiveDiagnolWin = function (r, c, arr) {
		var win = true;
		for (var i = 1; i <= 3; i++) {
			var newR = Number(r) - i;
			var newC = Number(c) + i;
			var nextCell = "r" + newR + "c" + newC;
			if (-1 === $.inArray(nextCell, arr)) {
				win = false;
			}
		}
		
		return win;
	};
	
	parent.verticalWin = function (r, c, arr) {
		var win = true;
		for (var i = 1; i <= 3; i++) {
			var newR = Number(r) - i;
			var nextCell = "r" + newR + "c" + c;
			if (-1 === $.inArray(nextCell, arr)) {
				win = false;
			}
		}
	
		return win;
	};
	
	parent.horizontalRightWin = function (r, c, arr) {
		var win = true;
		for (var i = 1; i <= 3; i++) {
			var newC = Number(c) + i;
			var nextCell = "r" + r + "c" + newC;
			if (-1 === $.inArray(nextCell, arr)) {
				win = false;
			}
		}
		
		return win;
	};
	
	parent.horizontalLeftWin = function (r, c, arr) {
		var win = true;
		for (var i = 1; i <= 4; i++) {
			var newC = Number(c) - i;
			var nextCell = "r" + r + "c" + newC;
			if (-1 === $.inArray(nextCell, arr)) {
				win = false;
			}
		}
		
		return win;
	};
	
	parent.initComputerTurn = function () {
		globals.disableClick = false;
		logic.init(parent.order);
	};
	
	return parent;
})(game || {}, $, globals, logic);



