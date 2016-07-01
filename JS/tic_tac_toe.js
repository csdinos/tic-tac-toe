
/**
 *  Author: Konstantinos Vlachantonis
 */

/**
 * User object
 */
var human =
	{
		moves: 0,
		side: 'X',
    wins: document.getElementById('human'),
		img: '../pics/corgi.jpg'
	};


/**
 * Machine object
 */
var machine =
	{
		moves: 0,
		side: 'O',
    wins: document.getElementById('machine'),
		img: '../pics/pug.jpg'
	};


/**
 * Board object
 */
var board =
	{
		box11: document.getElementById('box11'), box12: document.getElementById('box12'), box13: document.getElementById('box13'),
		box21: document.getElementById('box21'), box22: document.getElementById('box22'), box23: document.getElementById('box23'),
		box31: document.getElementById('box31'), box32: document.getElementById('box32'), box33: document.getElementById('box33'),
	};


/**
 * Game object
 */
var game =
	{
		turn: 'X',
		status: true,
	};


/**
 * newGame - re-Iniatialize the game data in order to start over
 */
function newGame(){

	game.status = true;

	human.moves = 0;
	machine.moves = 0;

	board.box11.classList.remove("X","O"); board.box12.classList.remove("X","O"); board.box13.classList.remove("X","O");
	board.box21.classList.remove("X","O"); board.box22.classList.remove("X","O"); board.box23.classList.remove("X","O");
	board.box31.classList.remove("X","O"); board.box32.classList.remove("X","O"); board.box33.classList.remove("X","O");

	// temp until we add pics
	removeImages(board);

  if(game.turn === machine.side){
    machineMove();
  }

}

/**
 * removeImages - clear board from images in order to start a new game
 *
 * @param  {HTML element} board the game's board
 */
function removeImages(board){

	for(var box in board) {
		removeAllChildren(board[box]);
	}
}


/**
 * removeAllChildren - remove all element's children
 *
 * @param  {HTML element} box one of the board's boxes
 */
function removeAllChildren(box){

	while (box.hasChildNodes()) {
	    box.removeChild(box.lastChild);
	}
}

/**
 * humanMove - Function that gets called when a player end his turn (pressed a box)
 *
 * @param  {HTML element} box The board's box that got clicked by the user
 */
function humanMove(box){

	if(!isEmpty(box) || !inGame()) return;

	makeMove(human,box);

	game.turn = machine.side;

	checkBoard();

  if(inGame()) machineMove();
}

/**
 * checkClass - check whether 3 elements have one same class
 *
 * @param  {HTML element} box1
 * @param  {HTML element} box2
 * @param  {HTML element} box3
 * @return {boolean}      result
 */
function checkClass(box1, box2, box3){

	if( (box1.classList.contains('X') && box2.classList.contains('X') && box3.classList.contains('X'))
			|| (box1.classList.contains('O') && box2.classList.contains('O') && box3.classList.contains('O')) ){

		return true;
	}

	return false;
}

/**
 * checkClass2 - check whether 2 elements have one same class
 *
 * @param  {HTML element} box1
 * @param  {HTML element} box2
 * @return {boolean}      result
 */
function checkClass2(box1, box2){

	if( (box1.classList.contains('X') && box2.classList.contains('X')) || (box1.classList.contains('O') && box2.classList.contains('O')) ){

		return true;
	}

	return false;
}

/**
 * checkIfTie - Checks whether all board has been filled up.
 * Since it's used after checkBoard() for winner we can safely assume that
 * a fully filled board = TIE game
 *
 * @return {boolean}  filled or not
 */
function checkIfTie(){

  var tie = true;

  for(var box in board) {

      if( isEmpty(board[box]) ){
        tie = false;
        break;
  		}
  	}

  if(tie){
    game.status = false;
    return true;
  }
  else{
    return false;
  }
}

function isEmpty(box){

	//if not X nor O
	if( !(box.classList.contains('X') || box.classList.contains('O')) ){
		return true;
	}

	return false;
}

/*
 * Function that checks whether we have an ongoing game
 */
function inGame(){

	return game.status;
}

/**
 * NOTE: steps 3 and 4 are missing cause otherwise machine is never gonna lose
 *
 * 1. Win: If you have two in a row, play the third to get three in a row.
 * 2. Block: If the opponent has two in a row, play the third to block them.
 * 3. Fork: Create an opportunity where you can win in two ways.
 * 4. Block Opponent's Fork:
 *    Option 1: Create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork or winning.
 *    For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win.
 *    (Playing a corner in this scenario creates a fork for "X" to win.)
 *    Option 2: If there is a configuration where the opponent can fork, block that fork.
 * 5. Center: Play the center.
 * 6. Opposite Corner: If the opponent is in the corner, play the opposite corner.
 * 7. Empty Corner: Play an empty corner.
 * 8. Empty Side: Play an empty side.
 */
function machineMove(){

  var moveMade = checkBoardIf('win');

  if(!moveMade) moveMade = checkBoardIf('block');

  if(!moveMade) moveMade = playCenter();

  if(!moveMade) moveMade = playOppositeCorner();

  if(!moveMade) moveMade = playEmptyCorner();

  if(!moveMade) moveMade = playEmptySide();

  game.turn = human.side;
  checkBoard();
}

/**
 * playCenter - make machine move on the center box
 *
 * @return {boolean}  whether a move was made
 */
function playCenter(){

  if( isEmpty(board.box22)){

    makeMove(machine,board.box22);
    return true;
  }

  return false;
}

function makeMove(who, where){

	var img = document.createElement("img");
	img.src = who.img;
	where.appendChild(img);
	// box.innerHTML = human.side;
	where.classList.add(who.side);
}

/**
 * playOppositeCorner - check whehter the machine can play in an opposite corner
 *
 * @return {boolean}  whether there was a move in an opposite corner
 */
function playOppositeCorner(){

  if(board.box11.classList.contains(human.side) && isEmpty(board.box33)){

    makeMove(machine,board.box33);
    return true;
  }
  else if(board.box33.classList.contains(human.side) && isEmpty(board.box11)){

    makeMove(machine,board.box11);
    return true;
  }
  else if(board.box31.classList.contains(human.side) && isEmpty(board.box13)){

    makeMove(machine,board.box13);
    return true;
  }
  else if(board.box13.classList.contains(human.side) && isEmpty(board.box31)){

    makeMove(machine,board.box31);
    return true;
  }

  return false;
}


/**
 * playEmptyCorner - machine plays on an empty corner
 *
 * @return {boolean}  whether there was a move on an empty corner
 */
function playEmptyCorner(){

  if(isEmpty(board.box11)){

    makeMove(machine,board.box11);
    return true;
  }
  else if(isEmpty(board.box33)){

    makeMove(machine,board.box33);
    return true;
  }
  else if(isEmpty(board.box31)){

    makeMove(machine,board.box31);
		return true;
  }
  else if(isEmpty(board.box13)){

    makeMove(machine,board.box13);
		return true;
  }

  return false;
}

/**
 * playEmptySide - machine plays on an empty side
 *
 * @return {boolean}  whether there was a move on an empty side
 */
function playEmptySide(){

  if(isEmpty(board.box12)){

    makeMove(machine,board.box12);
    return true;
  }
  else if(isEmpty(board.box21)){

    makeMove(machine,board.box21);
		return true;
  }
  else if(isEmpty(board.box32)){

    makeMove(machine,board.box32);
		return true;
  }
  else if(isEmpty(board.box23)){

    makeMove(machine,board.box23);
    return true;
  }

  return false;
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
	if( !isEmpty(board.box11) && checkClass(board.box11, board.box12, board.box13)){

		winner = board.box11.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check second row
	else if( !isEmpty(board.box21) && checkClass(board.box21, board.box22, board.box23)){

		winner = board.box21.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check third row
	else if( !isEmpty(board.box31) && checkClass(board.box31, board.box32, board.box33)){

		winner = board.box31.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check first column
	else if( !isEmpty(board.box11) && checkClass(board.box11, board.box21, board.box31)){

		winner = board.box11.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check second column
	else if( !isEmpty(board.box12) && checkClass(board.box12, board.box22, board.box32)){

		winner = board.box12.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check third column
	else if( !isEmpty(board.box13) && checkClass(board.box13, board.box23, board.box33)){

		winner = board.box13.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check main diagonal
	else if( !isEmpty(board.box11) && checkClass(board.box11, board.box22, board.box33)){

		winner = board.box11.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}
	// check other diagonal
	else if( !isEmpty(board.box31) && checkClass(board.box31, board.box22, board.box13)){

		winner = board.box31.classList.contains('X') ? 'X' : 'O';
		game.status = false;
	}

	if(!inGame()){

    if(winner === human.side){
      human.wins.innerHTML = parseInt(human.wins.innerHTML) +1;
    }
    else{
      machine.wins.innerHTML = parseInt(human.wins.innerHTML);
    }

		var dog = winner === 'X' ? 'Corgi' : 'Pug';
		window.alert(dog + ' WINS');
	}
  // if there was no winner found lets check whether all boxes are filled up by players (which means that we have a tie game)
  else if(checkIfTie()){
    window.alert('It\'s a TIE');
  }
}

/**
 * checkBoardIf - According to the mode variable this function checks whether the machine can
 * win by marking a box or block the user from winning
 *
 * @param  {String} mode 'win' =>check if can win, 'block' check if can block
 * @return {boolean}      'true' if there was a move, 'false' otherwise
 */
function checkBoardIf(mode){

    var checkingSide = mode === 'win' ? machine.side : human.side;

    // first row checking
    if(checkClass2(board.box11, board.box12) && board.box12.classList.contains(checkingSide) && isEmpty(board.box13)){

      makeMove(machine,board.box13);
      return true;
    }
    else if(checkClass2(board.box12, board.box13) && board.box13.classList.contains(checkingSide) && isEmpty(board.box11)){

      makeMove(machine,board.box11);
      return true;
    }
    else if(checkClass2(board.box11, board.box13) && board.box13.classList.contains(checkingSide) && isEmpty(board.box12)){

      makeMove(machine,board.box12);
      return true;
    }

    // second row checking
    else if(checkClass2(board.box21, board.box22) && board.box22.classList.contains(checkingSide) && isEmpty(board.box23)){

      makeMove(machine,board.box23);
      return true;
    }
    else if(checkClass2(board.box22, board.box23) && board.box23.classList.contains(checkingSide) && isEmpty(board.box21)){

      makeMove(machine,board.box21);
      return true;
    }
    else if(checkClass2(board.box21, board.box23) && board.box23.classList.contains(checkingSide) && isEmpty(board.box22)){

      makeMove(machine,board.box22);
      return true;
    }

    // third row checking
    else if(checkClass2(board.box31, board.box32) && board.box32.classList.contains(checkingSide) && isEmpty(board.box33)){

      makeMove(machine,board.box33);
      return true;
    }
    else if(checkClass2(board.box32, board.box33) && board.box33.classList.contains(checkingSide) && isEmpty(board.box31)){

      makeMove(machine,board.box31);
      return true;
    }
    else if(checkClass2(board.box31, board.box33) && board.box33.classList.contains(checkingSide) && isEmpty(board.box32)){

      makeMove(machine,board.box32);
      return true;
    }

    // first column checking
    else if(checkClass2(board.box11, board.box21) && board.box21.classList.contains(checkingSide) && isEmpty(board.box31)){

      makeMove(machine,board.box31);
      return true;
    }
    else if(checkClass2(board.box21, board.box31) && board.box31.classList.contains(checkingSide) && isEmpty(board.box11)){

      makeMove(machine,board.box11);
      return true;
    }
    else if(checkClass2(board.box11, board.box31) && board.box31.classList.contains(checkingSide) && isEmpty(board.box21)){

      makeMove(machine,board.box21);
      return true;
    }

    // second column checking
    else if(checkClass2(board.box12, board.box22) && board.box22.classList.contains(checkingSide) && isEmpty(board.box32)){

      makeMove(machine,board.box32);
      return true;
    }
    else if(checkClass2(board.box22, board.box32) && board.box32.classList.contains(checkingSide) && isEmpty(board.box12)){

      makeMove(machine,board.box12);
      return true;
    }
    else if(checkClass2(board.box12, board.box32) && board.box32.classList.contains(checkingSide) && isEmpty(board.box22)){

      makeMove(machine,board.box22);
      return true;
    }

    // third column checking
    else if(checkClass2(board.box13, board.box23) && board.box23.classList.contains(checkingSide) && isEmpty(board.box33)){

      makeMove(machine,board.box33);
      return true;
    }
    else if(checkClass2(board.box23, board.box33) && board.box33.classList.contains(checkingSide) && isEmpty(board.box13)){

      makeMove(machine,board.box13);
      return true;
    }
    else if(checkClass2(board.box13, board.box33) && board.box33.classList.contains(checkingSide) && isEmpty(board.box23)){

      makeMove(machine,board.box23);
      return true;
    }

    // diagonals checking
    else if(checkClass2(board.box11, board.box22) && board.box22.classList.contains(checkingSide) && isEmpty(board.box33)){

      makeMove(machine,board.box33);
      return true;
    }
    else if(checkClass2(board.box22, board.box33) && board.box33.classList.contains(checkingSide) && isEmpty(board.box11)){

      makeMove(machine,board.box11);
      return true;
    }
    else if(checkClass2(board.box13, board.box22) && board.box22.classList.contains(checkingSide) && isEmpty(board.box31)){

      makeMove(machine,board.box31);
      return true;
    }
    else if(checkClass2(board.box22, board.box31) && board.box31.classList.contains(checkingSide) && isEmpty(board.box13)){

      makeMove(machine,board.box13);
      return true;
    }
    else if(checkClass2(board.box11, board.box33) && board.box33.classList.contains(checkingSide) && isEmpty(board.box22)){

      makeMove(machine,board.box22);
      return true;
    }
    else if(checkClass2(board.box13, board.box31) && board.box31.classList.contains(checkingSide) && isEmpty(board.box22)){

      makeMove(machine,board.box22);
      return true;
    }

    return false;
}

/**
 * Greek flag :P
 */
console.log(
    "%c    %c  %c                     \n" +
    "%c    %c  %c    %c               \n" +
    "%c          %c                 \n" +
    "%c    %c  %c    %c               \n" +
    "%c    %c  %c                     \n" +
    "%c                           \n" +
    "%c                           \n" +
    "%c                           \n" +
    "%c                           \n",
"background: #0072c7", "background: #ffffff", "background: #0072c7",
"background: #0072c7", "background: #ffffff", "background: #0072c7", "background: #ffffff",
"background: #ffffff", "background: #0072c7",
"background: #0072c7", "background: #ffffff", "background: #0072c7", "background: #ffffff",
"background: #0072c7", "background: #ffffff", "background: #0072c7",
"background: #ffffff",
"background: #0072c7",
"background: #ffffff",
"background: #0072c7");
