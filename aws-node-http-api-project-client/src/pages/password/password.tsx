import { useContext, useState, VFC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { LoadingButton } from "@mui/lab";

import s from "./password.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { InputPassword } from "../../components/inputPassword/inputPassword";

export const Password: VFC = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  const { changePassword, loadingAuth, formError, setFormError } =
    useContext(AuthContext)!;


  const handleSubmit = async () => {
    setFormError("");
    if (!password || !newPassword || !newPasswordConfirm) {
      return setFormError("All fields must be filled");
    }

    if(newPassword !== newPasswordConfirm) {
      return setFormError("Password mismatch");
    }

    await changePassword(password, newPassword);
    epmtifyFields();
  };


  const epmtifyFields = () => {
    setPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  }

  return (
    <Container component="main" maxWidth="xs" className={s.container}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <InputPassword
            label="Password"
            isShownPass={showPassword}
            setIsShownPass={setShowPassword}
            value={password}
            setValue={setPassword}
          />
          <InputPassword
            label="New password"
            isShownPass={showNewPassword}
            setIsShownPass={setShowNewPassword}
            value={newPassword}
            setValue={setNewPassword}
          />
          <InputPassword
            label="New password"
            isShownPass={showNewPasswordConfirm}
            setIsShownPass={setShowNewPasswordConfirm}
            value={newPasswordConfirm}
            setValue={setNewPasswordConfirm}
          />
          {formError && <div className="errorString">{formError}</div>}
          <LoadingButton
            loading={loadingAuth}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Change
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
};
