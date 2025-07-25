import { bugService } from "../../services/bug/index.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilterBy, toggleIsFilterPopupOpen }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [filterOptions, setFilterOptions] = useState([])
    const defaultFilterRef = useRef(bugService.getDefaultFilter())

    bugService
    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onToggelFilterOptions(option) {
        setFilterOptions(prev => {

            if (prev.includes(option)) {
                prev = prev.filter(op => op !== option)
            } else {
                prev = [...prev, option]
            }

            return prev
        })
    }

    function onRestFilter() {
        setFilterByToEdit(defaultFilterRef.current)
    }

    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter" onClick={(event) => { event.stopPropagation() }}>

            <header className="filter-header">
                <h2>Filter</h2>
                <div className="close-btn" onClick={toggleIsFilterPopupOpen}>X</div>
            </header>

            <form onSubmit={onSubmitFilter}>


                <div className={`label ${filterOptions.includes("txt") ? "open" : ""}`}>
                    <div className="label-content" onClick={() => onToggelFilterOptions("txt")}>
                        <span>Txt</span>
                        <span>{filterOptions.includes("txt") ? "▲" : "▼"}</span>
                    </div>

                    <div className="input-cell">
                        <div className="input-wrapper">
                            <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />
                        </div>
                    </div>
                </div>

                <div className={`label ${filterOptions.includes("minSeverity") ? "open" : ""}`}>

                    <div className="label-content" onClick={() => onToggelFilterOptions("minSeverity")}>
                        <span>Min Severity</span>
                        <span>{filterOptions.includes("minSeverity") ? "▲" : "▼"}</span>
                    </div>

                    <div className="input-cell">
                        <div className="input-wrapper">
                            <input value={minSeverity || ''} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
                        </div>
                    </div>
                </div>

                <button type="button" onClick={onRestFilter}>Reset</button>
            </form>
        </section >
    )
}