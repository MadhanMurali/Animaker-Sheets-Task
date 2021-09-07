import { CellProps } from "./interfaces";
import { Input } from "./input";
import { useDispatch, useSelector } from "react-redux";
import { CellValueType } from "./types";
import { selectTableCell, updateCellValue } from "../tableSlice";

export const Cell = (props: CellProps) => {
    const { inputProps, rowId, colId, ..._props } = props;
    const cell = useSelector(selectTableCell(rowId, colId));
    const tableDispatch = useDispatch();

    const updateCell = (value: CellValueType) => {
        console.log(rowId, colId, value);
        tableDispatch(
            updateCellValue({
                value: value,
                rowId: rowId,
                colId: colId,
            })
        );
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateCell(event.target.value);
    };

    return (
        <td {..._props}>
            <Input
                {...inputProps}
                value={cell.value}
                onChange={handleInputChange}
            />
        </td>
    );
};
