import React from "react";
import { Button as MuiButton } from "../utils/MaterialUI";

const Button = ({
  id,
  variant,
  color,
  size,
  onClick,
  children,
  className,
  ...props
}) => {
  return (
    <MuiButton
      className={`button ${className}`}
      id={id}
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
