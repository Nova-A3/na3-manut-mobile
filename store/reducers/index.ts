import { combineReducers } from "redux";
import auth from "./auth";
import ui from "./ui";
import data from "./data";

const rootReducer = combineReducers({ auth, ui, data });

export default rootReducer;
