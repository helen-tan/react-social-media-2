import React, { useContext, useEffect, useReducer } from 'react'
import { useParams, Link } from 'react-router-dom'
import Axios from 'axios'
import Page from './Page'
import LoadingDotsIcon from './LoadingDotsIcon'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'

const EditPost = () => {
    const globalState = useContext(StateContext)
    const globalDispatch = useContext(DispatchContext)

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
        sendCount: 0,
        notFound: false
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
            case "titleChange":
                return {
                    ...state,
                    ...state.title.value = action.value,
                    ...state.title.hasErrors = false
                }
            case "bodyChange":
                return {
                    ...state,
                    ...state.body.value = action.value,
                    ...state.body.hasErrors = false
                }
            case "submitRequest":
                if (!state.title.hasErrors && !state.body.hasErrors) {
                    return {
                        ...state,
                        ...state.sendCount++
                    }
                } else return { ...state }

            case "saveRequestStarted":
                return {
                    ...state,
                    ...state.isSaving = true
                }
            case "saveRequestFinished":
                return {
                    ...state,
                    ...state.isSaving = false
                }
            case "titleRules":
                // Validation: Check if title is blank
                if (!action.value.trim()) {
                    return {
                        ...state,
                        ...state.title.hasErrors = true,
                        ...state.title.message = "You must provide a title"
                    }
                } else {
                    return {
                        ...state,
                        ...state.title.hasErrors = false,
                        ...state.title.message = ""
                    }
                }
            case "bodyRules":
                // Validation: Check if body is blank
                if (!action.value.trim()) {
                    return {
                        ...state,
                        ...state.body.hasErrors = true,
                        ...state.body.message = "You must provide body content"
                    }
                } else {
                    return {
                        ...state,
                        ...state.body.hasErrors = false,
                        ...state.body.message = ""
                    }
                }
            case "notFound":
                return {
                    ...state,
                    ...state.notFound = true
                }
        }
    }

    // Reducer to manage state
    const [state, dispatch] = useReducer(ourReducer, originalState)

    useEffect(() => {
        const ourRequest = Axios.CancelToken.source() // A way of identifying an Axios request

        async function fetchPost() {
            try {
                const response = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token })
                // console.log(response.data)
                if (response.data) {
                    // Only declare the req completed if post is found
                    dispatch({ type: "fetchComplete", value: response.data })
                } else {
                    dispatch({ type: "notFound" })
                }


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

    // useEffect that runs when post update btn is clicked (detected when sendCount increases)
    useEffect(() => {
        if (state.sendCount) {
            dispatch({ type: "saveRequestStarted" })

            const ourRequest = Axios.CancelToken.source() // A way of identifying an Axios request

            async function fetchPost() {
                try {
                    const response = await Axios.post(`/post/${state.id}/edit`, {
                        title: state.title.value,
                        body: state.body.value,
                        token: globalState.user.token
                    }, { cancelToken: ourRequest.token })
                    // console.log(response.data)

                    dispatch({ type: "saveRequestFinished" })
                    globalDispatch({ type: "flashMessage", value: "Post was updated" })
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
        }
    }, [state.sendCount])

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate first before sending the form in a req
        dispatch({ type: "titleRules", value: state.title.value })
        dispatch({ type: "bodyRules", value: state.body.value })
        dispatch({ type: "submitRequest" })
    }

    if (state.notFound) {
        return (
            <Page title="Not Found">
                <div className='text-center'>
                    <h2>Whoops we cannot find that page</h2>
                    <p className='lead text-muted'>You can always visit the <Link to="/">homepage</Link> to get a fresh start</p>
                </div>
            </Page>
        )
    }

    if (state.isFetching) {
        return (
            <Page title="...">
                <LoadingDotsIcon />
            </Page>
        )
    }

    return (
        <Page title="Edit Post">
            <Link className='small font-weight-bold' to={`/post/${state.id}`}>&laquo; Back to post</Link>

            <form className='mt-3' onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="post-title" className="text-muted mb-1">
                        <small>Title</small>
                    </label>
                    <input autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off"
                        onChange={e => dispatch({ type: "titleChange", value: e.target.value })} value={state.title.value}
                        onBlur={e => dispatch({ type: "titleRules", value: e.target.value })} />
                    {/* Error message */}
                    {state.title.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="post-body" className="text-muted mb-1 d-block">
                        <small>Body Content</small>
                    </label>
                    <textarea name="body" id="post-body" value={state.body.value} className="body-content tall-textarea form-control" type="text"
                        onChange={e => dispatch({ type: "bodyChange", value: e.target.value })}
                        onBlur={e => dispatch({ type: "bodyRules", value: e.target.value })} />
                    {/* Error message */}
                    {state.body.hasErrors && (
                        <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>
                    )}
                </div>

                <button className="btn btn-primary" disabled={state.isSaving}>{state.isSaving ? "Saving..." : "Confirm Changes"}</button>
            </form>
        </Page>
    )
}

export default EditPost