
import './App.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Forms from './components/forms';
function App() {
  return (
    <Router>
        <Routes>
            <Route path='' element={<Forms/>}/>
        </Routes>
    </Router>
  );
}

export default App;
