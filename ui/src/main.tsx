import './index.css'

import { Layout, Menu, MenuProps } from 'antd'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createHashRouter,
  RouterProvider,
  useNavigate,
  Outlet,
  useMatches,
  Navigate
} from 'react-router-dom'

const { Header, Footer, Sider, Content } = Layout

import { Graph } from './Graph'

import { HomeOutlined } from '@ant-design/icons';
import { BarChartOutlined } from '@ant-design/icons';
import { Arc } from './Arc';
import { QueryProvider } from './query'

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Visualization',
    key: 'visualization',
    icon: <BarChartOutlined />,
  },
]

const sideItems: MenuItem[] = [
  {
    label: 'Graph',
    key: 'graph',
    icon: <BarChartOutlined />,
  },
  {
    label: 'Arc',
    key: 'arc',
    icon: <BarChartOutlined />,
  },
]

const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: '3.2em',
  padding: 0,
  lineHeight: '3.2em',
  // backgroundColor: '#4096ff'
}
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  minHeight: '100vh',
  maxHeight: '100vh',
  minWidth: '100vw',
  maxWidth: '100vw'
}

const siderStyle: React.CSSProperties = {
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: 'white'
}

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  // backgroundColor: '#0958d9',
  overflow: 'hidden'
}

const footerStyle: React.CSSProperties = {
  color: '#fff',
  height: '2em',
  padding: 0
  // backgroundColor: '#4096ff'
}

function AppLayout() {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.id;
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Menu onClick={onClick} selectedKeys={[currentRouteId]} mode="horizontal" items={items} />
      </Header>
      <Layout>
        <Outlet />
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  )
}

function Visualization() {
  const matches = useMatches()
  const currentRouteId = matches[matches.length - 1]?.id;
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <>
      <Sider style={siderStyle}>
        <Menu items={sideItems} selectedKeys={[currentRouteId]} onClick={onClick} />
      </Sider>
      <Content style={contentStyle}>
        <Outlet />
      </Content>
    </>
  )
}


const router = createHashRouter([
  {
    id: 'root',
    path: '/',
    element: <AppLayout />,
    children: [
      {
        id: 'home',
        path: '/',
        element: <div>Home</div>
      },
      {
        id: 'home-redirect',
        path: '/home',
        element: <Navigate to="/" />
      },
      {
        id: 'visualization',
        path: 'visualization',
        element: <Visualization />,
        children: [
          {
            id: 'graph',
            path: 'graph',
            element: <Graph />
          },
          {
            id: 'arc',
            path: 'arc',
            element: <Arc />
          },
          {
            id: 'visualization-root',
            path: '',
            element: <Navigate to="graph" />
          },
        ]
      }
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
)
