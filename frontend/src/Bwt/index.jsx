import React, { useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import BwtVisual from '../BwtVisual';

function Bwt() {
  const [genome, setGenome] = useState('');
  const [pattern, setPattern] = useState('');
  const [mistake, setMistake] = useState(0);
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
        <Grid container>
          <Grid
            item
            xs={4}
            textAlign="center"
            style={{ marginTop: '10%', marginLeft: '10%', float: 'left' }}
          >
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <TextField
                id="genome-label"
                label="Genome"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={genome}
                onChange={(e) => setGenome(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <TextField
                id="pattern-label"
                label="Pattern"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <TextField
                id="mistake-label"
                label="Mistake"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={mistake}
                onChange={(e) => setMistake(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} style={{ padding: '5px' }}>
              <CustomButton variant="contained" onClick={submitForm}>
                Run Bwt
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <BwtVisual genome={genome} pattern={pattern} mistake={mistake} />
      )}
    </>
  );
}

export default Bwt;
