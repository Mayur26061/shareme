import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { fetchUserToken,fetchUserId } from "../utils/fetchUser";
import axios from "axios";
import { BASE_URL } from "../utils/config";

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology"
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("Created");
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentuid = fetchUserId()
  const token = fetchUserToken()
  useEffect(() => {
    debugger;
    axios.get(`${BASE_URL}/getuser/${userId}`,{
      headers:{token}
    }).then((response)=>{
          setUser(response.data.user);
    }).catch((error)=>{
      console.log(error)
    });
  }, [userId]);
  const logOut= ()=>{
    googleLogout()
    localStorage.clear();
    navigate('/login')
  }
  if (!user) {
    return <Spinner message="Loading profile." />;
  }
  return <div className="relative pb-5 h-full justify-center items-center">
    <div className="flex flex-col p-5">
      <div className="relative flex flex-col mb-7">
        <div className="flex flex-col justify-center items-center">
          <img src={randomImage} alt="images" className="w-full h-370 xl:h-510 shadow-lg object-cover"/>
          <img src={user.image} alt="" className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"/>
          <h1 className="font-bold text-3xl text-center mt-3">{user.name}</h1>
          {
          currentuid === user._id &&           <button onClick={logOut}>Log out</button>
          }
        </div>
      </div>
    </div>
    </div>;
};

export default UserProfile;
