import RouterComponent from './routes/Router';
import { BrowserRouter } from 'react-router-dom';
import Header from './features/Header/pages/Header';

function App() {
  return (
    <BrowserRouter >
      <Header/>
      <RouterComponent/>
    </BrowserRouter>
  );
}

export default App;

