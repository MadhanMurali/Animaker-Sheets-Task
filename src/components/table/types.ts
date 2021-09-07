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
