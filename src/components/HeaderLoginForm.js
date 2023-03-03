import React, { useState, useContext } from 'react'
import Axios from 'axios'
import ExampleContext from '../ExampleContext'

const HeaderLoginForm = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loggedInUser, setLoggedInUser] = useState("")
    
    // Get setLoggedIn method in the parent App.js from the Context
    const { setLoggedIn } = useContext(ExampleContext)

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios.post("/login", {
                username,
                password
            })
            // console.log(response.data)

            if (response.data) {
                console.log(response.data)

                // Save token & image to sessionStorage
                sessionStorage.setItem("token", response.data.token)
                sessionStorage.setItem("avatar", response.data.avatar)
                // Set logged in user
                setLoggedInUser(response.data.username)

                setUsername("")
                setPassword("")

                setLoggedIn(true)
            } else {
                console.log("Incorrect username or password")
            }

        } catch (err) {
            console.log("There was a problem")
        }
    }

    return (
        <form onSubmit={handleLogin} className="mb-0 pt-2 pt-md-0">
            <div className="row align-items-center">
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => setUsername(e.target.value)} value={username} name="username" className="form-control form-control-sm input-dark" type="text" placeholder="Username" autoComplete="off" />
                </div>
                <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
                    <input onChange={e => setPassword(e.target.value)} value={password} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-success btn-sm">Sign In</button>
                </div>
            </div>
        </form>
    )
}

export default HeaderLoginForm