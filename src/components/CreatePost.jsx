import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import Page from './Page'

const CreatePost = () => {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios.post("/create-post", {
                title,
                body,
                token: sessionStorage.getItem("token")
            })
            // console.log(response) // post id returned in response.data
            console.log("New post was created.")
            setTitle("")
            setBody("")

            // Redirect to new post url
            navigate(`/post/${response.data}`);

        } catch (err) {
            console.log("There was a problem.")
        }
    }

    return (
        <Page title="Create New Post">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input autoFocus onChange={e => setTitle(e.target.value)} name="title" value={title} id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea onChange={e => setBody(e.target.value)} name="body" value={body} id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
                </div>

                <button className="btn btn-primary">Save New Post</button>
            </form>
        </Page>
    )
}

export default CreatePost