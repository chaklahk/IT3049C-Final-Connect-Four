"use strict";

const btnStart = document.getElementById("btnStart");
const btnMenu = document.getElementById("btnMenu");
const btnNewGame = document.getElementById("btnNewGame");

const gameForm = document.getElementById("game-form");

const rdEasy = document.getElementById("rdEasy");
const rdHard = document.getElementById("rdHard");

const inPOName = document.getElementById("inPOName");
const inPOColor = document.getElementById("inPOColor")

const inPTName = document.getElementById("inPTName");
const inPTColor = document.getElementById("inPTColor")

const checkComputer = document.getElementById("checkComputer");

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const playerTwoInfo = document.getElementById("player-two-info");
const computerInfo = document.getElementById("computer-info");

const playerOneNameSpan = document.getElementById("first-name");
const playerTwoNameSpan = document.getElementById("second-name");

const instructions = document.getElementById("instructions");
const startInstructions = instructions.innerHTML; // Store the value currently set for the instructions on the start screen

var isComputer; // Boolean... Is Player 2 a computer?
var difficulty;

var playerOneName;
var playerTwoName;

var playerOneColor;
var playerTwoColor;

btnStart.addEventListener("click", function(clickEvent) 
{
	clickEvent.preventDefault();
	
	isComputer = checkComputer.checked;
	
	// Configure Player 1's Info
	playerOneName = inPOName.value;
	
	if (playerOneName.trim() == "")
	{
		playerOneName = "Player 1";
	}
	
	playerOneColor = inPOColor.value;
	
	// Configure Player 2's Info
	if (isComputer)
	{
		// Get the difficulty selected by the user
		if (rdEasy.checked) 
		{
			difficulty = rdEasy.value;
		}
		if (rdHard.checked) 
		{
			difficulty = rdHard.value;
		}
		
		playerTwoName = difficulty + " Computer"
	}
	else
	{
		playerTwoName = inPTName.value;
		
		if (playerTwoName.trim() == "")
		{
			playerTwoName = "Player 2";
		}
	}
	
	playerTwoColor = inPTColor.value;
	
	// Game will not start if info is invalid.
	if (validateInformation()) // This method uses window.alert, so not necessary to add later
	{
		// Game Screen Configuration
		
		// Hides the start screen and shows the game screen...
		startScreen.classList.add("hidden")
		gameScreen.classList.remove("hidden");
		
		// Sets the display for names and scores of the current game
		playerOneNameSpan.innerHTML = playerOneName;
		playerOneNameSpan.style.color = playerOneColor;
		
		playerTwoNameSpan.innerHTML = playerTwoName;
		playerTwoNameSpan.style.color = playerTwoColor;
		
		// Tell the user how to play with instructions
		instructions.innerHTML = 
			"Take turns placing pieces until someone gets four in a row. The person to connect four is the winner!";
		
		// From game.js... handles game logic and draws board...
		initGame(isComputer, playerOneColor, playerTwoColor, playerOneName, playerTwoName, difficulty);
	}
	
});

// This button is for returning to the menu...
btnMenu.addEventListener("click", function(clickEvent)
{
	clickEvent.preventDefault();
	
	// Sets the game back to the start screen and hides the game screen
	gameScreen.classList.add("hidden")
	startScreen.classList.remove("hidden");
	
	// Sets the instructions to the starting instructions
	instructions.innerHTML = startInstructions;
});

// Shows appropriate menu depending on if computer opponent check box is checked...
checkComputer.onchange = function() 
{
	if(checkComputer.checked) 
	{
		playerTwoInfo.classList.add("hidden");
		computerInfo.classList.remove("hidden");
	} 
	else 
	{
		playerTwoInfo.classList.remove("hidden");
		computerInfo.classList.add("hidden");
	}
};

// This button is for restarting the game...
btnNewGame.addEventListener("click", function(clickEvent)
{
	clickEvent.preventDefault();

	// From game.js - Clears the board without resetting scores
	newGame();
});

function validateInformation() // Used to ensure that both players don't use the same name or same color
{
	if (playerOneName == playerTwoName)
	{
		playerTwoName += "(2)"; // Adds (2) to end of name player 2 name if names match...
	}
	
	if (playerOneColor == playerTwoColor)
	{
		window.alert("Both players chose the same color. Players must have different colors!");
		return false; // Information is not valid...
	}
	
	return true; // Information is valid
}