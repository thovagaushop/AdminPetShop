import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { Alert, Box, Snackbar, TextField } from "@mui/material";
import instance from "../../api/axios";

export default function Config() {
  const [config, setConfig] = useState({
    maxPlaceTakeCare: "",
    maxPlaceExamination: "",
  });
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });

  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  const handleCloseSnack = () => {
    setMessage({ ...message, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await instance.put("/config", config, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      fetchBookingConfig();

      setMessage({
        ...message,
        open: true,
        type: "success",
        content: data.message,
      });
    } catch (error) {
      setMessage({
        ...message,
        open: true,
        type: "error",
        content: error.response.data.message,
      });
    }
  };

  const fetchBookingConfig = async () => {
    try {
      const { data } = await instance.get("/config");
      setConfig({
        maxPlaceTakeCare: data.maxPlaceTakeCare,
        maxPlaceExamination: data.maxPlaceExamination,
      });
    } catch (error) {
      setMessage({
        ...message,
        open: true,
        type: "error",
        content: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    fetchBookingConfig();
  }, []);
  return (
    <>
      <Sidebar />
      <div className="container">
        <Snackbar
          anchorOrigin={{
            vertical: message.vertical,
            horizontal: message.horizontal,
          }}
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
        <div
          style={{
            width: "100%",
            textAlign: "center",
            overflow: "scroll",
          }}
        >
          <Box
            style={{
              marginLeft: "20px",
              backgroundColor: "#fff",
              width: "100%",
            }}
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div style={{ fontSize: "24px" }}>Form</div>
            <div>
              <TextField
                id="outlined-number"
                label="Max slot take caring"
                type="number"
                size="small"
                style={{ width: "80%" }}
                placeholder="Max slot of Take care"
                InputLabelProps={{
                  shrink: true,
                }}
                value={config.maxPlaceTakeCare}
                //   focused={!!updateCategory}
                onChange={(e) =>
                  setConfig({ ...config, maxPlaceTakeCare: e.target.value })
                }
              />
            </div>
            <div>
              <TextField
                id="outlined-number"
                label="Max slot examination"
                type="number"
                size="small"
                style={{ width: "80%" }}
                placeholder="Max slot of Examination"
                InputLabelProps={{
                  shrink: true,
                }}
                value={config.maxPlaceExamination}
                //   focused={!!updateCategory}
                onChange={(e) =>
                  setConfig({ ...config, maxPlaceExamination: e.target.value })
                }
              />
            </div>

            <button
              style={{
                width: "70px",
                height: "40px",
                margin: "10px",
                textAlign: "center",
              }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </Box>
        </div>
      </div>
    </>
  );
}
