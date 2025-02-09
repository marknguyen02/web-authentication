import { useSelector } from "react-redux"
import Unauthorized from "../pages/Unauthorized"
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user)

  if (!user) {
    return <Spin style={{height: '100vh', width: '100vw'}} indicator={<LoadingOutlined />} />
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Unauthorized />
  }

  return children
}

export default ProtectedRoute