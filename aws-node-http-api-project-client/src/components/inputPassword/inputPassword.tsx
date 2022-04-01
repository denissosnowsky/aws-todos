import React, { VFC } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

export const InputPassword: VFC<Props> = ({
  label,
  value,
  isShownPass,
  setIsShownPass,
  setValue,
}) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name={label}
      label={label}
      type={isShownPass ? "text" : "password"}
      id={label}
      autoComplete={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setIsShownPass(!isShownPass)} edge="end">
              {!isShownPass ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

type Props = {
  label: string;
  value: string;
  isShownPass: boolean;
  setIsShownPass: (arg: boolean) => void;
  setValue: (arg: string) => void;
};
