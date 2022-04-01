import { TodoItem } from "../types/todoItem";

export const dateTodosSorting = (todosList: Array<TodoItem>): Array<TodoItem> => {
  return todosList.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
};
