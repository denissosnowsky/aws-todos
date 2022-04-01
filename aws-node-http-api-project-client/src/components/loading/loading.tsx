import React, { CSSProperties, VFC } from "react";

import loading from "../../assets/loading.gif";
import s from "./loading.module.css";

export const Loading: VFC<Props> = ({ isFull, small, style }) => {
  return (
    <div
      className={s.wrapper}
      style={{
        height: small ? "50px" : isFull ? "100vh" : "100%",
        width: small ? "50px" : "100%",
        ...style
      }}
    >
      <img alt="loading" src={loading} className={small ? s.smallLoading : s.loading} />
    </div>
  );
};

type Props = {
  isFull?: boolean;
  small?: boolean;
  style?: CSSProperties;
};
