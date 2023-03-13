import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import Axios from 'axios';
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { useImmer } from 'use-immer';

const Home = () => {
    const globalState = useContext(StateContext)
    const globalDispatch = useContext(DispatchContext)

    const [state, setState] = useImmer({
        isLoading: true,
        feed: []
    })

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source()

        // Fetch data related to the profile (specified by username)
        async function fetchData() {
            try {
                const response = await Axios.post('/getHomeFeed', { token: globalState.user.token })
                console.log(response.data)

                setState(draft => {
                    draft.isLoading = false
                    draft.feed = response.data
                })
            } catch (err) {
                console.log("There was a problem.")
            }
        }

        fetchData()

        return () => {
            ourRequest.cancel()
        }
    }, [])

    if (state.isLoading) {
        return <LoadingDotsIcon />
    }

    return (
        <Page title="Your Feed">
            {state.feed.length > 0 && (
                <>
                    <h2 className='text-center mb-4'>The Latest from Those You Follow</h2>
                    <div className='list-group'>
                        {state.feed.map(post => {
                            const date = new Date(post.createdDate)
                            const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
                            return (
                                <Link onClick={() => globalDispatch({ type: "closeSearch" })} key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
                                    <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong> {" "}
                                    <span className="text-muted small">by {post.author.username} {dateFormatted} </span>
                                </Link>
                            )
                        })}
                    </div>
                </>
            )}

            {state.feed.length === 0 && (
                <>
                    <h2 className="text-center">Hello <strong>{globalState.user.username}</strong>, your feed is empty.</h2>
                    <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
                </>
            )}
        </Page>
    )

}

export default Home