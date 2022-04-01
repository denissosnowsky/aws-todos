import { Alert } from "@mui/material";
import React, { FC } from "react";

import s from "./alertLayout.module.css";

export const AlertLayout: FC<Props> = ({ children, text, type }) => {
  return (
    <>
      {text && (
        <div className={s.wrapper}>
          <Alert severity={type} variant="filled">{text}</Alert>
        </div>
      )}
      {children}
    </>
  );
};

type Props = {
  type: "error" | "success" | "warning" | "info";
  text: string;
};
