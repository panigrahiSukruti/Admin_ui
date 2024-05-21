import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Create1 from './components/Create1';
import Read from './components/Read';
// import Update from './components/Update';
function App() {
  return (
    <div className="Container">
    <BrowserRouter>
    <Routes>
      {/* <Route exact path="/" element={<Create1/>}></Route> */}
      <Route exact path="/" element={<Read/>}></Route>
      {/* <Route exact path="/update" element={<Update/>}></Route> */}
      
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
