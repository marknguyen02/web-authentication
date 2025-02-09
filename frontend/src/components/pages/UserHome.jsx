import '../../styles/user-home.scss'
import { logout, logoutAll } from '../../controllers/auth.js'
import { useSelector } from 'react-redux'

function UserHome() {
    const fullName = useSelector(state => state.auth.user).full_name

    const handleLogout = async () => {
        try {
            await logout()
            localStorage.removeItem('isAuthenticated')
        } catch (error) {
            console.log(error.message);
        } finally {
            window.location.reload()
        }
    }

    const handleLogoutAll = async () => {
        try {
            await logoutAll()
            localStorage.removeItem('isAuthenticated')
        } catch (error) {
            console.log(error.message);
        } finally {
            window.location.reload()
        }
    }

    return (
        <div className='user-home-container'>
            <h1 style={{color: 'white'}}>Hello {fullName}!</h1>
            <h1 style={{color: 'white'}}>This is user home page.</h1>
            <button className='user-home-logout-button' onClick={handleLogout}>Logout</button>
            <button className='user-home-logout-button' onClick={handleLogoutAll}>Logout all</button>
        </div>
    )
}

export default UserHome