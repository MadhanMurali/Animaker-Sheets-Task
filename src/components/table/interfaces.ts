import { CellValueType } from "./cell";
import {
    CopiedSelection,
    Ids,
    RowColPair,
    Rows,
    SelectionCoordinates,
} from "./types";

export interface TableState {
    numberOfRows: number;
    numberOfColumns: number;
    rows: Rows;
    ids?: Ids;
    selection: Selection;
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

export interface Selection {
    firstSelection?: RowColPair;
    secondSelection?: RowColPair;
    selectionCoordinates: SelectionCoordinates;
    isSelecting: boolean;
    copiedSelection: CopiedSelection;
}

export interface UpdateSelection {
    type: "first" | "second";
    rowColPair: RowColPair;
}
