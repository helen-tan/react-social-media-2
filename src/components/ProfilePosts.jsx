import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import Post from './Post'

const ProfilePosts = () => {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])

    const { username } = useParams()

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/posts`)
                // console.log(response.data)
                setPosts(response.data)
                setLoading(false)
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchPosts()
    }, [username])

    if (loading) {
        return <LoadingDotsIcon />
    }

    return (
        <div className="list-group">
            {posts.map(post => {
               return <Post post={post} key={post._id} noAuthor={true}/>
            })}
        </div>
    )
}

export default ProfilePosts