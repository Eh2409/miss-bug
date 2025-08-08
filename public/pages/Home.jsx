const { Link } = ReactRouterDOM

export function Home() {

    return <section className="full-width  home-page">

        <div className="animated-bg"></div>

        <div className="main-content ">
            <div className="home-page-content">

                <h2>View and organize your Bugs</h2>
                <Link to="/bug" className='btn view-bug'>View Bugs</Link>

            </div>
            <img src="./../assets/img/7.png" alt="bug" className="bug-img" />
        </div>

    </section>
}