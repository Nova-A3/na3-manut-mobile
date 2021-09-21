import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

const store = createStore(rootReducer, composeWithDevTools());

/*
store.subscribe(() => {
  console.log("FILTERS", store.getState().data.filters.departments);
});
*/

export default store;
