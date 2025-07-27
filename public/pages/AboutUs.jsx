export function AboutUs() {
    return <section className="about-us">
        <h2>About Us</h2>

        <div className="box">
            <img src="./../assets/img/7.png" alt="bug" className="bug-img" />
            <div>
                <p>Welcome to Miss Bug – your one-stop solution for reporting, managing, and tracking software issues with ease and efficiency. </p>
                <p>Built for developers, testers, and product teams, our platform simplifies the full CRUDL (Create, Read, Update, Delete, List) cycle of bug reports.
                </p>
                <p>We believe that clarity and collaboration are the keys to great software. That’s why we designed Miss Bug to be fast, user-friendly, and customizable to fit any project – big or small.
                </p>
            </div>
        </div>

        <div className="box-grid">
            <div className="box full-size">
                Why Miss Bug?
            </div>
            <div className="box">
                <img src="./../assets/img/logo.png" alt="bug" className="bug-img" />
                <div>
                    <h4>Lightning-Fast Workflow</h4>
                    <p>Submit, update, or remove bug reports with just a few clicks.</p>
                </div>
            </div>
            <div className="box">
                <img src="./../assets/img/logo.png" alt="bug" className="bug-img" />
                <div>
                    <h4>Smart Filtering & Search</h4>
                    <p>Find bugs based on severity or text in seconds.</p>
                </div>
            </div>
            <div className="box">
                <img src="./../assets/img/logo.png" alt="bug" className="bug-img" />
                <div>
                    <h4>Built With Developers in Mind</h4>
                    <p>Designed for real-world usage – minimal clutter, maximum focus.</p>
                </div>
            </div>
            <div className="box">
                <img src="./../assets/img/logo.png" alt="bug" className="bug-img" />
                <div>
                    <h4>Always Improving</h4>
                    <p>Miss Bug is constantly evolving. Got ideas? We’re listening.</p>
                </div>
            </div>
        </div>

        <div className="box last">
            <img src="./../assets/img/logo.png" alt="bug" className="bug-img" />
            <p>Our mission is to empower teams to build better software by making bug reporting intuitive and efficient. Whether you're a solo developer or a large organization, we provide the tools you need to keep your product stable and your users happy.</p>
        </div>

    </section>
}