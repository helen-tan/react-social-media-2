import React, { useState, useEffect, useReducer } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'

const EditPost = () => {
    const originalState = {
        title: {
            value: "",
            hasErrors: false,
            message: ""
        },
        body: {
            value: "",
            hasErrors: false,
            message: ""
        },
        isFetching: true,
        isSaving: false,
        id: useParams().id,
        sendCount: 0
    }

    function ourReducer(state, action) {
        switch (action.type) {
            case "fetchComplete":
                return {
                    title: {
                        value: action.value.title,
                        hasErrors: false,
                        message: ""
                    },
                    body: {
                        value: action.value.body,
                        hasErrors: false,
                        message: ""
                    },
                    isFetching: false,
                    isSaving: false,
                    id: state.id,
                    sendCount: 0
                }
        }
    }

    const [state, dispatch] = useReducer(ourReducer, originalState)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source() // A way of identifying an Axios request

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
                // console.log(response.data)
                dispatch({ type: "fetchComplete", value: response.data })
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

    if (state.isFetching) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    }

    return (
        <Page title="Edit Post">
            <form>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input autoFocus value={state.title.value} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea name="body" id="post-body" value={state.body.value} className="body-content tall-textarea form-control" type="text" />
                </div>

                <button className="btn btn-primary">Confirm Changes</button>
            </form>
        </Page>
    )
}

export default EditPost