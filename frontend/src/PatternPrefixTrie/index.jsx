import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import Grid from '@mui/material/Grid';
import { Checkbox } from '@mui/material';
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

  const CustomButton = styled(Button)({
    height: 50,
    backgroundColor: '#081054',
    color: 'white',
    textTransform: 'none',
    fontSize: '20px',
  });

  return (
    <>
      {!showGraph ? (
        <Grid style={{ marginLeft: '300px', marginTop: '100px' }}>
          <h1 style={{ textAlign: 'center' }}>Prefiksna stabla</h1>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Typography paragraph>
              S obzirom da je iterativni algoritam veoma zahtevan, potrebno nam je da nađemo način
              kako da ceo proces učinimo efikasnijim i smanjimo složenost. Možemo uvideti da u
              prethodnom algoritmu za višestruko uparivanje prolazimo kroz genom za svaki patern
              nezavisno. Način na koji možemo optimizovati prethodno rešenje je da sve paterne
              smestimo u usmeren aciklični graf koji zovemo Trie i koji ima sledeća svojstva:
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon style={{ color: '#081054' }}>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText primary="Trie ima jedan početni čvor sa ulaznim stepenom 0 koji nazivamo root." />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ color: '#081054' }}>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText primary="Svaka grana je označena jednim karakterom alfabeta." />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ color: '#081054' }}>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText primary="Sve grane koje izlaze iz istog čvora imaju različite oznake." />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ color: '#081054' }}>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Svaki patern iz niza paterna koji se traže može da se kreira spajanjem karaktera
duž neke putanje od root čvora niz graf."
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon style={{ color: '#081054' }}>
                  <CircleIcon />
                </ListItemIcon>
                <ListItemText
                  primary=" Svaka putanja od root čvora do lista (čvora sa izlaznim stepenom 0) sa svojim
oznakama može rekonstruisati neku nisku iz liste paterna koji se traže."
                />
              </ListItem>
            </List>
            <Typography paragraph>
              Pretraga bi tada bila izvršena tako što bismo krenuli sa čitanjem karaktera u genomu i
              proverili da li u stablu postoji putanja od korena (čvora root) do lista. Ukoliko smo
              stigli do lista znamo da je taj patern prefiks niske genom. Izvršavanje tako ponovimo
              za svaki sufiks niske Genom da bismo našli sva pojavljivanja.
            </Typography>
            <Typography paragraph>
              Na ovoj stranici je dostupna forma u koju možemo uneti primer genoma i liste paterna
              (paterne unosimo razdvojene zarezom. Na primer: mika,pera,laza ). Takođe imamo i
              opciju da štikliranjem checkbox-a `Iscrtaj graf postupno` kreiranje grafa na narednoj
              stranici izvršimo postupno. U sličaju da pomenuti checkbox nije štikliran stablo će
              biti automatski kreirano i odmah će se krenuti sa pronalaženjem rešenja, tj.
              uparivanjem unetih paterna. Za takav unos klikom na dugme `Pokreni algoritam`
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
                id="patternList-label"
                label="Paterni razdvojeni zarezom"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={patternList}
                onChange={(e) => setPatternList(e.target.value)}
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
