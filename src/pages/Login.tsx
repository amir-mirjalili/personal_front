import React, { useState } from 'react';
import { Form, Input, Button, message as antMessage, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = antMessage.useMessage();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await userService.login(values);
      localStorage.setItem('token', response.data.accessToken);
      messageApi.success('Login successful');

      navigate('/habits');
    } catch (error: any) {
      console.log('Login error:', error);

      // Robust error handling
      const errorMessage =
        (typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || error.response?.data?.error) ||
        error.message ||
        'Login failed';

      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#f0f2f5',
          padding: '20px',
        }}
      >
        <Card title="Login" style={{ width: 400 }}>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input type="email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;
