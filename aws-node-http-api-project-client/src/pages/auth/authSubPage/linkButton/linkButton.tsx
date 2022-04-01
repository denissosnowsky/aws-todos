import React, { VFC } from "react";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

export const LinkButton: VFC<Props> = ({ isNewUser, onChangeIsNew }) => {
  return (
    <Grid container>
      <Grid item xs></Grid>
      <Grid item>
        <Link href="#" variant="body2" onClick={onChangeIsNew}>
          {isNewUser
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Link>
      </Grid>
    </Grid>
  );
};

type Props = {
  isNewUser: boolean;
  onChangeIsNew: () => void;
};
