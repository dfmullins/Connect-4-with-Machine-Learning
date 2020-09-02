var logic = (function (parent, $, shared) {
	parent.computerCells = [];
	parent.opponentCells = [];
	parent.openCells = [];
	parent.potentialChoices = [];
	parent.urgentChoices = [];
	parent.orderedChoices = [];
	parent.computerWinMove = [];
	parent.urgentCell = "";
	parent.noCells = 0;
	
	parent.init = function (order) {
		if (true === parent.initRightLeftTop(parent.isFirstMove(order), order)) {
			parent.chooseSpace();
		}
	};
	
	parent.chooseSpace = function () {
		if (parent.potentialChoices.length > 0) {
			var id = parent.checkForWinMove();
			if ("" !== id) {
				parent.makeChoice(id);
			} else {
				id = parent.processMoveId();
			}
			
			if ("" === parent.urgentCell) {
				parent.initAjaxMoveCall(id); 
			} else {
				parent.makeChoice(parent.urgentCell);
			}
		}
	};
	
	parent.makeChoice = function (id) {
		$elem = $("#" + id);
		$elem.trigger('click');
		parent.clearMemory();
	};
	
	parent.processMoveId = function () {
		var id = parent.analyzeOpponentChoices();
		if ("" === id) {
			id = parent.potentialChoices[0];
		}
		
		return id;
	};
	
	parent.initAjaxMoveCall = function (id) {
		var data = {
			"jsOptionId": id,
			"moveCount": game.order,
			"openCells": parent.openCells,
			"potentialChoices": parent.potentialChoices,
			"urgentChoices": parent.urgentChoices,
			"opponentCells": parent.opponentCells,
			"computerCells": parent.computerCells,
			"orderedChoices": parent.orderedChoices
		}
		
		var func = {
			'afterAjax': function (payload, data) {
				return logic.triggerChoice(payload, data);
			}
		};
		
		var ajaxConfig = {
			'url': '/sample1/logic/index',
			'method': 'GET'
		}
		
		shared.ajax(ajaxConfig, data, func);
	};
	
	parent.triggerChoice = function (payload, data) {
		var id = data.jsOptionId;
		if ("" !== payload.value && null !== payload.value) {
			id = payload.value;
		}
		parent.makeChoice(id);
	};
	
	parent.chooseMostUrgent = function () {
		var id = "";
		if (parent.urgentChoices.length > 0) {
			parent.urgentChoices.sort();
			var choice = parent.urgentChoices[parent.urgentChoices.length - 1];
			id = choice.split("_")[1];
		}
		
		return id;
	};
	
	
	parent.getRecordWithHighestWeightAndFrequency = function (id) {
		var obj = {};
		for (var i = 0; i <= parent.computerWinMove.length; i++) {
			if (typeof parent.computerWinMove[i] !== "undefined") {
				var arr = parent.computerWinMove[i].split("_");
				if (obj.hasOwnProperty(arr[1])) {
					obj[arr[1]] = Number(obj[arr[1]]) + Number(arr[0]);
				} else {
					obj[arr[1]] = Number(arr[0]);
				}
			}
		}
		
		$.each(obj, function (index, value) {
			if (Number(value) >= 3) {
				id = index;
				return;
			}
		});
		
		return id;
	};
	
	parent.chooseWinningOption = function () {
		var id = "";
		if (parent.computerWinMove.length > 0) {
			parent.computerWinMove.sort();
			id = parent.getRecordWithHighestWeightAndFrequency(id);
		}
		
		return id;
	};
	
	parent.analyzeOpponentChoices = function () {
		for (var i = 0; i <= parent.opponentCells.length; i++) {
			var id = parent.opponentCells[i];
			if (typeof id !== "undefined") {
				var r = id.split("r")[1].split("c")[0];
				var c = id.split("c")[1];
				parent.itemsConnected(r, c, 0, "hR", "opp");
				parent.itemsConnected(r, c, 0, "hL", "opp");
				parent.itemsConnected(r, c, 0, "vert", "opp");
				parent.itemsConnected(r, c, 0, "dR", "opp");
				parent.itemsConnected(r, c, 0, "dL", "opp");
				parent.itemsConnected(r, c, 0, "dRneg", "opp");
				parent.itemsConnected(r, c, 0, "dLneg", "opp");
			}
		}
		
		return parent.chooseMostUrgent();
	};
	
	parent.checkForWinMove = function () {
		for (var i = 0; i <= parent.computerCells.length; i++) {
			var id = parent.computerCells[i];
			if (typeof id !== "undefined") {
				var r = id.split("r")[1].split("c")[0];
				var c = id.split("c")[1];
				parent.itemsConnected(r, c, 0, "hR", "comp");
				parent.itemsConnected(r, c, 0, "hL", "comp");
				parent.itemsConnected(r, c, 0, "vert", "comp");
				parent.itemsConnected(r, c, 0, "dR", "comp");
				parent.itemsConnected(r, c, 0, "dL", "comp");
				parent.itemsConnected(r, c, 0, "dRneg", "comp");
				parent.itemsConnected(r, c, 0, "dLneg", "comp");
			}
		}
		
		return parent.chooseWinningOption(); 
	};
	
	parent.itemsConnected = function (r, c, weight, type, who) {
		var id = "";
		if ("hR" === type) {
			c = Number(c) + 1;
			id = "r" + r + "c" + c;
		}
		
		if ("hL" === type) {
			c = Number(c) - 1;
			id = "r" + r + "c" + c;
		}
		
		if ("vert" === type) {
			r = Number(r) - 1;
			id = "r" + r + "c" + c;
		}
		
		if ("dR" === type) {
			r = Number(r) - 1;
			c = Number(c) + 1;
			id = "r" + r + "c" + c;
		}
		
		if ("dL" === type) {
			r = Number(r) - 1;
			c = Number(c) - 1;
			id = "r" + r + "c" + c;
		}
		
		if ("dRneg" === type) {
			r = Number(r) + 1;
			c = Number(c) + 1;
			id = "r" + r + "c" + c;
		}
		
		if ("dLneg" === type) {
			r = Number(r) + 1;
			c = Number(c) - 1;
			id = "r" + r + "c" + c;
		}
		
		if ("opp" === who) {
			parent.processForOpponentData(weight, id, r, c, type, who);	
		} else if ("comp" === who) {
			parent.processForComputerData(weight, id, r, c, type, who);	
		}
	};
	
	parent.processForComputerData = function (weight, id, r, c, type, who) {
		if (-1 !== $.inArray(id, parent.computerCells)) {
			weight = Number(weight) + 1;
			parent.itemsConnected(r, c, weight, type, who);
		} else {
			parent.validateForWinningCell(r, c, weight);
		}
	};
	
	parent.processForOpponentData = function (weight, id, r, c, type, who) {
		if (-1 !== $.inArray(id, parent.opponentCells)) {
			weight = Number(weight) + 1;
			parent.itemsConnected(r, c, weight, type, who);
		} else {
			parent.validateForUrgentCell(r, c, weight);
		}
	};
	
	parent.validateForWinningCell = function (r, c, weight) {
		var newC = "r" + r + "c" + c;
		if (-1 !== $.inArray(newC, parent.openCells)) {
			newC = weight + "_r" + r + "c" + c;
			parent.computerWinMove.push(newC);
		}
	};
	
	parent.validateForUrgentCell = function (r, c, weight) {
		var newC = "r" + r + "c" + c;
		if (-1 !== $.inArray(newC, parent.openCells)) {
			if (Number(weight) >= 2) {
				parent.urgentCell = "r" + r + "c" + c;
			}
			newC = weight + "_r" + r + "c" + c;
			parent.urgentChoices.push(newC);
		}
	};
	
	parent.clearMemory = function () {
		parent.computerCells = [];
		parent.opponentCells = [];
		parent.openCells = [];
		parent.potentialChoices = [];
		parent.urgentChoices = [];
		parent.computerWinMove = [];
		parent.noCells = true;
		parent.urgentCell = "";
	};
	
	parent.initRightLeftTop = function (moved, order) {
		if (false === moved) {
			parent.getChosenCells();
			parent.getOpenHorizSpaces("sub");
			parent.getOpenHorizSpaces("add");
			parent.getOpenVertSpaces();
			
			return true;
		}
	};
	
	parent.getOpenVertSpaces = function () {
		for (var i2 = 1; i2 <= 3; i2++) {
			for (var i = 0; i <= parent.opponentCells.length; i++) {
				var id = parent.opponentCells[i];
				if (typeof id !== "undefined") {
					var r = id.split("r")[1].split("c")[0] - Number(i2);
					var c = id.split("c")[1];
					parent.validateCell(r, c, parent.openCells);
				}
			}
		}
	};
	
	parent.getOpenHorizSpaces = function (dir) {
		for (var i2 = 1; i2 <= 3; i2++) {
			for (var i = 0; i <= parent.opponentCells.length; i++) {
				var id = parent.opponentCells[i];
				if (typeof id !== "undefined") {
					var r = id.split("r")[1].split("c")[0];
					var c = id.split("c")[1] - Number(i2);
					if ("add" === dir) {
						c = id.split("c")[1] + Number(i2);
					}
					parent.validateCell(r, c);
				}
			}
		}
	};
	
	parent.validateCell = function (r, c) {
		var newC = "r" + r + "c" + c;
		if (-1 !== $.inArray(newC, parent.openCells)) {
			parent.potentialChoices.push(newC);
		}
	}
	
	parent.isFirstMove = function (order) {
		if ((false === game.compFirst && 1 === Number(order)) 
			|| (true === game.compFirst && 2 === Number(order))) {
			var $elem = "";
			if ("" === $("#r6c4").attr('data-chosenBy')) {
				$elem = $("#r6c4");
			} else if ("" === $("#r6c5").attr('data-chosenBy')) {
				$elem = $("#r6c5");
			}
			
			$elem.trigger('click');
			return true;
		}
		
		return false;
	};
	
	parent.getChosenCells = function () {
		var count = 0
		$(".cell").each(function (i, elem) {
			var id = $(elem).prop("id");
			var chosenBy = $(elem).attr('data-chosenBy');
			if (1 === Number(chosenBy)) {
				parent.opponentCells.push(id);
				parent.populateOrderedChoices(elem, id, chosenBy);
			}
			
			if (2 === Number(chosenBy)) {
				parent.computerCells.push(id);
				parent.populateOrderedChoices(elem, id, chosenBy);
			}
			
			if ("" === chosenBy 
			    && 0 === Number($(elem).attr('data-blocked'))) {
				parent.openCells.push(id);
			}
			
			if ("" !== chosenBy) {
				count++;
			}
		});
		parent.noCells = count;
	};
	
	parent.populateOrderedChoices = function (elem, id, chosenBy) {
		var order_id = $(elem).attr('data-order') + "_" + chosenBy + "_" + id;
		if (-1 === $.inArray(order_id, parent.orderedChoices)) {
			parent.orderedChoices.push(order_id);
		}
	};
	
	return parent;
})(logic || {}, $, shared);


