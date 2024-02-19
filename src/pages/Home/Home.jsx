import React, { useEffect } from "react";
import MainDash from "../../components/MainDash/MainDash";
import RightSide from "../../components/RightSide/RightSide";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const user = useSelector((state) => state.orebiReducer.userInfo);
  const navigate = useNavigate()
  console.log("Hello");
  
  useEffect(() => {
    if(!user.token) navigate('/signin')
  })
  return (
    <>
      <Sidebar />
      <MainDash />
      <RightSide />
    </>
  );
}
