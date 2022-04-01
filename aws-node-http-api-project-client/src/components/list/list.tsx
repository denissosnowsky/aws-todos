import React, { VFC } from "react";
import List from "@mui/material/List";

import { TodoItem } from "../../types/todoItem";
import s from "./list.module.css";
import { ListItemFC } from "./listItem/listItem";

export const ListFC: VFC<Props> = ({
  list,
  deleteingId,
  updatingId,
  deleteItem,
  updateItem,
}) => {
  return (
    <div className={s.wrapper}>
      <List>
        {list.map((item, i) => (
          <ListItemFC
            key={i}
            index={i}
            item={item}
            deleteingId={deleteingId}
            deleteItem={deleteItem}
            updatingId={updatingId}
            updateItem={updateItem}
          />
        ))}
      </List>
    </div>
  );
};

type Props = {
  list: TodoItem[];
  deleteingId: string;
  updatingId: string;
  deleteItem: (id: string) => Promise<void>;
  updateItem: (id: string, completed: boolean) => Promise<void>;
};
