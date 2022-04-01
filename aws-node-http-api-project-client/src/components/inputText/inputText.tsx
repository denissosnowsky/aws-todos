import React, { VFC } from "react";
import { TextField } from "@mui/material";

export const InputText: VFC<Props> = ({ label, value, setValue }) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name={label}
      label={label}
      id={label}
      autoComplete={label}
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

type Props = {
  label: string;
  value: string;
  setValue: (arg: string) => void;
};
