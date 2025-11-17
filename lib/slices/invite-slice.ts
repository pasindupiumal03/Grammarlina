import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InviteState {
  inviteCode: string | null;
  email: string | null;
  org: string | null;
}

const initialState: InviteState = {
  inviteCode: null,
  email: null,
  org: null,
};

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {
    setInviteData(
      state,
      action: PayloadAction<{
        inviteCode: string;
        email: string;
        org: string;
      }>
    ) {
      state.inviteCode = action.payload.inviteCode;
      state.email = action.payload.email;
      state.org = action.payload.org;
    },
    clearInviteData(state) {
      state.inviteCode = null;
      state.email = null;
      state.org = null;
    },
  },
});

export const { setInviteData, clearInviteData } = inviteSlice.actions;
export const inviteReducer = inviteSlice.reducer;
export const inviteSelector = (state: RootState) => state.invite;


