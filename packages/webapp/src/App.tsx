import { RouterProvider, createBrowserRouter } from 'react-router';

import { RoutedApp } from '@components/routing/routedApp';

import './App.css';

const router = createBrowserRouter([
  {
    path: '*',
    element: <RoutedApp />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
