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
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Route>
  )
);

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
