const { useState, useEffect, useRef } = React
const { Link } = ReactRouterDOM

import { bugService } from '../services/bug/index.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/bug/BugFilter.jsx'
import { BugList } from '../cmps/bug/BugList.jsx'
import { BugSort } from '../cmps/bug/BugSort.jsx'
import { Pagination } from '../cmps/Pagination.jsx'

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [maxPageCount, setMaxPageCount] = useState(0)

    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(null)
    const [activeFilterOptionsCount, setActiveFilterOptionsCount] = useState(0)

    useEffect(() => {
        onCountActiveFilterOptions(filterBy)
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(({ bugs, maxPageCount }) => {
                setBugs(bugs)
                setMaxPageCount(maxPageCount)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({
            ...prevFilter, ...filterBy
            , pageIdx: prevFilter.pageIdx !== undefined ? 0 : undefined
        }))
    }

    function setPageIdx(pageNum) {
        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageNum }))
    }

    function onMakePdf() {
        bugService.createPdf()
            .then(blob => {
                const url = window.URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.href = url
                a.download = 'bugs-report.pdf'
                document.body.appendChild(a)
                a.click()
                a.remove()

                window.URL.revokeObjectURL(blob)
                showSuccessMsg('PDF download started!')
            })
            .catch((err) =>
                showErrorMsg(`Failed to generate PDF`, err))
    }

    // filter popup

    function toggleIsFilterPopupOpen() {
        setIsFilterPopupOpen(!isFilterPopupOpen)
    }

    function onCountActiveFilterOptions(filter) {

        const count = Object.entries(filter).filter(([key, val]) => {
            if (key === 'sortType' || key === 'dir' || key === 'pageIdx') return
            if (key === 'labels') return Array.isArray(val) && val.length > 0
            else return val
        }).length

        setActiveFilterOptionsCount(count)
    }

    function togglePagination({ target }) {
        const pageIdx = target.checked ? 0 : undefined

        setFilterBy(prevFilter => ({ ...prevFilter, pageIdx: pageIdx }))
    }

    const { txt, minSeverity, labels, sortType, dir, pageIdx } = filterBy

    return <section className="bug-index">

        <header>
            <div className="bug-toolbar">

                <div className="btns">
                    <Link to='/bug/edit'><button>Add Bug</button></Link>
                    <button onClick={onMakePdf} title="create bugs pdf">
                        <img src="../assets/img/pdf.svg" alt="pdf" className="icon" />
                    </button>
                </div>

                <div className='filter-options'>
                    <BugSort sortBy={{ sortType, dir }} onSetFilterBy={onSetFilterBy} />
                    <button className="bug-filter-btn" onClick={toggleIsFilterPopupOpen}>
                        Filter {activeFilterOptionsCount > 0 ? `(${activeFilterOptionsCount})` : ''}
                    </button>
                </div>


                <div className={`bug-filter-black-wrapper ${isFilterPopupOpen ? "open" : ""}`} onClick={toggleIsFilterPopupOpen}>
                    <BugFilter
                        filterBy={{ txt, minSeverity, labels, }}
                        onSetFilterBy={onSetFilterBy}
                        toggleIsFilterPopupOpen={toggleIsFilterPopupOpen}
                    />
                </div>
            </div>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug} />

        {bugs && !bugs.length && <div className='no-bug-msg'>No Bugs found</div>}

        {(maxPageCount !== 0 && pageIdx !== undefined) && < Pagination
            maxPageCount={maxPageCount}
            pageIdx={pageIdx}
            setPageIdx={setPageIdx}
        />}

        {bugs && bugs.length > 0 && <div className='Pagination-toggle'>
            <span>{pageIdx !== undefined ? 'Pagination: On' : 'Pagination: Off'}</span>
            <label className="switch">
                <input type="checkbox" checked={pageIdx !== undefined} onChange={togglePagination} />
                <span className="slider round"></span>
            </label>
        </div>}

    </section>
}
