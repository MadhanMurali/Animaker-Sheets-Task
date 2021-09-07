import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { makeEmptyCells, makeEmptyRowsCells } from "./helpers";
import {
    TableAddColPayload,
    TableAddRowPayload,
    TableCellValuePayload,
    TablePayload,
    tableState,
} from "./interfaces";
import { Ids } from "./types";

const INITIAL_ROWS = 5;
const INITIAL_COLS = 5;

const initialState: tableState = {
    numberOfRows: INITIAL_ROWS,
    numberOfColumns: INITIAL_COLS,
    rows: makeEmptyRowsCells(INITIAL_ROWS, INITIAL_COLS),
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
    },
});

export const { update, reset, updateCellValue, addRow, addCol, buildIds } =
    tableSlice.actions;

export const selectTable = (state: RootState) => state.table;
export const selectTableCell =
    (row: string, col: string) => (state: RootState) =>
        state.table.rows[row][col];
export const selectTableIds = (state: RootState) => state.table.ids;

export default tableSlice.reducer;
