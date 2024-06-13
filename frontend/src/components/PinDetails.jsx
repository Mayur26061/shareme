import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { fetchUserToken } from "../utils/fetchUser";
import { useRecoilValue } from "recoil";
import { userState } from "../stores/userState";

const Pindetails = () => {
  const user = useRecoilValue(userState)
  const [pin, setPin] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();
  const token = fetchUserToken();

  const fetchPinDetails = async () => {
    try {
      const res = await axios.get(BASE_URL + `/pin/${pinId}`, {
        headers: { token },
      });
      setPinDetail(res.data.pin);
      const res2 = await axios.get(`${BASE_URL}/getPin`, {
        params: {
          categoryId: res.data.pin.category,
        },
        headers: { token },
      });
      setPin(res2.data.pins);
    } catch (err) {
      console.log("Error:", err);
    }
  };
  const addComment = async () => {
    setAddingComment(true);
    await axios.post(
      BASE_URL + `/addcomment/${pinId}`,
      {
        comment,
      },
      {
        headers: {
          token,
        },
      }
    );
    setAddingComment(false);
    fetchPinDetails();
    setComment("");
  };
  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);
  if (!pinDetail) return <Spinner message="Loading pin.." />;
  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white "
        style={{ maxWidth: "1000", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image}
            className="rounded-t-3xl rounded-b-lg max-h-600"
            alt="User Post"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:shadow-md outline-none"
                rel="noreferrer"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetail?.destination} target="_blank" rel="noreferrer">
              Source
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy._id}`}
            className="flex gap-2 mt-2 items-center"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.name}
            </p>
          </Link>
          <h2 className="mt-5 tex-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comment?.map((com, i) => (
              <div
                className="flex gap-2 mt-5 items-center bg-light rounded-lg"
                key={i}
              >
                <img
                  src={com.postedBy.image}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{com.postedBy.name}</p>
                  <p>{com.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3">
            <Link to={`user-profile/${user._id}`}>
              <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={user?.image}
                alt="user-profile"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(ev) => setComment(ev.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>
      {pin?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pin} />
        </>
      ) : (
        <div className="mt-8">
          <Spinner message="Loading more pins..." />
        </div>
      )}
    </>
  );
};

export default Pindetails;
