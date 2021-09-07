import { Cells, Rows } from "./types";

export const getHeaderByColumnIndex = (col: number) => {
    const ASCII_A = 65;
    let header = "";

    const OFFSET = 1; // col starts from zero
    let remainder = col;
    for (
        let quotient = Math.floor(col / 26);
        quotient > 0;
        quotient = Math.floor(col / 26)
    ) {
        remainder = col % 26;
        header += String.fromCharCode(quotient + ASCII_A - OFFSET);
        col = remainder;
    }
    header += String.fromCharCode(remainder + ASCII_A);
    return header;
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
