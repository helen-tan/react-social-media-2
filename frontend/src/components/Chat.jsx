import React, { useContext, useEffect, useRef } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'

const Chat = () => {
    const socket = useRef(null)

    const globalState = useContext(StateContext)
    const globalDispatch = useContext(DispatchContext)

    const chatField = useRef(null)
    const chatLog = useRef(null) // For chat scrollbar to auto scroll down
    // not document.querySelector. A Ref is like a box to hold a value. 
    // Unlike state, we can directly mutate it
    // React will not re-render when our reference changes

    const [state, setState] = useImmer({
        fieldValue: '',
        chatMessages: []
    })

    // Run the 1st time component renders - Frontend to begin listening for an event called "chatFromServer"
    useEffect(() => {
        // Establish an ongoing bidirectional connection between the browser and the backend server
        socket.current = io("http://localhost:8080")

        socket.current.removeAllListeners()
        // Arg 1: Name of event the server will emit to use (programmed in backend)
        // Arg 2: Function that will run whenever the specified event in Arg 1 happens
        socket.current.on("chatFromServer", message => {
            setState(draft => {
                draft.chatMessages.push(message)
            })
        })

        // End socket connection
        return () => socket.current.disconnect()
    }, [])

    // Watch isChatOpen changes
    useEffect(() => {
        if (globalState.isChatOpen) {
            chatField.current.focus()                           // focus on input field
            globalDispatch({ type: "clearUnreadChatCount" })    // Clear no. of unread msg in global state
        }
    }, [globalState.isChatOpen])

    // Watch for new chat messages
    useEffect(() => {
        // Whenever a new message is pushed into the collection, scroll the chatlog div down to the bottom
        chatLog.current.scrollTop = chatLog.current.scrollHeight

        // Don't run when component is first rendered, when chatMessages = 0
        // Run if there are new messages & when chat is not open
        if (state.chatMessages.length && !globalState.isChatOpen) {
            globalDispatch({ type: "incrementUnreadChatCount" })
        }
    }, [state.chatMessages])


    const handleFieldChange = (e) => {
        const value = e.target.value

        setState(draft => {
            draft.fieldValue = value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Send message to chat server - Server will broadcast to connected users
        // Server will listen to an event "chatFromBrowser"
        socket.current.emit("chatFromBrowser", {
            message: state.fieldValue,
            token: globalState.user.token
        })

        setState(draft => {
            // Add message to state collection of messages
            draft.chatMessages.push({
                message: draft.fieldValue,
                username: globalState.user.username,
                avatar: globalState.user.avatar
            })
            // Clear out input field
            draft.fieldValue = ''
        })
    }

    return (
        <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right " + (globalState.isChatOpen ? "chat-wrapper--is-visible" : "")}>
            {/* Chat Title bar */}
            <div className="chat-title-bar bg-primary">
                Chat
                <span onClick={() => globalDispatch({ type: "closeChat" })} className="chat-title-bar-close">
                    <i className="fas fa-times-circle"></i>
                </span>
            </div>
            {/* Chat messages display */}
            <div id="chat" className="chat-log" ref={chatLog}>
                {state.chatMessages.map((message, index) => {
                    // If entered by the logged in user
                    if (message.username === globalState.user.username) {
                        return (
                            <div className="chat-self" key={index}>
                                <div className="chat-message">
                                    <div className="chat-message-inner">{message.message}</div>
                                </div>
                                <img className="chat-avatar avatar-tiny" src={message.avatar} alt="profile avatar"/>
                            </div>
                        )
                    } else {
                        // If not entered by the logged in user
                        return (
                            <div className="chat-other" key={index}>
                                <Link to={`/profile/${message.username}`}>
                                    <img className="avatar-tiny" src={message.avatar} />
                                </Link>
                                <div className="chat-message">
                                    <div className="chat-message-inner">
                                        <Link to={`/profile/${message.username}`}>
                                            <strong>{message.username}: </strong>
                                        </Link>
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

            {/* User input */}
            <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
                <input value={state.fieldValue} onChange={handleFieldChange} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
            </form>
        </div>
    )
}

export default Chat