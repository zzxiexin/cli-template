import Login from '@src/pages/Login';
import Protected from '@src/pages/Protected';

const routes = [
  {
    path: '/login',
    element: Login,
  },
  {
    path: '/protected',
    element: Protected,
    requireAuth: true,
  },
];

export default routes;
