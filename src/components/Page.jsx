import React, { useEffect } from 'react'
import Container from './Container'

const Page = (props) => {

    useEffect(() => {
        document.title = `${props.title} | ComplexApp`
        window.scrollTo(0, 0) // Scroll to the top every this page loads
    }, [])

    return (
        <Container wide={props.wide}>
            {props.children}
        </Container>
    )
}

export default Page