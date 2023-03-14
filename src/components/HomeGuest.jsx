import React, { useState } from 'react'
import Axios from 'axios'
import Page from './Page'
import { useReducer } from 'react'
import { CSSTransition } from 'react-transition-group'

const HomeGuest = () => {
    // const [username, setUsername] = useState("")
    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")
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
                let newObj = {
                    ...state,
                    ...state.username.value = action.value,
                    ...state.username.hasErrors = false
                }
                // Username cannot be > 30 characters
                if (state.username.value.length > 30) {
                    newObj = {
                        ...state, 
                        ...state.username.hasErrors = true,
                        ...state.username.message = "Username cannot exeed 30 characters"
                    }
                }
                // Username must be alphanumeric (letters and numbers)
                if (state.username.value && !/^([a-zA-Z0-9]+)$/.test(state.username.value)) { // Check not empty &
                    newObj = {
                        ...state, 
                        ...state.username.hasErrors = true,
                        ...state.username.message = "Username cannot only contain letters and numbers"
                    }
                }
                return newObj;
            case "usernameAfterDelay":
                return
            case "usernameUniqueResults":
                return
            case "emailImmediately":
                return {
                    ...state,
                    ...state.email.value = action.value,
                    ...state.email.hasErrors = false
                }
            case "emailAfterDelay":
                return
            case "emailUniqueResults":
                return
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