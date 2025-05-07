import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import SidebarLayout from './assets/sidebar.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (<>
    <SidebarLayout style={{ minHeight: '100vh' }}></SidebarLayout>
    
  </>
  
  )
}

export default App
