import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: {
    token:
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MDY2MDEzMTcsImV4cCI6MjY3MDYwMTMxN30.tKYrYdaSqwVbzso9fme8rGaLsOjjlbV0Jpodi-7kTww",
    type: "Bearer",
    id: "59b99de2-009e-44e6-8c63-a37525a27505",
    email: "admin@gmail.com",
    roles: ["ROLE_ADMIN"],
  },
  products: [],
};

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
    login: (state, action) => {
      state.userInfo = {
        token: action.payload.token,
        id: action.payload.id,
        email: action.payload.email,
        roles: action.payload.roles,
      };
    },
    logout: (state) => {
      state.userInfo = {};
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
  login,
  logout,
} = orebiSlice.actions;
export default orebiSlice.reducer;
