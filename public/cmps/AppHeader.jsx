import { userService } from "../services/user/user-index.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { LoginSignup } from "./LoginSignup.jsx"
import { Popup } from "./Popup.jsx"
import { UserMenu } from "./UserMenu.jsx"


const { useState, useEffect, useRef } = React
const { NavLink, Link, useNavigate } = ReactRouterDOM

export function AppHeader({ loggedinUser, setLoggedinUser }) {
    const navigate = useNavigate()

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const userMenuRef = useRef()

    useEffect(() => {
        if (isUserMenuOpen) {
            addEventListener('mousedown', handleClickOutside)
        } else {
            removeEventListener('mousedown', handleClickOutside)
        }

        return (() => {
            removeEventListener('mousedown', handleClickOutside)
        })
    }, [isUserMenuOpen])

    function toggleIsMobileNavOpen() {
        setIsMobileNavOpen(!isMobileNavOpen)
    }
    function onCloseMobileNav() {
        if (!isMobileNavOpen) return
        setIsMobileNavOpen(false)
    }

    function toggleIsPopupOpen() {
        setIsPopupOpen(!isPopupOpen)
    }

    function toggleIsSignup() {
        setIsSignup(!isSignup)
    }

    function toggleIsUserMenuOpen() {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    function handleClickOutside({ target }) {
        const elUserMenu = userMenuRef.current
        if (elUserMenu && target !== elUserMenu && !elUserMenu.contains(target)) {
            toggleIsUserMenuOpen()
        }
    }

    /// auth

    function signup(credentials) {
        userService.signup(credentials)
            .then(loggedinUser => {
                setLoggedinUser(loggedinUser)
                toggleIsPopupOpen()
                showSuccessMsg('Signup successful!')
            })
            .catch(err => {
                showErrorMsg(`Signup failed: ${err || 'Please try again later.'}`)
            })
    }

    function login(credentials) {
        userService.login(credentials)
            .then(loggedinUser => {
                setLoggedinUser(loggedinUser)
                toggleIsPopupOpen()
                showSuccessMsg('Login successful!')
            })
            .catch(err => {
                showErrorMsg(`Login failed: ${err || 'Please try again later.'}`)
            })
    }

    function logout() {
        userService.logout()
            .then(() => {
                setLoggedinUser(null)
                navigate('/')
                showSuccessMsg('Logout successful!')
            })
            .catch(err => {
                showErrorMsg(`Couldn't Logout`)
            })
    }

    return <header className="app-header main-content">
        <div className="app-header-content">
            <Link to="/" className="main-logo">
                <img src="../assets/img/logo.png" alt="bug-logo" className="bug-logo" />
                <span> Miss Bug</span>
            </Link>

            <div
                className={`nav-black-wrapper  ${isMobileNavOpen ? "open-nav" : ""}`}
                onClick={toggleIsMobileNavOpen}>
            </div>

            <nav className={`main-nav ${isMobileNavOpen ? "open-nav" : ""}`}>
                <NavLink to="/" onClick={onCloseMobileNav}>Home</NavLink>
                <NavLink to="/bug" onClick={onCloseMobileNav}>Bugs</NavLink>
                <NavLink to="/about" onClick={onCloseMobileNav}>About</NavLink>
            </nav>


            <div className="login-signup-wrapper">
                <button onClick={() => { loggedinUser ? toggleIsUserMenuOpen() : toggleIsPopupOpen() }} className="login-signup-btn">
                    {loggedinUser
                        ? <div className="user-btn">
                            {loggedinUser.username}
                        </div>
                        : <div className="user-btn" title="Login / Signup">
                            <img src="/assets/img/user-icon.svg" alt="user icon" className="icon user-icon" />
                            <span className="login-signup-str">Login / Signup</span>
                        </div>
                    }
                </button>

                {loggedinUser && isUserMenuOpen && <div className="user-menu-wrapper">
                    <UserMenu
                        loggedinUser={loggedinUser}
                        userMenuRef={userMenuRef}
                        logout={logout}
                        toggleIsUserMenuOpen={toggleIsUserMenuOpen}
                    />
                </div>}
            </div>


            <button className="mobile-nav-btn" onClick={toggleIsMobileNavOpen}>
                <img src={`../assets/img/${isMobileNavOpen ? "x" : "bars"}.svg`}
                    alt={isMobileNavOpen ? "x" : "bars"}
                    className="icon" />
            </button>


            <div className={`popup-black-wrapper ${isPopupOpen ? "visible" : ""}`} onClick={toggleIsPopupOpen}>
                <Popup
                    toggleIsPopupOpen={toggleIsPopupOpen}
                    header={<h2>{isSignup ? "Signup" : "Login"}</h2>}
                >
                    <LoginSignup
                        isSignup={isSignup}
                        toggleIsSignup={toggleIsSignup}
                        signup={signup}
                        login={login}
                        isPopupOpen={isPopupOpen}
                    />
                </Popup>
            </div>

        </div>
    </header >
}