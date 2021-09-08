import { InputProps } from "./interfaces";
import { useRef } from "react";
import { forwardRef } from "react";
import { InputRefType } from "./types";
import { refAssigner } from "../../../utils";

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ type, ...props }, ref) => {
        const inputRef = useRef<InputRefType>(null);

        return (
            <input
                {...props}
                type={type ? type : "text"}
                ref={(el) => refAssigner(el, ref, inputRef)}
            />
        );
    }
);
