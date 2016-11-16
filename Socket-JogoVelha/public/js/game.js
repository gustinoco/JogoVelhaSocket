//ta tudo ddentro do ready() pois é uma funcion do Jquery que é executada smepre que abre a pagina, nao necessariamente precsa
//chamar uma funcção para executar.
$(document).ready(function(){
	var socket = io();
	var score1 = 0, score2 = 0,ties=0;
	var squares;
	var ganhador =false;
	var moves = 0;
	var icon, iconother;
	var turn = {
		player : 1,
		square: 0		
	}


//recebe numero de usuarios do servidor. Caso 1 = remove mensagem que está exibindo em h1 e mostra mensagem de segundo jogador.	
	socket.on('users', function(num_users){
		//se temos 2 usuários remove mensagem e adiciona o corpo do jogo. 
	   if(num_users == 1)
	   { $('h1').remove();
		 $('body').append('<h1>Aguardando segundo jogador.</h1>');} 	
	   if(num_users == 2)
	   { $('h1').remove(); 
   
		socket.emit('geticon', 'abcde');//emite icone ao servidor
		//aguarda resposta de iconeenviado se X ou O e seta variavel iconeutilizado
		socket.on('icon',function(msg){
			icon = msg;
			if(icon == "X")
				iconother="O";
			else
				iconother="X";
		
		//adiciona ao corpo da pagina o jogo em si com um APPEND.
		$('body').append('\
		<div class="game">\
			<div class="board">\
				<div class="square top left"></div>\
				<div class="square top"></div>\
				<div class="square top right"></div>\
				<div class="square left"></div>\
				<div class="square"></div>\
				<div class="square right"></div>\
				<div class="square bottom left"></div>\
				<div class="square bottom"></div>\
				<div class="square bottom right"></div>\
			</div>\
			</div>\
	   <div class="scores p1">\
<p class="player1"><span class="p1">Você</span><span class="p2">Jogador 1</span> (<span class="x">' + icon + '</span>)<span class="score"> '+ score1 + '</span></p>\
<p class="ties">Empates<span class="score">' + ties + '</span></p>\
<p class="player2"><span class="p1">Jogador 2</span><span class="p2">Jogador 2</span> (<span class="o">'+ iconother + '</span>)<span class="score">' + score2 + '</span></p>\
</div>\
	   <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
  <div class="vertical-alignment-helper">\
  <div class="modal-dialog  vertical-align-center" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">&times;</span>\
        </button>\
      </div>\
	  </div>\
	 </div>\
    </div>\
  </div>\
	   </div>');  });	
	   }
	   //verificação de quantidade usuários conectados ao servidor. Caso>= 3 exibe mensagem de erro e que ele nao pode se conectar.
	   if(num_users >=3)
	    {	
			if(!$('body').children().length)
			$('body').append('<h1>Parece que dois jogadores já estão conectados no momento. Aguarde sua vez..</h1>');	
		}  	 

	});
	
		//evento de reload. Caso seja recebido do servidor faz um F5 na página. 
	socket.on('reload', function(msg){	   
	   location.reload(true);	   
   });	
   
  
	
		//evento que envia ao servidor quando clicado no elemento <div>  classe square.

	$("body").on("click", "div.square", function(event){
		
			turn.square = $(this).index();
				
			socket.emit('turn', turn);
	});
	

	socket.on('turnadd', function(turnval){
		
		//Recebe o valor recebido do servidor, faz uma análise de qual jogador que enviou e da um append no board com a respectiva posição.
		square_num = turnval.square;
		clicked_square = $(".board").find( "div.square:eq(" + square_num + ")" );
		
		if(!clicked_square.has("p").length) 
		{ 
		if( turn.player==1 )
				clicked_square.append('<p class="O">o</p>');
			else
				clicked_square.append('<p class="X">x</p>');
		
		

		//Verificação de ganhador. (transforma elementos da classe .square em array e faz a validação do jogo.)
		squares = $(".square").toArray();
		
		 ganhador  = false;
		 //IFS de validação de vencedor.
                if (squares[0].innerHTML && squares[0].innerHTML === squares[1].innerHTML  && squares[1].innerHTML === squares[2].innerHTML) {
                  ganhador = true;
                } else if (squares[3].innerHTML && squares[3].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[5].innerHTML ) {
                  ganhador = true;
                } else if (squares[6].innerHTML && squares[6].innerHTML ===  squares[7].innerHTML && squares[7].innerHTML ===  squares[8].innerHTML ) {
                  ganhador = true;
                } else if (squares[0].innerHTML && squares[0].innerHTML ===  squares[3].innerHTML && squares[3].innerHTML ===  squares[6].innerHTML ) {
                  ganhador = true;
                } else if (squares[1].innerHTML && squares[1].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[7].innerHTML ) {
                  ganhador = true;
                } else if (squares[2].innerHTML && squares[2].innerHTML ===  squares[5].innerHTML && squares[5].innerHTML ===  squares[8].innerHTML ) {
                  ganhador = true;
                } else if (squares[0].innerHTML && squares[0].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[8].innerHTML ) {
                  ganhador = true;
                } else if (squares[2].innerHTML && squares[2].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[6].innerHTML ) {
                  ganhador = true;
                }
                  
//se a variavel ganhador = true envia ao servidor o 'ganhador'
		if(ganhador === true)	
		{
			socket.emit('win', turn);
			turn.player = 3-turn.player;			
		}
		
		else if(moves === 8)
			{ 
		//mostra empate e reseta board.
				$('.modal-title').remove();
				$('.modal-header').append('<h3 class="modal-title">Empate!</h3> ' );
				$('#myModal').modal('show');
				resetboard();
				ties++;
				$('.ties > .score').empty();
				$('.ties > .score').append(ties);}
				
		else{
			turn.player = 3-turn.player;
			moves++;		
			socket.emit('getchance',turn);
		}
		
	}		
	});
	
	
	//aguarda escolha.
	socket.on('minhaescolha',function(msg)
	{	
			$('.player1').css("color", 'black');
			$('.player2').css('color', 'black');
			$(msg).css('color','#fff');
	});
	
// caso receba mensagem de que nao é sua vez.	
	socket.on('naoehsuavez', function(msg)
	{		
		$('.modal-title').remove();
		$('.modal-header').append('<h3 class="modal-title">' + msg + '</h3> ' );
		$('#myModal').modal('show');	
	});
  //socket aguarda mensagem de vencedor. Manda um checkscore pro servidor e reseta o board com 3 seg.
	socket.on('winmsg', function(msg)
	{
		$('.modal-title').remove();
		$('.modal-header').append('<h3 class="modal-title">' + msg + 'ganhou</h3> ' );
		$('#myModal').modal('show');
		socket.emit('checkscore', turn);
		setTimeout(resetboard, 3000);		 
	});
	//funcao socketg que atualiza o placar.
	socket.on('atualizaplacar', function(msg)
	{		
		if(!msg) score1++;
		if(msg) score2++;
		$('.player1 >.score').empty();
		$('.player2 >.score').empty();
		$('.player1 > .score ').append(score1/2);
		$('.player2 > .score ').append(score2/2);
	});
		
	//funcao que reseta board
	var resetboard = function()
	{	
		$('.square').empty('p');
		moves = 0;	
	}

});