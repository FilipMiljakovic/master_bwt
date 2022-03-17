import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Graph from '../Graph';

function Home() {
  const [genome, setGenome] = useState('');
  const [pattern, setPattern] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const submitForm = () => {
    setShowGraph(true);
  };

  return (
    <>
      {!showGraph ? (
        <Box textAlign="center" style={{ marginTop: '20%' }}>
          <Grid container spacing={2} textAlign="center">
            <Grid item xs={8} textAlign="center">
              <TextField
                id="genome-label"
                label="Genome"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={genome}
                onChange={(e) => setGenome(e.target.value)}
              />
            </Grid>
            <Grid item xs={8} textAlign="center">
              <TextField
                id="pattern-label"
                label="Pattern"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </Grid>
            <Grid item xs={8}>
              <Button variant="contained" onClick={submitForm}>
                Create Suffix Trie
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Graph genome={genome} pattern={pattern} />
      )}
    </>
  );
}

export default Home;
