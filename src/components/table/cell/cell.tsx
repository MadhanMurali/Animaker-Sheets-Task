import { CellProps } from "./interfaces";
import { Input } from "./input";
import { useDispatch, useSelector } from "react-redux";
import { CellValueType, InputRefType } from "./types";
import {
    isCellSelected,
    selectTableCell,
    updateCellValue,
    isSelecting,
    updateSelection,
    updateIsSelecting,
    buildSelectionCoordinates,
} from "../tableSlice";
import { useCallback, useRef, useState } from "react";
import "./cell.scss";
import { useEffect } from "react";

export const Cell = (props: CellProps) => {
    const { inputProps, rowId, colId, ..._props } = props;
    const cell = useSelector(selectTableCell(rowId, colId));
    const isSelected = useSelector(isCellSelected({ row: rowId, col: colId }));
    const _isSelecting = useSelector(isSelecting);
    const tableDispatch = useDispatch();

    // useEffect(() => {
    //     // if (isSelected) console.log(rowId, colId, isSelected);
    // }, [colId, isSelected, rowId]);

    const updateCell = (value: CellValueType) => {
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

    const handleMouseDown = useCallback(() => {
        tableDispatch(
            updateSelection({
                type: "first",
                rowColPair: {
                    row: rowId,
                    col: colId,
                },
            })
        );
        tableDispatch(updateIsSelecting(true));
        tableDispatch(buildSelectionCoordinates());
    }, [colId, rowId, tableDispatch]);

    const handleMouseEnter = useCallback(() => {
        if (_isSelecting) {
            // console.log("_isSelecting");
            tableDispatch(
                updateSelection({
                    type: "second",
                    rowColPair: {
                        row: rowId,
                        col: colId,
                    },
                })
            );
            tableDispatch(buildSelectionCoordinates());
        }
    }, [_isSelecting, colId, rowId, tableDispatch]);
    const handleMouseUp = useCallback(() => {
        tableDispatch(updateIsSelecting(false));
    }, [tableDispatch]);

    /* Make input element editable only on double click [START] */
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRefType>(null);

    const handleDoubleClick = useCallback(() => {
        setEditable(true);
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleBlur = useCallback(() => {
        setEditable(false);
    }, []);
    /* Make input element editable only on double click [START] */

    return (
        <td
            {..._props}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
        >
            <div className={"input-div"}>
                <Input
                    {...inputProps}
                    value={cell.value}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    ref={inputRef}
                />
                <span
                    className={`${!editable ? "overlay" : ""} ${
                        isSelected ? "selected" : ""
                    }`}
                ></span>
            </div>
        </td>
    );
};
