import { Cells, ColIdList, Rows, SelectionRows } from "./types";
import { TableState } from "./interfaces";

export const getHeaderByColumnIndex = (col: number) => {
    const ASCII_A = 65;
    let header = "";
    col++; // track from one

    while (col > 0) {
        let remainder = Math.floor(col % 26);

        if (remainder === 0) {
            header += "Z";
            col = Math.floor(col / 26) - 1;
        } else {
            header += String.fromCharCode(remainder + ASCII_A - 1);
            col = Math.floor(col / 26);
        }
    }

    return header.split("").reverse().join("");
};

export const makeEmptyRowsCells = (
    rows: number,
    cols: number,
    defaultRowOffset = 0,
    defaultColOffset = 0,
    defaultValue = ""
) => {
    let rowsObj: Rows = {};
    for (let i = 0 + defaultRowOffset; i < rows + defaultRowOffset; i++) {
        let cells = makeEmptyCells(cols, defaultColOffset, defaultValue);
        rowsObj = {
            ...rowsObj,
            [i]: cells,
        };
    }
    return rowsObj;
};

export const makeEmptyCells = (
    cols: number,
    defaultColOffset = 0,
    defaultValue = ""
) => {
    let cells: Cells = {};
    for (let j = 0 + defaultColOffset; j < cols + defaultColOffset; j++) {
        cells = {
            ...cells,
            [j]: {
                id: j,
                value: defaultValue,
            },
        };
    }
    return cells;
};

export const buildSelectionCoordinatesHelper = (state: TableState) => {
    const firstSelection = state.selection.firstSelection;
    const secondSelection = state.selection.secondSelection;
    let selectionRows: SelectionRows = {};

    if (!firstSelection) return;
    if (!secondSelection) {
        selectionRows[firstSelection.row] = [firstSelection.col];
        state.selection.selectionCoordinates.rows = selectionRows;
        return;
    }

    let rowDiff = parseInt(secondSelection.row) - parseInt(firstSelection.row);
    let colDiff = parseInt(secondSelection.col) - parseInt(firstSelection.col);

    const downRight = (swapToUpLeft = false) => {
        let f = firstSelection;
        // upLeft is opposite of downRight
        if (swapToUpLeft) {
            rowDiff =
                parseInt(firstSelection.row) - parseInt(secondSelection.row);
            colDiff =
                parseInt(firstSelection.col) - parseInt(secondSelection.col);
            f = secondSelection;
        }
        for (let i = 0; i <= rowDiff; i++) {
            let colIdList: ColIdList = [];
            let fRow = parseInt(f.row);
            let fCol = parseInt(f.col);
            for (let j = 0; j <= colDiff; j++) {
                let colId =
                    state.rows[(i + fRow).toString()][(j + fCol).toString()].id;
                colIdList.push(colId.toString());
            }
            selectionRows[(i + fRow).toString()] = colIdList;
        }
        state.selection.selectionCoordinates.rows = selectionRows;
    };

    const downLeft = (swapToUpRight = false) => {
        let f = firstSelection;
        // upRight is opposite of downLeft
        if (swapToUpRight) {
            rowDiff =
                parseInt(firstSelection.row) - parseInt(secondSelection.row);
            colDiff =
                parseInt(firstSelection.col) - parseInt(secondSelection.col);
            f = secondSelection;
        }

        for (let i = 0; i <= rowDiff; i++) {
            let colIdList: ColIdList = [];
            let fRow = parseInt(f.row);
            let fCol = parseInt(f.col);
            for (let j = 0; j <= Math.abs(colDiff); j++) {
                let colId = state.rows[i + fRow][fCol - j].id;
                colIdList.push(colId.toString());
            }
            selectionRows[i + fRow] = colIdList;
        }
        state.selection.selectionCoordinates.rows = selectionRows;
    };

    if (rowDiff > 0) {
        // down
        if (colDiff > 0) {
            // right
            downRight();
        } else {
            // left or center
            downLeft();
        }
    } else {
        // up
        if (colDiff < 0) {
            // left
            downRight(true);
        } else {
            // right or center
            downLeft(true);
        }
    }

    return state;
};
