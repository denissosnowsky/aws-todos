import React, { FC, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";

import s from "./navbar.module.css";
import { AuthContext } from "../../contexts/AuthContext";

export const Navbar: FC = ({ children }) => {
  const { logout } = useContext(AuthContext)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box>
        <AppBar position="static">
          <Toolbar className={s.navbar}>
            <div className={s.navbarButtons}>
              <NavLink to="/">
                <Button color="inherit" variant="text">
                  Home
                </Button>
              </NavLink>
              <div className={s.divider}>|</div>
              <NavLink to="/changePassword">
                <Button color="inherit" variant="text">
                  Change Password
                </Button>
              </NavLink>
            </div>
            <Button color="error" onClick={logout} variant="contained" className={s.logoutButton}>
              LogOut
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className={s.body}>{children}</div>
    </div>
  );
};
