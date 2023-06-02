import { configureStore } from '@reduxjs/toolkit';
import Task from './Reducers';
import Stroage from "./Storage";

export const Store = configureStore({
    reducer: Task,
    preloadedState: Stroage.LoadState(),
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        })
    )
});

Store.subscribe(() => {
    Stroage.SaveState(Store.getState());
});

