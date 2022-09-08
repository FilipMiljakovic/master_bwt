import './App.css';
import { Routes, Route } from 'react-router-dom';
// import background from './img/DNK.jpg';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Home from './Home';
import SuffixTrie from './SuffixTrie';
import BruteForce from './BruteForce';
import SuffixTrieCompressed from './SuffixTrieCompressed';
import PatternPrefixTrie from './PatternPrefixTrie';
import Bwt from './Bwt';
import SideBar from './SideBar';

function App() {
  // const myStyle = {
  //   backgroundImage: `url(${background})`,
  //   backgroundPosition: 'fixed',
  //   // background: 'url(${background}) no-repeat center center fixed',
  //   // backgroundColor: '#2813AF',
  //   fontSize: '20px',
  //   backgroundSize: 'cover',
  //   backgroundRepeat: 'no-repeat',
  // };
  return (
    <div className="App">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        style={{ backgroundColor: '#081054', color: 'white' }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Uparivanje šablona - elektronska lekcija
          </Typography>
        </Toolbar>
      </AppBar>
      <SideBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suffixtrie" element={<SuffixTrie />} />
        <Route path="/bruteforce" element={<BruteForce />} />
        <Route path="/suffixtriecompressed" element={<SuffixTrieCompressed />} />
        <Route path="/patternprefixtrie" element={<PatternPrefixTrie />} />
        <Route path="/bwt" element={<Bwt />} />
      </Routes>
    </div>
  );
}

export default App;
