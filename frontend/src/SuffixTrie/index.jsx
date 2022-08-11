import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import SuffixTrieGraph from '../SuffixTrieGraph';

function SuffixTrie() {
  const [genome, setGenome] = useState('');
  const [pattern, setPattern] = useState('');
  const [doStepByStep, setDoStepByStep] = useState(false);
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
              <label htmlFor="suffixTrieCheckbox">
                <input
                  type="checkbox"
                  value={doStepByStep}
                  id="suffixTrieCheckbox"
                  name="suffixTrieCheckbox"
                  onChange={(e) => setDoStepByStep(e.target.checked)}
                />
                Iscrtaj graf postupno
              </label>
            </Grid>
            <Grid item xs={7} style={{ padding: '5px' }}>
              <CustomButton variant="contained" onClick={submitForm}>
                Create Suffix Trie
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <SuffixTrieGraph genome={genome} pattern={pattern} doStepByStep={doStepByStep} />
      )}
    </>
  );
}

export default SuffixTrie;
