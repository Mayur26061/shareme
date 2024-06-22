import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { useRecoilState } from "recoil";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import Notfound from "./Notfound";
import { fetchUserToken, fetchUserId } from "../utils/fetchUser";
import { BASE_URL } from "../utils/config";
import { userState } from "../stores/userState";

const randomImage = "https://source.unsplash.com/1600x900/?nature,photography,technology";

const UserProfile = () => {
  const [user, setUser] = useRecoilState(userState);
  const [pin, setPin] = useState(null);
  const [text, setText] = useState("Created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentuid = fetchUserId();
  const token = fetchUserToken();

  const updateImage = (ev) => {
    if (ev.target.files.length) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (event.target.result) {
          fetctUser(event.target.result);
        }
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  };

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

  async function fetctUser(imageData) {
    const response = await axios.post(
      BASE_URL + `/editProfile/${userId}`,
      {
        image: imageData,
      },
      {
        headers: {
          token,
        },
      }
    );
    setUser(response.data.user);
  }

  const logOut = () => {
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
              className="w-full h-370 xl:h-510 shadow-lg object-cover bg-stone-950"
            />
            <div className="relative -mt-10 size-20">
              {user?.image ? (
                <img
                  src={user?.image}
                  alt=""
                  className="rounded-full w-full h-full shadow-xl object-cover"
                />
              ) : (
                <div className="rounded-full shadow-xl flex justify-center items-center w-full h-full bg-blue-950 text-5xl">
                  {user.name[0]}
                </div>
              )}
              <label className="absolute top-0 rounded-full bg-black opacity-0 hover:opacity-50 flex justify-center items-center w-full h-full">
                <MdEdit />
                <input
                  accept="image/png,image/jpeg"
                  type="file"
                  name="upload-image"
                  onChange={updateImage}
                  className="w-0 h-0"
                />
              </label>
            </div>
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
                activeBtn === "created" && "bg-red-500"
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
                activeBtn === "saved" && "bg-red-500"
              }`}
            >
              Saved
            </button>
          </div>
          {pin?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pin} setPins={setPin} />
            </div>
          ) : (
            <Notfound />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
