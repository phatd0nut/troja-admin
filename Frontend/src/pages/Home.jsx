import React from "react";
import StackGrid from "../components/StackGrid"; // Importera StackGrid-komponenten
import "./Home.css";

const Home = ({ openNav, setOpenNav }) => {
  return (
    <div>
      <h1 className="pageHeader">Hem</h1>
      <StackGrid isDrawerOpen={openNav} /> {/* Skicka `openNav`-state som prop */}
    </div>
  );
};

export default Home;