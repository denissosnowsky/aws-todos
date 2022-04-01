import React, { VFC } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import s from './deleteButton.module.css';
import { Loading } from "../../../loading/loading";
import { TodoItem } from "../../../../types/todoItem";

export const DeleteButton: VFC<Props> = ({ item, deleteItem, deleteingId }) => {
  return (
    <div className={s.deleteButton}>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => deleteItem(item.id)}
        disabled={deleteingId === item.id}
      >
        {deleteingId === item.id ? (
          <Loading small />
        ) : (
          <DeleteIcon fontSize="large" className={s.deleteButton} />
        )}
      </IconButton>
    </div>
  );
};

type Props = {
  item: TodoItem;
  deleteingId: string;
  deleteItem: (id: string) => Promise<void>;
};
