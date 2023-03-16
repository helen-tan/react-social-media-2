import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DispatchContext from '../DispatchContext'
import StateContext from '../StateContext'
import { Tooltip } from 'react-tooltip'

const HeaderLoggedIn = () => {

    // Get setLoggedIn method in the parent App.js from the Context
    const globalDispatch = useContext(DispatchContext)
    const globalState = useContext(StateContext)

    const navigate = useNavigate()

    const handleLogout = () => {
        globalDispatch({ type: "logout" }) // instead of setLoggedIn(false)
        // Remove token & avatar from sessionStorage // Handled by App.js useEffect & Reducer
        // sessionStorage.removeItem("token")
        // sessionStorage.removeItem("avatar")
        globalDispatch({ type: "flashMessage", value: {message: "You have successfully logged out", color: "success" }})

        navigate("/home")
    }

    const handleSearchIcon = (e) => {
        e.preventDefault()
        globalDispatch({ type: "openSearch" })
    }

    return (
        <div className="flex-row my-3 my-md-0">
            <a data-tooltip-id="search-tooltip" data-tooltip-content="Search" onClick={handleSearchIcon} href="#" className="text-white mr-2 header-search-icon">
                <i className="fas fa-search"></i>
            </a>
            <Tooltip id="search-tooltip" place="bottom" className="custom-tooltip" />

            {" "}

            <span onClick={() => globalDispatch({ type: "toggleChat" })} data-tooltip-id="chat-tooltip" data-tooltip-content="Chat" className={"mr-2 header-chat-icon " + (globalState.unreadChatCount ? "text-danger" : "text-white")}>
                <i className="fas fa-comment"></i>
                {/* Conditionally render the unread msg count badge */}
                {globalState.unreadChatCount ?
                    <span className="chat-count-badge text-white">
                        {globalState.unreadChatCount < 10 ? globalState.unreadChatCount : "9+"}
                    </span>
                    :
                    ""
                }
            </span>
            <Tooltip id="chat-tooltip" place="bottom" className="custom-tooltip" />

            {" "}

            <Link data-tooltip-id="profile-tooltip" data-tooltip-content="My Profile" to={`/profile/${globalState.user.username}`} className="mr-2">
                <img className="small-header-avatar" src={globalState.user.avatar} />
            </Link>
            <Tooltip id="profile-tooltip" place="bottom" className="custom-tooltip" />

            {" "}

            <Link to="/create-post" className="btn btn-sm btn-success mr-2">
                Create Post
            </Link>

            {" "}

            <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                Sign Out
            </button>
        </div>
    )
}

export default HeaderLoggedIn