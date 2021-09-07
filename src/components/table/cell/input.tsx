import { InputProps } from "./interfaces";

export const Input = ({ type, ...props }: InputProps) => {
    return <input {...props} type={type ? type : "text"} />;
};
