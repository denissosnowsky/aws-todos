import React, { useContext } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import s from "./auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { AuthSubPage } from "./authSubPage/authSubPage";
import { CodeSubPage } from "./codeSubPage/codeSubPage";

export function Auth() {
  const { isConfirmAccountPage } = useContext(AuthContext)!;

  return (
    <Container component="main" maxWidth="xs" className={s.container}>
      <CssBaseline />
      <Box className={s.wrapper}>
        {!isConfirmAccountPage ? <AuthSubPage /> : <CodeSubPage />}
      </Box>
    </Container>
  );
}
