import { InputHTMLAttributes, TdHTMLAttributes } from "react";

export interface CellProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
    inputProps?: InputPropsWithoutValue;
    children?: undefined;
    rowId: string;
    colId: string;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}
export interface InputPropsWithoutValue extends InputProps {
    value?: undefined;
}
