import React, { useEffect } from 'react';
import CreateForm from './components/ui/CreateForm';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Dashboard from './pages/Dashboard';
import ItemsList from './components/ui/ItemsList';
import EditForm from './components/ui/EditForm';
import Createcategory from './components/ui/Createcategory';
import ListCategory from './components/ui/ListCategory';
import EditCategory from './components/ui/EditCategory';
import Orders from './components/ui/orders';


function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} >
        <Route path="/create" element={<CreateForm />} />
        <Route path="/list" element={<ItemsList />} />
        <Route path="/editform/:id" element={<EditForm />} />
        <Route path="/createcategory" element={<Createcategory />} />
        <Route path="/listcategory" element={<ListCategory />} />
        <Route path="/editcategory/:id" element={<EditCategory />} />
        <Route path="/vieworders" element={<Orders />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
