// App.jsx
import React, { useState, useEffect } from 'react';
import { AntDesignOutlined, PayCircleOutlined, ReadOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentTable from './studentTable';
const { Header, Content, Footer, Sider } = Layout;
import ProvidersTable from './providerstable';
// const items1 = ['1', '2', '3'].map(key => ({
//   key,
//   label: `nav ${key}`,
// }));

const items2 = [
  { icon: UserOutlined, label: 'Student', path: '/user' },
  { icon: PayCircleOutlined, label: 'Providers', path: '/provider' },
  { icon: ReadOutlined, label: 'Institutions', path: '/Institutions' },
].map((item, index) => ({
  key: item.path,
  icon: React.createElement(item.icon),
  label: item.label,
}));

// Dummy pages
const UserPage = () => <h2>User Page</h2>;
const LaptopPage = () => <h2>Laptop Page</h2>;
const NotificationPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/posts/1')
      .then(response => {
        setData(response.data);
        setLoading(false);
      }).catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return loading ? (
    <p>Loading...</p>
  ) : error ? (
    <p style={{ color: 'red' }}>Error: {error}</p>
  ) : (
    <div>
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </div>
  );
};

// App Layout with Routing
const AppLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" style={{ height: `5em` }} />
        <Avatar
    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
    icon={<AntDesignOutlined />}
  /><h3 style={{ color: 'white', marginLeft: '20px' }}>Internship Tracker</h3>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <div style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Login</Breadcrumb.Item>
          <Breadcrumb.Item>Authentication</Breadcrumb.Item>
          <Breadcrumb.Item>Internship-Tracker</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['/user']}
              style={{ height: '100%' }}
              items={items2}
              onClick={({ key }) => navigate(key)} // handle navigation
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: "75vh "}}>
            <Routes>


              <Route path="/user" element={<StudentTable/>} />
              <Route path="/provider" element={<ProvidersTable />} />
              <Route path="/notification" element={<NotificationPage />} />
              <Route path="*" element={<p>Select a menu option</p>} />



            </Routes>
          </Content>
        </Layout>
      </div>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

// Main App with Router
const App = () => (
  <Router>
    <AppLayout />
  </Router>
);

export default App;
