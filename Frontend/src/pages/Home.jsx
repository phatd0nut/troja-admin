import StackGrid from "../components/StackGrid";
import InfoContainer from "../components/InfoContainer";
import "./Home.css";
import { Typography } from "../utils/MaterialUI";
/**
 * Home-komponenten är startsidan för applikationen.
 * 
 * @component Home
 * @returns {JSX.Element} JSX-element som representerar startsidan.
 * 
 * @example
 * // Exempel på användning:
 * <Home />
 * 
 * @description
 * Home-komponenten innehåller följande element:
 * - En div med klassen "homeWrapper" som omsluter hela komponenten.
 * - En typografi-komponent (Typography) med variant "h2" och klassen "pageHeader" som visar texten "Hem".
 * - En StackGrid-komponent som troligen används för att visa ett rutnät av innehåll.
 * - En InfoContainer-komponent används för att visa ytterligare information.
 */
const Home = () => {
  return (
    <div className="homeWrapper">
      <Typography variant="h2" className="pageHeader">Hem</Typography>
      <StackGrid />
      <InfoContainer />
    </div>
  );
};

export default Home;