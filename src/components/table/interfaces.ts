import { CellValueType } from "./cell";
import { Rows } from "./types";

export interface tableState {
    numberOfRows: number;
    numberOfColumns: number;
    rows: Rows;
    ids?: {
        [key: string]: string[];
    };
}

export interface TablePayload {
    numberOfRows?: number;
    numberOfColumns?: number;
    rows?: Rows;
}

export interface TableCellValuePayload {
    value: CellValueType;
    rowId: string;
    colId: string;
}

export interface TableAddRowPayload {
    count: number;
}
export interface TableAddColPayload {
    count: number;
}
