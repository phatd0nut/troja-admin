import React from "react";
import { Button as MuiButton } from "../utils/MaterialUI";

// 
/**
 * @component Button
 * @description En anpassad knappkomponent som använder Material-UI:s MuiButton.
 *
 * @param {string} id - ID för knappen.
 * @param {string} variant - Variant av knappen (t.ex. "contained", "outlined").
 * @param {string} color - Färg på knappen (t.ex. "primary", "secondary").
 * @param {string} size - Storlek på knappen (t.ex. "small", "medium", "large").
 * @param {function} onClick - Klick-händelsehanterare.
 * @param {React.ReactNode} children - Innehåll som ska visas inuti knappen.
 * @param {string} className - Extra CSS-klasser för knappen.
 * @param {object} props - Övriga props som ska skickas vidare till MuiButton.
 *
 * @returns {JSX.Element} En Material-UI knappkomponent med anpassade egenskaper.
 */
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
      className={`button ${className}`} // Kombinera standardklass med extra klasser
      id={id}                           // Sätt ID för knappen
      variant={variant}                 // Sätt variant för knappen
      color={color}                     // Sätt färg för knappen
      size={size}                       // Sätt storlek för knappen
      onClick={onClick}                 // Sätt klick-händelsehanterare
      {...props}                        // Sprid övriga props till MuiButton
    >
      {children} {/* Visa innehåll inuti knappen */}
    </MuiButton>
  );
};

export default Button;