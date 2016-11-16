var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);													//Hook websocket server to the http server 
var users = [];
var num_users = 0;
var port = 8090;

//Faz o servidor chamar ao acessar o endereço o index.html
app.get('/', function(req, res){
	
	res.sendFile(__dirname + '/index.html');
		
});
//Instancia a pasta dos arquivos de configuração *css *js
publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir));

io.sockets.on('connection', function(socket){
  
  
  users.push(socket);
  num_users = users.length;	
  console.log("Numero de jogadores ativos.: " + num_users);
  //envia numero de usuários com total de jogadores
  
  io.emit('users', num_users);
    
  //funcao de turn em que verifica o usuário e a jogada. Caso player 1  ou 2 envie caso nao esteja aceito, é enviado
  //a mensagem a tela que não é sua vez.
  socket.on('turn', function(turn){
  console.log("Jogador " + turn.player + " na posição "+turn.square );
    if( users[0] == socket && turn.player === 1){
		io.emit('turnadd', turn);				
}
		 //o envio de turnadd diz aos jogadores								
			
	
	else if( users[1] == socket && turn.player === 2)
	   io.emit('turnadd', turn);
		 	
			
	else
			socket.emit('naoehsuavez',"Opa, parece que não é sua vez!");	
	
	});

	//recebe mudança de icone
	socket.on('geticon',function(){		
		if(socket == users[0])
			socket.emit('icon', 'O');
		else
			socket.emit('icon','X');
	});

	//recebe socket 'win' dependendo o player manda a mensagem e atualiza o SCORE no final da pagina.

	socket.on('win',function(turn){
		
		if(turn.player === 1)

		{
			console.log("Jogador: "+turn.player + "ganhou.");
			users[1].emit('winmsg', "Jogador 2 ");
			users[0].emit('winmsg',"Você ");
			users[1].emit('atualizaplacar', 1);
			users[0].emit('atualizaplacar',0);
		}
		
		if(turn.player === 2)
		{
			console.log("Jogador: "+turn.player + "ganhou.");
			users[0].emit('winmsg', "Jogador 2 ");
			users[1].emit('winmsg',"Você ");
			users[0].emit('atualizaplacar', 1);
			users[1].emit('atualizaplacar',0);
		}
		
		
		});
	
	//aguarda turno e emite mensagem de escolha pro outro.
	socket.on('getchance', function(turn){

		if(turn.player === 1 && socket == users[0])
		{ socket.emit('minhaescolha','.player1'); users[1].emit('minhaescolha','.player2');}
		
		if(turn.player === 2 && socket == users[1])
		{ socket.emit('minhaescolha','.player1');
			users[0].emit('minhaescolha','.player2');}
		
		
	});
	
	//se for desconectado emite mensagem de reload.  

  socket.on('disconnect', function() {
       
	   if(socket == users[0] || socket == users[1])
	   io.emit('reload', 'reload');									
   
	   var i = users.indexOf(socket);
       users.splice(i, 1);					
	    
	   num_users = users.length;
	   console.log("Numero de jogadores: " + num_users);
	   		  
  });
	

});




http.listen( process.env.VCAP_APP_PORT || port , function(){
  console.log('Conectado na porta: ' + port);
});


