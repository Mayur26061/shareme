import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import logo from "../assets/logowhite.png";

import { categories } from "../utils/config";
import { useRecoilValue } from "recoil";
import { userState } from "../stores/userState";

const navLinkStyle = "flex items-center px-5 gap-3 transition-all duration-200 ease-in-out capitalize ";
const isNotActiveStyle = "text-stone-500 hover:text-white";
const isActiveStyle = "font-extrabold border-r-2 border-white";

const Sidebar = ({ closeToggle }) => {
  const user = useRecoilValue(userState);
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };
  return (
    <div className="flex flex-col justify-between bg-stone-950 h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5 pl-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              navLinkStyle + (isActive ? isActiveStyle : isNotActiveStyle)
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            home
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover</h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                navLinkStyle + (isActive ? isActiveStyle : isNotActiveStyle)
              }
              onClick={handleCloseSidebar}
              key={category.name}
            >
              <img
                className="w-8 h-8 rounded-full shadow-sm"
                src={category.image}
                alt="user-profile"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex my-5 mb-3 gap-2 p-2 items-center rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img src={user.image} alt="" className="w-10 h10 rounded-full" />
          <p>{user.name}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
