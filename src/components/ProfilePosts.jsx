import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'axios'

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
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="list-group">
            {posts.map(post => {
                const date = new Date(post.createdDate)
                const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                return (
                    <a key={post._id} href="#" className="list-group-item list-group-item-action">
                        <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> {" "}
                        <span className="text-muted small">{dateFormatted} </span>
                    </a>
                )
            })}
        </div>
    )
}

export default ProfilePosts