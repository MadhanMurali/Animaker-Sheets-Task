import { ThHTMLAttributes } from "react";

export interface RowProps extends ThHTMLAttributes<HTMLTableRowElement> {
    index: number;
    indexOffset?: number;
}
