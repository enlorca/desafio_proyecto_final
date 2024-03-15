/* eslint-disable no-unused-vars */
import Login from '@/components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Bookcard from './components/Bookcard';
import Productdetail from './components/Productdetail';
import Loginpage from './components/pages/Loginpage';
import Topnavbar from './components/Topnavbar';
import { ECommerceProvider } from './Context/ECommerceProvider';

function App() {
  return (
    <ECommerceProvider>
      <div className="px-4 md:px-20 flex-col space-y-8">
        <Navbar />
        {/* <Topnavbar /> */}
        {/* <Loginpage />
     <Register />
     <Bookcard />
     <Productdetail /> */}
        {/* <Carousel /> */}
      </div>
    </ECommerceProvider>
  );
}

export default App;
