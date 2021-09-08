import { useState } from "react";
import { useCallback } from "react";
import { InputProps } from "./interfaces";
import { useRef } from "react";
import "./input.scss";

export const Input = ({ type, ...props }: InputProps) => {
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleDoubleClick = useCallback(() => {
        setEditable(true);
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleBlur = useCallback(() => {
        setEditable(false);
    }, []);

    return (
        <div onDoubleClick={handleDoubleClick} className={"input-div"}>
            <input
                {...props}
                onBlur={handleBlur}
                type={type ? type : "text"}
                ref={inputRef}
            />
            <span className={!editable ? "overlay" : ""}></span>
        </div>
    );
};
