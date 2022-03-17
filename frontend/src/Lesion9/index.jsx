import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Graph from '../Graph';

function Lesion9() {
  const [genome, setGenome] = useState('');
  const [pattern, setPattern] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const submitForm = () => {
    if (genome && pattern) {
      setShowGraph(true);
    }
  };

  const CustomButton = styled(Button)(() => ({
    height: 50,
    backgroundColor: '#00FFFF',
    color: '#191970',
  }));

  return (
    <>
      {!showGraph ? (
        <Box textAlign="center" style={{ marginTop: '20%' }}>
          <Grid container spacing={2} textAlign="center">
            <Grid item xs={7} textAlign="center">
              <TextField
                id="genome-label"
                label="Genome"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={genome}
                onChange={(e) => setGenome(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} textAlign="center">
              <TextField
                id="pattern-label"
                label="Pattern"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </Grid>
            <Grid item xs={7}>
              <CustomButton variant="contained" onClick={submitForm}>
                Create Suffix Trie
              </CustomButton>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Graph genome={genome} pattern={pattern} />
      )}
    </>
  );
}

export default Lesion9;
