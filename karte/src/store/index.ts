import { configureStore, combineReducers, getDefaultMiddleware } from '@reduxjs/toolkit';

import map from './map';
import history from './history';

const reducer = combineReducers({
	map,
	history,
});

export type AppState = ReturnType<typeof reducer>;
export default configureStore({
	reducer,
	middleware: [...getDefaultMiddleware({ immutableCheck: false, serializableCheck: false })],
});
