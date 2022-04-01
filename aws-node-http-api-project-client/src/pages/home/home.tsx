import { useContext, useEffect, useState, VFC } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { TextField } from "@mui/material";

import s from "./home.module.css";
import { ListFC } from "../../components/list/list";
import { TodoItem } from "../../types/todoItem";
import { Loading } from "../../components/loading/loading";
import { dateTodosSorting } from "../../utils/dateTodosSorting";
import apiService from "../../service/api.service";
import { AuthContext } from "../../contexts/AuthContext";
import { notifyErrorAlert } from "../../utils/notifyErrorAlert";

export const Home: VFC = () => {
  const [updatingId, setUpdatingId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteingId, setDeleteingId] = useState("");
  const [isAddLoading, setIsAddLoading] = useState(false);
  const { setErrorAlert } = useContext(AuthContext)!;

  useEffect(() => {
    const fetchList = async () => {
      try {
        setIsLoading(true);
        const res = await apiService.get<TodoItem[]>("/todos");
        setList(res);
      } catch (e) {
        notifyErrorAlert("", setErrorAlert);
      }
      setIsLoading(false);
    };
    fetchList();
  }, []);

  const handlerAdd = async () => {
    try {
      if (inputValue.length > 0) {
        setIsAddLoading(true);
        const newItem = await apiService.post<TodoItem>("/todos", {
          todo: inputValue,
        });
        setList((list) => [newItem, ...list]);
        setInputValue("");
      }
    } catch (e) {
      notifyErrorAlert("Some error happened, try again", setErrorAlert);
    }
    setIsAddLoading(false);
  };

  const handlerDelete = async (id: string) => {
    try {
      setDeleteingId(id);
      await apiService.delete<void>(`/todo/${id}`);
      setList(list.filter((item) => item.id !== id));
    } catch (e) {
      notifyErrorAlert("Some error happened, try again", setErrorAlert);
    }
    setDeleteingId("");
  };

  const handlerUpdate = async (id: string, completed: boolean) => {
    try {
      setUpdatingId(id);
      await apiService.put<unknown>(`/todo/${id}`, {
        completed,
      });
      setList(
        list.map((item) => (item.id === id ? { ...item, completed } : item))
      );
    } catch (e) {
      notifyErrorAlert("Some error happened, try again", setErrorAlert);
    }
    setUpdatingId("");
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
