import React, { useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import BruteForceVisual from '../BruteForceVisual';

function BruteForce() {
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
    backgroundColor: '#081054',
    color: 'white',
    textTransform: 'none',
    fontSize: '20px',
  }));

  return (
    <>
      {!showGraph ? (
        <Grid style={{ marginLeft: '300px', marginTop: '100px' }}>
          <h1 style={{ textAlign: 'center' }}>Iterativni algoritam</h1>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Typography paragraph>
              Pristup koji prvo pada na pamet za rešavanje problema uparivanja šablona je iterativni
              pristup kojim se linearno prolazi kroz genom i proverava da li se dati šablon poklapa
              sa podniskom genoma iste dužine, a koja počinje na toj poziciji.
            </Typography>
            <img
              style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}
              alt="Poklapanje podsekvenci"
              src="/img/ocitavanje_genoma.png"
            />
            <Typography paragraph>
              Na ovoj stranici je dostupna forma u koju možemo uneti primer genoma i paterna i za
              takav unos klikom na dugme `Pokreni algoritam` pokrenemo postupno izvršavanje
              iterativnog algoritma. Više objašnjenja o samom izvršavanju algoritma biće prikazano
              na narednoj stranici dostupnoj nakon pokretanja.
            </Typography>
          </Box>
          <Grid
            container
            textAlign="center"
            style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '50%' }}
          >
            <Grid
              item
              xs={7}
              textAlign="center"
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                padding: '5px',
              }}
            >
              <TextField
                id="genome-label"
                label="Genom"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={genome}
                onChange={(e) => setGenome(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={7}
              textAlign="center"
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                padding: '5px',
              }}
            >
              <TextField
                id="pattern-label"
                label="Patern"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={7}
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                padding: '5px',
              }}
            >
              <CustomButton variant="contained" onClick={submitForm}>
                Pokreni algoritam
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <BruteForceVisual genome={genome} pattern={pattern} />
      )}
    </>
  );
}

export default BruteForce;
