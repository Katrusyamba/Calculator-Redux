import { createSlice } from '@reduxjs/toolkit';
import {weights} from '../weights'

const appSlice = createSlice({
  name: 'app',
  initialState: {
    selectedGroup: '',
    selectedSubgroup: '',
    length: '',
    result: '',
    data: weights
  },
  reducers: {
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setSelectedSubgroup: (state, action) => {
      state.selectedSubgroup = action.payload;
    },
    setLength: (state, action) => {
      state.length = action.payload;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
  },
});

export const { setSelectedGroup, setSelectedSubgroup, setLength, setResult } = appSlice.actions;

export default appSlice.reducer;
