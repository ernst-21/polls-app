import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';
import Navbar from './core/Navbar';
import { Layout } from 'antd';
import FooterComponent from './core/Footer';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout className="layout">
      <BrowserRouter>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <Navbar />
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <MainRouter />
        </Content>
      </BrowserRouter>
      <FooterComponent />
    </Layout>
  );
}

export default App;
