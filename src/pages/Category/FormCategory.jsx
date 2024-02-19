import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { useSelector } from "react-redux";

export default function FormCategory({ onSubmit, updateCategory }) {
  const [category, setCategory] = useState({
    categoryName: "",
  });
  const userInfo = useSelector((state) => state.orebiReducer.userInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (updateCategory) {
        await instance.put(
          `/category/${updateCategory.categoryId}`,
          { name: category.categoryName },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
      } else {
        await instance.post("/category", category, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
      }
      onSubmit("Success");
      setCategory({
        categoryName: "",
      });
    } catch (error) {
      onSubmit(error.response.data.message, "error");
    }
  };

  useEffect(() => {
    setCategory({
      categoryName: !!updateCategory ? updateCategory.categoryName : "",
    });
  }, [updateCategory]);
  return (
    <div
      style={{
        marginTop: "70px",
        textAlign: "center",
      }}
    >
      <Box
        style={{ marginLeft: "20px", backgroundColor: "#fff" }}
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
            id="outlined-error"
            label="Name"
            size="small"
            style={{ width: "80%" }}
            placeholder="Enter title"
            value={category.categoryName}
            focused={!!updateCategory}
            onChange={(e) =>
              setCategory({ ...category, categoryName: e.target.value })
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
  );
}
