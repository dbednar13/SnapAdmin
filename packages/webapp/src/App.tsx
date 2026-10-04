import { BrowserRouter } from 'react-router';

import { RoutedApp } from '@components/routing/routedApp';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}

export default App;
