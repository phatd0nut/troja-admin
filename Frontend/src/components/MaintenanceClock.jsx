import * as React from "react";
import { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import dayjs from "dayjs";

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
          <Button onClick={handleIncreaseHours}>↑</Button>
          <Box>{time.format("HH")}</Box>
          <Button onClick={handleDecreaseHours}>↓</Button>
        </div>
        <div className="timeSection">
          <Button onClick={handleIncreaseMinutes}>↑</Button>
          <Box>{time.format("mm")}</Box>
          <Button onClick={handleDecreaseMinutes}>↓</Button>
        </div>
      </div>
    </Box>
  );
}
