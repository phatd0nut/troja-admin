import React from "react";
import { CircularProgress } from "../utils/MaterialUI";

const LoadingCircle = ({
  id,
  className = "loadingCircle",
  size,
  ...props
}) => {
  return (
    <CircularProgress id={id} className={className} size={size} {...props} />
  );
};

export default LoadingCircle;
