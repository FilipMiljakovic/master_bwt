import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircleIcon from '@mui/icons-material/Circle';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function Home() {
  return (
    <Grid style={{ marginLeft: '300px', marginTop: '100px' }}>
      <h1 style={{ textAlign: 'center' }}>Uparivanje šablona</h1>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Uparivanje šablona se veoma često javlja kao problem u različitim oblastima naučnog
          istraživanja: biologiji, informatici, samim tim i bioinformatici, medicini itd.
        </Typography>
        <Typography paragraph>
          Kao jedan od najpoznatijih problema u medicini i bioinformatici koji zahteva uparivanje
          šablona javlja se problem lociranja mutacija u ljudskom genomu i ranog otkrivanja raznih
          genetskih poremećaja. Pomenute mutacije se nalaze tako što se segmenti DNK osobe koja se
          ispituje porede sa referentnim ljudskim genomom. Očitavanje predstavlja sekvencu parova
          baza koja odgovara nekom delu DNK, dok referentni ljudski genom predstavlja genom
          sastavljen od genoma više donora i čini šablon u kojem se pomenuti segmenti individualnih
          ljudskih genoma traže.
        </Typography>
        <Typography paragraph>
          Dužina ljudskog genoma smeštenog u memoriji je preko 3GB, dok ukupna dužina svih
          očitavanja može biti veća od 1TB. Zbog toga nam je od izuzetne važnosti da algoritmi
          kojima radimo mapiranje očitavanja budu efikasni.
        </Typography>
        <Typography paragraph>
          U ovoj aplikaciji će biti predstavljeni algoritmi različite složenosti koji se bave
          uparivanjem šablona, a to su:
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemIcon style={{ color: '#081054' }}>
              <CircleIcon />
            </ListItemIcon>
            <ListItemText primary="Iterativni algoritam za uparivanje šablona" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ color: '#081054' }}>
              <CircleIcon />
            </ListItemIcon>
            <ListItemText primary="Algoritam uparivanja šablona pomoću prefiksnih stabala" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ color: '#081054' }}>
              <CircleIcon />
            </ListItemIcon>
            <ListItemText primary="Algoritam uparivanja šablona pomoću sufiksnih stabala" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ color: '#081054' }}>
              <CircleIcon />
            </ListItemIcon>
            <ListItemText primary="Algoritam uparivanja šablona pomoću kompresovanih sufiksnih stabala" />
          </ListItem>
          <ListItem disablePadding>
            <ListItemIcon style={{ color: '#081054' }}>
              <CircleIcon />
            </ListItemIcon>
            <ListItemText primary="Algoritam uparivanja šablona pomoću Barouz-Vilerove transformacije kao i sama Barouz-Vilerova transformacija i i njena inverzna operacija" />
          </ListItem>
        </List>
        <Typography paragraph>
          U primeni ovih algoritama možemo razlikovati jednostruko i višestruko uparivanje šablona.
          Kod jednostrukog su ulaz niska Patern koja se traži i niska Genom u kojoj se traže
          poklapanja. Dok su izlaz sve pozicije u niski Genom gde se niska Patern pojavljuje kao
          podniska. Kod višestrukog uparivanja šablona ulaz je kolekcija niski šablona koji se traže
          i naravno niska Genom u kojoj se traže poklapanja. Izlaz su uređeni parovi (Patern, Index)
          - za svaki šablon iz liste pronalazi se pozicija njegovog početka u niski Genom gde imamo
          poklapanje.
        </Typography>
      </Box>
    </Grid>
  );
}

export default Home;
