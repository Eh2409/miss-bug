
export function Popup({ header, footer, toggleIsPopupOpen }) {
    return (
        <section className="popup" onClick={(event) => event.stopPropagation()}>
            <header className="popup-header">
                {header}
                <button className="close-btn" onClick={toggleIsPopupOpen}>X</button>
            </header>
            <main>

            </main>
            <footer>{footer}</footer>
        </section>
    )
}