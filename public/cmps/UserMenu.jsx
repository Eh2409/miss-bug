const { NavLink } = ReactRouterDOM

export function UserMenu({ loggedinUser, userMenuRef, logout, toggleIsUserMenuOpen }) {
    return (
        <section className="user-menu" ref={userMenuRef}>

            <header className="user-menu-header">
                <div>welcome back {loggedinUser.username}</div>
                <div className="btn" onClick={logout}>Logout</div>
            </header>

            <nav className="user-manu-nav">
                <NavLink to={`/user/${loggedinUser._id}`} onClick={toggleIsUserMenuOpen}>My Account</NavLink>
            </nav>

        </section>
    )
}