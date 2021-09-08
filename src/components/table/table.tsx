import { Row } from "./row";
import { memo } from "react";
import { Cell } from "./cell";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addCol,
    addRow,
    buildIds,
    selectTable,
    selectTableIds,
} from "./tableSlice";
import { useEffect } from "react";
import { Header } from "./header";
import { getHeaderByColumnIndex } from "./helpers";
export const Table = memo(() => {
    const tableState = useSelector(selectTable);
    const tableIds = useSelector(selectTableIds);
    const tableDispatch = useDispatch();

    useEffect(() => {}, [tableDispatch, tableIds]);

    const HeadersJsx = useMemo(() => {
        let hJsx = [];
        for (let i = 0; i < tableState.numberOfColumns; i++) {
            hJsx.push(<Header key={i}>{getHeaderByColumnIndex(i)}</Header>);
        }
        return hJsx;
    }, [tableState.numberOfColumns]);

    const RowsJsx = useMemo(() => {
        if (tableIds === undefined) {
            tableDispatch(buildIds());
            return;
        }
        let rowIds = Object.keys(tableIds).sort();
        return rowIds.map((rowId) => {
            const cellsJsx = [...tableIds[rowId]].sort().map((colId) => {
                return <Cell rowId={rowId} colId={colId} key={colId} />;
            });
            return (
                <Row index={parseInt(rowId, 10)} key={rowId}>
                    {cellsJsx}
                </Row>
            );
        });
    }, [tableDispatch, tableIds]);

    const handleAddRowClick = () => {
        tableDispatch(
            addRow({
                count: 1,
            })
        );
        tableDispatch(buildIds());
    };
    const handleAddColClick = () => {
        tableDispatch(
            addCol({
                count: 1,
            })
        );
        tableDispatch(buildIds());
    };

    return (
        <table>
            <thead>
                <tr>
                    <Header></Header>
                    {HeadersJsx}
                    <Header>
                        <button onClick={handleAddColClick}>ADD COLUMN</button>
                    </Header>
                </tr>
            </thead>
            <tbody>
                {RowsJsx}
                <tr>
                    <Header>
                        <button onClick={handleAddRowClick}>ADD ROW</button>
                    </Header>
                </tr>
            </tbody>
        </table>
    );
});
