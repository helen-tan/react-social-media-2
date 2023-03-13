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
        fieldValue: ''
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
        alert(state.fieldValue)
        setState(draft => {
            draft.fieldValue= ''
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
                <div className="chat-self">
                    <div className="chat-message">
                        <div className="chat-message-inner">Hey, how are you?</div>
                    </div>
                    <img className="chat-avatar avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" />
                </div>

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
            </div>

            {/* User input */}
            <form onSubmit={handleSubmit} id="chatForm" className="chat-form border-top">
                <input value={state.fieldValue} onChange={handleFieldChange} ref={chatField} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
            </form>
        </div>
    )
}

export default Chat