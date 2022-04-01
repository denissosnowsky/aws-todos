import { useEffect, useState, VFC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import s from "./home.module.css";
import { ListFC } from "../../components/list/list";
import axios from "axios";
import { TodoItem } from "../../types/todoItem";
import { Loading } from "../../components/loading/loading";
import { TextField } from "@mui/material";
import { dateTodosSorting } from "../../utils/dateTodosSorting";

export const Home: VFC = () => {
  const [list, setList] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deleteingId, setDeleteingId] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<TodoItem[]>(
          "https://w896wj0aol.execute-api.us-east-1.amazonaws.com/dev/todos",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("aws-token")}`,
            },
          }
        );
        setList(res.data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    };
    fetchList();
  }, []);

  const handlerAdd = async () => {
    try {
      if (inputValue.length > 0) {
        setIsAddLoading(true);
        const newItem = await axios.post<TodoItem>(
          "https://w896wj0aol.execute-api.us-east-1.amazonaws.com/dev/todos",
          {
            todo: inputValue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("aws-token")}`,
            },
          }
        );
        setList((list) => [newItem.data, ...list]);
        setInputValue("");
        setIsAddLoading(false);
      }
    } catch (e) {
      setIsAddLoading(false);
    }
  };

  const handlerDelete = async (id: string) => {
    try {
      setDeleteingId(id);
      await axios.delete<void>(
        `https://w896wj0aol.execute-api.us-east-1.amazonaws.com/dev/todo/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aws-token")}`,
          },
        }
      );
      setList(list.filter((item) => item.id !== id));
      setDeleteingId("");
    } catch (e) {
      setDeleteingId("");
    }
  };

  const handlerUpdate = async (id: string, completed: boolean) => {
    try {
      setUpdatingId(id);
      await axios.put<unknown>(
        `https://w896wj0aol.execute-api.us-east-1.amazonaws.com/dev/todo/${id}`,
        {
          completed,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aws-token")}`,
          },
        }
      );
      setList(
        list.map((item) => (item.id === id ? { ...item, completed } : item))
      );
      setUpdatingId("");
    } catch (e) {
      setUpdatingId("");
    }
  };

  return (
    <Container component="main" maxWidth="xs" className={s.container}>
      <CssBaseline />
      {isLoading ? (
        <div className={s.loadingWrapper}>
          <Loading />
        </div>
      ) : (
        <div className={s.wrapper}>
          <div className={s.inputWrapper}>
            <TextField
              id="standard-basic"
              label="Input new item..."
              variant="standard"
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {!isAddLoading ? (
              <AddCircleIcon
                onClick={handlerAdd}
                fontSize="large"
                className={s.addButton}
              />
            ) : (
              <Loading small style={{ marginLeft: "10px" }} />
            )}
          </div>
          <ListFC
            list={dateTodosSorting(list)}
            deleteItem={handlerDelete}
            updateItem={handlerUpdate}
            updatingId={updatingId}
            deleteingId={deleteingId}
          />
        </div>
      )}
    </Container>
  );
};
