import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import MainDash from "./components/MainDash/MainDash";
import RightSide from "./components/RightSide/RightSide";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Product from "./pages/Product/Product";
import Category from "./pages/Category/Category";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./redux/orebiSlice";
import ExaminationBooking from "./pages/ExaminationBooking/ExaminationBooking";

const Layout = () => {
  return <></>;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* ==================== Header Navlink Start here =================== */}
      <Route index element={<Home />}></Route>
      <Route path="/products" element={<Product />}></Route>
      <Route path="/categories" element={<Category />}></Route>
      <Route
        path="/examination-bookings"
        element={<ExaminationBooking />}
      ></Route>
      {/* <Route path="/categories" element={<Category />}></Route> */}
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Route>
  )
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      login({
        token:
          "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MDY2MDEzMTcsImV4cCI6MjY3MDYwMTMxN30.tKYrYdaSqwVbzso9fme8rGaLsOjjlbV0Jpodi-7kTww",
        type: "Bearer",
        id: "59b99de2-009e-44e6-8c63-a37525a27505",
        email: "admin@gmail.com",
        roles: ["ROLE_ADMIN"],
      })
    );
  });
  return (
    <div className="App">
      <div className="AppGlass">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
