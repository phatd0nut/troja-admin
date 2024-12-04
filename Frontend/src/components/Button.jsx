import React from "react";
import { Button as MuiButton } from "../utils/MaterialUI";

const Button = ({ id, variant, color, size, onClick, children, ...props }) => {
  return (
    <MuiButton
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
