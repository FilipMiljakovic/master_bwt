import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import background from './img/DNK.jpg';
import Lesion9 from './Lesion9';

function App() {
  const myStyle = {
    backgroundImage: `url(${background})`,
    height: '100vh',
    fontSize: '20px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };
  return (
    <div className="App" style={myStyle}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/9" element={<Lesion9 />} />
      </Routes>
    </div>
  );
}

export default App;
