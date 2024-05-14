import React, { useState } from "react";
import Spinner from "./Spinner";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState(null);
  const [fields, setFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

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
    }
    setImageAsset(URL.createObjectURL(e.target.files[0]));
    debugger;
  };
  const createPin = () => {};
  return (
    <div className="flex flex-col justigy-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          Please fill in all the fields.
        </p>
      )}
      <div className="flex lg:flex-col flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner />}
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
                  <p className="mt-32 text-gray-400">
                    Use high-quality JPG, SVG, PNG, GIF or TIFF less then 20 MB
                  </p>
                </div>
                <input
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
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
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
            className="outline-none text-2xl sm:text-3xl font-bold boder-b-2 border-gray-200 p-2 "
          />
          <input
            type="text"
            value={about}
            placeholder="About"
            className="outline-none text-2xl sm:text-3xl font-bold boder-b-2 border-gray-200 p-2 "
            onChange={(e) => setAbout(e.target.value)}
          />
          <input
            type="text"
            value={destination}
            placeholder="Destination"
            className="outline-none text-2xl sm:text-3xl font-bold boder-b-2 border-gray-200 p-2 "
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
