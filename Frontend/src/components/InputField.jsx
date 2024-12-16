import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "../utils/MaterialUI";
import { Visibility, VisibilityOff } from "../utils/MaterialUI";

const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  showPasswordToggle,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  className,
  disabled,
}) => {
  return (
    <FormControl
      className={`inputField ${className}`}
      sx={{ m: 0, width: "40ch" }}
      variant="outlined"
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        id={id}
        type={showPasswordToggle && showPassword ? "text" : type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        sx={{
          "&.Mui-disabled": {
            backgroundColor: "#f0f0f0",
          },
        }}
        endAdornment={
          showPasswordToggle && (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="start"
                sx={{  
                  "&:hover": { color: "#ffffff", backgroundColor: "#dc2e34" } }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
        label={label}
      />
    </FormControl>
  );
};

export default InputField;
