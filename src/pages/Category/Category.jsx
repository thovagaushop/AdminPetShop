import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Alert,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import instance from "../../api/axios";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    type: null,
    content: "",
  });

  const handleCloseSnack = () => {
    setMessage({ ...message, open: false });
  };

  const fetchListCategories = async () => {
    try {
      const { data } = await instance.get("/category");
      setCategories(data.data);
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
    fetchListCategories();
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
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length &&
                categories.map((row, index) => (
                  <TableRow
                    key={row.categoryId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index}</TableCell>
                    <TableCell component="th" scope="row">
                      {row.categoryName}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>Hello</div>
    </>
  );
}
