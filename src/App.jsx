import { useState } from 'react';
import { ConfigProvider } from 'antd'; // Import ConfigProvider
import SidebarLayout from './assets/sidebar.jsx'; // Assuming your Sidebar is a custom component
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    // Wrap your app with ConfigProvider and enable dark mode
    <ConfigProvider theme={{ mode: 'dark' }}>
      <SidebarLayout style={{ minHeight: '100vh' }} />
    </ConfigProvider>
  );
}

export default App;
