import React, { useContext, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";

import s from "./auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";

export function Auth() {
  const [isNew, setIsNew] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [code, setCode] = useState("");

  const {
    signIn,
    signUp,
    loadingAuth,
    isConfirmAccountPage,
    confirmAccountEmail,
    formError,
    setFormError,
  } = useContext(AuthContext)!;

  const handleSubmit = async () => {
    setFormError("");
    if (isNew) {
      if (email && password && passwordConfirm) {
        if (password === passwordConfirm) {
          await signUp(email, password);
        } else {
          setFormError("Password mismatch");
        }
      } else {
        setFormError("All fields must be filled");
      }
    } else {
      if (email && password) {
        await signIn(email, password);
      } else {
        setFormError("All fields must be filled");
      }
    }
  };

  const handleConfirm = async () => {
    setFormError("");
    if (code) {
      await confirmAccountEmail(code);
    } else {
      setFormError("Enter the code");
    }
  };

  const onChangeIsNew = () => {
    setIsNew(!isNew);
    setEmail("");
    setPassword("");
    setFormError("");
  };

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
        {isConfirmAccountPage ? (
          <Typography component="h1" variant="h5" width="100%">
            Confirm account
          </Typography>
        ) : isNew ? (
          <Typography component="h1" variant="h5" width="100%">
            Sign up
          </Typography>
        ) : (
          <Typography component="h1" variant="h5" width="100%">
            Sign in
          </Typography>
        )}
        {!isConfirmAccountPage ? (
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {isNew && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirm password"
                label="Confirm password"
                type={showPasswordConfirm ? "text" : "password"}
                id="confirmPassword"
                autoComplete="current-password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPasswordConfirm(!showPasswordConfirm)
                        }
                        edge="end"
                      >
                        {!showPasswordConfirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
              {isNew ? "Sign Up" : "Sign In"}
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={onChangeIsNew}>
                  {isNew
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Code"
              name="code"
              autoComplete="code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {formError && <div className="errorString">{formError}</div>}
            <LoadingButton
              loading={loadingAuth}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleConfirm}
            >
              Confirm
            </LoadingButton>
          </>
        )}
      </Box>
    </Container>
  );
}
