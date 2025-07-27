const { useState } = React
const { NavLink, Link } = ReactRouterDOM
export function AppHeader() {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

    function toggleIsMobileNavOpen() {
        setIsMobileNavOpen(!isMobileNavOpen)
    }
    function onCloseMobileNav() {
        if (!isMobileNavOpen) return
        setIsMobileNavOpen(false)
    }

    return <header className="app-header main-content single-row">

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

        <button className="mobile-nav-btn" onClick={toggleIsMobileNavOpen}>
            <img src={`../assets/img/${isMobileNavOpen ? "x" : "bars"}.svg`}
                alt={isMobileNavOpen ? "x" : "bars"}
                className="icon" />
        </button>

    </header >
}