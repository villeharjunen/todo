"use client";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Grid,
  IconButton,
  Input,
  Stack,
} from "@mui/joy";
import { ChangeEvent, useEffect, useReducer, useState } from "react";
import { tasksReducer } from "./reducer";
import { Task } from "./task";

let initialState = { tasks: [] };
if (typeof window !== "undefined") {
  const localStorageState = localStorage.getItem("state");

  if (localStorageState !== null) {
    const parsedLocalStorageData = JSON.parse(localStorageState);

    parsedLocalStorageData.tasks = parsedLocalStorageData.tasks
      // Date strings need to be converted back to Date objects
      .map((task: any) => {
        return {
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
        };
      });
    initialState = parsedLocalStorageData;
  }
}

export default function Todo() {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const [newTaskInput, setNewTaskInput] = useState<string>("");

  const saveNewTask = () => {
    if (newTaskInput) {
      dispatch({ type: "new", payload: new Task(newTaskInput) });
    }
    setNewTaskInput("");
  };

  const editTask = (event: ChangeEvent<HTMLInputElement>, task: Task) => {
    task.label = event.target.value;
    dispatch({ type: "edit", payload: task });
  };

  const toggleTaskCompleted = (checked: boolean, task: Task) => {
    if (checked) {
      dispatch({ type: "complete", payload: task });
    } else {
      dispatch({ type: "uncomplete", payload: task });
    }
  };

  const deleteTask = (task: Task) => {
    dispatch({ type: "remove", payload: task });
  };

  useEffect(() => {
    if (state.tasks.length) {
      localStorage.setItem("state", JSON.stringify(state));
    } else {
      localStorage.removeItem("state");
    }
  }, [state]);

  return (
    <>
      <Container sx={{ p: 2 }} suppressHydrationWarning>
        <Stack spacing={2}>
          <Card>
            <Box sx={{ p: 1 }}>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  return saveNewTask();
                }}
              >
                <Input
                  id="task"
                  variant="outlined"
                  placeholder="New task"
                  fullWidth
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  endDecorator={
                    <>
                      <Divider orientation="vertical" />
                      <IconButton onClick={() => saveNewTask()}>
                        <AddIcon />
                      </IconButton>
                    </>
                  }
                />
              </form>
            </Box>
          </Card>
          {state && state.tasks.length ? (
            <Card>
              <Stack spacing={2}>
                {state.tasks
                  .sort((a, b) => {
                    return a.createdAt.getTime() - b.createdAt.getTime();
                  })
                  .sort((a, b) => {
                    if (a.completedAt && b.completedAt) {
                      return b.completedAt.getTime() - a.completedAt.getTime();
                    } else if (a.completedAt && !b.completedAt) {
                      return 1;
                    } else if (!a.completedAt && b.completedAt) {
                      return -1;
                    }
                    return 0;
                  })
                  .map((task, i) => {
                    return (
                      <Input
                        key={i}
                        id="task"
                        variant="outlined"
                        fullWidth
                        value={task.label}
                        onChange={(event) => {
                          editTask(event, task);
                        }}
                        startDecorator={
                          <>
                            <Checkbox
                              sx={{ mr: 1 }}
                              checked={task.completed}
                              onChange={(event) => {
                                toggleTaskCompleted(event.target.checked, task);
                              }}
                            ></Checkbox>
                            <Divider orientation="vertical" />
                          </>
                        }
                        endDecorator={
                          <IconButton onClick={() => deleteTask(task)}>
                            <ClearIcon />
                          </IconButton>
                        }
                      ></Input>
                    );
                  })}
              </Stack>
              <Grid container>
                <Grid xs={6} sx={{ textAlign: "left" }}>
                  <Button
                    variant="soft"
                    color="success"
                    onClick={() =>
                      dispatch({ type: "complete-all", payload: {} as any })
                    }
                    startDecorator={<CheckIcon />}
                  >
                    Mark all done
                  </Button>
                </Grid>
                <Grid xs={6} sx={{ textAlign: "right" }}>
                  <Button
                    variant="soft"
                    color="danger"
                    onClick={() =>
                      dispatch({ type: "remove-all", payload: {} as any })
                    }
                    startDecorator={<ClearIcon />}
                  >
                    Clear all
                  </Button>
                </Grid>
              </Grid>
            </Card>
          ) : null}
        </Stack>
      </Container>
    </>
  );
}
