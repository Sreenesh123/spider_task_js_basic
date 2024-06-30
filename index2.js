document.addEventListener("DOMContentLoaded", () => {
  const board = document.querySelector(".board");
  let cellCount = 9; 
  let winningConditions,
    singleplayer,
    humansymbol,
    computersymbol,
    gridSize,
    boxid,
    count2,
    moves = 0,
    randomboxindex;
  let currentPlayer = "X";
  let gameState = Array(cellCount).fill(null);
  const restartBtn = document.querySelector(".game-restart-btn");
  const popup = document.querySelector(".popup");
  const message = document.querySelector("#message");
  const popupRestartBtn = document.querySelector(".popup__restart-btn");
  const gridsizemodal = document.getElementById("gridsizemodal");
  const gridsizeoptions = document.querySelectorAll(".grid-size img");
  const main = document.querySelector(".main");
  const player1 = document.querySelector(".player-1");
  const player2 = document.querySelector(".player-2");
  const timer1 = document.querySelector("#timer1");
  const timer2 = document.querySelector("#timer2");
  main.classList.add("hidden");
  let cells;

  function createbox(size) {
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    const marginvalue = size === 3 ? 0 : size === 4 ? 2 : 4;
    winningConditions =
      size === 3
        ? [...winningConditions3x3]
        : size === 4
        ? [...winningConditions4x4]
        : [...winningConditions5x5];
   
    board.innerHTML = "";
    cellCount = size * size;
    for (let i = 0; i < cellCount; i++) {
      const square = document.createElement("div");
      square.classList.add("box");
      square.setAttribute("id", i);
      board.append(square);
    }
    cells = document.querySelectorAll(".box");
    cells.forEach((cell) => {
      console.log("hello");
      cell.addEventListener("click", handleCellClick);
    });
  }
  const winningConditions3x3 = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const winningConditions4x4 = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];
  const winningConditions5x5 = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  let timer;
  let currentTimer = 60;

  function startTimer() {
    currentTimer = 60;
    updateTimerDisplay();
    clearInterval(timer);
    timer = setInterval(() => {
      currentTimer--;
      updateTimerDisplay();
      if (currentTimer <= 0) {
        clearInterval(timer);
        switchPlayer();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(currentTimer / 60);
    const seconds = currentTimer % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (currentPlayer === "X") {
      timer1.textContent = formattedTime;
      timer2.textContent = "";
    } else {
      timer2.textContent = formattedTime;
      timer1.textContent = "";
    }
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    player1.classList.toggle("active", currentPlayer === "X");
    player2.classList.toggle("active", currentPlayer === "O");
    clearInterval(timer);
    startTimer();
  }

  function createimage(cell, currentPlayer) {
    const img = document.createElement("img");
    img.src = currentPlayer === "X" ? "media/x.png" : "media/o.png";
    cell.appendChild(img);
    cell.classList.add(currentPlayer.toLowerCase());
    moves++;
  }
  function updateWinningConditionsForComputer() {
    winningConditions = winningConditions.filter((condition) => {
      return condition.some((index) => gameState[index] === null);
    });
  }

  function handleCellClick(event) {
    console.log("clicked");
    let cell = event.currentTarget;
    const cellIndex = parseInt(cell.id);

    if (gameState[cellIndex] || checkWinner()) {
      return;
    }


    gameState[cellIndex] = currentPlayer;

    createimage(cell, currentPlayer);

    if (checkWinner()) {
      message.textContent = `Player ${currentPlayer} Wins!`;
      popup.classList.remove("hide");
      clearInterval(timer);
    } else if (gameState.every((cell) => cell)) {
      message.textContent = "It's a Draw!";
      popup.classList.remove("hide");
      clearInterval(timer);
    } else {
      switchPlayer();
    }
    cell.removeEventListener("click", handleCellClick);
    if (singleplayer && currentPlayer === computersymbol) {
      computermove();
    }
  }

  function checkWinner() {
    return winningConditions.some((condition) => {
      return condition.every((index) => {
        return gameState[index] === currentPlayer;
      });
    });
  }

  function restartGame() {
    welcomeModal.style.display="inline";
    modal_content.classList.remove("hidden");
    main.style.display="none";
    welcomeModal.classList.remove("hidden");
    moves = 0;
    restartBtn.classList.add("hidden");
    main.classList.add("hidden");
    gameState = Array(cellCount).fill(null);
    cells.forEach((cell) => {
      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
      cell.classList.remove("x", "o");
      cell.addEventListener("click", handleCellClick);
    });

    currentPlayer = "X";
    player1.classList.add("active");
    player2.classList.remove("active");

    popup.classList.add("hide");
    clearInterval(timer);
    startTimer();
  }

  restartBtn.addEventListener("click", restartGame);
  restartBtn.classList.add("hidden");
  popupRestartBtn.addEventListener("click", restartGame);

  player1.classList.add("active");

  const welcomeModal = document.getElementById("welcomeModal");
  const gameSettingsForm = document.getElementById("gameSettingsForm");
  const playerNames = document.getElementById("playerNames");
  const choosecoin = document.getElementById("choosecoin");
  const modal_content = document.querySelector(".modal-content");
  const submit = document.querySelector(".submit");
  choosecoin.classList.add("hidden");

  document.querySelectorAll('input[name="gameMode"]').forEach((input) => {
    input.addEventListener("change", (event) => {
      if (event.target.value === "single") {
        playerNames.classList.add("hidden");
        playerNames.classList.remove("playerNames");
        choosecoin.classList.remove("hidden");
      } else {
        playerNames.classList.remove("hidden");
        playerNames.classList.add("playerNames");
        choosecoin.classList.add("hidden");
      }
    });
  });

  gameSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("clicked submit");
    const gameMode = document.querySelector(
      'input[name="gameMode"]:checked'
    ).value;

    if (gameMode === "multi") {
      singleplayer = false;
      const player1Name =
        document.getElementById("player1Name").value || "Player 1";
      const player2Name =
        document.getElementById("player2Name").value || "Player 2";
      document.querySelector(".player-1 h2").textContent =
        player1Name;
      document.querySelector(".player-2 h2").textContent =
        player2Name;
    } else {
      singleplayer = true;
      const chosensymbol = document.querySelector(
        'input[name="symbol"]:checked'
      ).value;
      humansymbol = chosensymbol;
      if (humansymbol === "O") {
        computersymbol = "X";
      } else {
        computersymbol = "O";
      }
    }

    modal_content.classList.add("hidden");
    welcomeModal.classList.add("hidden");
    welcomeModal.style.display = "none";
    document.getElementById("gridsizemodal").style.display = "block";
    startTimer();
  });

  welcomeModal.style.display = "block";

  gridsizeoptions.forEach((img) => {
    img.addEventListener("click", () => {
      main.style.display="flex";
      console.log("image clicked");
      gridSize = parseInt(img.getAttribute("id"));
      console.log(gridSize);
      createbox(gridSize);
      gameState = Array(gridSize * gridSize).fill(null);
      gridsizemodal.style.display = "none";
      main.classList.remove("hidden");
      startTimer();
      console.log("timer started");
      restartBtn.classList.remove("hidden");
      console.log(singleplayer, currentPlayer, computersymbol);
      console.log(singleplayer,computersymbol,currentPlayer);
      if (singleplayer && currentPlayer === computersymbol) {
        computermove();
      }
    });
  });
  let count = 0;
  let emptybox;

  function computermove() {
    const emptyboxes = Array.from(cells).filter((cell) => !cell.firstChild);
    if (emptyboxes.length === 0 || checkWinner()) {
      return;
    }
    let chosenboxindex = -1;
 setTimeout(()=>
{
     if (moves > 2) {
       chosenboxindex = Defensivemove();
     }
     if (chosenboxindex === -1) {
       console.log("non-defensive move");
       console.log(winningConditions);
       console.log(moves, gridSize);
       if (moves < 2 && gridSize === 3) {
         randomboxindex = 3;
       } else {
         console.log("entering else");
         randomboxindex = Math.floor(Math.random() * emptyboxes.length);
       }
       console.log(randomboxindex);
       chosenboxindex = parseInt(emptyboxes[randomboxindex].id);
       createimage(document.getElementById(`${chosenboxindex}`), currentPlayer);
     } else {
       console.log("defensivve move");
       console.log(winningConditions);
       createimage(document.getElementById(`${chosenboxindex}`), currentPlayer);
     }
     gameState[chosenboxindex] = currentPlayer;

     console.log(gameState);
     if (checkWinner()) {
       message.textContent = `Player ${currentPlayer} Wins!`;
       popup.classList.remove("hide");
       clearInterval(timer);
     } else if (gameState.every((cell) => cell)) {
       message.textContent = "It's a Draw!";
       popup.classList.remove("hide");
       clearInterval(timer);
     } else {
       switchPlayer();
     }
     updateWinningConditionsForComputer();
},500)
  }
  function Defensivemove() {
    for (let i = 0; i < winningConditions.length; i++) {
      console.log(winningConditions);
      count = 0;
      count2 = 0;
      emptybox = null;
      for (let j = 0; j < gridSize; j++) {
        boxid = winningConditions[i][j];
        const targetbox = document.getElementById(`${boxid}`);
        console.log(
          targetbox,
          targetbox.firstChild,
          targetbox.classList.contains(`${humansymbol.toLowerCase()}`)
        );
        if (
          targetbox.firstChild &&
          targetbox.classList.contains(`${humansymbol.toLowerCase()}`)
        ) {
          count++;
        } else if (
          targetbox.firstChild &&
          targetbox.classList.contains(`${computersymbol.toLowerCase()}`)
        ) {
          count2++;
        } else {
          emptybox = targetbox;
          console.log(emptybox);
        }
      }
      console.log(count);
      if (count2 === gridSize - 1 && emptybox != null && !emptybox.firstChild) {
        return emptybox.getAttribute("id");
      }
      if (count === gridSize - 1 && emptybox != null && !emptybox.firstChild) {
        console.log(emptybox.getAttribute("id"));
        winningConditions.splice(i, 1);
        i--;
        console.log(winningConditions);
        return emptybox.getAttribute("id");
      }
    }
    return -1;
  }
});

 