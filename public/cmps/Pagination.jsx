const { Fragment } = React

export function Pagination({ maxPageCount, pageIdx, setPageIdx }) {

    const pages = setPageBtns(maxPageCount, pageIdx)

    function setPageBtns(maxPage, currPage) {
        var btnsCount = new Set([0, currPage])

        if (maxPage) btnsCount.add(maxPage - 1)

        if (currPage > 0) btnsCount.add(currPage - 1)
        if (currPage < maxPage - 1) btnsCount.add(currPage + 1)

        btnsCount = Array.from(btnsCount)
        btnsCount = btnsCount.sort()

        return btnsCount
    }

    function onSetPageIdx(pageIdx) {
        setPageIdx(pageIdx)
    }

    function onSetPageBydiff(diff) {
        const nextPage = pageIdx + diff
        if (nextPage < 0 || nextPage > maxPageCount - 1) return
        setPageIdx(nextPage)
    }

    return (
        <section className="pagination">
            <button disabled={pageIdx <= 0} onClick={() => { onSetPageBydiff(-1) }}>Prev</button>

            {maxPageCount > 0 &&
                pages.map((pageNum, idx) => {
                    const prevPage = pages[idx - 1]
                    const isGap = prevPage !== undefined && pageNum - prevPage > 1

                    return <Fragment key={pageNum}>
                        {isGap && <button className="gap">...</button>}
                        <button className={pageIdx === pageNum ? "active" : ""}
                            onClick={() => { onSetPageIdx(pageNum) }}>
                            {pageNum + 1}
                        </button>
                    </Fragment>

                })
            }

            <button disabled={pageIdx >= maxPageCount - 1} onClick={() => { onSetPageBydiff(1) }}>Next</button>
        </section>
    )
}