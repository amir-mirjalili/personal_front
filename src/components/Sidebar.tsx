import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AppstoreOutlined,
  CheckSquareOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import React from 'react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/habits',
      icon: <CheckSquareOutlined />,
      label: <Link to="/habits">Habits</Link>,
    },
    {
      key: '/tasks',
      icon: <BookOutlined />,
      label: <Link to="/tasks">Tasks</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div style={{ height: '100%', padding: '16px 0' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
      />
    </div>
  );
};

export default Sidebar;
