import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { authReducer } from "./slices/auth-slice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { organizationReducer } from "./slices/organization-slice"
import { inviteReducer } from "./slices/invite-slice"

// Placeholder reducer map; slices will be added incrementally
const rootReducer = combineReducers({
  auth: authReducer,
  organization: organizationReducer,
  invite: inviteReducer,
})

const persistConfig = {
  key: "root",
  storage,
  whitelist: [ "organization", "invite", "auth"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector


