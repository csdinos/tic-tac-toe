
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
	};


/**
 * Machine object
 */
var machine =
	{
		moves: 0,
		side: 'O',
    wins: document.getElementById('machine'),
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

  if(game.turn === machine.side){
    machineMove();
  }

}

/*
 * Function that gets called when a player end his turn (pressed a box)
 */
function humanMove(box){

	if(box.innerHTML!=' ' || !inGame()) return;

	box.innerHTML = human.side;
	game.turn = machine.side;

	checkBoard();

  if(inGame()) machineMove();
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

	if(!inGame()){

    if(winner === human.side){
      human.wins.innerHTML = parseInt(human.wins.innerHTML) +1;
    }
    else{
      machine.wins.innerHTML = parseInt(human.wins.innerHTML);
    }

		// colorWinnerBoxes(winner);
		window.alert(winner + ' WINS');
	}
  // if there was no winner found lets check whether all boxes are filled up by players (which means that we have a tie game)
  else if(checkIfTie()){
    window.alert('It\'s a TIE');
  }
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
      if( board[box].innerHTML === ' '){
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

  if(board.box22.innerHTML === ' '){

    board.box22.innerHTML = machine.side;
    return true;
  }

  return false;
}


/**
 * playOppositeCorner - check whehter the machine can play in an opposite corner
 *
 * @return {boolean}  whether there was a move in an opposite corner
 */
function playOppositeCorner(){

  if(board.box11.innerHTML === human.side && board.box33.innerHTML === ' '){

    board.box33.innerHTML = machine.side;
    return true;
  }
  else if(board.box33.innerHTML === human.side && board.box11.innerHTML === ' '){

    board.box11.innerHTML = machine.side;
    return true;
  }
  else if(board.box31.innerHTML === human.side && board.box13.innerHTML === ' '){

    board.box13.innerHTML = machine.side;
    return true;
  }
  else if(board.box13.innerHTML === human.side && board.box31.innerHTML === ' '){

    board.box31.innerHTML = machine.side;
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

  if(board.box11.innerHTML === ' '){

    board.box11.innerHTML = machine.side;
    return true;
  }
  else if(board.box33.innerHTML === ' '){

    board.box33.innerHTML = machine.side;
    return true;
  }
  else if(board.box31.innerHTML === ' '){

    board.box31.innerHTML = machine.side;
    return true;
  }
  else if(board.box13.innerHTML === ' '){

    board.box13.innerHTML = machine.side;
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

  if(board.box12.innerHTML === ' '){

    board.box12.innerHTML = machine.side;
    return true;
  }
  else if(board.box21.innerHTML === ' '){

    board.box21.innerHTML = machine.side;
    return true;
  }
  else if(board.box32.innerHTML === ' '){

    board.box32.innerHTML = machine.side;
    return true;
  }
  else if(board.box23.innerHTML === ' '){

    board.box23.innerHTML = machine.side;
    return true;
  }

  return false;
}




/**
 * canWin - According to the mode variable this function checks whether the machine can
 * win by marking a box or block the user from winning
 * TODO: 1. missing checks with gaps ['X' ' ' 'X']
 *       2. add label to every if-elseif
 *
 * @param  {String} mode 'win' =>check if can win, 'block' check if can block
 * @return {boolean}      'true' if there was a move, 'false' otherwise
 */
function checkBoardIf(mode){

    var checkingSide = mode === 'win' ? machine.side : human.side;

    // first row checking
    if(board.box11.innerHTML === board.box12.innerHTML  && board.box12.innerHTML === checkingSide && board.box13.innerHTML === ' '){

      board.box13.innerHTML = machine.side;
      return true;
    }
    else if(board.box12.innerHTML === board.box13.innerHTML  && board.box13.innerHTML === checkingSide && board.box11.innerHTML === ' '){

      board.box11.innerHTML = machine.side;
      return true;
    }
    else if(board.box11.innerHTML === board.box13.innerHTML  && board.box13.innerHTML === checkingSide && board.box12.innerHTML === ' '){

      board.box12.innerHTML = machine.side;
      return true;
    }

    // second row checking
    else if(board.box21.innerHTML === board.box22.innerHTML  && board.box22.innerHTML === checkingSide && board.box23.innerHTML === ' '){

      board.box23.innerHTML = machine.side;
      return true;
    }
    else if(board.box22.innerHTML === board.box23.innerHTML  && board.box23.innerHTML === checkingSide && board.box21.innerHTML === ' '){

      board.box21.innerHTML = machine.side;
      return true;
    }
    else if(board.box21.innerHTML === board.box23.innerHTML  && board.box23.innerHTML === checkingSide && board.box22.innerHTML === ' '){

      board.box22.innerHTML = machine.side;
      return true;
    }

    // third row checking
    else if(board.box31.innerHTML === board.box32.innerHTML  && board.box32.innerHTML === checkingSide && board.box33.innerHTML === ' '){

      board.box33.innerHTML = machine.side;
      return true;
    }
    else if(board.box32.innerHTML === board.box33.innerHTML  && board.box33.innerHTML === checkingSide && board.box31.innerHTML === ' '){

      board.box31.innerHTML = machine.side;
      return true;
    }
    else if(board.box31.innerHTML === board.box33.innerHTML  && board.box33.innerHTML === checkingSide && board.box32.innerHTML === ' '){

      board.box32.innerHTML = machine.side;
      return true;
    }

    // first column checking
    else if(board.box11.innerHTML === board.box21.innerHTML  && board.box21.innerHTML === checkingSide && board.box31.innerHTML === ' '){

      board.box31.innerHTML = machine.side;
      return true;
    }
    else if(board.box21.innerHTML === board.box31.innerHTML  && board.box31.innerHTML === checkingSide && board.box11.innerHTML === ' '){

      board.box11.innerHTML = machine.side;
      return true;
    }
    else if(board.box11.innerHTML === board.box31.innerHTML  && board.box31.innerHTML === checkingSide && board.box21.innerHTML === ' '){

      board.box21.innerHTML = machine.side;
      return true;
    }

    // second column checking
    else if(board.box12.innerHTML === board.box22.innerHTML  && board.box22.innerHTML === checkingSide && board.box32.innerHTML === ' '){

      board.box32.innerHTML = machine.side;
      return true;
    }
    else if(board.box22.innerHTML === board.box32.innerHTML  && board.box32.innerHTML === checkingSide && board.box12.innerHTML === ' '){

      board.box12.innerHTML = machine.side;
      return true;
    }
    else if(board.box12.innerHTML === board.box32.innerHTML  && board.box32.innerHTML === checkingSide && board.box22.innerHTML === ' '){

      board.box22.innerHTML = machine.side;
      return true;
    }

    // third column checking
    else if(board.box13.innerHTML === board.box23.innerHTML  && board.box23.innerHTML === checkingSide && board.box33.innerHTML === ' '){

      board.box33.innerHTML = machine.side;
      return true;
    }
    else if(board.box23.innerHTML === board.box33.innerHTML  && board.box33.innerHTML === checkingSide && board.box13.innerHTML === ' '){

      board.box13.innerHTML = machine.side;
      return true;
    }
    else if(board.box13.innerHTML === board.box33.innerHTML  && board.box33.innerHTML === checkingSide && board.box23.innerHTML === ' '){

      board.box23.innerHTML = machine.side;
      return true;
    }

    // diagonals checking
    else if(board.box11.innerHTML === board.box22.innerHTML  && board.box22.innerHTML === checkingSide && board.box33.innerHTML === ' '){

      board.box33.innerHTML = machine.side;
      return true;
    }
    else if(board.box22.innerHTML === board.box33.innerHTML  && board.box33.innerHTML === checkingSide && board.box11.innerHTML === ' '){

      board.box11.innerHTML = machine.side;
      return true;
    }
    else if(board.box13.innerHTML === board.box22.innerHTML  && board.box22.innerHTML === checkingSide && board.box31.innerHTML === ' '){

      board.box31.innerHTML = machine.side;
      return true;
    }
    else if(board.box22.innerHTML === board.box31.innerHTML  && board.box31.innerHTML === checkingSide && board.box13.innerHTML === ' '){

      board.box13.innerHTML = machine.side;
      return true;
    }
    else if(board.box11.innerHTML === board.box33.innerHTML  && board.box33.innerHTML === checkingSide && board.box22.innerHTML === ' '){

      board.box22.innerHTML = machine.side;
      return true;
    }
    else if(board.box13.innerHTML === board.box31.innerHTML  && board.box31.innerHTML === checkingSide && board.box22.innerHTML === ' '){

      board.box22.innerHTML = machine.side;
      return true;
    }

    return false;
}


/* NOTE: fails badly :P
 * Function that colors the winning boxes
 */
// function colorWinnerBoxes(winnerType){
//
// 	for(var box in board) {
// 		if( board[box].innerHTML === winnerType){
// 			board[box].classList.add("win");
// 		}
// 	}
// }

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
