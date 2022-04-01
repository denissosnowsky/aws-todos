import React, { useContext, useState, VFC } from "react";
import { LoadingButton } from "@mui/lab";

import { InputText } from "../../../components/inputText/inputText";
import { AuthContext } from "../../../contexts/AuthContext";
import { Typography } from "@mui/material";

export const CodeSubPage: VFC = () => {
  const [code, setCode] = useState("");
  const { setFormError, confirmAccountEmail, formError, loadingAuth } =
    useContext(AuthContext)!;

  const handleConfirm = async () => {
    setFormError("");
    if (code) {
      await confirmAccountEmail(code);
    } else {
      setFormError("Enter the code");
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" width="100%">
        Confirm account
      </Typography>
      <InputText label="Code" value={code} setValue={setCode} />
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
  );
};
