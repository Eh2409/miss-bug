import { Popup } from "./Popup.jsx"

const { useState } = React
const { NavLink, Link } = ReactRouterDOM

export function AppHeader() {

    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
    const [isPopupOpen, setIsPopupOpen] = useState(false)

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

            <nav className={isMobileNavOpen ? "open-nav" : ""}>
                <NavLink to="/" onClick={onCloseMobileNav}>Home</NavLink>
                <NavLink to="/bug" onClick={onCloseMobileNav}>Bugs</NavLink>
                <NavLink to="/about" onClick={onCloseMobileNav}>About</NavLink>
            </nav>

            <button onClick={toggleIsPopupOpen} className="popup-btn">{isPopupOpen ? "Close popup" : "Open popup"}</button>

            <button className="mobile-nav-btn" onClick={toggleIsMobileNavOpen}>
                <img src={`../assets/img/${isMobileNavOpen ? "x" : "bars"}.svg`}
                    alt={isMobileNavOpen ? "x" : "bars"}
                    className="icon" />
            </button>

            <div className={`popup-black-wrapper ${isPopupOpen ? "visible" : ""}`} onClick={toggleIsPopupOpen}>
                <Popup
                    toggleIsPopupOpen={toggleIsPopupOpen}
                />
            </div>
        </div>
    </header >
}