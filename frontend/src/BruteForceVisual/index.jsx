import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(() => ({
  width: '150px',
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
  marginRight: '10px',
  marginBottom: '10px',
}));

function changeIElement(renderedOutput, i, valueString, colorHash) {
  const renderedOutputNew = renderedOutput;
  renderedOutputNew[i] = (
    <Grid item textAlign="center" key={i}>
      <div style={{ color: colorHash, width: '25px' }}>{valueString[i]}</div>
    </Grid>
  );
  return renderedOutputNew;
}

function BruteForceVisual({ genome, pattern }) {
  const [renderedOutputResults, setRenderedOutputResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [value, setValue] = useState(400);
  const [renderedOutputPattern, setRenderedOutputPattern] = useState(
    pattern
      ? [...pattern].map((item, index) => (
          <Grid item textAlign="center" key={index}>
            <div style={{ width: '25px' }}>{item}</div>
          </Grid>
        ))
      : 'Error!!!',
  );
  const [renderedOutputGenome, setRenderedOutputGenome] = useState(
    genome
      ? [...genome].map((item, index) => (
          <Grid item textAlign="center" key={index}>
            <div style={{ width: '25px' }}>{item}</div>
          </Grid>
        ))
      : 'Error!!!',
  );
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [moveIndexes, setMoveIndexes] = useState({ i: 0, j: 0 });
  const [patternSpaces, setPatternSpaces] = useState('');

  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => {
        const { i, j } = indexes;
        if (i < genome.length - pattern.length + 1 || j > 0) {
          if (i < genome.length && genome.charAt(i) !== pattern.charAt(j)) {
            setRenderedOutputGenome(changeIElement(renderedOutputGenome, i, genome, '#FF0000'));
            setRenderedOutputPattern(changeIElement(renderedOutputPattern, j, pattern, '#FF0000'));
            setIndexes({ i: i - j + 1, j: 0 });
            setPatternSpaces(new Array(i - j + 1).join('_'));
            setMoveIndexes({ i, j });
          } else if (i < genome.length) {
            setRenderedOutputGenome(changeIElement(renderedOutputGenome, i, genome, '#00FFFF'));
            setRenderedOutputPattern(changeIElement(renderedOutputPattern, j, pattern, '#00FFFF'));

            if (j === pattern.length - 1) {
              setRenderedOutputResults([...renderedOutputResults, i - j]);
              setIndexes({ i: i - j + 1, j: 0 });
              setPatternSpaces(new Array(i - j + 1).join('_'));
              setMoveIndexes({ i, j });
            } else {
              setIndexes({ i: i + 1, j: j + 1 });
              setPatternSpaces(new Array(i - j + 1).join('_'));
            }
          } else {
            setDisableButton(true);
          }
        } else {
          setMoveIndexes({ i, j });
          setDisableButton(true);
        }
      }, value);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [indexes, isPlaying]);

  useEffect(() => {
    const { i, j } = moveIndexes;
    for (let k = 0; k <= j; k += 1) {
      setRenderedOutputGenome(changeIElement(renderedOutputGenome, i - k, genome, 'black'));
      setRenderedOutputPattern(changeIElement(renderedOutputPattern, j - k, pattern, 'black'));
    }
  }, [moveIndexes]);

  const changeValue = (event, valueToChange) => {
    setValue(valueToChange);
  };

  return (
    <Grid spacing={2} style={{ marginLeft: '300px', marginTop: '100px' }}>
      <h1 style={{ textAlign: 'center' }}>Iterativni algoritam - rešenje</h1>
      <Grid container>
        <Box item textAlign="center" style={{ margin: '5% 10% 5% 10%' }}>
          <CustomButton
            disabled={disableButton}
            variant="contained"
            startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={() => setIsPlaying(!isPlaying)}
          />
          <CustomButton
            disabled={!disableButton}
            variant="contained"
            onClick={() => {
              setDisableButton(false);
              setRenderedOutputResults([]);
              setIndexes({ i: 0, j: 0 });
              setMoveIndexes({ i: 0, j: 0 });
              setIsPlaying(true);
              setPatternSpaces('');
              setRenderedOutputPattern(
                pattern
                  ? [...pattern].map((item, index) => (
                      <Grid item textAlign="center" key={index}>
                        <div style={{ width: '25px' }}>{item}</div>
                      </Grid>
                    ))
                  : 'Error!!!',
              );
              setRenderedOutputGenome(
                genome
                  ? [...genome].map((item, index) => (
                      <Grid item textAlign="center" key={index}>
                        <div style={{ width: '25px' }}>{item}</div>
                      </Grid>
                    ))
                  : 'Error!!!',
              );
            }}
          >
            Reset
          </CustomButton>
          <Slider
            defaultValue={50}
            aria-label="Iteration speed"
            valueLabelDisplay="auto"
            value={value}
            onChange={changeValue}
            min={400}
            max={1000}
            step={100}
            style={{ width: '50%', marginTop: '20px' }}
          />
        </Box>
        <Box item style={{ margin: '5% 10% 5% 10%' }}>
          <Stack direction="row" style={{ fontSize: '30px' }}>
            {renderedOutputGenome}
          </Stack>
          <Stack direction="row" style={{ fontSize: '30px' }}>
            <Stack direction="row">
              {patternSpaces.split('').map((character, index) => (
                <Grid item textAlign="center" key={index}>
                  <div style={{ width: '25px' }}>{character}</div>
                </Grid>
              ))}
            </Stack>
            {/* flex: 0 0 width u pikselima ako ne radi sa width zakucanim */}
            <Stack direction="row">{renderedOutputPattern}</Stack>
          </Stack>
        </Box>
      </Grid>
      <Stack
        direction="row"
        spacing={2}
        style={{ margin: '0 10% 0 10%', textAlign: 'center', fontSize: '30px' }}
      >
        Pronađena rešenja:
        {renderedOutputResults.slice(0, -1).map((listItem, ind) => (
          <Grid item textAlign="center" key={ind}>
            <div> {listItem},</div>
          </Grid>
        ))}
        {renderedOutputResults.slice(-1).map((listItem, ind) => (
          <Grid item textAlign="center" key={ind}>
            <div> {listItem} </div>
          </Grid>
        ))}
      </Stack>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
          donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
          Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
          imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
          arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
          donec massa sapien faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
          facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
          tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
          consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
          vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
          hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
          tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
          nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
          accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box>
    </Grid>
  );
}

export default BruteForceVisual;
