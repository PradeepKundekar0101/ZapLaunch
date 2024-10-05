import { Outlet } from "react-router-dom";

import Layout from "./layout/CustomLayout";

const App = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default App;
