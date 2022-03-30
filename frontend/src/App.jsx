import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import background from './img/DNK.jpg';
import SuffixTrie from './SuffixTrie';
import BruteForce from './BruteForce';

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
        <Route path="/suffixtrie" element={<SuffixTrie />} />
        <Route path="/bruteforce" element={<BruteForce />} />
      </Routes>
    </div>
  );
}

export default App;
