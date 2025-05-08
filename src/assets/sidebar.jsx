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
import InstitutionsTable from './institutions table';
import InternshipTrack from './internshipTrack';
import bgImage from './photo-1530533718754-001d2668365a.jpg';

// const items1 = ['1', '2', '3'].map(key => ({
//   key,
//   label: `nav ${key}`,
// }));

import InternshipTable from './internship';;

const items2 = [
  { icon: UserOutlined, label: 'Student', path: '/user' },
  { icon: PayCircleOutlined, label: 'Providers', path: '/provider' },
  { icon: ReadOutlined, label: 'Institutions', path: '/Institutions' },
  { icon: ReadOutlined, label: 'Applications', path: '/internship_status' },
  { icon: ReadOutlined, label: 'Internship Track', path: '/internshipTracking' }
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
  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -2,
  };
  
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
    zIndex: -1,
  };
  
  const contentStyle = {
    position: 'relative',
    zIndex: 0,
  };
  


  return (
    <Layout
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <Header style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center' }}>
        <Avatar
          size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 60 }}
          icon={<AntDesignOutlined />}
        />
        <h3 style={{ color: 'white', marginLeft: '20px' }}>Internship Tracker</h3>
      
      </Header>
      <div style={{ padding: '0 48px' }}>
      <Breadcrumb style={{ margin: '16px 0', color: 'white' }}>
    <Breadcrumb.Item style={{ color: 'white' }}>Login</Breadcrumb.Item>
    <Breadcrumb.Item style={{ color: 'white' }}>Authentication</Breadcrumb.Item>
    <Breadcrumb.Item style={{ color: 'white' }}>Internship-Tracker</Breadcrumb.Item>
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
          <Content style={{ padding: '0 24px', minHeight: "75vh ", background: 'rgba(255,255, 255, 0.3)'}}>
            <Routes>


              <Route path="/user" element={<StudentTable/>} />
              <Route path="/provider" element={<ProvidersTable />} />
              <Route path="/Institutions" element={<InstitutionsTable/>} />
              <Route path="/internship_status" element={<InternshipTable/>} />
              <Route path="/internshipTracking" element={<InternshipTrack/>} />
              <Route path="*" element={<p>Select a menu option</p>} />



            </Routes>
          </Content>
        </Layout>
      </div>
      <Footer style={{ textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>
        Internship Tracker ©{new Date().getFullYear()} Created by Sanan, Suleman and Sheheryar
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
