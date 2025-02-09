import '../../styles/login.scss'
import { Layout } from 'antd'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import { login } from '../../controllers/auth'

function Login() {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    
    const handleLogin = async (formData) => {
        try {
            await login(formData)
            localStorage.setItem('isAuthenticated', '1')
            window.location.href = '/'
        } catch (error) {
            if (error.response && error.response.status === 401) {
                form.setFields([
                    {
                        name: 'password',
                        errors: ['Tài khoản hoặc mật khẩu không chính xác']
                    }
                ])
            } else {
                form.setFields([
                    {
                        name: 'password',
                        errors: [error.message]
                    }
                ])
            }
        }
    }
    
    return (
        <Layout className='login-layout'>
            <div className='login-widget'>
                <div className='login-header'>
                    <span>Your App</span>
                </div>

                <Form
                    form={form}
                    name='login_form'
                    onFinish={handleLogin}
                    style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '90%' }}
                >
                    <Form.Item
                        name='username'
                        rules={[
                            { 
                                required: true, 
                                message: 'Vui lòng nhập tên đăng nhập!' 
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder='Tên đăng nhập'
                            style={{ height: 50 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { 
                                required: true, 
                                message: 'Vui lòng nhập mật khẩu!' 
                            }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            style={{ height: 50 }}
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block style={{ height: 35 }}>
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button block style={{ height: 35 }} onClick={() => navigate('/signup')}>
                            Tạo tài khoản mới
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Layout>
    )
}

export default Login