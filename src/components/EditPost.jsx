import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';

const EditPost = () => {
    const [loading, setLoading] = useState(true)
    const [post, setPost] = useState()
    const { id } = useParams()

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
        <Page title="Edit Post">
            <form>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input autoFocus value={post.title} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea name="body" id="post-body" value={post.body} className="body-content tall-textarea form-control" type="text" />
                </div>

                <button className="btn btn-primary">Confirm Changes</button>
            </form>
        </Page>
    )
}

export default EditPost