import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface OrganizationModel {
  _id: string;
  name: string;
  organizationAdmin: string;
  members: string[];
  cookies: any[];
}

interface AuthState {
  authToken: string | null;
  email: string | null;
  name: string | null;
  organizations: OrganizationModel[];
  accountCreatedAt: string | null; // ISO string for serialization
  isLoading: boolean;
  error?: string;
  _id: string | null;
}

const initialState: AuthState = {
  authToken: null,
  email: null,
  name: null,
  organizations: [],
  accountCreatedAt: null,
  isLoading: false,
  error: undefined,
  _id: null,
};

// Thunks moved to lib/thunks/auth-thunks

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{
        authToken: string;
        email: string;
        name: string;
        organizations: OrganizationModel[];
        accountCreatedAt: string;
        _id: string;
      }>
    ) {
      state.authToken = action.payload.authToken;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.organizations = action.payload.organizations;
      state.accountCreatedAt = action.payload.accountCreatedAt;
      state._id = action.payload._id;
    },
    addOrganization(state, action: PayloadAction<OrganizationModel>) {
      state.organizations = [...state.organizations, action.payload];
    },
    loadFromStorage(state) {
      // State is persisted via redux-persist. No-op here.
      return state;
    },
    logout(state) {
      state._id = null
      state.authToken = null;
      state.email = null;
      state.name = null;
      state.organizations = [];
      state.accountCreatedAt = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("session-share-user");
        localStorage.removeItem("session-share-org");
      }
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: () => {},
});

export const {
  setAuth,
  addOrganization,
  loadFromStorage,
  logout,
  setIsLoading,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
export const authSelector = (state: RootState) => state.auth;
