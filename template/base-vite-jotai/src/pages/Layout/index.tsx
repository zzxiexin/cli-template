import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/protected">Protected Page</Link>
        </li>
        <li>
          <Link to="/login">Login Page</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default Layout;
