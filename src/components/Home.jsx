import React, { useState, useEffect } from 'react'
import Axios from 'axios';
import Page from './Page'

const Home = () => {
    const [loggedInUser, setLoggedInUser] = useState("")
    const [loadingAuth, setLoadingAuth] = useState(true)

    const bearer_token = `Bearer ${sessionStorage.getItem('token')}`
    const config = {
        headers: {
            Authorization: bearer_token
        }
    }

    // Send request to get identity of logged in user
    const authenticate = async () => {
        try {
            const response = await Axios.get(`http://localhost:8080/authuser`, config)
            if (response.data) {
                setLoggedInUser(response.data.loggedInUser)
                setLoadingAuth(false)

                console.log(response.data)
            }
        } catch (err) {
            console.log("There was a problem")
            console.log(err)
            // navigate("/")
        }
    }

    useEffect(() => {
        authenticate()
    }, [])

    if (loadingAuth) {
        <div>Loading...</div>
    } else {
        return (
            <Page title="Your Feed">
                <h2 className="text-center">Hello <strong>{loggedInUser}</strong>, your feed is empty.</h2>
                <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
            </Page>
        )
    }
}

export default Home