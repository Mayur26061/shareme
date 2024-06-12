import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { fetchUserToken, fetchUserId } from "../utils/fetchUser";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { AiOutlineLogout } from "react-icons/ai";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";
const activeBtnStyles = "bg-red-500 text-white";
const notActiveBtnStyles = "bg-primary mr-4 text-black";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentuid = fetchUserId();
  const token = fetchUserToken();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getuser/${userId}`, {
        headers: { token },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [userId]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/getUserPin/${userId}`, {
        headers: { token },
        params: {
          key: text === "Created" ? "postedBy" : "savePost",
        },
      })
      .then((response) => {
        setPin(response.data.pins);
      });
  }, [text, userId]);

  const logOut = () => {
    googleLogout();
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile." />;
  }

  return (
    <div className="relative pb-5 h-full justify-center items-center">
      <div className="flex flex-col p-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              alt="images"
              className="w-full h-370 xl:h-510 shadow-lg object-cover"
            />
            <img
              src={user.image}
              alt=""
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">{user.name}</h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {currentuid === user._id && (
                <button
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                  onClick={logOut}
                >
                  <AiOutlineLogout color="red" fontSize={21} />
                </button>
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(ev) => {
                setText(ev.target.textContent);
                setActiveBtn("created");
              }}
              className={`font-bold p-2 rounded-full w-20 outline-none ${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(ev) => {
                setText(ev.target.textContent);
                setActiveBtn("saved");
              }}
              className={`font-bold p-2 rounded-full w-20 outline-none ${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>
          {pin?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pin} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
