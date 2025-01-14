import * as React from "react";
import { useState } from "react";
import { Box, ArrowDropDownIcon, ArrowDropUpIcon } from "../utils/MaterialUI";
import Button from "./Button";
import dayjs from "dayjs";

/**
 * @component MaintenanceClock
 * @description Komponent för att justera underhållsklockan.
 * 
 * 
 * @example
 * return (
 *   <MaintenanceClock />
 * )
 * 
 * @returns {JSX.Element} JSX-element som representerar underhållsklockan.
 * 
 * @description
 * Denna komponent tillåter användaren att justera timmar och minuter för en underhållsklocka.
 * Tiden är initialt inställd till kl 00:00 och kan justeras med knappar för att öka eller minska timmar och minuter.
 * 
 * @function
 * @name MaintenanceClock
 * 
 * @property {function} handleIncreaseHours - Funktion för att öka timmar med 1.
 * @property {function} handleDecreaseHours - Funktion för att minska timmar med 1.
 * @property {function} handleIncreaseMinutes - Funktion för att öka minuter med 5.
 * @property {function} handleDecreaseMinutes - Funktion för att minska minuter med 5.
 */
export default function MaintenanceClock() {
  const [time, setTime] = useState(dayjs().startOf("day")); // Ställ in tiden till kl 00:00

  const handleIncreaseHours = () => {
    setTime(time.add(1, "hour"));
  };

  const handleDecreaseHours = () => {
    setTime(time.subtract(1, "hour"));
  };

  const handleIncreaseMinutes = () => {
    setTime(time.add(5, "minute"));
  };

  const handleDecreaseMinutes = () => {
    setTime(time.subtract(5, "minute"));
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="timeAdjustment">
        <div className="timeSection">
          <Button className="clockAdjustBtn" onClick={handleIncreaseHours}><ArrowDropUpIcon/></Button>
          <Box sx={{ paddingTop: "5px", paddingBottom: "5px", fontWeight: "bold", fontSize: "1.1rem" }}>{time.format("HH")}</Box>
          <Button className="clockAdjustBtn" onClick={handleDecreaseHours}><ArrowDropDownIcon/></Button>
        </div>
        <div className="timeSection">
          <Button className="clockAdjustBtn" onClick={handleIncreaseMinutes}><ArrowDropUpIcon/></Button>
          <Box sx={{ paddingTop: "5px", paddingBottom: "5px", fontWeight: "bold", fontSize: "1.1rem" }}>{time.format("mm")}</Box>
          <Button className="clockAdjustBtn" onClick={handleDecreaseMinutes}><ArrowDropDownIcon/></Button>
        </div>
      </div>
    </Box>
  );
}
