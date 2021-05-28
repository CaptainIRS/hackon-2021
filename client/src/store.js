import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./rootReducer";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const excludeLoggerEnvs = ["test", "production"];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(
  process.env.NODE_ENV || ""
);

const middleWare = [thunk];

if (shouldIncludeLogger) {
  const logger = createLogger({
    level: "info",
    collapsed: true,
  });
  middleWare.push(logger);
}

const persistedState = {};

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  persistedReducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middleWare))
);

export const persist = persistStore(store);

export default store;
