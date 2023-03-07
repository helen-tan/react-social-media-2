import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'

const ViewSinglePost = () => {
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState()
    const { id } = useParams()

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source() // A way of identifying an Axios request

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${id}`, {cancelToken: ourRequest.token})
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
                <span className="pt-2">
                    <a href="#" className="text-primary mr-2" title="Edit"><i className="fas fa-edit"></i></a>
                    <a className="delete-post-button text-danger" title="Delete"><i className="fas fa-trash"></i></a>
                </span>
            </div>

            <p className="text-muted small mb-4">
                <Link to={`/profile/${post.author.username}`}>
                    <img className="avatar-tiny" src={post.author.avatar} />
                </Link>
                Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
            </p>

            <div className="body-content">
                {post.body}
            </div>
        </Page>
    )
}

export default ViewSinglePost