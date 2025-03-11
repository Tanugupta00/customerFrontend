import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Addcustomer from './customer/addCustomer';
import Toastify from './common/toastify';



function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Addcustomer/>} />
        </Routes>
        <Toastify />
      </BrowserRouter>

  );
}

export default App;