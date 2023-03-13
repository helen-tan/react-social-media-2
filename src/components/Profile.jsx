import React, { useEffect, useContext } from 'react'
import { useImmer } from 'use-immer'
import { useParams, NavLink } from "react-router-dom"
import Axios from 'axios'
import StateContext from '../StateContext'
import Page from './Page'
import ProfilePosts from './ProfilePosts'

const Profile = () => {
    const { username } = useParams() // Get the username segment of the url

    const globalState = useContext(StateContext)

    const [state, setState] = useImmer({
        followActionLoading: false,
        startFollowingRequestCount: 0,
        stopFollowingRequestCount: 0,
        profileData: {
            profileUsername: "...",
            profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
            isFollowing: false,
            counts: { postCounts: "", followerCount: "", followingCount: "" }
        }
    })

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        // Fetch data related to the profile (specified by username)
        async function fetchData() {
            try {
                const response = await Axios.post(`/profile/${username}`, { token: globalState.user.token })
                // console.log(response.data)

                setState(draft => {
                    draft.profileData = response.data
                })
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchData()

        return () => {
            ourRequest.cancel()
        }
    }, [username])

    // useEffect to watch for changes in the state startFollowingRequestCount
    useEffect(() => {
        // if > 0 (prevent req from firing on component first mount)
        if (state.startFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true
            }) // this disables the follow btn as the req is sending

            const ourRequest = Axios.CancelToken.source()

            // Fetch data related to the profile (specified by username)
            async function fetchData() {
                try {
                    const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: globalState.user.token })
                    // console.log(response.data)

                    setState(draft => {
                        draft.profileData.isFollowing = true
                        draft.profileData.counts.followerCount++
                        draft.followActionLoading = false
                    })
                } catch (err) {
                    console.log("There was a problem.")
                }
            }

            fetchData()

            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.startFollowingRequestCount])

    // useEffect to watch for changes in the state stopFollowingRequestCount
    useEffect(() => {
        // if > 0 (prevent req from firing on component first mount)
        if (state.stopFollowingRequestCount) {
            setState(draft => {
                draft.followActionLoading = true
            }) // this disables the follow btn as the req is sending

            const ourRequest = Axios.CancelToken.source()

            // Fetch data related to the profile (specified by username)
            async function fetchData() {
                try {
                    const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: globalState.user.token })
                    // console.log(response.data)

                    setState(draft => {
                        draft.profileData.isFollowing = false
                        draft.profileData.counts.followerCount--
                        draft.followActionLoading = false
                    })
                } catch (err) {
                    console.log("There was a problem.")
                }
            }

            fetchData()

            return () => {
                ourRequest.cancel()
            }
        }
    }, [state.stopFollowingRequestCount])

    const startFollowing = () => {
        setState(draft => {
            draft.startFollowingRequestCount++
        })
    }

    const stopFollowing = () => {
        setState(draft => {
            draft.stopFollowingRequestCount++
        })
    }

    return (
        <Page title="Profile Screen">
            <h2>
                <img className="avatar-small" src={state.profileData.profileAvatar} alt="profile" /> {state.profileData.profileUsername}
                {/* Show follow btn only if logged in, not following the person & not your own profile & when component is still loading with placeholder ... value */}
                {globalState.loggedIn
                    && !state.profileData.isFollowing
                    && globalState.user.username !== state.profileData.profileUsername
                    && state.profileData.profileUsername !== '...'
                    && (
                        <button onClick={startFollowing} disabled={state.followActionLoading} className="btn btn-primary btn-sm ml-2">Follow <i className="fas fa-user-plus"></i></button>
                    )}

                {globalState.loggedIn
                    && state.profileData.isFollowing
                    && globalState.user.username !== state.profileData.profileUsername
                    && state.profileData.profileUsername !== '...'
                    && (
                        <button onClick={stopFollowing} disabled={state.followActionLoading} className="btn btn-danger btn-sm ml-2">Unfollow <i className="fas fa-user-times"></i></button>
                    )}
            </h2>

            <div className="profile-nav nav nav-tabs pt-2 mb-4">
                <NavLink to="" end className="nav-item nav-link">
                    Posts: {state.profileData.counts.postCounts}
                </NavLink>
                <NavLink to="followers" className="nav-item nav-link">
                    Followers: {state.profileData.counts.followerCount}
                </NavLink>
                <NavLink to="following" className="nav-item nav-link">
                    Following: {state.profileData.counts.followingCount}
                </NavLink>
            </div>

            <ProfilePosts />

        </Page>
    )
}

export default Profile