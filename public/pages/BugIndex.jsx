const { useState, useEffect, useRef } = React
const { useSearchParams, Link } = ReactRouterDOM

import { bugService } from '../services/bug/index.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugFilter } from '../cmps/bug/BugFilter.jsx'
import { BugList } from '../cmps/bug/BugList.jsx'
import { BugLoader } from '../cmps/bug/BugLoader.jsx'
import { BugSort } from '../cmps/bug/BugSort.jsx'
import { Pagination } from '../cmps/Pagination.jsx'
import { utilService } from '../services/util.service.js'

export function BugIndex({ loggedinUser }) {

    const [bugs, setBugs] = useState(null)

    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState(bugService.getFilterFromSearchParams(searchParams))

    const [maxPageCount, setMaxPageCount] = useState(0)
    const [isFirstRender, setIsFirstRender] = useState(true)

    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(null)
    const [activeFilterOptionsCount, setActiveFilterOptionsCount] = useState(0)

    const [isbugsLoading, setIsbugsLoading] = useState({ isLoading: false, isFiretTime: true })

    useEffect(() => {
        setSearchParams(utilService.cleanSearchParams(filterBy))
        onCountActiveFilterOptions(filterBy)
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        const start = performance.now()
        setIsbugsLoading(prev => ({ ...prev, isLoading: true }))

        bugService.query(filterBy)
            .then(({ bugs, maxPageCount }) => {
                setBugs(bugs)
                setMaxPageCount(maxPageCount)

                const end = performance.now()
                const duration = ((end - start) / 1000).toFixed(2)

                if (isbugsLoading.isFiretTime && +duration < 0.5) {
                    setTimeout(() => {
                        setIsbugsLoading(prev => ({ isLoading: false, isFiretTime: false }))
                    }, 500)
                } else if (isbugsLoading.isFiretTime) {
                    setIsbugsLoading(prev => ({ isLoading: false, isFiretTime: false }))
                } else {
                    setIsbugsLoading(prev => ({ ...prev, isLoading: false }))
                }

            })
            .catch(err => {
                showErrorMsg(`Couldn't load bugs - ${err}`)
                setIsbugsLoading(prev => ({ isLoading: false, isFiretTime: false }))
            })

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
            ...prevFilter, ...filterBy,
            pageIdx: isFirstRender ? prevFilter.pageIdx : (prevFilter.pageIdx !== undefined ? 0 : undefined)
        }))

        if (isFirstRender) {
            setIsFirstRender(false)
        }
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
                    {loggedinUser && <Link to='/bug/edit' className='btn'>Add Bug</Link>}
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


        {bugs && !isbugsLoading.isLoading ? <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            loggedinUser={loggedinUser}
        />
            : <BugLoader />
        }

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
