import React from "react";
import MainDash from "../../components/MainDash/MainDash";
import RightSide from "../../components/RightSide/RightSide";
import Sidebar from "../../components/Sidebar";

export default function Home() {
  console.log("Hello");
  return (
    <>
      <Sidebar />
      <MainDash />
      <RightSide />
    </>
  );
}
