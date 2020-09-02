$(document).ready(function () {
	$("#newGame").on("click", function () {
		window.location = "/sample1/home/index";
	});
	
	$("#resetWins").on("click", function () {
		shared.resetWarning();
	});
	
	$("#about").on("click", function () {
		shared.openBootbox('About');
	});
	
	$("#instructions").on("click", function () {
		shared.openBootbox('Instructions');
	});
});

var shared = (function (parent, $) {
	parent.text = {
		"About": function () {
			return "This version of connect-4 uses a " +
				   "custom machine learning algorithm in conjuction with basic hard coded game play procedures. " +
				   "Each time the computer wins or loses, it uses that data in order to make improved choices for its next games. " +
	               "The more games the computer plays, the better it should get." +
				   "<br><br>Tech stack: HTML5, CSS3, Bootstrap, Jquery, JavaScript, Linux, Python, Django, & Sqlite" +
				   "<br><br>Developed by Damion Mullins";
		},
		"Instructions": function () {
			return "<ul>" +
					"<li>When it's your turn, click in a white cell</li>" +
					"<li>Try to make 4 of your cells connected (i.e. touching each other) either vertically, horizontally, or diagnoly in a straight line</li>" +
					"<li>If neither player can connect 4 and uses up all of the cells, the game is considered a draw</li>" +
					"</ul>";
		}
	};
	
	parent.ajax = function (ajaxConfig, data, func) {
		var request = $.ajax({
			url: ajaxConfig.url,
			method: ajaxConfig.method,
			data: data,
			dataType: "html"
		});
		
		request.done(function (result) {
			try {
				var payload = JSON.parse(result);
				func['afterAjax'](payload, data);
			} catch (e) {
				bootbox.alert("Server post error");
			}
		});
		
		request.fail(function () {
			
		})
	};
	
	parent.resetWarning = function () {
		bootbox.confirm("Are you sure you want to reset all wins?", function(result){ 
		    if (true === result) {
				parent.resetDatabase();
			}
		});
	};
	
	parent.resetDatabase = function () {
		parent.func = {
			'afterAjax': function (payload) {
				shared.databaseReset(payload);
			}
		};
		
		parent.ajaxConfig = {
			'url': '/sample1/home/reset_database',
			'method': 'GET'
		}
		
		shared.ajax(parent.ajaxConfig, parent.data, parent.func);
	};
	
	parent.databaseReset = function (payload) {
		if (1 === Number(payload.reset)) {
			bootbox.alert("Wins have been reset");
			$("#compWins").html(0);
			$("#playerWins").html(0);
			$("#draws").html(0);
		}
	};
	
	parent.openBootbox = function (type) {
		bootbox.alert({
			title: type,
		    message: parent.text[type](),
		    size: 'large'
		});
	};
	
	return parent;
})(shared || {}, $);