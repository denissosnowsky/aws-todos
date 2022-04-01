import React, { VFC } from "react";
import { Checkbox } from "@mui/material";

import s from "./checkButton.module.css";
import { Loading } from "../../../loading/loading";
import { TodoItem } from "../../../../types/todoItem";

export const CheckButton: VFC<Props> = ({ updatingId, item, updateItem }) => {
  return (
    <div className={s.checkWrapper}>
      {updatingId === item.id ? (
        <Loading small />
      ) : (
        <Checkbox
          edge="end"
          onChange={() => updateItem(item.id, !item.completed)}
          checked={item.completed}
        />
      )}
    </div>
  );
};

type Props = {
  item: TodoItem;
  updatingId: string;
  updateItem: (id: string, completed: boolean) => Promise<void>;
};
