import React, { useContext, useState, VFC } from "react";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";

import { InputText } from "../../../components/inputText/inputText";
import { InputPassword } from "../../../components/inputPassword/inputPassword";
import { AuthContext } from "../../../contexts/AuthContext";
import { Typography } from "@mui/material";
import { LinkButton } from "./linkButton/linkButton";

export const AuthSubPage: VFC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { signIn, signUp, setFormError, formError, loadingAuth } =
    useContext(AuthContext)!;

  const handleSubmit = async () => {
    setFormError("");
    return isNewUser ? signUpHandler() : signInHandler();
  };

  const onChangeIsNew = () => {
    setIsNewUser(!isNewUser);
    setEmail("");
    setPassword("");
    setFormError("");
    setPasswordConfirm("");
  };

  const signUpHandler = async () => {
    if (!email || !password || !passwordConfirm) {
      return setFormError("All fields must be filled");
    }
    if (password !== passwordConfirm) {
      return setFormError("Password mismatch");
    }
    await signUp(email, password);
  };

  const signInHandler = async () => {
    if (!email || !password) {
      return setFormError("All fields must be filled");
    }
    await signIn(email, password);
  };

  return (
    <>
      <Typography component="h1" variant="h5" width="100%">
        {isNewUser ? "Sign up" : "Sign in"}
      </Typography>

      <Box component="form" noValidate sx={{ mt: 1 }}>
        <InputText label="Email address" value={email} setValue={setEmail} />
        <InputPassword
          label="Password"
          isShownPass={showPassword}
          setIsShownPass={setShowPassword}
          value={password}
          setValue={setPassword}
        />
        {isNewUser && (
          <InputPassword
            label="Confirm password"
            isShownPass={showPasswordConfirm}
            setIsShownPass={setShowPasswordConfirm}
            value={passwordConfirm}
            setValue={setPasswordConfirm}
          />
        )}
        {formError && <div className="errorString">{formError}</div>}
        <LoadingButton
          loading={loadingAuth}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          {isNewUser ? "Sign Up" : "Sign In"}
        </LoadingButton>
        <LinkButton isNewUser={isNewUser} onChangeIsNew={onChangeIsNew} />
      </Box>
    </>
  );
};
