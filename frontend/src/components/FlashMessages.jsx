import React from 'react'

const FlashMessages = (props) => {
    return (
        <div className='floating-alerts'>
            {props.messages.map((msg, index) => {
                return (
                    <div key={index} className={`alert alert-${msg.color} text-center floating-alert shadow-sm`}>
                        { msg.message }
                    </div>
                )
            })}
        </div>
    )
}

export default FlashMessages