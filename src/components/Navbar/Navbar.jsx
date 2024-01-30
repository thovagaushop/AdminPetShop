import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ listNavbar }) {
  return (
    <div>
      <ul style={{ display: "flex", gap: "10px" }}>
        {listNavbar.map((item) => {
          return (
            <NavLink to={item.path} className="">
              {item.title}
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
}
