import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
    addColHelper,
    addRowHelper,
    buildSelectionCoordinatesHelper,
    makeEmptyCells,
    makeEmptyRowsCells,
} from "./helpers";
import {
    TableAddColPayload,
    TableAddRowPayload,
    TableCellValuePayload,
    TablePayload,
    TableState,
    UpdateSelection,
} from "./interfaces";
import { Ids, RowColPair, Rows } from "./types";

const INITIAL_ROWS = 5;
const INITIAL_COLS = 5;

const initialState: TableState = {
    numberOfRows: INITIAL_ROWS,
    numberOfColumns: INITIAL_COLS,
    rows: makeEmptyRowsCells(INITIAL_ROWS, INITIAL_COLS),
    selection: {
        isSelecting: false,
        selectionCoordinates: {
            rows: {},
        },
        copiedSelection: {
            rows: {},
        },
    },
    ids: undefined,
};

export const tableSlice = createSlice({
    name: "table",
    initialState,
    reducers: {
        update: (state, action: PayloadAction<TablePayload>) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        reset: () => initialState,
        updateCellValue: (
            state,
            action: PayloadAction<TableCellValuePayload>
        ) => {
            state.rows[action.payload.rowId][action.payload.colId].value =
                action.payload.value;
            return state;
        },
        addRow: (state, action: PayloadAction<TableAddRowPayload>) => {
            const newRowCount = state.numberOfRows + action.payload.count;

            const newRows = makeEmptyRowsCells(
                action.payload.count,
                state.numberOfColumns,
                state.numberOfRows
            );

            state.rows = {
                ...state.rows,
                ...newRows,
            };

            state.numberOfRows = newRowCount;

            return state;
        },
        addCol: (state, action: PayloadAction<TableAddColPayload>) => {
            const newColCount = state.numberOfColumns + action.payload.count;

            const newCells = makeEmptyCells(
                action.payload.count,
                state.numberOfColumns
            );

            let rowIds = Object.keys(state.rows);

            rowIds.forEach((rowId) => {
                state.rows[rowId] = {
                    ...state.rows[rowId],
                    ...newCells,
                };
            });

            state.numberOfColumns = newColCount;

            return state;
        },
        buildIds: (state) => {
            let rowIds = Object.keys(state.rows).sort();
            let ids: Ids = {};
            rowIds.forEach((rowId) => {
                let cells = Object.keys(state.rows[rowId]).sort();
                ids[rowId] = cells;
            });
            state.ids = ids;
            return state;
        },
        updateSelection: (state, action: PayloadAction<UpdateSelection>) => {
            if (action.payload.type === "first") {
                state.selection.firstSelection = action.payload.rowColPair;
                state.selection.secondSelection = undefined;
            }

            if (action.payload.type === "second")
                state.selection.secondSelection = action.payload.rowColPair;
            return state;
        },
        updateIsSelecting: (state, action: PayloadAction<boolean>) => {
            state.selection.isSelecting = action.payload;
            return state;
        },
        buildCopiedSelection: (state) => {
            let rows = state.selection.selectionCoordinates.rows;
            let rowIds = Object.keys(rows).sort();
            let copiedRows: Rows = {};

            // copy with rows and cols indexes starting from zero maintaing the same order
            rowIds.forEach((rowId, rowIndex) => {
                let colIds = rows[rowId].sort();
                colIds.forEach((colId, colIndex) => {
                    let cell = Object.assign({}, state.rows[rowId][colId]); // clone the cell
                    copiedRows[rowIndex] = {
                        ...copiedRows[rowIndex],
                        [colIndex]: cell,
                    };
                });
            });

            state.selection.copiedSelection.rows = copiedRows;
        },
        buildSelectionCoordinates: (state) => {
            buildSelectionCoordinatesHelper(state);
        },
        pasteInTarget: (state) => {
            if (!state.selection.firstSelection) return;

            const rowsToPaste = state.selection.copiedSelection.rows;
            const targetCellPair = state.selection.firstSelection;

            const rowIds = Object.keys(rowsToPaste).sort();
            const copiedColsCount = Object.keys(
                rowsToPaste[rowIds[rowIds.length - 1]]
            ).length;

            const LAST_COL_INDEX = state.numberOfColumns - 1;
            const totalColumnsRequired =
                parseInt(targetCellPair.col) + (copiedColsCount - 1);
            let colsToBeAdded = totalColumnsRequired - LAST_COL_INDEX;
            colsToBeAdded = colsToBeAdded > 0 ? colsToBeAdded : 0;

            const LAST_ROW_INDEX = state.numberOfRows - 1;
            const totalRowsRequired =
                parseInt(targetCellPair.row) + (rowIds.length - 1);
            let rowsToBeAdded = totalRowsRequired - LAST_ROW_INDEX;
            rowsToBeAdded = rowsToBeAdded > 0 ? rowsToBeAdded : 0;

            if (colsToBeAdded) {
                addColHelper(state, { count: colsToBeAdded });
            }
            if (rowsToBeAdded) {
                addRowHelper(state, { count: rowsToBeAdded });
            }

            rowIds.forEach((rowId) => {
                let colIds = Object.keys(rowsToPaste[rowId]).sort();
                colIds.forEach((colId) => {
                    let rKey = (
                        parseInt(targetCellPair.row) + parseInt(rowId)
                    ).toString();
                    let cKey = (
                        parseInt(targetCellPair.col) + parseInt(colId)
                    ).toString();
                    rowsToPaste[rowId][colId] = {
                        ...rowsToPaste[rowId][colId],
                        id: cKey,
                    };
                    state.rows[rKey] = {
                        ...state.rows[rKey],
                        [cKey]: rowsToPaste[rowId][colId],
                    };
                });
            });

            return state;
        },
    },
});

export const {
    update,
    reset,
    updateCellValue,
    addRow,
    addCol,
    buildIds,
    buildCopiedSelection,
    buildSelectionCoordinates,
    updateIsSelecting,
    updateSelection,
    pasteInTarget,
} = tableSlice.actions;

export const selectTable = (state: RootState) => state.table;
export const selectTableCell =
    (row: string, col: string) => (state: RootState) =>
        state.table.rows[row][col];
export const selectTableIds = (state: RootState) => state.table.ids;
export const isSelecting = (state: RootState) =>
    state.table.selection.isSelecting;
export const isCellSelected =
    ({ row, col }: RowColPair) =>
    (state: RootState) => {
        return state.table.selection.selectionCoordinates.rows[row]?.includes(
            col
        );
    };

export default tableSlice.reducer;
