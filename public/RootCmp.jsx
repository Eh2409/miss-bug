const Router = ReactRouterDOM.BrowserRouter
const { Route, Routes } = ReactRouterDOM
const { useState } = React

import { userService } from './services/user/user-index.js'

import { UserMsg } from './cmps/UserMsg.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugEdit } from './pages/BugEdit.jsx'
import { UserDetails } from './pages/UserDetails.jsx'

export function App() {

    const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())

    return <Router>
        <div className="app-wrapper">
            <UserMsg />
            <AppHeader loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bug" element={<BugIndex loggedinUser={loggedinUser} />} />
                    <Route path="/bug/edit" element={<BugEdit />} />
                    <Route path="/bug/edit/:bugId" element={<BugEdit />} />
                    <Route path="/bug/:bugId" element={<BugDetails />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/user/:userId" element={<UserDetails loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser} />} />
                    <Route path="/user/:userId/:btnType" element={<UserDetails loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser} />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    </Router>
}
