import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import { Layout, Menu } from "antd";
import "./App.css";

import PropertyList from "./pages/property-setup/PropertyList";

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
            <Menu.Item key="1">
              <Link to="/properties/setup">Setup Properties</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content
          className="site-layout"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <Switch>
            <Redirect exact from="/" to="/home" />
            <Route exact path="/properties/setup" component={PropertyList} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
