import React, { useEffect, useState } from 'react'
import VideoCard from '../components/VideoCard'
import { Link } from 'react-router-dom'
import axios from "axios"
import { Loading } from '../components/index.js'

const Home = () => {

  const[videos, setVideos]=useState([])

  useEffect(()=>{
    const fetchVideos=async()=>{
      const res =await axios.get("/api/videos/get-all-videos")
      console.log(res.data.data.videos)
      setVideos(res.data.data.videos)
    }
    fetchVideos()
  },[])
  if(!videos){
    return <><Loading /></>
  }
  return (
    <div className=' p-2 w-full text-white grid gap-12 h-auto grid-cols-3 max-sm:grid-cols-1 max-lg:grid-cols-2'>
      {
      videos.map((video)=>(
        <Link key={video._id} to={`/video/${video._id}`}>
        <VideoCard video={video} user={video.users[0]}/>
        </Link>
      ))
      }
    </div>
  )
}

export default Home