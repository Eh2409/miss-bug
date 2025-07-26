const { NavLink, Link } = ReactRouterDOM

export function AppHeader() {
    return <header className="app-header main-content single-row">
        
        <Link to="/" className="main-logo">
            <img src="../assets/img/logo.png" alt="bug-logo" className="bug-logo" />
            <span> Miss Bug</span>
        </Link>


        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
        </nav>
    </header >
}