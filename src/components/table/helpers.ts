import { Cells, Rows } from "./types";

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
                isSelectedByDrag: false,
            },
        };
    }
    return cells;
};
