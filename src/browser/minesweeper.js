const BombIcon = `<i class="fas fa-bomb"></i>`;
const FlagIcon = `<i class="fas fa-flag"></i>`;

const BoardCellConditions = {
  FLAG: "flag",
  DISCOVERED: "discovered",
};

class Minesweeper {
  constructor(rows, columns, dificulty) {
    this.columns = columns;
    this.rows = rows;
    this.cell = 30;
    this.mines = 0;
    this.board = [];
    this.inGame = true;
    this.startingGame = false;
    this.flags = 0;
    this.dificulty = dificulty;
  }

  /* Reusable function to traverse the table */
  _boardForLoop(fn) {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        fn(row, column);
      }
    }
  }

  /* Function that generates the HTML table */
  htmlBoardGenerator() {
    let boardBuilded = "";
    const cellStyle = `"width: ${this.cell}px;height:${this.cell}px"`;

    for (let row = 0; row < this.rows; row++) {
      boardBuilded += `<tr>`;

      for (let column = 0; column < this.columns; column++) {
        const id = `${row}-${column}`;
        boardBuilded += `<td id=${id} style=${cellStyle} >`;
        boardBuilded += `</td>`;
      }

      boardBuilded += `</tr>`;
    }

    const htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = boardBuilded;
    htmlBoard.style.width = `${this.columns * this.cell}px`;
    htmlBoard.style.height = `${this.rows * this.cell}px`;
    htmlBoard.style.background = "#708090";
  }

  /* Function that adds click events */
  addEvents(row, column) {
    const cell = document.getElementById(`${row}-${column}`);

    cell.addEventListener("dblclick", (event) => {
      this.doubleClickEvent(cell, row, column, event);
      this.refreshBoard();
    });

    cell.addEventListener("mouseup", (event) => {
      this.simpleClickEvent(cell, row, column, event);
      this.refreshBoard();
    });
  }

  /* Mouse double click function */
  doubleClickEvent(cell, row, column, event) {
    this.showArea(row, column);
    this.refreshBoard();
  }

  /* Mouse simple click function */
  simpleClickEvent(cell, row, column, event) {
    const logicBoardCell = this.board[row][column];

    if (!this.inGame) return;

    if (this.board[row][column].condition === BoardCellConditions.DISCOVERED) return;

    if (event.button === 0) {
      if (logicBoardCell.condition === BoardCellConditions.FLAG) return;

      this.board[row][column].condition = BoardCellConditions.DISCOVERED;
      this.startGame = true;

      if (!logicBoardCell.value) this.showArea(row, column);
    } else if (event.button === 2) {
      if (logicBoardCell?.condition === BoardCellConditions.FLAG) {
        this.board[row][column].condition = undefined;
        this.flags -= 1;
      } else {
        this.board[row][column].condition = BoardCellConditions.FLAG;
        this.flags += 1;
      }
    }
  }

  /* Function to clear the logical values from the board */
  cleanLogicBoard() {
    for (let column = 0; column < this.columns; column++) {
      this.board.push([]);
    }
  }

  /* Function to add the mines to the board */
  addMines() {
    this.mines = this.rows * this.columns * this.dificulty;

    for (let mine = 0; mine < this.mines; mine++) {
      let column;
      let row;

      do {
        column = Math.floor(Math.random() * this.columns);
        row = Math.floor(Math.random() * this.rows);
      } while (this.board[row][column]);

      this.board[row][column] = { value: -1 };
    }
  }

  /* Function to show the mines */
  showMines() {
    const fn = (row, column) => {
      const cellData = this.board[row][column];

      if (cellData.value === -1) {
        const cell = document.getElementById(`${row}-${column}`);
        cell.innerHTML = BombIcon;
        cell.style.color = "#000000";
      }
    };

    this._boardForLoop(fn);
  }

  /* Function to show an area of the board given the conditions */
  showArea(row, column) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!i && !j) continue;

        try {
          const logicBoardCell = this.board[row + i][column + j];
          const condition = logicBoardCell?.condition || null;
          if (condition !== BoardCellConditions.DISCOVERED) {
            if (condition !== BoardCellConditions.FLAG) {
              this.board[row + i][column + j].condition = BoardCellConditions.DISCOVERED;

              if (!logicBoardCell?.value) this.showArea(row + i, column + j);
            }
          }
        } catch (error) {}
      }
    }
  }

  /* Mine counter */
  minesCounter(row, column) {
    if (!this.board[row][column]) {
      let counter = 0;

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (!i && !j) continue;

          try {
            if (this.board[row + i][column + j]?.value === -1) counter++;
          } catch (error) {}
        }
      }

      this.board[row][column] = { value: counter };
    }
  }

  /* Function that updates the mine counter on the screen */
  showMinesCount() {
    const display = document.getElementById("mines-display");
    display.innerHTML = `${
      this.mines - this.flags
    } <i class="fas fa-bomb" style="padding-left: 10px"></i> `;
  }

  /* Function that refresh the board constantly */
  refreshBoard() {
    const fn = (row, column) => {
      const cellData = this.board[row][column];
      const cell = document.getElementById(`${row}-${column}`);

      if (cellData.condition === BoardCellConditions.DISCOVERED) {
        cell.style.boxShadow = "none";

        if (cellData.value === -1) {
          cell.style.color = "#000000";
          cell.innerHTML = BombIcon;
          cell.style.transition = "none";
        } else cell.innerHTML = cellData.value;
      }

      if (cellData.condition === BoardCellConditions.FLAG) {
        cell.innerHTML = FlagIcon;
        cell.style.background = `cadetblue`;
      }

      if (!cellData.condition) {
        cell.innerHTML = ``;
        cell.style.background = ``;
      }
    };

    this._boardForLoop(fn);
    this._boardForLoop((row, column) => this.checkLose(row, column));
    this.checkWin();
    this.showMinesCount();
  }

  /* Function that validates if the user lost the game */
  checkLose(row, column) {
    const cellData = this.board[row][column];

    if (cellData.condition === BoardCellConditions.DISCOVERED && cellData.value === -1) {
      const htmlBoard = document.getElementById("board");

      htmlBoard.style.background = "red";
      this.inGame = false;
      this.showMines();

      $("#loseModal").modal("show");
    }
  }

  /* Function that validates if the user won the game */
  checkWin() {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (this.board[row][column].condition !== BoardCellConditions.DISCOVERED) {
          if (this.board[row][column].value === -1) continue;
          else return;
        }
      }
    }

    let htmlBoard = document.getElementById("board");
    htmlBoard.style.background = "green";
    this.inGame = false;
    this.showMines();

    $("#winModal").modal("show");
  }

  /* Function that loads the logical values to the board */
  logicBoardGenerator() {
    this.cleanLogicBoard();
    this.addMines();
    this._boardForLoop((row, column) => this.minesCounter(row, column));
  }

  /* Function to start the game */
  startGame() {
    this.restartVariableGames();
    this.htmlBoardGenerator();
    this.logicBoardGenerator();
    this.refreshBoard();
    this._boardForLoop((row, column) => this.addEvents(row, column));
  }

  /* Function to reset the value of properties */
  restartVariableGames() {
    this.inGame = true;
    this.startingGame = false;
    this.flags = 0;
  }

  /* Function to restore a saved dashboard */
  reloadBoardSaved() {
    this.htmlBoardGenerator();
    this.refreshBoard();
    this._boardForLoop((row, column) => this.addEvents(row, column));
  }
}

let columns = 10;
let rows = 10;
let dificulty = 0.15;
let minesweeper = null;

const newGame = () => {
  $("#loseModal").modal("hide");
  $("#winModal").modal("hide");

  minesweeper = new Minesweeper(rows, columns, dificulty);

  minesweeper.startGame();
};

const setDificulty = () => {
  const range = document.getElementById("dificulty").value;
  dificulty = range / 100;

  newGame();
};

const setDimensions = () => {
  const dimensions = document.getElementById("dimensions").value;
  columns = dimensions;
  rows = dimensions;

  newGame();
};

const saveBoard = () => {
  if (minesweeper) {
    localStorage.setItem("board", JSON.stringify(minesweeper.board));
    localStorage.setItem("flags", minesweeper.flags);
    localStorage.setItem("dimensions", minesweeper.columns);
    localStorage.setItem("dificulty", minesweeper.dificulty);
    localStorage.setItem("mines", minesweeper.mines);
  }
};

const loadBoard = () => {
  if (minesweeper) {
    const lastBoard = JSON.parse(localStorage.getItem("board"));
    const flags = localStorage.getItem("flags");
    const dimensions = localStorage.getItem("dimensions");
    dificulty = localStorage.getItem("dificulty");
    mines = localStorage.getItem("mines");
    minesweeper.board = lastBoard;
    minesweeper.flags = parseInt(flags);
    minesweeper.columns = parseInt(dimensions);
    minesweeper.rows = parseInt(dimensions);
    minesweeper.mines = parseInt(mines);
    minesweeper.dificulty = parseFloat(dificulty);

    minesweeper.reloadBoardSaved();
  }
};

const dificultyRange = document.getElementById("dificulty");
const dimensions = document.getElementById("dimensions");

dimensions.addEventListener("change", () => setDimensions());
dificultyRange.addEventListener("blur", () => setDificulty());

newGame();
