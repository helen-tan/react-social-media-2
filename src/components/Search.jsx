import React, { useContext, useEffect } from 'react'
import Axios from 'axios'
import DispatchContext from '../DispatchContext'
import { useImmer } from 'use-immer'

const Search = () => {
    const globalDispatch = useContext(DispatchContext)

    const [state, setState] = useImmer({
        searchTerm: '',
        results: [],
        show: 'neither',
        requestCount: 0
    })

    useEffect(() => {
        // Add keyboard event listener to browser (fn runs when ANY key is pressed)
        document.addEventListener("keyup", searchKeyPressHandler)

        // Stop listening to the keyboard press when the component is closed
        return () => {
            document.removeEventListener("keyup", searchKeyPressHandler)
        }
    }, [])

    // Send a req to the server only after some time after typing (not on every keystroke to avoid flooding the server)
    // Watch state.searchTerm for changes
    useEffect(() => {
        if (state.searchTerm.trim()) {
            setState(draft => {
                draft.show = "loading"
            })// Show loading icon

            const delay = setTimeout(() => {
                //console.log(state.searchTerm)
                setState(draft => { draft.requestCount++ })
            }, 3000)

            // Clean up fn not only runs when the component unmounts,
            // but also the next time when the useEffect runs
            return () => clearTimeout(delay)
            // cancels the setTimeout fn above

            // type 1 char > state.earchTerm changes > useEffect runs > setTimeout runs > quickly type another char > state.searchTerm changes > before useEffect runs again, the 1st instance will run its cleanup return fn 
            // When a person is typing at a reasonable pace, each keystroke will keep clearing the timeout
            // and setTimeout fn will only run after they stop typing for the ms specified
        } else {
            setState(draft => {
                draft.show = 'neither'
            })
        }
    }, [state.searchTerm])

    // Watch state.requestCount for changes
    useEffect(() => {
        // so that this won't run when component first renders
        if (state.requestCount) {
            const ourRequest = Axios.CancelToken.source() // create cancel token to cancel req if component unmounts in the middle of the req

            async function fetchResults() {
                try {
                    const response = await Axios.post('/search', { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })
                    // console.log(response.data)
                    setState(draft => {
                        draft.results = response.data
                        draft.show = "results" // makes results visible
                    })
                } catch (err) {
                    console.log("There was a problem or the request was cancelled.")
                }
            }
            fetchResults()

            return () => ourRequest.cancel()
        }
    }, [state.requestCount])

    const searchKeyPressHandler = (e) => {
        // If the key pressed is the esc key
        if (e.keyCode === 27) globalDispatch({ type: "closeSearch" })
    }

    // Set the user input in state for every keystroke
    const handleInput = (e) => {
        const value = e.target.value
        setState(draft => {
            draft.searchTerm = value // with Immer, we have draft which allows us to directly mutate state
        })
    }

    return (
        <div className="search-overlay">
            <div className="search-overlay-top shadow-sm">
                <div className="container container--narrow">
                    <label htmlFor="live-search-field" className="search-overlay-icon">
                        <i className="fas fa-search"></i>
                    </label>
                    {/* Search input */}
                    <input onChange={handleInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="What are you interested in?" />
                    <span onClick={() => globalDispatch({ type: "closeSearch" })} className="close-live-search">
                        <i className="fas fa-times-circle"></i>
                    </span>
                </div>
            </div>

            <div className="search-overlay-bottom">
                <div className="container container--narrow py-3">
                    <div className={"circle-loader " + (state.show === "loading" ? "circle-loader--visible" : "")}></div>

                    <div className={"live-search-results " + (state.show == "results" ? "live-search-results--visible" : "")}>
                        <div className="list-group shadow-sm">
                            <div className="list-group-item active"><strong>Search Results</strong> (3 items found)</div>
                            <a href="#" className="list-group-item list-group-item-action">
                                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #1</strong>
                                <span className="text-muted small">by brad on 2/10/2020 </span>
                            </a>
                            <a href="#" className="list-group-item list-group-item-action">
                                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" /> <strong>Example Post #2</strong>
                                <span className="text-muted small">by barksalot on 2/10/2020 </span>
                            </a>
                            <a href="#" className="list-group-item list-group-item-action">
                                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" /> <strong>Example Post #3</strong>
                                <span className="text-muted small">by brad on 2/10/2020 </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Search