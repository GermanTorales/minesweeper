# Minesweeper

## Famous minesweeper game made in node js

To run the server and be able to play you must follow these steps

- `yarn`
- create .env file and add environment variables
- `yarn run dev`
- open browser in `http://localhost:<port you set in .env file>`


---
## You can play the game online at this url
[Minesweeper online](https://h19od7uori.execute-api.us-east-1.amazonaws.com/dev/)

----
## How to play?

The game is simple, a board of n rows and n columns is displayed (it can be configured). Within that board are scattered the `mines` and` empty cells`, the cells have an assigned number which informs the amount of mines that it has around it in a radius of 1 cell. The purpose of the game is to discover all the cells without finding any mine, if a mine is uncovered, the game is lost.  
You can use the right click to `mark` a cell and protect it from a wrong click, this is to mark the possible mines that are in those cells.  
The game ends and the player is deemed won when all cells were discovered and no mines were uncovered.

## Configurations

- You can place the number of rows and columns (the number affects both cases).
- You can change the difficulty, this is the number of mines that appear on the board.
- You can save your game and continue later even if you close the window or the browser.

---

## Available routes

| method | endpoint    | description   | params |
| :----- | :---------- | :------------ | :----- |
| GET    | /           | Get html file |        |
| GET    | /styles.css | Get css file  |        |
| GET    | /minesweeper.js | Get js file  |        |
## Project structure

```sh
    src
    |_ browser
        |_ minesweeper.js
        |_ styles.js
    |_ routes
        |_ index.js
    |_ app.js
    |_ index.html
```

### Browser folder

The `.js` file that contains the game's logic and the `.css` file that gives it styles is saved in this folder.

### Routes folder

In this folder is the `index.js` file where the application paths are declared to access each of the resources.
