import StackGrid from "../components/StackGrid"; // Importera StackGrid-komponenten
import InfoContainer from "../components/InfoContainer";
import "./Home.css";
import { Typography } from "../utils/MaterialUI"; // Importera Typography korrekt

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