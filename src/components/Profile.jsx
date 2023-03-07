import React, { useEffect, useContext, useState } from 'react'
import { useParams } from "react-router-dom"
import Axios from 'axios'
import StateContext from '../StateContext'
import Page from './Page'
import ProfilePosts from './ProfilePosts'

const Profile = () => {
    const { username } = useParams() // Get the username segment of the url

    const globalState = useContext(StateContext)

    const [profileData, setProfileData] = useState({
        profileUsername: "...",
        profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
        isFollowing: false,
        counts: { postCounts: "", followerCount: "", followingCount: "" }
    })

    useEffect(() => {
        // Fetch data related to the profile (specified by username)
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: globalState.user.token })
                // console.log(response.data)

                setProfileData(response.data)
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchData()
    }, [])

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={profileData.profileAvatar} /> {profileData.profileUsername}
                <button className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <a href="#" className="active nav-item nav-link">
                    Posts: {profileData.counts.postCounts}
                </a>
                <a href="#" className="nav-item nav-link">
                    Followers: {profileData.counts.followerCount}
                </a>
                <a href="#" className="nav-item nav-link">
                    Following: {profileData.counts.followingCount}
                </a>
            </div>

            <ProfilePosts />

        </Page>
    )
}

export default Profile