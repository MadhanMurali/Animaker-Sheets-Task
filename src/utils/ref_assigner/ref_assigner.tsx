import { ForwardedRef } from "react";

export const refAssigner = <ElementType,>(
    el: ElementType,
    parentRef: ForwardedRef<ElementType>,
    ref: React.MutableRefObject<ElementType>
) => {
    ref.current = el;

    if (typeof parentRef === "function") {
        parentRef(el);
    } else if (parentRef) {
        parentRef.current = el;
    }
};
