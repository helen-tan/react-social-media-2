import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'

const HeaderLoginForm = (props) => {
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [usernameIsBlank, setUsernameIsBlank] = useState(false)
    const [passwordIsBlank, setPasswordIsBlank] = useState(false)
    
    // Get setLoggedIn method in the parent App.js from the Context
    const globalDispatch = useContext(DispatchContext)

    useEffect(() => {
        return username === "" || username === null ? setUsernameIsBlank(true) : setUsernameIsBlank(false)
    }, [username])

    useEffect(() => {
       return password === "" || password === null ? setPasswordIsBlank(true) : setPasswordIsBlank(false)
    }, [password])

    const handleLogin = async (e) => {
        e.preventDefault()

        if (usernameIsBlank || passwordIsBlank) {
            globalDispatch({ type: "flashMessage", value: "Please enter your username or password" })
            // This should only fire when submit is clicked after first render, to replace initial null values with an empty string
            if (username === null) setUsername("")
            if (password === null) setPassword("")
        } else {
            try {
                const response = await Axios.post("/login", {
                    username,
                    password
                })
                // console.log(response.data)
    
                if (response.data) {
                    console.log(response.data)
                    // Save token & image to sessionStorage - Handled usign Reducer (globalDispatch)
                    // sessionStorage.setItem("token", response.data.token)
                    // sessionStorage.setItem("avatar", response.data.avatar)
    
                    setUsername("")
                    setPassword("")
    
                    // setLoggedIn(true)
                    globalDispatch({ type: "flashMessage", value: "Login successful" })
                    globalDispatch({ type: "login", data: response.data})
                } else {
                    globalDispatch({ type: "flashMessage", value: "Incorrect username or password" })
                }
    
            } catch (err) {
                console.log("There was a problem")
            }

        }

    }

    return (
        <form onSubmit={handleLogin} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    {/* username !== null prevents username input from having a red border on first render */}
                    <input onChange={e => setUsername(e.target.value)} value={username} name="username" className={"form-control form-control-sm input-dark " + (usernameIsBlank && username !== null ? "is-invalid" : "")} type="text" placeholder="Username" autoComplete="off" />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    {/* password !== null prevents password input from having a red border on first render */}
                    <input onChange={e => setPassword(e.target.value)} value={password} name="password" className={"form-control form-control-sm input-dark " + (passwordIsBlank && password !== null ? "is-invalid" : "")} type="password" placeholder="Password" />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    )
}

export default HeaderLoginForm