import StackGrid from "../components/StackGrid";
import InfoContainer from "../components/InfoContainer";
import "./Home.css";
import { Typography } from "../utils/MaterialUI";
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