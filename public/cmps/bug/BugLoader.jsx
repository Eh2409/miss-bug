
export function BugLoader(prop) {
    return (
        <ul className="bug-loader bug-list">

            {Array.from({ length: 8 }).map((_, idx) => (
                <li key={idx} className="bug-load-item">
                    <div className="preview"></div>
                    <div className="actions">
                        {
                            Array.from({ length: 3 }).map((_, idx) => (
                                <span className="btn" key={idx + 'b'}></span>
                            ))
                        }
                    </div>
                </li>
            ))}

        </ul>
    )
}