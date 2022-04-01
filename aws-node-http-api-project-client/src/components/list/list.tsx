import React, { VFC } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { TodoItem } from "../../types/todoItem";
import s from "./list.module.css";
import { Loading } from "../loading/loading";
import { Checkbox } from "@mui/material";

export const ListFC: VFC<Props> = ({
  list,
  deleteingId,
  deleteItem,
  updateItem,
  updatingId,
}) => {
  return (
    <div className={s.wrapper}>
      <List>
        {list.map((item, i) => (
          <ListItem
            key={i}
            secondaryAction={
              <div className={s.itemButtons}>
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
                <div className={s.buttonWrapper}>
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
              </div>
            }
          >
            <div className={s.id}>{i + 1}.</div>
            <ListItemText
              primary={item.todo}
              className={s.text}
              style={{
                textDecoration: item.completed ? "line-through" : "none",
              }}
            />
          </ListItem>
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
