import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { fetchUserId, fetchUserToken } from "../utils/fetchUser";
import Spinner from "./Spinner";

const Login = () => {
  const navigate = useNavigate();
  const currentuid = fetchUserId();
  const token = fetchUserToken();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/getuser/${currentuid}`, {
        headers: { token },
      })
      .then((response) => {
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        localStorage.clear();
        console.log(error);
      });
  }, []);

  const decodeResponse = (response) => {
    let decode = jwtDecode(response.credential);
    const obj = {
      username: decode.email,
      name: decode.name,
      image: decode.picture.replace("=s96-c", ""),
    };
    axios.post(`${BASE_URL}/login`, { ...obj }).then((res) => {
      if (res.data.token) {
        debugger;

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("uid", res.data.uid);

        navigate("/");
      }
    });
  };
  if (loading) return <Spinner />;
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          control="false"
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute w-full flex flex-col justify-center items-center top-0 left-0 bottom-0 bg-black bg-opacity-50">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                decodeResponse(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
