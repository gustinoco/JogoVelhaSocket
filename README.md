Para instalação no linux é necessário a instalação do NODEJS via terminal.

Execute a seguinte linha: 


sudo apt-get install -y nodejs




Após a instalação navegue no diretório extraido do Jogo

E faça

nodejs server.js




Para usuário Windows

Instale o NODEJS do site https://nodejs.org/en/download/current/

após a instalação(Só clicar em avançar, avançar que instala rapidão)

Abra o terminal do windows, vá até a pasta onde está entraido usando o comando 
"cd c:\diretorio\JogoDaVelha"

Após estar lá faça:


node server.js




Será iniciado a mensagem de execução e a aplicação está pronta para ser acessada de qualquer navegador.
 Através do seu IP local e a porta usada que é: 8090


Dicas de usabilidade


Se você é o jogador 1.

	--> Exibe mensagem aguardando segundo jogador.

	-->Quando o jogador 2 conectar, a tela do Jogador 1 é atualizada e exibida o jogo


Se você é o Jogador 2.

	--> Caso um terceiro jogador tentar conectar, é exibida uma informação que dois jogadores estão jogando

	--> Se um jogador sair
	
		-->Exibe mensagem do player que saiu.

--> Quando ganhar exibe a mensagem em uma nova MODAL.



Ainda assim é mostrado um ranking do resultado geral entre jogador 1 e jogador 2.