import { useRef, useState } from "react";
import Spinner from "./Spinner";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { categories, BASE_URL } from "../utils/config";
import axios from "axios";
import { fetchUserToken } from "../utils/fetchUser";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../stores/userState";

const CreatePin = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState(null);
  const [fields, setFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [image, setImage] = useState(null);
  const scrollref = useRef(null);

  const updateImage = (e) => {
    const { type } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/jpeg" ||
      type === "image/svg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setImageAsset(URL.createObjectURL(e.target.files[0]));
      setImage(e.target.files[0]);
    } else {
      setWrongImageType(true);
    }
  };

  const getImageURL = async () => {
    URL.revokeObjectURL(imageAsset);
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
    const images = new FormData();
    images.append("file", image);
    images.append("cloud_name", cloudName);
    images.append("upload_preset", import.meta.env.VITE_APP_UPLOAD_PRESET);
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        images
      );
      return res.data.secure_url;
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const savePin = async (e) => {
    setLoading(true);
    if (imageAsset && title && destination && about) {
      const imageURL = await getImageURL();
      const doc = {
        title,
        destination,
        category,
        name: about,
        image: imageURL,
      };
      try {
        await axios.post(`${BASE_URL}/createPin`, doc, {
          headers: {
            token: fetchUserToken(),
          },
        });
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
      navigate("/");
    } else {
      setFields(true);
      scrollref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        setFields(false);
      }, 2000);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner message="Posting image" />;
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <p
        className="text-red-600 bg-red-600/[.2] h-6 text-xl transition-all duration-150 ease-in"
        ref={scrollref}
      >
        {fields && "Please fill in all the fields."}
      </p>
      <div className="flex lg:flex-col flex-col justify-center items-center lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-stone-950 p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-stone-300 p-3 w-full h-420">
            {wrongImageType && <p>Wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-4">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to Upload</p>
                  </div>
                  <p className="mt-32 text-stone-400">
                    Use high-quality JPG, SVG, PNG, GIF or TIFF less then 20 MB
                  </p>
                </div>
                <input
                  accept="image/png,image/jpeg,image/svg,image/gif,image/tiff"
                  type="file"
                  name="upload-image"
                  onChange={updateImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset}
                  alt="Uploaded File"
                  className="w-full h-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-stone-950 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 bg-stone-900 border-stone-200 p-2 placeholder:text-stone-600"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center rounded-lg">
              <img src={user.image} className="w-10 h-10 rounded-full" alt="" />
              <p className="font-bold">{user.name}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            placeholder="About"
            className="outline-none text-base sm:text-lg border-b-2  bg-stone-900  border-stone-200 p-2 placeholder:text-stone-600"
            onChange={(e) => setAbout(e.target.value)}
          />
          <input
            type="text"
            value={destination}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 bg-stone-900 border-stone-200 p-2 placeholder:text-stone-600"
            onChange={(e) => setDestination(e.target.value)}
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 bg-stone-900 border-stone-200 p-2 rounded-md cursor-pointer capitalize"
              >
                <option value="other">Select Category</option>
                {categories.map((cat) => (
                  <option
                    key={cat.name}
                    className="text-base border-0 outline-none"
                    value={cat.name}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-400 font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
