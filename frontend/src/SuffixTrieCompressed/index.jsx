import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Checkbox } from '@mui/material';
import SuffixTrieCompressedGraph from '../SuffixTrieCompressedGraph';

function SuffixTrieCompressed() {
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
    backgroundColor: '#081054',
    color: 'white',
    textTransform: 'none',
    fontSize: '20px',
  }));

  return (
    <>
      {!showGraph ? (
        <Grid style={{ marginLeft: '300px', marginTop: '100px' }}>
          <h1 style={{ textAlign: 'center' }}>Kompresovana sufiksna stabla</h1>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Typography paragraph>
              Sufiksna stabla zauzimaju memoriju koja je proporcionalna kvadratu dužine genoma. S
              obzirom da genomi mogu imati nekoliko milijardi karaktera, to znači da ove strukture
              traže ogromne prostorne resurse. Možemo značajno smanjiti broj grana i čvorova u
              sufiksnom stablu tako što ćemo sve grane u putanjama koje se ne račvaju (ulazni i
              izlazni stepen čvorova je 1) spojiti u jednu granu. Tada će oznake grana biti spojeni
              karakteri po tim putanjama. Do uštede memorije u ovom slučaju dolazi zato što ne
              moramo da čuvamo spojene karaktere grana koje se ne račvaju, već možemo da čuvamo samo
              indeks u genomu gde ta niska počinje i njenu dužinu.
            </Typography>
            <Typography paragraph>
              Iako ovako kompresovano sufiksno stablo značajno smanjuje memorijske zahteve, sa
              O(|Genom|<sup>2</sup>) na O(|Genom|), prosečno nam i dalje treba oko 20 puta |Genom|
              memorije. U ovom slučaju, gde ljudski genom ima 3GB, 60GB RAM-a ovim pristupom je
              veliko unapređenje u odnosu na 1TB.
            </Typography>
            <Typography paragraph>
              Na ovoj stranici je dostupna forma u koju možemo uneti primer genoma i šablona. Takođe
              imamo i opciju da štikliranjem checkbox-a `Iscrtaj graf postupno` kreiranje grafa na
              narednoj stranici izvršimo postupno. U sličaju da pomenuti checkbox nije štikliran
              stablo će biti automatski kreirano i odmah će se krenuti sa pronalaženjem rešenja, tj.
              uparivanjem unetog šablona. Za takav unos klikom na dugme `Pokreni algoritam`
              pokrenemo postupno izvršavanje ovog algoritma. Više objašnjenja o samom izvršavanju
              algoritma biće prikazano na narednoj stranici dostupnoj nakon pokretanja.
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
              textAlign="center"
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '50%',
                padding: '5px',
              }}
            >
              <Checkbox
                value={doStepByStep}
                id="suffixTrieCheckbox"
                label="Iscrtaj graf postupno"
                size="medium"
                onChange={(e) => setDoStepByStep(e.target.checked)}
              />
              Iscrtaj graf postupno
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
        <SuffixTrieCompressedGraph genome={genome} pattern={pattern} doStepByStep={doStepByStep} />
      )}
    </>
  );
}

export default SuffixTrieCompressed;
