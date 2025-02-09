import '../../styles/signup.scss'
import { Layout} from 'antd'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useNavigate } from 'react-router-dom'
import { register } from '../../controllers/auth'

function Signup() {
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const handleSignup = async (formData) => {
        const { confirmPassword, ...data } = formData
        try {
            await register(data)
            navigate('/login')
        } catch (error) {
            if (error?.response?.status === 400) {
                    form.setFields([
                        {
                            name: 'username',
                            errors: ['Tên đăng nhập đã được sử dụng!']
                        }
                    ])
            } else {
                form.setFields([
                    {
                        name: 'full_name',
                        errors: ['Đã có lỗi xảy ra, vui lòng thử lại!']
                    }
                ])
            }
        }
    }

    return (
        <Layout className='signup-layout'>
            <div className='signup-widget'>
                <div className='signup-header'>
                    <span>Your App</span>
                </div>

                <Form
                    form={form}
                    name='signup_form'
                    onFinish={handleSignup}
                    style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px', 
                        width: '90%'
                    }}
                >
                    <Form.Item
                        name='username'
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder='Tên đăng nhập'
                            style={{height: 50}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            style={{height: 50}}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { 
                                required: true, 
                                message: 'Vui lòng nhập lại mật khẩu!' 
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve()
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'))
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập lại mật khẩu"
                            style={{height: 50}}
                        />
                    </Form.Item>

                    <Form.Item
                        name='full_name'
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ và tên!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder='Nhập họ và tên'
                            style={{height: 50}}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block style={{height: 35}}>
                            Đăng ký
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button block style={{height: 35}} onClick={() => navigate('/login')}>
                            Quay lại đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Layout>
    )
}

export default Signup