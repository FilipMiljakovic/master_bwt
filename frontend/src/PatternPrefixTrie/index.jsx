import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import PatternPrefixTrieGraph from '../PatternPrefixTrieGraph';

function PatternPrefixTrie() {
  const [genome, setGenome] = useState('');
  const [patternList, setPatternList] = useState('');
  const [doStepByStep, setDoStepByStep] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  const submitForm = () => {
    if (genome && patternList) {
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
                id="patternList-label"
                label="Comma separated patterns"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={patternList}
                onChange={(e) => setPatternList(e.target.value)}
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
                Create Pattern Prefix Trie
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <PatternPrefixTrieGraph
          genome={genome}
          patternList={patternList}
          doStepByStep={doStepByStep}
        />
      )}
    </>
  );
}

export default PatternPrefixTrie;
