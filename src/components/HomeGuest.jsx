import React, { useEffect } from 'react'
import Axios from 'axios'
import Page from './Page'
import { useReducer } from 'react'
import { CSSTransition } from 'react-transition-group'

const HomeGuest = () => {
    const initialState = {
        username: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0
        },
        email: {
            value: "",
            hasErrors: false,
            message: "",
            isUnique: false,
            checkCount: 0
        },
        password: {
            value: "",
            hasErrors: false,
            message: "",
        },
        submitCount: 0
    }

    const ourReducer = (state, action) => {
        switch (action.type) {
            case "usernameImmediately":
                // Set state in an object first
                let obj1 = {
                    ...state,
                    ...state.username.value = action.value,
                    ...state.username.hasErrors = false
                }
                // Username cannot be > 30 characters
                if (state.username.value.length > 30) {
                    obj1 = {
                        ...state,
                        ...state.username.hasErrors = true,
                        ...state.username.message = "Username cannot exeed 30 characters"
                    }
                }
                // Username must be alphanumeric (letters and numbers)
                if (state.username.value && !/^([a-zA-Z0-9]+)$/.test(state.username.value)) { // Check not empty &
                    obj1 = {
                        ...state,
                        ...state.username.hasErrors = true,
                        ...state.username.message = "Username cannot only contain letters and numbers"
                    }
                }
                return obj1;
            case "usernameAfterDelay":
                let obj2 = {}
                // Username cannot be less than 3 chars
                if (state.username.value.length < 3) {
                    obj2 = {
                        ...state,
                        ...state.username.hasErrors = true,
                        ...state.username.message = "Username must be at least 3 characters"
                    }
                }
                // Username must not already exist
                // If no above errors and is valid username - increment checkCount, and begin checking if username already exist (handled by "usernameUniqueResults")
                if (!state.username.hasErrors) {
                    obj2 = {
                        ...state,
                        ...state.username.checkCount++
                    }
                }
                return obj2
            case "usernameUniqueResults":
                let obj3 = {}
                // if action.value is true (returns by server) - means username is already in use
                if (action.value) {
                    obj3 = {
                        ...state,
                        ...state.username.hasErrors = true,
                        ...state.username.isUnique = false,
                        ...state.username.message = "That username is already taken"
                    }
                } else {
                    obj3 = {
                        ...state,
                        ...state.username.isUnique = true,
                    }
                }
                return obj3
            case "emailImmediately":
                // Set state
                return {
                    ...state,
                    ...state.email.value = action.value,
                    ...state.email.hasErrors = false
                }
            case "emailAfterDelay":
                let obj4 = {}
                // Email must be of valid email format  ....@...
                if (!/^\S+@\S+$/.test(state.email.value)) {
                    obj4 = {
                        ...state,
                        ...state.email.hasErrors = true,
                        ...state.email.message = "You must provide a valid email address"
                    }
                }
                // Email must be unique - Has someone already registered an acc with this email?
                if (!state.email.hasErrors) {
                    obj4 = {
                        ...state,
                        ...state.email.checkCount++
                    }
                }
                return obj4
            case "emailUniqueResults":
                let obj5 = {}
                // if action.value is true (returns by server) - means username is already in use
                if (action.value) {
                    obj5 = {
                        ...state,
                        ...state.email.hasErrors = true,
                        ...state.email.isUnique = false,
                        ...state.email.message = "That email is already being used"
                    }
                } else {
                    obj5 = {
                        ...state,
                        ...state.email.isUnique = true
                    }
                }
                return obj5
            case "passwordImmediately":
                return {
                    ...state,
                    ...state.password.value = action.value,
                    ...state.password.hasErrors = false
                }
            case "passwordAfterDelay":
                return
            case "submitForm":
                return
        }
    }

    const [state, dispatch] = useReducer(ourReducer, initialState)

    useEffect(() => {
        if (state.username.value) {
            const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800)

            return () => clearTimeout(delay)
        }
    }, [state.username.value])

    useEffect(() => {
        if (state.email.value) {
            const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)

            return () => clearTimeout(delay)
        }
    }, [state.email.value])

    useEffect(() => {
        if (state.password.value) {
            const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)

            return () => clearTimeout(delay)
        }
    }, [state.password.value])

    // Watch state.username.checkCount for changes - Check if username already exist
    useEffect(() => {
        // so that this won't run when component first renders
        if (state.username.checkCount) {
            const ourRequest = Axios.CancelToken.source() // create cancel token to cancel req if component unmounts in the middle of the req

            async function fetchResults() {
                try {
                    const response = await Axios.post('/doesUsernameExist', { username: state.username.value }, { cancelToken: ourRequest.token })
                    dispatch({ type: "usernameUniqueResults", value: response.data})
                } catch (err) {
                    console.log("There was a problem or the request was cancelled.")
                }
            }
            fetchResults()

            return () => ourRequest.cancel()
        }
    }, [state.username.checkCount])

    // Watch state.email.checkCount for changes - Check if email is already in use
    useEffect(() => {
        // so that this won't run when component first renders
        if (state.email.checkCount) {
            const ourRequest = Axios.CancelToken.source() // create cancel token to cancel req if component unmounts in the middle of the req

            async function fetchResults() {
                try {
                    const response = await Axios.post('/doesEmailExist', { email: state.email.value }, { cancelToken: ourRequest.token })
                    dispatch({ type: "emailUniqueResults", value: response.data})
                } catch (err) {
                    console.log("There was a problem or the request was cancelled.")
                }
            }
            fetchResults()

            return () => ourRequest.cancel()
        }
    }, [state.email.checkCount])

    const handleSubmit = (e) => {
        e.preventDefault();


    }

    return (
        <Page title="Welcome!" wide={true} >
            <div className="row align-items-center">
                <div className="col-lg-7 py-3 py-md-5">
                    <h1 className="display-3">Remember Writing?</h1>
                    <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
                </div>
                <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">

                    {/* Register Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username-register" className="text-muted mb-1">
                                <small>Username</small>
                            </label>
                            <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} value={state.username.value} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
                            {/* Username validation error message */}
                            <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                                <div className='alert alert-danger small liveValidateMessage'>{state.username.message}</div>
                            </CSSTransition>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email-register" className="text-muted mb-1">
                                <small>Email</small>
                            </label>
                            <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} value={state.email.value} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password-register" className="text-muted mb-1">
                                <small>Password</small>
                            </label>
                            <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} value={state.password.value} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
                        </div>
                        <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-block">
                            Sign up for ComplexApp
                        </button>
                    </form>
                </div>
            </div>
        </Page>
    )
}

export default HomeGuest