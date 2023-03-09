import React, { useState, useContext } from 'react'
import Axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'

const HeaderLoggedIn = (props) => {

    // Get setLoggedIn method in the parent App.js from the Context
    const globalDispatch = useContext(DispatchContext)
    const globalState = useContext(StateContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        globalDispatch({ type: "logout" }) // instead of setLoggedIn(false)
        // Remove token & avatar from sessionStorage // Handled by App.js useEffect & Reducer
        // sessionStorage.removeItem("token")
        // sessionStorage.removeItem("avatar")

        navigate("/home")
    }

    const handleSearchIcon = (e) => {
        e.preventDefault()
        globalDispatch({ type: "openSearch" })
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"></i>
            </a>
            <span className="mr-2 header-chat-icon text-white">
                <i className="fas fa-comment"></i>
                <span className="chat-count-badge text-white"> </span>
            </span>
            <Link to={`/profile/${globalState.user.username}`} className="mr-2">
                <img className="small-header-avatar" src={globalState.user.avatar} />
            </Link>
            <Link to="/create-post" className="btn btn-sm btn-success mr-2">
                Create Post
            </Link>
            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    )
}

export default HeaderLoggedIn