import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

function returnIndexArray(genome, pattern) {
  const indexArray = [];
  for (let i = 0; i < genome.length; i += 1) {
    for (let j = 0; j < pattern.length; j += 1) {
      if (genome.charAt(i + j) !== pattern.charAt(j)) {
        break;
      }
      if (j === pattern.length - 1) {
        indexArray.push(i);
      }
    }
  }
  return indexArray;
}

function BruteForceVisual({ genome, pattern }) {
  const [indexArray, setIndexArray] = useState([]);

  useEffect(() => {
    setIndexArray(returnIndexArray(genome, pattern));
  }, []);

  const renderedOutputResults = indexArray
    ? indexArray.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item key={index}>
          <div style={{ color: '#00FFFF', padding: '6px' }}>
            {index === indexArray.length - 1 ? item : `${item}, `}
          </div>
        </Grid>
      ))
    : 'Error!!!';

  let renderedOutputGenome = genome
    ? [...genome].map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item textAlign="center" key={index}>
          <div style={{ padding: '6px' }}>{index}</div>
          <div style={{ padding: '6px' }}>{item}</div>
        </Grid>
      ))
    : 'Error!!!';

  useEffect(() => {
    indexArray.forEach((element) => {
      // TODO: Hocu da promenim nacin renderovanja ovog renderedOutputGenome.
      // Ali kad se izvrsi ovaj useEffect ne radi se rerender opet, da li ovo treba da bude u state-u?
      renderedOutputGenome = `aca${element}`;
    });
  }, [indexArray]);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={10}
        style={{ margin: '10% 10% 10% 0', paddingLeft: '5%', color: '#FFFFFF', fontSize: '50px' }}
      >
        <Stack direction="row" spacing={2}>
          {renderedOutputGenome}
        </Stack>
        <div style={{ margin: '20px 0', fontSize: '60px' }}>{pattern}</div>
        <Stack direction="row" spacing={2}>
          {renderedOutputResults}
        </Stack>
      </Grid>
    </Grid>
  );
}

export default BruteForceVisual;
