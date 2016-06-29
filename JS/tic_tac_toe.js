/*
 * Main Classes
 */
 
// Object that represents the user
var human =
	{ 
		moves: 0,
		SIDE: 'X',
	};

// Object that represents the machine
var machine =
	{ 
		moves: 0,
		side: 'O',
	};

// Object that represents the board
var board = 
	{
		box11: document.getElementById('box11'), box12: document.getElementById('box12'), box13: document.getElementById('box13'),
		box21: document.getElementById('box21'), box22: document.getElementById('box22'), box23: document.getElementById('box23'),
		box31: document.getElementById('box31'), box32: document.getElementById('box32'), box33: document.getElementById('box33'),
	};

// Object that represents the game
var game = 
	{
		turn: 'X',
		status: true,
	};


/* 
 * re-Iniatialize the game data in order to start over
 */
function newGame(){
	
	game.status = true;
	
	human.moves = 0;
	machine.moves = 0;
	
	board.box11.innerHTML = ' ', board.box12.innerHTML = ' '; board.box13.innerHTML = ' ';
	board.box21.innerHTML = ' '; board.box22.innerHTML = ' '; board.box23.innerHTML = ' ';
	board.box31.innerHTML = ' '; board.box32.innerHTML = ' '; board.box33.innerHTML = ' ';
	
	// remove background color from winning boxes
	for(var box in board) { 
		board[box].classList.remove("win");
	}
}

/*
 * Function that gets called when a player end his turn (pressed a box)
 */
function nextMove(box){
	
	if(box.innerHTML!=' ' || !inGame()) return;
	
	box.innerHTML = game.turn === 'X' ? 'X' : 'O';
	game.turn = game.turn === 'X' ? '0' : 'X';
	
	checkBoard();
}	

/*
 * Function that check whether we have a winner
 * If we do then it ends the game
 * If not then the game goes on
 * NOTE: could join all this ifs into a big one
 */
function checkBoard(){
	
	var winner = null;
	
	// check first row
	if( board.box11.innerHTML != ' ' && board.box11.innerHTML === board.box12.innerHTML && board.box12.innerHTML === board.box13.innerHTML){
		
		winner = board.box11.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check second row 
	else if( board.box21.innerHTML != ' ' && board.box21.innerHTML === board.box22.innerHTML && board.box22.innerHTML === board.box23.innerHTML){
		
		winner = board.box21.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check third row
	else if( board.box31.innerHTML != ' ' && board.box31.innerHTML === board.box32.innerHTML && board.box32.innerHTML === board.box33.innerHTML){
		
		winner = board.box31.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check first column
	else if( board.box11.innerHTML != ' ' && board.box11.innerHTML === board.box21.innerHTML && board.box21.innerHTML === board.box31.innerHTML){
		
		winner = board.box11.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check second column
	else if( board.box12.innerHTML != ' ' && board.box12.innerHTML === board.box22.innerHTML && board.box22.innerHTML === board.box32.innerHTML){
		
		winner = board.box12.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check third column
	else if( board.box13.innerHTML != ' ' && board.box13.innerHTML === board.box23.innerHTML && board.box23.innerHTML === board.box33.innerHTML){
		
		winner = board.box13.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check main diagonal
	else if( board.box11.innerHTML != ' ' && board.box11.innerHTML === board.box22.innerHTML && board.box22.innerHTML === board.box33.innerHTML){
		
		winner = board.box11.innerHTML === 'X' ? 'X' : 'O';
		game.status = false;
	}
	// check other diagonal
	else if( board.box31.innerHTML != ' ' && board.box31.innerHTML === board.box22.innerHTML && board.box22.innerHTML === board.box13.innerHTML){
		
		winner = board.box31.innerHTML === 'X' ? 'X' : 'O';		
		game.status = false;
	}
	
	if(!game.status){
		
		colorWinnerBoxes(winner);
		window.alert(winner + ' WINS');
	}   
}

/*
 * Function that checks whether we have an ongoing game
 */
function inGame(){
	
	return game.status;
}

/*
 * Function that colors the winning boxes
 */
function colorWinnerBoxes(winnerType){
	
	for(var box in board) { 
		if( board[box].innerHTML === winnerType){
			board[box].classList.add("win");
		}
	}
}





