
$(document).ready(function(){
	var socket = io();
	var player = 1;
	
	var turn = {
		player : 1,
		name : "Player",
		square: 0
		//GLOBAL variable
	}
	
	
	
	$(".square").click( function(){
		if(!$(this).has("div").length)
		{   
			
			
			turn.square = $(this).index();
			
			socket.emit('turn', turn);
			
		}	
		return false;
	});
	

	socket.on('turn', function(turnval){
		//square number is index. squares begin from 0 not from one.
		square_num = turnval.square;
		
		console.log(square_num);
		
		if(turn.player==1)
				$(".board").find( "div.square:eq(" + square_num + ")" ).append('<div class=\"circle\"><svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="white" stroke-width="4" fill="none" /></svg></div>');
			else
				$(".board").find( "div.square:eq(" + square_num + ")" ).append("<div class=\"cross\">CROSS</div>");
		
		
		turn.player = 3-turn.player;					//GLOBAL change
		
	});
	
	 
});