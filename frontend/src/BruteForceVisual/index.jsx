import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
      <div style={{ color: colorHash }}>{valueString[i]}</div>
    </Grid>
  );
  return renderedOutputNew;
}

// function renderPattern(i, pattern) {
//   const renderedOutputPattern = [];
//   for (let k = 0; k <= i; k += 1) {
//     renderedOutputPattern.push(
//       <Grid item textAlign="center" key={k}>
//         <div>_</div>
//       </Grid>,
//     );
//   }
//   [...pattern].map((item, index) =>
//     renderedOutputPattern.push(
//       <Grid item textAlign="center" key={index}>
//         <div>{item}</div>
//       </Grid>,
//     ),
//   );
//   return renderedOutputPattern;
// }

function BruteForceVisual({ genome, pattern }) {
  const [renderedOutputResults, setRenderedOutputResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [renderedOutputPattern, setRenderedOutputPattern] = useState(
    pattern
      ? [...pattern].map((item, index) => (
          <Grid item textAlign="center" key={index}>
            <div>{item}</div>
          </Grid>
        ))
      : 'Error!!!',
  );
  const [renderedOutputGenome, setRenderedOutputGenome] = useState(
    genome
      ? [...genome].map((item, index) => (
          <Grid item textAlign="center" key={index}>
            <div>{item}</div>
          </Grid>
        ))
      : 'Error!!!',
  );
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [moveIndexes, setMoveIndexes] = useState({ i: 0, j: 0 });

  useEffect(() => {
    let timeout;
    if (isPlaying) {
      timeout = setTimeout(() => {
        const { i, j } = indexes;
        if (genome.charAt(i) !== pattern.charAt(j)) {
          setRenderedOutputGenome(changeIElement(renderedOutputGenome, i, genome, '#FF0000'));
          setRenderedOutputPattern(changeIElement(renderedOutputPattern, j, pattern, '#FF0000'));
          if (i < genome.length - 1) {
            // Pomeri pattern za jedan
            setIndexes({ i: i + 1, j: 0 });
          } else {
            setDisableButton(true);
          }
          setMoveIndexes({ i, j });
        } else {
          setRenderedOutputGenome(changeIElement(renderedOutputGenome, i, genome, '#00FFFF'));
          setRenderedOutputPattern(changeIElement(renderedOutputPattern, j, pattern, '#00FFFF'));
          if (i < genome.length - 1) {
            if (j === pattern.length - 1) {
              // Pomeri pattern za jedan
              setRenderedOutputResults([...renderedOutputResults, i - j]);
              setIndexes({ i: i - j + 1, j: 0 });
              setMoveIndexes({ i, j });
            } else {
              setIndexes({ i: i + 1, j: j + 1 });
            }
          } else {
            setDisableButton(true);
          }
        }
      }, 800);
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
    // setRenderedOutputPattern(renderPattern(i, pattern));
  }, [moveIndexes]);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={10}
        style={{ margin: '10% 10% 10% 0', paddingLeft: '5%', color: '#FFFFFF', fontSize: '50px' }}
      >
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
            setRenderedOutputPattern(
              pattern
                ? [...pattern].map((item, index) => (
                    <Grid item textAlign="center" key={index}>
                      <div>{item}</div>
                    </Grid>
                  ))
                : 'Error!!!',
            );
            setRenderedOutputGenome(
              genome
                ? [...genome].map((item, index) => (
                    <Grid item textAlign="center" key={index}>
                      <div>{item}</div>
                    </Grid>
                  ))
                : 'Error!!!',
            );
          }}
        >
          Reset
        </CustomButton>
        <Stack direction="row" spacing={2}>
          {renderedOutputGenome}
        </Stack>
        <Stack direction="row" spacing={2}>
          {renderedOutputPattern}
        </Stack>
        <Stack direction="row" spacing={2} style={{ paddingTop: '2rem' }}>
          Indexses found:
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
      </Grid>
    </Grid>
  );
}

export default BruteForceVisual;
