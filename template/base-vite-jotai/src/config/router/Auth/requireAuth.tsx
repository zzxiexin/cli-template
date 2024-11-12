import { useLocation, Navigate } from 'react-router-dom';
import userInfo from '@store/index';
import { useAtom } from 'jotai';
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const [auth] = useAtom(userInfo);
  console.log(auth)
  const location = useLocation();

  if (!auth.name) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
