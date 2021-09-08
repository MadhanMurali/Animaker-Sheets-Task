import { HeaderProps } from "./interfaces";

export const Header = ({ children, ...props }: HeaderProps) => {
    return (
        <>
            <th {...props}>{children}</th>
        </>
    );
};
