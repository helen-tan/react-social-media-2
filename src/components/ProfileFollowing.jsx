import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import LoadingDotsIcon from './LoadingDotsIcon'
import StateContext from '../StateContext'

const ProfileFollowing = (props) => {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])

    const { username } = useParams()

    const globalState = useContext(StateContext)

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await Axios.get(`/profile/${username}/following`)
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
            {posts.length ?
                posts.map((follower, index) => {
                    return (
                        <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
                            <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
                        </Link>
                    )
                })
                :
                globalState.user.username === props.profileUsername ? <div>You have no followers yet</div> : <div>{props.profileUsername} has no followers yet.</div>
            }

        </div>
    )
}

export default ProfileFollowing