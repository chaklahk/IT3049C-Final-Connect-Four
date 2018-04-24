"use strict";
const canvas = document.getElementById("connect-four-canvas");

const turnSpan = document.getElementById("player-turn");
const playerOneScoreSpan = document.getElementById("first-wins");
const playerTwoScoreSpan = document.getElementById("second-wins");

const clearPiece = 0; // These represent the token values in the board array...
const firstPiece = 1;
const secondPiece = 2;

var playerOneName;
var playerTwoName;

var playerOneScore;
var playerTwoScore;

var playerOneColor;
var playerTwoColor;

var playerOneTurn; // Boolean... True = Player 1's turn | False = Player 2's turn
var isComputer;
var difficulty;

var board; // 7x6 grid
var gameOver; // boolean that is true when: 1. board is filled or 2. there is a winner

// Used for when the game starts from the menu
function initGame(isComputerOpponent, pOneColor, pTwoColor, pOneName, pTwoName, dif)
{
	// Starts new game and gets starting values from index.js
	newGame();
	isComputer = isComputerOpponent;
	
	playerOneName = pOneName;
	playerTwoName = pTwoName;
	
	playerOneScore = 0;
	playerTwoScore = 0;
	
	playerOneColor = pOneColor;
	playerTwoColor = pTwoColor;
	
	difficulty = dif;
	
	updateScoresDisplay(); // ... Finally, scores within span are updated (in this case, initialized)
}

// Used when the player(s) starts a new round... Resets board but not win count
function newGame()
{
	gameOver = false;
	playerOneTurn = true;
	
	// Board is clear 7x6 Grid
	board = 
	[
		[clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece],
		[clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece],
		[clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece],
		[clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece],
		[clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece],
		[clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece, clearPiece]
	]
	
	// Updates display...
	drawBoard();
	updateTurnDisplay();
}

function drawBoard()
{
	var width = canvas.width;
	var height = canvas.height;
	
	// Determine width and height for each grid piece
	var gWidth = width / 7;
	var gHeight = height / 6;
	
	var radius = gWidth / 2; // Assuming gWidth and gHeight are the same.
	
	let context = canvas.getContext("2d");
	
	context.beginPath();
	context.clearRect(0, 0, canvas.width, canvas.height); // Clear the board
	
	context.fillStyle = "yellow"; // Change color of filled objects (background)
	
	// Draw background
	context.fillRect(0, 0, width, height);
	
	// Draw tokens and empty slots
	for (var r = 0; r < board.length; r++)
	{
		for (var c = 0; c < board[0].length; c++)
		{
			context.beginPath();
			
			var rowCenter = (gHeight * r) + radius;
			var colCenter = (gWidth * c) + radius;
			
			if (board[r][c] == clearPiece)
			{
				context.strokeStyle = "yellow";
				context.fillStyle = "white";
			}
			else if (board[r][c] == firstPiece)
			{
				context.strokeStyle = "black";
				context.fillStyle = playerOneColor;
			}
			else if (board[r][c] == secondPiece)
			{
				context.strokeStyle = "black";
				context.fillStyle = playerTwoColor;
			}
			
			context.arc(colCenter, rowCenter, radius, 1.5 * Math.PI, 3.5 * Math.PI);
			
			context.fill();
			context.stroke();
			context.closePath();
		}
	}
	
	// Draw outline of grid ... This is done after tokens so that the outline is above the tokens
	context.beginPath();
	context.strokeStyle = "black"; // Change color of stroked lines (lines of grid)
	
	context.strokeRect(0, 0, width, height);
	
	for (var r = 1; r < 6; r++)
	{
		context.moveTo(0, gHeight * r);
		context.lineTo(width, gHeight * r);
	}
	
	for (var c = 1; c < 7; c++)
	{
		context.moveTo(gWidth * c, 0);
		context.lineTo(gWidth * c, height);
	}
	context.stroke(); // Stroke to draw the lines...
}

function updateScoresDisplay()
{
	playerOneScoreSpan.innerHTML = playerOneScore;
	playerTwoScoreSpan.innerHTML = playerTwoScore;
}

function updateTurnDisplay()
{
	if (playerOneTurn)
	{
		turnSpan.innerHTML = playerOneName;
		turnSpan.style.color = playerOneColor;
	}
	else
	{
		turnSpan.innerHTML = playerTwoName;
		turnSpan.style.color = playerTwoColor;
	}
}

function advanceTurn()
{
	playerOneTurn = !playerOneTurn;
	updateTurnDisplay();
}

canvas.addEventListener("click", function(clickEvent){
	canvasClick(clickEvent.clientX - canvas.offsetLeft);
}, false)

function canvasClick(x)
{
	if(gameOver)
	{
		window.alert("The game has ended. Press New Game to start over.");
		return;
	}
	
	if(!playerOneTurn && isComputer) // If it is the computer's turns
	{
		return; // Exit...
	}
	
	var col;
	var width = canvas.width / 7;
	
	// Tries to find which column was clicked on...
	for (var i = 0; i < board[0].length; i++)
	{
		if ( x >= width * i && x < width * (i + 1) ) // Checks to see if x falls into the ith column
		{
			col = i;
			break;
		}
	}
	
	// Human's turn
	var placedLocation = place(col);
	
	if(!placedLocation)
	{
		window.alert("You cannot place a piece there!")
	}
	else
	{
		var message = checkGameOver(placedLocation); // Get message from checkGameOver method...
		advanceTurn(); // Advances the turn to next player
		
		if (!playerOneTurn && isComputer && !gameOver) // If the next player is computer and game is not over...
		{
			placedLocation = computerPlace(); // Place the computer's piece now...
			
			message = checkGameOver(placedLocation); // Update message from checkGameOver...
			advanceTurn(); // Advance back to player 1's turn.
		}
		
		if(gameOver)
		{
			window.alert(message); // Display the message only if the game is over...
		}
	}
}

function place(c)
{
	var piece;
	var placed = null; // By default, placed location is null.
	
	// Determine which piece will be placed based on the turn.
	if (playerOneTurn)
	{
		piece = firstPiece;
	}
	else
	{
		piece = secondPiece;
	}
	
	for (var r = board.length - 1; r >= 0 ; r--) // Condition: Either piece isn't placed or top of grid reached
	{
		if (board[r][c] == clearPiece)
		{
			
			board[r][c] = piece;
			drawBoard();
			
			placed = [r, c]; // Return the location of the placed piece.
			break;
		}
	}
	
	return placed; // Will return null if it reaches this line.
}

function remove(c) // This method is to remove pieces for hard computer logic (See below)
{
	var removed = null;
	
	for (var r = 0; r < board.length; r++) // Condition: Either piece isn't removed or bottom of grid reached
	{
		if (board[r][c] != clearPiece)
		{
			board[r][c] = clearPiece;
			removed = board[r, c];
			
			break;
		}
	}
	
	return removed;
}

function computerPlace()
{
	var placed = null;
	
	if (difficulty == "hard") // Only do this on the hard computer...
	{
		for (var c = 0; c < board[0].length; c++)
		{
			// First checks if the play is a winning move...
			placed = place(c);
			if (placed) // If the piece is placed (won't be if the column is full)
			{
				if (checkForWin(placed))
				{
					return placed; // If it is winning move... it is returned.
				}
				
				remove(c); // Removes piece. We don't want to keep each piece placed.
				
				// Then check to see if the play blocks opponent from winning.
				playerOneTurn = !playerOneTurn; // We are going to place the piece from the opponent so we need to swap...
				
				placed = place(c);
				if (checkForWin(placed))
				{
					remove(c); // Remove piece and swap with piece for computer player...
					playerOneTurn = !playerOneTurn;
					
					placed = place(c);
					return placed; 
				}
				
				// Resets the turn to the computer and removes added piece after each iteration
				remove(c); 
				playerOneTurn = !playerOneTurn; 
			}
		}
		
		placed = null; // Resets placed to null... moves on to place randomly...
	}

	// Place randomly
	while(!placed)
	{
		placed = place(Math.floor(Math.random() * 7));
	}
	
	return placed;
}

function checkForWin(placedLocation) // This is used only to check for a win... doesn't actually update scores!
{
	var y = placedLocation[0]; // Vertical... row
	var x = placedLocation[1]; // Horizontal... column
	
	var piece = board[y][x]; // Used to determine which piece (player 1 or player 2's) was placed
	var matches = 0; // See if matches = 4. Will count placed location during each loop below.
	
	// Check vertical 4
	// Will only look down since it is impossible to add token in between vertically.
	for(var mY = y; mY < board.length; mY++)
	{
		// First iteration will check the placed location (hence mY = y)
		if (board[mY][x] == piece)
		{
			matches++; 
			
			if (matches >= 4)
			{
				return true; // Found 4...
			}
		}
		else
		{
			break;
		}
	}
	
	matches = 0; // Resets matches since we are no longer checking vertically.
	
	// Check horizontal 4
	// First look left
	for(var mX = x; mX >= 0; mX--)
	{
		if (board[y][mX] == piece)
		{
			matches++; 
			
			if (matches >= 4)
			{
				return true;
			}
		}
		else
		{
			break;
		}
	}
	// Then right (Doesn't reset matches since we are still looking in the same row)
	for(var mX = x + 1; mX < board[0].length; mX++)
	{ 
		// Starts at x + 1 since we don't want to count placedLocation twice...
		if (board[y][mX] == piece)
		{
			matches++; 
			
			if (matches >= 4)
			{
				return true;
			}
		}
		else
		{
			break;
		}
	}
	
	matches = 0;
	
	// Check Diagonal 4 (Left to right) (Always looks down... same reason as vertical)
	var mX = x;
	var mY = y;
	
	while(mX >= 0 && mY < board.length)
	{
		if (board[mY][mX] == piece)
		{
			matches++; 
			
			if (matches >= 4)
			{
				return true;
			}
		}
		else
		{
			break;
		}
		
		mX--; mY++;
	}
	
	mX = x; mY = y; matches = 0;
	
	// Check Diagonal 4 (Right to left)
	while(mX < board[0].length && mY < board.length)
	{
		if (board[mY][mX] == piece)
		{
			matches++; 
			
			if (matches >= 4)
			{
				return true;
			}
		}
		else
		{
			break;
		}
		
		mX++; mY++;
	}
	
	return false;
}

// NOTE: Call this method before advancing the turn!
function checkGameOver(placedLocation) // Checks if game is over. Updates info and displays result
{
	if (checkForWin(placedLocation))
	{
		var message;
		if(playerOneTurn)
		{
			message = playerOneName + " wins!";
			playerOneScore++;
		}
		else
		{
			message = playerTwoName + " wins!";
			playerTwoScore++;
		}
		
		updateScoresDisplay();
		gameOver = true;
		return message;
	}
	
	for (var c = 0; c < board[0].length; c++) // Checks to see if there are any remaining slots;
	{
		if (board[0][c] == clearPiece) // Only needs to check top row...
		{
			return gameOver;
		}
	}
	
	gameOver = true;
	return "The board is filled. It's a tie! Press New Game to start over.";
}