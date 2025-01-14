import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "../utils/MaterialUI";
import { Visibility, VisibilityOff } from "../utils/MaterialUI";

/**
 * @component InputField
 * @description InputField-komponenten renderar ett formulärkontrollfält med en etikett och ett inmatningsfält.
 * Den stöder olika typer av inmatningar och kan visa eller dölja lösenord.
 *
 * @param {Object} props - Egenskaper som skickas till komponenten.
 * @param {string} props.id - ID för inmatningsfältet.
 * @param {string} props.label - Etiketten för inmatningsfältet.
 * @param {string} props.type - Typen av inmatningsfältet (t.ex. "text", "password").
 * @param {string} props.value - Värdet av inmatningsfältet.
 * @param {function} props.onChange - Händelsehanterare för ändring av inmatningsfältet.
 * @param {string} [props.autoComplete] - Autokompletteringsattribut för inmatningsfältet.
 * @param {boolean} [props.showPasswordToggle] - Om lösenordsvisningsknappen ska visas.
 * @param {boolean} [props.showPassword] - Om lösenordet ska visas som text.
 * @param {function} [props.handleClickShowPassword] - Händelsehanterare för klick på lösenordsvisningsknappen.
 * @param {function} [props.handleMouseDownPassword] - Händelsehanterare för musnedtryckning på lösenordsvisningsknappen.
 * @param {string} [props.className] - Ytterligare CSS-klasser för inmatningsfältet.
 * @param {boolean} [props.disabled] - Om inmatningsfältet ska vara inaktiverat.
 *
 * @returns {JSX.Element} En JSX-element som representerar ett inmatningsfält med en etikett.
 */
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
