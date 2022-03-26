import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./LoaderButton.css";

export default function LoaderButton(props: any) {
    const { isLoading, className = "", disabled = false, ...rest } = props;
    return (
        <Button
            disabled={disabled || isLoading}
            className={`LoaderButton ${className}`}
            {...rest}
        >
            {isLoading && <BsArrowRepeat className="spinning"/>}
            {rest.children}
        </Button>
    );
}