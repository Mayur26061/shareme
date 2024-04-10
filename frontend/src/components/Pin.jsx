import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import { AiTwotoneDelete } from "react-icons/ai";
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import axios from "axios";

import { fetchUserToken, fetchUserId } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, _id, image, savePost, destination } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const token = fetchUserToken();
  const uid = fetchUserId();
  //   const alreadySaved = true;
  const [alreadySaved, setAlreadySaved] = useState(
    !!savePost?.filter((item) => item._id === uid)?.length
  );
  const savePin = (ev, id) => {
    ev.stopPropagation();
    if (!alreadySaved) {
      axios
        .post(
          "http://localhost:8080/user/savePin",
          {
            pid: id,
          },
          {
            headers: { token: token },
          }
        )
        .then((response) => {
          // console.log(response.data);
          setAlreadySaved(true);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
      //         setSavingPost(true)
      //         client
      //         .patch(id)
      //         .setIfMissing({save:[]})
      //         .insert('after','save[-1]',[{
      //             _key:uuid4(),
      //             userId: userId,
      //             postedBy:{
      //                 _type: 'postedBy',
      //                 _ref:userId
      //             }
      //         }])
      //         .commit()
      //         .then(()=>{
      //
      //             setSavingPost(false)
      //         })
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
        <img alt="" className="rounded-lg w-full" src={image} />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image}?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg`}
                  download="custom-filename.jpg"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:shadow-md outline-none"
                  rel="noreferrer"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  disabled
                >
                  {savePost?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(ev) => savePin(ev, _id)}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
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
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(8, 20)
                    : destination}
                </a>
              )}
              <button
                type="button"
                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
