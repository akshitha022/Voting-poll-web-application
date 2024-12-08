document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("grid-container");
    const message = document.getElementById("message");

    const size = 4;
    let grid = [];

    // Initialize grid
    function createGrid() {
        gridContainer.innerHTML = "";
        grid = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                tile.dataset.value = 0;
                gridContainer.appendChild(tile);
                row.push(0);
            }
            grid.push(row);
        }
        addRandomTile();
        addRandomTile();
        updateGrid();
    }

    // Add a random tile (2 or 4)
    function addRandomTile() {
        const emptyTiles = [];
        grid.forEach((row, i) => row.forEach((val, j) => {
            if (val === 0) emptyTiles.push({ i, j });
        }));
        if (emptyTiles.length > 0) {
            const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[i][j] = Math.random() > 0.1 ? 2 : 4;
        }
    }

    // Update the grid display
    function updateGrid() {
        const tiles = gridContainer.querySelectorAll(".tile");
        tiles.forEach((tile, index) => {
            const x = Math.floor(index / size);
            const y = index % size;
            const value = grid[x][y];
            tile.dataset.value = value;
            tile.textContent = value > 0 ? value : "";
        });
    }

    // Move tiles in a direction
    function slide(row) {
        const filtered = row.filter(val => val);
        const empty = Array(size - filtered.length).fill(0);
        return [...filtered, ...empty];
    }

    function combine(row) {
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1] && row[i] !== 0) {
                row[i] *= 2;
                row[i + 1] = 0;
            }
        }
        return row;
    }

    function move(direction) {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let row;
            if (direction === "left" || direction === "right") {
                row = grid[i];
                if (direction === "right") row.reverse();
            } else {
                row = grid.map(r => r[i]);
                if (direction === "down") row.reverse();
            }

            let newRow = slide(row);
            newRow = combine(newRow);
            newRow = slide(newRow);
            if (direction === "right" || direction === "down") newRow.reverse();

            if (direction === "left" || direction === "right") {
                if (JSON.stringify(grid[i]) !== JSON.stringify(newRow)) moved = true;
                grid[i] = newRow;
            } else {
                const column = grid.map(r => r[i]);
                if (JSON.stringify(column) !== JSON.stringify(newRow)) moved = true;
                newRow.forEach((val, j) => grid[j][i] = val);
            }
        }
        if (moved) {
            addRandomTile();
            updateGrid();
            if (isGameOver()) {
                message.textContent = "Game Over!";
            }
        }
    }

    function isGameOver() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] === 0) return false;
                if (j < size - 1 && grid[i][j] === grid[i][j + 1]) return false;
                if (i < size - 1 && grid[i][j] === grid[i + 1][j]) return false;
            }
        }
        return true;
    }

    // Key controls
    document.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowLeft":
                move("left");
                break;
            case "ArrowRight":
                move("right");
                break;
            case "ArrowUp":
                move("up");
                break;
            case "ArrowDown":
                move("down");
                break;
        }
    });

    createGrid();
});
