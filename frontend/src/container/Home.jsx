import React, { useEffect, useState, useRef } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Routes, Route } from "react-router-dom";
import { UserProfile, Sidebar } from "../components";
import Pins from "./Pins";
import logo from "../assets/logowhite.png";
import { fetchUserToken, fetchUserId } from "../utils/fetchUser";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { userState } from "../stores/userState";
import { useRecoilState } from "recoil";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const token = fetchUserToken();
  const userId = fetchUserId();
  const [user, setUser] = useRecoilState(userState);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/getuser/${userId}`, {
        headers: { token },
      })
      .then((response) => {
        setUser(response.data.user);
        localStorage.setItem("uid", response.data.user._id);
      })
      .catch((error) => {
        localStorage.clear()
        console.log(error); 
      });
  }, []);

  return (
    <div className="flex bg-stone-900 text-white md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          {user && (
            <Link to={`user-profile/${user?._id}`}>
              <img src={user?.image} alt="user logo" className="w-28" />
            </Link>
          )}
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll hide-scrollbar">
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
