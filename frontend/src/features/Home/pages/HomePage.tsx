import RouterComponent from '../../../routes/Router';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../Header/pages/Header';


function HomePage() {
    return (
        <BrowserRouter >
          <Header/>
          <RouterComponent/>
        </BrowserRouter>
      );
}

export default HomePage;
