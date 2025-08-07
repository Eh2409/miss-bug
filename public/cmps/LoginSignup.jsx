import { userService } from "../services/user/index.js"

const { useState, useEffect, useRef, Fragment } = React

export function LoginSignup({ isSignup, toggleIsSignup, signup, login }) {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())

    function handleChange({ target }) {
        var { name, value } = target

        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    function onSubmit(ev) {
        ev.preventDefault()
        isSignup ? signup(credentials) : login(credentials)
    }

    const { username, password, fullname } = credentials

    return (
        <section className="login-signup">
            <form onSubmit={onSubmit}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={handleChange} required />
                <label htmlFor="password">Password</label>
                <input type="text" name="password" id="password" value={password} onChange={handleChange} required />

                {isSignup && <Fragment>
                    <label htmlFor="fullname">Fullname</label>
                    <input type="text" name="fullname" id="fullname" value={fullname} onChange={handleChange} required />
                </Fragment>}

                <button>{isSignup ? "Signup" : "Login"}</button>
            </form>

            <div onClick={toggleIsSignup} className="signup-toggle">
                {isSignup ? "Already have an account? Login" : "New here? Signup to get started"}
            </div>

        </section>
    )
}