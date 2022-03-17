import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import background from './img/DNK.jpg';
import Lesion9 from './Lesion9';

function App() {
  const myStyle = {
    backgroundImage: `url(${background})`,
    height: '109vh',
    marginTop: '-70px',
    fontSize: '50px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  };
  return (
    <div className="App" style={myStyle}>
      {/* <header className="App-header" /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/9" element={<Lesion9 />} />
        {/* <Route path="/trie" element={<Graph />} /> */}
      </Routes>
    </div>
  );
}

export default App;
