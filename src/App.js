import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useNavigate,
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
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./redux/orebiSlice";
import ExaminationBooking from "./pages/ExaminationBooking/ExaminationBooking";
import TakeCareBooking from "./pages/TakeCareBooking/TakeCareBooking";
import { parseJwt } from "./utils";

const Layout = () => {
  return <></>;
};

function App() {
  const user = useSelector((state) => state.orebiReducer.userInfo);
  const dispatch = useDispatch();

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
        <Route path="/take-care-bookings" element={<TakeCareBooking />}></Route>
        <Route
          path="/signup"
          element={user.token ? <Home /> : <SignUp />}
        ></Route>
        <Route
          path="/signin"
          element={user.token ? <Home /> : <SignIn />}
        ></Route>
      </Route>
    )
  );

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (user.token) {
        try {
          const decodedJwt = parseJwt(user.token);
          console.log(decodedJwt);

          if (decodedJwt.exp * 1000 < Date.now()) {
            dispatch(logout());
          }
        } catch (error) {
          console.error("Error decoding JWT:", error);
          // Handle error (e.g., logout user)
          dispatch(logout());
        }
      }
    };

    checkTokenExpiration();
  }, [user, dispatch]);
  return (
    <div className="App">
      <div className="AppGlass">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
