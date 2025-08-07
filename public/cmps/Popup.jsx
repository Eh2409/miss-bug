

export function Popup({ header, footer, toggleIsPopupOpen, children }) {
    return (
        <section className="popup" onClick={(event) => event.stopPropagation()}>
            <header className="popup-header">
                {header}
                <button className="close-btn" onClick={toggleIsPopupOpen}>X</button>
            </header>
            <main>
                {children}
            </main>
            <footer>{footer}</footer>
        </section>
    )
}