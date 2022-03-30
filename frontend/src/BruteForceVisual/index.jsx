import React from 'react';
import Grid from '@mui/material/Grid';

function BruteForceVisual({ genome, pattern }) {
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={10}
        style={{ margin: '15% 20% 20% 0', paddingLeft: '5%', color: '#FFFFFF', fontSize: '50px' }}
      >
        <div>{genome}</div>
        <div>{pattern}</div>
      </Grid>
    </Grid>
  );
}

export default BruteForceVisual;
