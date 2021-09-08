import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
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
                        [colIndex]: cell,
                    };
                });
            });

            state.selection.copiedSelection.rows = copiedRows;
        },
        buildSelectionCoordinates: (state) => {
            buildSelectionCoordinatesHelper(state);
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
        console.log(state.table.selection.selectionCoordinates.rows[row]);
        return state.table.selection.selectionCoordinates.rows[row]?.includes(
            col
        );
    };

export default tableSlice.reducer;
