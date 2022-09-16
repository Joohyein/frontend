import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { apis } from "../../shared/api";

// Getting all categories & todos from server
// If there is no todolist, then createTodoList
export const getCategThunk = createAsyncThunk(
  "category/getCategory",
  async (payload, thunkAPI) => {
    try {
      const { data } = await apis.getCategories(payload);
      return thunkAPI.fulfillWithValue(data.data);
    } catch (e) {
      console.log("getCategThunk", e.response.data.status)
      if(e.response.data.status === 503){
        try {
          console.log("Check here", payload)
          const { data } = await apis.postTodoList(payload);
          return thunkAPI.rejectWithValue(data.data)
        } catch (e){
          console.log(e)
        }
      }
    }
  }
);

// Posting the added todo to server
export const createTodoThunk = createAsyncThunk(
  "todo/createTodo",
  async (payload, thunkAPI) => {
    try {
      const { data } = await apis.createTodo(payload);
      return thunkAPI.fulfillWithValue({
        todo: data.data,
        index: payload.addTodoObj,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Updating the added todo's title to server & state
export const updateTodoTiThunk = createAsyncThunk(
  "todo/updateTodoTitle",
  async (payload, thunkAPI) => {
    try {
      const { data } = await apis.updateTodoTi(payload);
      return thunkAPI.fulfillWithValue({
        todo: data.data,
        index: payload.updateTodoTiObj,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Updating the added todo's checkbox status to server & state
export const updateTodoCkThunk = createAsyncThunk(
  "todo/updateTodoCheck",
  async (payload, thunkAPI) => {
    try {
      const { data } = await apis.updateTodoCk(payload);
      return thunkAPI.fulfillWithValue({
         todo: data.data,
         index: payload.updateTodoCkObj,
       });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Updating the added todo's memo to server & state
export const updateTodoMemoThunk = createAsyncThunk(
  "todo/updateTodoMemo",
  async (payload, thunkAPI) => {
    try {
      console.log("Checy updateTodoMemoThunk", payload)
      const { data } = await apis.updateTodoMemo(payload);
      return thunkAPI.fulfillWithValue({
      todo: data.data,
      index: payload.updateTodoMemoObj,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Deleting the added todo to server
export const deleteTodoThunk = createAsyncThunk(
  "todo/deleteTodo",
  async (payload, thunkAPI) => {
    try {
      console.log("deleteThunk payload", payload.todoId);
      await apis.deleteTodo(payload.todoId);
      return thunkAPI.fulfillWithValue(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
};

const categTodoSlice = createSlice({
  name: "category",
  initialState,
  reducers: {

    // adding empty todo when the btn get clicked
    addMtyTodo: (state, action) => {
      state.categories[action.payload.categIndex].todos.push(
        action.payload.categReq
      );
    },

    // onChnageTodo for the new added todo
    onChangeTodo: (state, action) => {
      state.categories[action.payload.categIndex].todos[
        action.payload.todoIndex
      ].title = action.payload.chgTodoTitle;
    },
  },
  extraReducers: {

    // Getting all the categories
    [getCategThunk.pending]: (state) => {
      state.isLoading = true;
    },
    [getCategThunk.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    },
    [getCategThunk.rejected]: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload;
    },

    // Replacing the submitted todo from server with the added todo
    [createTodoThunk.pending]: (state) => {
      state.isLoading = true;
    },
    [createTodoThunk.fulfilled]: (state, action) => {
      state.isLoading = false;

      const categIndex = action.payload.index.categIndex;
      const todoIndex = action.payload.index.todoIndex;

      state.categories[categIndex].todos[todoIndex] = action.payload.todo;
    },
    [createTodoThunk.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Updating todo's title
    [updateTodoTiThunk.pending]: (state) => {
      state.isLoading = true;
    },
    [updateTodoTiThunk.fulfilled]: (state, action) => {
      state.isLoading = false;

      const categIndex = action.payload.index.categIndex;
      const todoIndex = action.payload.index.todoIndex;

      state.categories[categIndex].todos[todoIndex] = action.payload.todo;
    },
    [updateTodoTiThunk.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

     // Updating todo's Memo
     [updateTodoMemoThunk.pending]: (state) => {
      state.isLoading = true;
    },
    [updateTodoMemoThunk.fulfilled]: (state, action) => {
      state.isLoading = false;

      const categIndex = action.payload.index.categIndex;
      const todoIndex = action.payload.index.todoIndex;

      state.categories[categIndex].todos[todoIndex] = action.payload.todo;
    },
    [updateTodoMemoThunk.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Updating todo's checkbox status
    [updateTodoCkThunk.pending]: (state) => {
      state.isLoading = true;
    },
    [updateTodoCkThunk.fulfilled]: (state, action) => {
      state.isLoading = false;

      const categIndex = action.payload.index.categIndex;
      const todoIndex = action.payload.index.todoIndex;

      state.categories[categIndex].todos[todoIndex] = action.payload.todo;
    },
    [updateTodoCkThunk.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Deleting todo
    [deleteTodoThunk.pending]: (state) => {
      state.isLoading = true;
    },
    [deleteTodoThunk.fulfilled]: (state, action) => {
      state.isLoading = false;

      const categIndex = action.payload.categIndex;
      const todoIndex = action.payload.todoIndex;

      state.categories[categIndex].todos.splice(todoIndex,1)
    },
    [deleteTodoThunk.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { addMtyTodo, onChangeTodo } = categTodoSlice.actions;
export default categTodoSlice.reducer;