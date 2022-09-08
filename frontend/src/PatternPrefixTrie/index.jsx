import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
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

  const CustomButton = styled(Button)(() => ({
    height: 50,
    backgroundColor: '#00FFFF',
    color: '#191970',
  }));

  return (
    <>
      {!showGraph ? (
        <Grid style={{ marginLeft: '300px', marginTop: '100px' }}>
          <h1 style={{ textAlign: 'center' }}>Prefiksna stabla</h1>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent
              elementum facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in
              hendrerit gravida rutrum quisque non tellus. Convallis convallis tellus id interdum
              velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing.
              Amet nisl suscipit adipiscing bibendum est ultricies integer quis. Cursus euismod quis
              viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum leo.
              Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus
              at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
              ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
            </Typography>
            <Typography paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
              facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
              tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at
              quis risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra
              accumsan in. In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec
              nam aliquam sem et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend.
              Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
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
                id="patternList-label"
                label="Paterni razdvojeni zarezom"
                variant="outlined"
                style={{ backgroundColor: 'white' }}
                value={patternList}
                onChange={(e) => setPatternList(e.target.value)}
              />
            </Grid>
            <Grid item xs={7} textAlign="center" style={{ padding: '5px' }}>
              <label htmlFor="suffixTrieCheckbox">
                <input
                  type="checkbox"
                  value={doStepByStep}
                  id="suffixTrieCheckbox"
                  name="suffixTrieCheckbox"
                  onChange={(e) => setDoStepByStep(e.target.checked)}
                />
                Iscrtaj graf postupno
              </label>
            </Grid>
            <Grid item xs={7} style={{ padding: '5px' }}>
              <CustomButton variant="contained" onClick={submitForm}>
                Pokreni algoritam prefiksnim stablom
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
