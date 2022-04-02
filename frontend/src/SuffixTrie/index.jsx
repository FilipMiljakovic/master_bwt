import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import SuffixTrieGraph from '../SuffixTrieGraph';

import pdfFile from '../pdf/Chapter_9.pdf';

function SuffixTrie() {
  const [genome, setGenome] = useState('');
  const [pattern, setPattern] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [defaultPdfFile] = useState(pdfFile);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

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
            <Grid item xs={7} style={{ padding: '5px' }}>
              <CustomButton variant="contained" onClick={submitForm}>
                Create Suffix Trie
              </CustomButton>
            </Grid>
          </Grid>
          <Grid
            item
            spacing={2}
            style={{
              borderRadius: '25px',
              border: '2px solid #00FFFF',
              padding: '20px',
              width: '650px',
              height: '650px',
              marginTop: '20px',
              float: 'left',
            }}
          >
            {defaultPdfFile && (
              <>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={defaultPdfFile}
                    plugins={[defaultLayoutPluginInstance]}
                    style={{ width: '650px', height: '650px' }}
                    initialPage={4}
                    theme={{
                      theme: 'dark',
                    }}
                  />
                </Worker>
              </>
            )}

            {!defaultPdfFile && <>No pdf file selected</>}
          </Grid>
        </Grid>
      ) : (
        <SuffixTrieGraph genome={genome} pattern={pattern} />
      )}
    </>
  );
}

export default SuffixTrie;
