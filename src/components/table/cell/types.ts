export type CellRefType = HTMLTableCellElement | null;
export type InputRefType = HTMLInputElement | null;

export type CellValueType = number | string | undefined;
export type CellType = {
    id: string;
    value: CellValueType;
};
