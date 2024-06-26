import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import axios from "axios";

import { fetchUserToken, fetchUserId } from "../utils/fetchUser";
import { BASE_URL } from "../utils/config";

const Pin = ({
  pin: { postedBy, _id, image, savePost, destination },
  filterPins,
}) => {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const token = fetchUserToken();
  const uid = fetchUserId();
  const [alreadySaved, setAlreadySaved] = useState(
    !!savePost?.filter((item) => item._id === uid)?.length
  );

  const deletePin = async (ev) => {
    ev.stopPropagation();
    try {
      await axios.post(
        `${BASE_URL}/deletepin/${_id}`,
        {},
        {
          headers: { token: token },
        }
      );
      filterPins(_id);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const savePin = (ev, id) => {
    ev.stopPropagation();
    if (!alreadySaved) {
      axios
        .post(
          `${BASE_URL}/savePin`,
          {
            pid: id,
          },
          {
            headers: { token: token },
          }
        )
        .then((response) => {
          setAlreadySaved(true);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img alt="" className="rounded-lg w-full h-96" src={image} />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={image}
                  download="custom-filename.jpg"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-dark hover:opacity-100 text-xl opacity-70 hover:shadow-md outline-none"
                  rel="noreferrer"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  disabled
                >
                  {savePost?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(ev) => savePin(ev, _id)}
                  type="button"
                  className={
                    "bg-red-500 opacity-70 hover:opacity-100 font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none "+
                    (!uid ? "hidden" : "")
                  }
                >
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white flex items-center gap-2 text-stone-950 font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 15
                    ? `${destination.slice(0, 15)}...`
                    : destination}
                </a>
              )}
              {postedBy._id === uid && (
                <button
                  type="button"
                  className="bg-white text-black p-2 opacity-70 hover:opacity-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outline-none"
                  onClick={deletePin}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy._id}`}
        className={
          "flex gap-2 mt-2 items-center rounded-lg " +
          (!uid ? "pointer-events-none" : "")
        }
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.name}</p>
      </Link>
    </div>
  );
};

export default Pin;
