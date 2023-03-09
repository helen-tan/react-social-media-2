import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import NotFound from './NotFound'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import StateContext from '../StateContext'

const ViewSinglePost = () => {
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState()
    const { id } = useParams()

    const globalState= useContext(StateContext)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source() // A way of identifying an Axios request

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
                // console.log(response.data)
                setPost(response.data)
                setLoading(false)
            } catch (err) {
                console.log("There was a problem, or the request was cancelled.")
            }
        }

        fetchPost()

        // Cleanup - prevent memory leak (update of state after this component is unmounted/stops being rendered)
        return () => {
            // Cancel the Axios request
            ourRequest.cancel()
        }
    }, [])

    const isOwner = () => {
        // If not logged in = not owner
        if (globalState.loggedIn) {
            return globalState.user.username === post.author.username
        } else return false
    }

    if (!loading && !post) { // if loading is completed & post is undefined (evaluated to false bcos server couldn't find anything)
        return <NotFound />
    }

    if (loading) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    }

    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

    return (
        <Page title={post.title}>
            <div className="d-flex justify-content-between">
                <h2>{post.title}</h2>

                {isOwner() && (
                    <span className="pt-2">
                        <Link to={`/post/${post._id}/edit`} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit" className="text-primary mr-2">
                            <i className="fas fa-edit"></i>
                        </Link>
                        <Tooltip id="edit-tooltip" place="top" className="custom-tooltip" />

                        {" "}

                        <a data-tooltip-id="delete-tooltip" data-tooltip-content="Delete" className="delete-post-button text-danger">
                            <i className="fas fa-trash"></i>
                        </a>
                        <Tooltip id="delete-tooltip" place="top" className="custom-tooltip" />
                    </span>
                )}
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
            </p>

            <div className="body-content">
                <ReactMarkdown
                    children={post.body}
                    allowedElements={["p", "br", "strong", "em", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"]}
                />
            </div>
        </Page>
    )
}

export default ViewSinglePost