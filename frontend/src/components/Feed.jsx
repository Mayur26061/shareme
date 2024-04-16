import React,{useEffect, useState} from 'react'
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins,setPins] = useState(null)
  const {categoryId} =useParams()
  useEffect(()=>{
    setLoading(true)

    axios.get(`${BASE_URL}/getPin`,{
      params:{
        categoryId
      }
    }).then((response)=>{
      // if(response.data)
      // console.log(response)
      setLoading(false);
      setPins(response.data.pins)
    }).catch((error)=>{
      console.log(error)
    });
  },[categoryId]);
  if (loading) return <Spinner message="We are adding new ideas to your feed"/>
  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed
