import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin ,googleLogout} from '@react-oauth/google';
import {FcGoogle} from 'react-icons/fc';
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import {jwtDecode} from 'jwt-decode'
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate()
  const decodeResponse = (response)=>{
      let decode = jwtDecode(response.credential)
      // console.log(decode)
      localStorage.setItem('uid',decode.sub)
      const obj = {
        _id:decode.sub,
        _type:'user',
        userName:decode.name,
        image:decode.picture
      }
      client.createIfNotExists(obj).then(()=>{
        navigate('/')
      });
      // console.log(obj)
  }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className="relative w-full h-full">
        <video
        src={shareVideo}
        type="video/mp4"
        loop
        control="false"
        muted
        autoPlay
        className='w-full h-full object-cover'
        />
        <div className="absolute w-full flex flex-col justify-center items-center top-0 left-0 bottom-0 bg-black bg-opacity-50">
          <div className='p-5'>
            <img src={logo} width="130px" alt="logo"/>
          </div>
          <div className='shadow-2xl'>
            <GoogleLogin
            onSuccess={credentialResponse => {
              decodeResponse(credentialResponse)
            }}
            onError={() => {
              console.log('Login Failed');
            }}
              />
            {/* <button
            type='button'
            className='bg-mainColor flex justify-center items-center p-3 rounded-lg outline-none'
            onClick={()=>loginProcess()}
            ><FcGoogle className='mr-4'/>Sign in with google</button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
