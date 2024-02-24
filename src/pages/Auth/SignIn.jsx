import React, { useState } from "react";
import "./signIn.css";
import instance from "../../api/axios";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../redux/orebiSlice";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseSnack = () => {
    setMessage({ ...message, open: false });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);

      if (!data.roles.includes("ROLE_ADMIN")) {
        console.log(data.roles.includes("ROLE_ADMIN"));
        setMessage({
          ...message,
          open: true,
          type: "error",
          content: "You are not allowed to login as an administrator",
        });
        return;
      } else {
        dispatch(login(data));
        navigate("/");
        return;
      }
    } catch (error) {
      setMessage({
        ...message,
        open: true,
        type: "error",
        content: "Invalid Email or Password",
      });
    }
  };
  return (
    <>
      <div></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          width: "70%",
        }}
      >
        <Snackbar
          anchorOrigin={{
            vertical: message.vertical,
            horizontal: message.horizontal,
          }}
          autoHideDuration={1000}
          open={message.open}
          onClose={handleCloseSnack}
          message="I love snacks"
          key={message.vertical + message.horizontal}
        >
          <Alert
            onClose={handleCloseSnack}
            severity={message.type}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message.content}
          </Alert>
        </Snackbar>
        <h1 style={{ textAlign: "center" }}>Login</h1>
        <form className="formLogin">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" class="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              class="form-control"
              id="exampleInputPassword1"
            />
          </div>

          <button type="submit" class="btn btn-primary" onClick={handleLogin}>
            Submit
          </button>
        </form>
      </div>
      <div></div>
    </>
  );
}
