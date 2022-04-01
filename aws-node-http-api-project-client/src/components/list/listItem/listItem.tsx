import React, { VFC } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import s from "./listItem.module.css";
import { TodoItem } from "../../../types/todoItem";
import { CheckButton } from "./checkButton/checkButton";
import { DeleteButton } from "./deleteButton/deleteButton";

export const ListItemFC: VFC<Props> = ({
  item,
  index,
  deleteingId,
  updatingId,
  updateItem,
  deleteItem,
}) => {
  return (
    <ListItem
      secondaryAction={
        <div className={s.itemButtons}>
          <CheckButton
            item={item}
            updatingId={updatingId}
            updateItem={updateItem}
          />
          <DeleteButton
            item={item}
            deleteingId={deleteingId}
            deleteItem={deleteItem}
          />
        </div>
      }
    >
      <div className={s.id}>{index + 1}.</div>
      <ListItemText
        primary={item.todo}
        className={s.text}
        style={{
          textDecoration: item.completed ? "line-through" : "none",
        }}
      />
    </ListItem>
  );
};

type Props = {
  index: number;
  item: TodoItem;
  deleteingId: string;
  updatingId: string;
  deleteItem: (id: string) => Promise<void>;
  updateItem: (id: string, completed: boolean) => Promise<void>;
};
