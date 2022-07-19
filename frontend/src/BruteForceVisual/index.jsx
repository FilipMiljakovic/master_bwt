import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
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
      setRenderedOutputGenome(changeIElement(renderedOutputGenome, i - k, genome, '#FFFFFF'));
      setRenderedOutputPattern(changeIElement(renderedOutputPattern, j - k, pattern, '#FFFFFF'));
    }
  }, [moveIndexes]);

  const changeValue = (event, valueToChange) => {
    setValue(valueToChange);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Box textAlign="center" style={{ margin: '15% 3% 5% 3%' }}>
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
        <Box style={{ margin: '0 10% 10% 10%', color: '#FFFFFF' }}>
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
          <Stack direction="row" spacing={2} style={{ paddingTop: '2rem' }}>
            Indexes found:
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
        </Box>
      </Grid>
    </Grid>
  );
}

export default BruteForceVisual;
