import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice'; // Предполагается, что у вас есть срез (slice) для app

const store = configureStore({
  reducer: {
  app: appReducer,
  }
});

export default store;