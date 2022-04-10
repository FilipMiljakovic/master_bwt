import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import pdfFile from '../pdf/Chapter_9.pdf';

const CustomButton = styled(Button)(() => ({
  width: 300,
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
  marginTop: '15px',
}));

function Home() {
  const [defaultPdfFile] = useState(pdfFile);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <Grid container>
      <Grid
        item
        xs={4}
        textAlign="center"
        style={{ marginTop: '10%', marginLeft: '10%', float: 'left' }}
      >
        <Grid item xs={7}>
          <CustomButton variant="contained" component={Link} to="/bruteforce">
            Brute force
          </CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained" component={Link} to="/patternprefixtrie">
            Pattern prefix trie
          </CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained" component={Link} to="/suffixtrie">
            Suffix trie
          </CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained" component={Link} to="/suffixtriecompressed">
            Compressed suffix trie
          </CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained" component={Link} to="/bwt">
            BWT
          </CustomButton>
        </Grid>
      </Grid>
      <Grid
        container
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
  );
}

export default Home;
