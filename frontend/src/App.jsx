import { HashRouter, Route, Routes } from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import Pending from './pages/Pending'
import Admin from './pages/Admin'
import Subscription from './pages/Subscription'
import Expiry from './pages/Expiry'
import Profile from './pages/Profile'
import Home from './pages/Home'
import AdminPanel from './pages/AdminPanel'
import ShowUser from './pages/ShowUser'

const App = () => {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route exact path='/' element={<Splash />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/subscription' element={<Subscription />} />
          <Route exact path='/pending' element={<Pending />} />
          <Route exact path='/expiry' element={<Expiry />} />
          <Route exact path='/admin' element={<Admin />} />
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/active' element={<Home />} />
          <Route exact path='/admin_panel' element={<AdminPanel />} />
          <Route exact path='/show_user' element={<ShowUser />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App
