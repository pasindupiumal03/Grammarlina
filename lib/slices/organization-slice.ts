import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface Member {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  categories: string[]; // Array of category names the member belongs to
}
interface PendingMember {
  email: string;
  status: string;
  userRole?: string;
  userId?: string;
  _id: string;
}

interface UserItem {
  _id: string;
  email: string;
}

interface Service {
  _id: string;
  name: string;
  domain: string;
  category: string;
  logo: string;
  tags: string[];
}

interface UserCategory {
  categoryName: string;
  users: UserItem[];
  _id: string;
}

interface OrganizationState {
  isLoading: boolean;
  name: string;
  organizationAdmin: UserItem;
  members: Member[];
  cookies: any[];
  _id: string;
  pendingMembers: PendingMember[];
  logo?: string;
  domain?: string;
  restrictToDomain?: boolean;
  type?: string;
  services?: Service[];
  admins: UserItem[];
  moderators: UserItem[];
  editors: UserItem[];
  createdAt: string;
  updatedAt: string;
  isDomainOpen: boolean;
  usercategories: UserCategory[];
}

const initialState: OrganizationState = {
  isLoading: false,
  name: "",
  organizationAdmin: {
    _id: "",
    email: "",
  },
  members: [],
  cookies: [],
  _id: "",
  pendingMembers: [],
  logo: undefined,
  domain: undefined,
  restrictToDomain: false,
  type: "",
  services: [],
  admins: [],
  moderators: [],
  editors: [],
  createdAt: "2025-10-01T06:42:32.331Z",
  updatedAt: "2025-10-02T07:55:45.314Z",
  isDomainOpen: true,
  usercategories: [],
};

// Thunks moved to lib/thunks/auth-thunks

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganization(state, action: PayloadAction<OrganizationState>) {
      state.name = action.payload.name;
      state.organizationAdmin = action.payload.organizationAdmin;
      state.members = action.payload.members;
      state.cookies = action.payload.cookies;
      state._id = action.payload._id;
      state.logo = action.payload.logo;
      state.domain = action.payload.domain;
      state.restrictToDomain = action.payload.restrictToDomain;
      state.type = action.payload.type;
      state.services = action.payload.services;
      state.admins = action.payload.admins;
      state.moderators = action.payload.moderators;
      state.editors = action.payload.editors;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
      state.isDomainOpen = action.payload.isDomainOpen;
      state.usercategories = action.payload.usercategories;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearOrganizationState(state) {
      return initialState;
    },
    setOrganizationMembers(state, action: PayloadAction<Member[]>) {
      state.members = action.payload;
    },
    setPendingMembers(state, action: PayloadAction<PendingMember[]>) {
      state.pendingMembers = action.payload;
    },
    addOrganizationMember(state, action: PayloadAction<PendingMember>) {
      state.pendingMembers = [...state.pendingMembers, action.payload];
    },
    addPendingMember(state, action: PayloadAction<PendingMember>) {
      state.pendingMembers = [...state.pendingMembers, action.payload];
    },
    setServices(state, action: PayloadAction<Service[]>) {
      state.services = action.payload;
    },
    setUserCategories(state, action: PayloadAction<UserCategory[]>) {
      state.usercategories = action.payload;
    },
    addUserCategory(state, action: PayloadAction<UserCategory>) {
      state.usercategories = [...state.usercategories, action.payload];
    },
    updateUserCategory(
      state,
      action: PayloadAction<{ id: string; category: UserCategory }>
    ) {
      const index = state.usercategories.findIndex(
        (cat) => cat._id === action.payload.id
      );
      if (index !== -1) {
        state.usercategories[index] = action.payload.category;
      }
    },
    removeUserCategory(state, action: PayloadAction<string>) {
      state.usercategories = state.usercategories.filter(
        (cat) => cat._id !== action.payload
      );
    },
  },
  extraReducers: () => {},
});

export const {
  setOrganization,
  setIsLoading,
  setOrganizationMembers,
  setPendingMembers,
  addPendingMember,
  addOrganizationMember,
  setServices,
  setUserCategories,
  addUserCategory,
  updateUserCategory,
  removeUserCategory,
  clearOrganizationState
} = organizationSlice.actions;
export const organizationReducer = organizationSlice.reducer;
export const organizationSelector = (state: RootState) => state.organization;
