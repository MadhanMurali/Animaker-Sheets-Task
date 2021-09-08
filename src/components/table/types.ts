import { CellType } from "./cell";

export type Cells = {
    [key: string]: CellType;
};

export type Rows = {
    [key: string]: Cells;
};

export type Ids = {
    [key: string]: string[];
};

export type RowColPair = {
    row: string;
    col: string;
};

export type ColIdList = string[];
export type SelectionRows = {
    [key: string]: ColIdList;
};
export type SelectionCoordinates = {
    rows: SelectionRows;
};

export type CopiedSelection = {
    rows: Rows;
};
