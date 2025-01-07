import React, { useState } from "react";
import {
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  HomeIcon,
  PeopleIcon,
  MailIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogoutIcon,
  Box,
  Dialog,
  DialogContent,
} from "../utils/MaterialUI";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css"; // Importera CSS-filen för ytterligare styling
import logo from "../assets/svg/troja_logo.svg"; // Importera SVG-filen
import Button from "../components/Button";
import LoadingCircle from "./LoadingCircle";

const drawerWidth = 190;
const miniDrawerWidth = 60;

const NavBar = ({ openNav, setOpenNav }) => {
  const navigate = useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrawerOpen = () => {
    setOpenNav(true);
  };

  const handleDrawerClose = () => {
    setOpenNav(false);
  };

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      navigate("/login");
    }, 2000);
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const navItems = [
    { text: "Hem", icon: <HomeIcon className="menuIcons" />, path: "/home" },
    {
      text: "Kunder",
      icon: <PeopleIcon className="menuIcons" />,
      path: "/customers",
    },
    {
      text: "Utskick",
      icon: <MailIcon className="menuIcons" />,
      path: "/mailing",
    },
    {
      text: "Inställningar",
      icon: <SettingsIcon className="menuIcons" />,
      path: "/settings",
    },
    {
      text: "Logga ut",
      icon: <LogoutIcon className="menuIcons" />,
      action: handleOpenLogoutDialog,
    },
    {
      text: "Fäll in",
      icon: openNav ? (
        <ChevronLeftIcon className="menuIcons" />
      ) : (
        <ChevronRightIcon className="menuIcons" />
      ),
      action: openNav ? handleDrawerClose : handleDrawerOpen,
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Drawer
        className="navbar" // Lägg till klassen navbar
        sx={{
          width: openNav ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          position: "relative",
          transition: "width 0.3s ease-in-out",
          [`& .MuiDrawer-paper`]: {
            width: openNav ? drawerWidth : miniDrawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            backgroundColor: (theme) => theme.palette.primary.main,
            color: (theme) => theme.palette.primary.contrastText,
            transition: "width 0.3s ease-in-out",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Lägg till box-shadow
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
        }}
        variant="permanent"
        anchor="left"
        open={openNav}
      >
        <Box
          component={Link}
          to="/home"
          sx={{
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </Box>
        <List
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "100%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {navItems.map((item, index) => (
            <ListItem
              button="true"
              key={index}
              component={item.path ? Link : "button"}
              to={item.path}
              onClick={item.action}
              sx={{
                "&:hover": {
                  backgroundColor: "white",
                  color: (theme) => theme.palette.primary.main,
                  "& .MuiListItemIcon-root": {
                    color: (theme) => theme.palette.primary.main,
                  },
                  "& .MuiListItemText-root": {
                    color: (theme) => theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{ color: (theme) => theme.palette.primary.contrastText }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color: (theme) => theme.palette.primary.contrastText,
                  transition: "opacity 0.3s ease-in-out", // Lägg till transition för opacity
                  opacity: openNav ? 1 : 0, // Ändra opacity beroende på om Drawer är öppen eller stängd
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Dialog open={openLogoutDialog} onClose={handleCloseLogoutDialog}>
        <DialogContent className="standardDialog">
          <h2>
            {loading ? "Loggar ut..." : "Är du säker på att du vill logga ut?"}
          </h2>
          <div id="logoutDialogBtns">
            {loading ? (
              <LoadingCircle />
            ) : (
              <>
                <Button variant="contained" onClick={handleLogout}>
                  Ja, logga ut
                </Button>
                <Button onClick={handleCloseLogoutDialog}>Avbryt</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NavBar;
