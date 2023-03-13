import React, { useContext, useEffect, useRef } from 'react'
import StateContext from '../StateContext'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'

const Chat = () => {
    const globalState = useContext(StateContext)
    const globalDispatch = useContext(DispatchContext)

    const chatField = useRef(null)
    // not document.querySelector. A Ref is like a box to hold a value. 
    // Unlike state, we can directly mutate it
    // React will not re-render when our reference changes

    const [state, setState] = useImmer({
        fieldValue: '',
        chatMessages: []
    })

    useEffect(() => {
        if (globalState.isChatOpen) {
            chatField.current.focus()
        }
    }, [globalState.isChatOpen])

    const handleFieldChange = (e) => {
        const value = e.target.value

        setState(draft => {
            draft.fieldValue = value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Send message to chat server

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
            <div id="chat" className="chat-log">
                {state.chatMessages.map((message, index) => {
                    // If entered by the logged in user
                    if (message.username === globalState.user.username) {
                        return (
                            <div className="chat-self">
                                <div className="chat-message">
                                    <div className="chat-message-inner">{message.message}</div>
                                </div>
                                <img className="chat-avatar avatar-tiny" src={message.avatar} />
                            </div>
                        )
                    }
                    // If not entered by the logged in user
                    return (
                        <div className="chat-other">
                            <a href="#">
                                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" />
                            </a>
                            <div className="chat-message">
                                <div className="chat-message-inner">
                                    <a href="#">
                                        <strong>barksalot:</strong>
                                    </a>
                                    Hey, I am good, how about you?
                                </div>
                            </div>
                        </div>
                    )
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