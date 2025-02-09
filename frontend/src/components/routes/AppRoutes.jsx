import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setUser, setIsLoading, deleteState } from "../../redux/authSlice"
import { fetchUserInfo } from "../../controllers/user"
import { refresh } from "../../controllers/auth"
import Login from "../pages/Login"
import { logout } from "../../controllers/auth"
import Signup from "../pages/Signup"
import ProtectedRoute from "./ProtectedRoute"
import UserHome from "../pages/UserHome"
import AdminHome from "../pages/AdminHome"
import Unauthorized from "../pages/Unauthorized"
import { Spin } from 'antd'
import {LoadingOutlined} from '@ant-design/icons'

function AppRoutes() {
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.auth.isLoading)

    useEffect(() => {
        const handleLogout = async () => {
            dispatch(deleteState())
            await logout()
        }

        const fetchData = async () => {
            try {
                const response = await fetchUserInfo()
                dispatch(setUser(response.data))
            } catch {
                try {
                    await refresh()
                    const response = await fetchUserInfo()
                    dispatch(setUser(response.data))
                } catch {
                    await handleLogout()
                    localStorage.removeItem('isAuthenticated')
                    window.location.reload()
                }
            } finally {
                dispatch(setIsLoading(false))
            }
        }
        if (!localStorage.getItem('isAuthenticated')) {
            handleLogout()
        } else {
            fetchData()
        }
    }, [dispatch])

    const user = useSelector(state => state.auth.user)
    const role = user?.role || null

    if (isLoading) {
        return <Spin style={{height: '100vh', width: '100vw'}} indicator={<LoadingOutlined />} />
    }

    if (!localStorage.getItem('isAuthenticated')) {
        return (
            <Routes>
                <Route path="/*" element={<Navigate to='/login' />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
            </Routes>
        )
    }

    if (role === 'admin') {
        return (
            <Routes>
                <Route path='/' element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminHome />
                    </ProtectedRoute>
                } />
                <Route path="/home" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminHome />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/signup" element={<Navigate to="/" />} />
                <Route path="*" element={<Unauthorized />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path="/" element={
                <ProtectedRoute allowedRoles={['user']}>
                    <UserHome />
                </ProtectedRoute>
            }/>
            <Route path="/home" element={
                <ProtectedRoute allowedRoles={['user']}>
                    <UserHome />
                </ProtectedRoute>
            }/>
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            
            <Route path="*" element={<Unauthorized />} />
        </Routes>
    )
}

export default AppRoutes
