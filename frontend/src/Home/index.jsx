import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(() => ({
  width: 300,
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
}));

function Home() {
  return (
    <Box textAlign="center" style={{ marginTop: '15%' }}>
      <Grid container item xs={7} spacing={2} textAlign="center">
        <Grid item xs={7}>
          <CustomButton variant="contained">Brute force</CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained">Pattern prefix trie</CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained" component={Link} to="/9">
            Suffix trie
          </CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained">Compressed suffix trie</CustomButton>
        </Grid>
        <Grid item xs={7}>
          <CustomButton variant="contained">BWT</CustomButton>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
