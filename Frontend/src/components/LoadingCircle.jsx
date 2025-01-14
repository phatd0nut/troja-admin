import React from "react";
import { CircularProgress } from "../utils/MaterialUI";

/**
 * @component LoadingCircle
 * @description En komponent som visar en laddningscirkel.
 *
 * @param {string} id - Ett valfritt id för laddningscirkeln.
 * @param {string} [className="loadingCircle"] - En valfri klass för laddningscirkeln.
 * @param {number} [size=88] - Storleken på laddningscirkeln.
 * @param {object} props - Övriga egenskaper som ska skickas till CircularProgress-komponenten.
 * @returns {JSX.Element} En JSX-element som representerar en laddningscirkel.
 */
const LoadingCircle = ({
  id,
  className = "loadingCircle",
  size = 88,
  ...props
}) => {
  return (
    <CircularProgress id={id} className={className} size={size} {...props} />
  );
};

export default LoadingCircle;
