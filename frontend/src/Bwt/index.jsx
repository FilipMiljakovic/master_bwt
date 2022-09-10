import React, { useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
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
        <Grid style={{ marginLeft: '300px', marginTop: '100px' }}>
          <h1 style={{ textAlign: 'center' }}>Barouz-Vilerova transformacija</h1>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Typography paragraph>
              Kako bi se smanjila količina memorije potrebna za rešavanje ovog problema, posegnućemo
              istraživanjima nekih drugih pristupa. Jedan od njih je kompresija niski velikih
              dužina. U kompresiji genoma možemo razlikovati dva slučaja: kada imamo nekoliko
              uzastopnih ponavljanja jedne aminokiseline (to nazi-vamo ranovima : runs) i kada imamo
              nekoliko uzastopnih ponavljanja niza aminokiselina (to nazivamo ripitima : repeats).
              Ranove možemo k uzastopnih pojavljivanja jedne aminokiseline kodirati brojem k i
              oznakom aminokiseline koja se pojavljuje.
            </Typography>
            <img src="" alt="Konvertovanje ranova" />
            <Typography paragraph>
              Problem je što kod genoma nemamo mnogo ranova, ali imamo dosta ripita. Zato bi bilo
              dobro kada bismo imali tehniku kojom bismo konvertovali ripite u ranove i na to
              primenili prethodno opisanu tehniku za kodiranje ranova. Algoritam koji rešava
              konverziju ripita u ranove je Barouz-Vilerova transforma- cija.
            </Typography>
            <Typography paragraph>
              Na ovoj stranici je dostupna forma u koju možemo uneti primer genoma i paterna, ali i
              polje za unos broja nepoklapanja koja tolerišemo kako bismo prikazali i približno
              uparivanje šablona ovim pristupom. Za takav unos klikom na dugme `Pokreni BWT
              algoritam` otvaramo novu stranicu na kojoj će biti prikazano generisanje
              Barouz-Vilerove transformacije, inverzne Barouz-Vilerove transformacije i uparivanje
              šablona pomoću ove transformacije za vrednosti unete u formu. Više objašnjenja biće
              prikazano na narednoj stranici dostupnoj nakon pokretanja.
            </Typography>
          </Box>
          <Grid container textAlign="center" style={{ margin: '5% 0', float: 'left' }}>
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <TextField
                id="genome-label"
                label="Genom"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={genome}
                onChange={(e) => setGenome(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <TextField
                id="pattern-label"
                label="Patern"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <TextField
                id="mistake-label"
                label="Broj dozvoljenih grešaka"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={mistake}
                onChange={(e) => setMistake(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} style={{ padding: '5px' }}>
              <CustomButton variant="contained" onClick={submitForm}>
                Pokreni BWT algoritam
              </CustomButton>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <BwtVisual genome={genome} pattern={pattern} mistake={mistake} setMistake={setMistake} />
      )}
    </>
  );
}

export default Bwt;
