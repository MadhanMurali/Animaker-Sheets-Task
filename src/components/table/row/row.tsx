import { Header } from "../header";
import { RowProps } from "./interfaces";

export const Row = (props: RowProps) => {
    const { index, indexOffset, children, ..._props } = props;

    const DEFAULT_INDEX_OFFSET = 1;
    const INDEX_OFFSET = indexOffset ? indexOffset : DEFAULT_INDEX_OFFSET;

    return (
        <tr {..._props}>
            <Header scope={"tr"}>{index + INDEX_OFFSET}</Header>
            {children}
        </tr>
    );
};
