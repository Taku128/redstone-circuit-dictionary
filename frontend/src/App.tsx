import RouterComponent from './routes/Router';
import { BrowserRouter } from 'react-router-dom';
import Header from './features/Header/pages/Header';
import './App.css';

function App() {
  const basePath = process.env.PUBLIC_URL || "/";

  return (
    <BrowserRouter basename={basePath}>
      <Header/>
      <RouterComponent/>
    </BrowserRouter>
  );
}

export default App;

