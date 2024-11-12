import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes from '@config/router/routes';
import Layout from '@pages/Layout';
import RequireAuth from '@src/config/router/Auth/requireAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {routes?.map(({ path, element: Element, requireAuth }) => (
            <Route
              key={path}
              path={path}
              element={
                requireAuth ? (
                  <RequireAuth>
                    <Element />
                  </RequireAuth>
                ) : (
                  <Element />
                )
              }
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
