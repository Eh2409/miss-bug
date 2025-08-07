export function AppFooter () {
    const year = (new Date).getFullYear()

    return <footer className="app-footer main-content">
        <p>coffeerights &copy; {year}</p>
    </footer>
}