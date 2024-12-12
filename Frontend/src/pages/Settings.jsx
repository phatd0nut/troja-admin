import { Typography } from "../utils/MaterialUI";
import Button from "../components/Button";  
import Toolbar from "../components/Toolbar";

const Settings = () => {
  return <div className="settingsWrapper">
    <Typography variant="h2" className="pageHeader">Inställningar</Typography>
    <Toolbar>
        <Button variant="contained">Logga ut</Button>
    </Toolbar>
  </div>;
};

export default Settings;
