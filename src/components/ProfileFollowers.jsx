import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'

const ProfileFollowers = () => {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])

    const { username } = useParams()

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/followers`)
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
            {posts.map((follower, index) => {
                return (
                    <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                    </Link>
                )
            })}
        </div>
    )
}

export default ProfileFollowers