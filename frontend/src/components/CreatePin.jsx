import React, { useState } from "react";
import Spinner from "./Spinner";
import {AiOutlineCloudUpload} from "react-icons/ai"
const CreatePin = () => {
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState('')
  const [category, setCategory] = useState(null);
  const [fields,setFields] = useState(false)
  const [loading,setLoading] = useState(false)
  const [imageAsset, setImageAsset] = useState(null)
  const [image, setImage] = useState("");
  const [wrongImageType, setWrongImageType] = useState(false)
  
  const updateImage = (ev)=>{
    console.log(ev.target.files)

  }
  const createPin = ()=>{}
  return (
    <div className="flex flex-col justigy-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">Please fill in  all the fields.</p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <Spinner/>}
            {wrongImageType && <p>Wrong Image Type</p>}
            {!imageAsset?(
              <label>

              <div className="flex flex-col items-center justify-center h-4">
                <div className="flex flex-col justify-center items-center">
                  <p className="font-bold text2xl">
                    <AiOutlineCloudUpload/>
                  </p>
                  <p className="text-lg">Click to Upload</p>
                </div>
                <p className="mt-32 text-gray-400">
                  Use high-quality JPG, SVG, PNG, GIF or TIFF less then 20 MB
                </p>
              </div>
              <input type="file"
              name="upload-image"
              onChange={updateImage}
              className="w-0 h-0"/>
              </label>
            ):(<p>SOmthing</p>)}
          </div>
        </div>
      </div> 
      <input
        type="text"
        value={title}
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
  );
};

export default CreatePin;
