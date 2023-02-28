import React from 'react'

const Container = (props) => {
  return (
    <div className={ "container py-md-5 " + (props.wide ? '' : 'container--narrow')}>
        {/* In React, nested jsx content is available in props.children */}
        {props.children}
    </div>
  )
}

export default Container