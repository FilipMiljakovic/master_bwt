import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const CustomButton = styled(Button)(() => ({
  width: 300,
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
  marginTop: '15px',
}));

function Home() {
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
    </Grid>
  );
}

export default Home;
