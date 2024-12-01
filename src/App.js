
import './App.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Forms from './components/forms';
import Checkbox from './components/checkbox';
function App() {
  return (
    <Router>
        <Routes>
            <Route path='' element={<Forms/>}/>
            <Route path='/box' element={<Checkbox/>}/>
        </Routes>
    </Router>
  );
}

export default App;
