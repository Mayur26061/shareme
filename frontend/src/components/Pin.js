import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuid4 } from 'uuid'
import { AiTwotoneDelete } from 'react-icons/ai'
import { MdDownloadForOffline } from 'react-icons/md'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'

import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'

const Pin = ({ pin: {postedBy,_id,image,save,destination}}) => {
    const [postHovered, setPostHovered] = useState(false)
    const [savingPost, setSavingPost] = useState(false)
    const navigate = useNavigate()
    const userId = fetchUser()
    const alreadySaved = !!(save?.filter((item)=> item.postedBy._id === userId))?.length
    debugger
    const savePin = (id)=>{
        if(!alreadySaved){
            setSavingPost(true)
            client
            .patch(id)
            .setIfMissing({save:[]})
            .insert('after','save[-1]',[{
                _key:uuid4(),
                userId: userId,
                postedBy:{
                    _type: 'postedBy',
                    _ref:userId
                }
            }])
            .commit()
            .then(()=>{
                window.location.reload()
                setSavingPost(false)
            })

        }

    }
    debugger;
    return (
        <div>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
            <img alt="" className='rounded-lg w-full' src={urlFor(image).width(250).url()} />
            {postHovered && (
                <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pb-2 z-50'
                style={{height:'100%'}}>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <a
                            href={`${image?.asset?.url}?dl=`}
                            download
                            onClick={(e)=>e.stopPropagation()}
                            className='bg-white w-8 h-8 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:shadow-md outline-none'
                            >
                            <MdDownloadForOffline/>
                            </a>
                        </div>
                            {alreadySaved?(
                                <button type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none' disabled>
                                  {save?.length}  Saved
                                </button>

                                    ):(
                                        <button
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            savePin(_id)

                                        }}
                                        type='button' className='bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'>
                                            Save
                                        </button>
                                    )
                                }
                    </div>
                    <div className="flex justify-between items-center gap-2 w-full">
                        {destination &&(
                            <a
                            href={destination}
                            target='_blank'
                            rel='noreferrer'
                            onClick={(e)=>e.stopPropagation()}
                            className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                            >
                                <BsFillArrowUpRightCircleFill/>
                                {destination.length > 20 ? destination.slice(8,20): destination}
                            </a>
                        )}
    
                    </div>
                </div>
            )}
            </div>
        </div>
    )
}

export default Pin
