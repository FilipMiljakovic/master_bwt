import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(() => ({
  width: '150px',
  height: 50,
  backgroundColor: '#081054',
  color: 'white',
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
            setRenderedOutputGenome(changeIElement(renderedOutputGenome, i, genome, '#008000'));
            setRenderedOutputPattern(changeIElement(renderedOutputPattern, j, pattern, '#008000'));

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
      <Grid
        container
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '50%',
          paddingBottom: '5%',
        }}
      >
        <Grid item xs={12} textAlign="center" style={{ margin: '5% 10% 0% 10%' }}>
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
        </Grid>
        <Grid item xs={12} style={{ margin: '5% 10% 5% 10%' }}>
          <Stack direction="row" style={{ fontSize: '30px' }}>
            <div style={{ width: '150px' }}>Genom:</div>
            <Stack direction="row">{renderedOutputGenome}</Stack>
          </Stack>
          <Stack direction="row" style={{ fontSize: '30px' }}>
            <Stack direction="row">
              <div style={{ width: '150px' }}>Patern:</div>
              {patternSpaces.split('').map((character, index) => (
                <Grid item textAlign="center" key={index}>
                  <div style={{ width: '25px' }}>{character}</div>
                </Grid>
              ))}
            </Stack>
            {/* flex: 0 0 width u pikselima ako ne radi sa width zakucanim */}
            <Stack direction="row">{renderedOutputPattern}</Stack>
          </Stack>
        </Grid>
      </Grid>
      <Stack
        direction="row"
        spacing={2}
        style={{ margin: '0 5% 3% 5%', textAlign: 'center', fontSize: '30px' }}
      >
        Pronađena rešenja:
        {renderedOutputResults.slice(0, -1).map((listItem, ind) => (
          <Grid item textAlign="center" style={{ marginLeft: '2%' }} key={ind}>
            <div> {listItem},</div>
          </Grid>
        ))}
        {renderedOutputResults.slice(-1).map((listItem, ind) => (
          <Grid item textAlign="center" style={{ marginLeft: '2%' }} key={ind}>
            <div> {listItem} </div>
          </Grid>
        ))}
      </Stack>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography paragraph>
          Na ovoj strani je prikazano postupno izvršavanje iterativnog algoritma. Izvršavanje teče
          tako što prolazimo kroz genom i poredimo karakter na trenutnoj poziciji sa prvim
          karakterom paterna koji tražimo. Ukoliko je došlo do poklapanja, početak niske Patern na
          istom karakteru niske Genom, ali izvršavanje pomeramo na naredni karakter niske Patern i
          njega poredimo sa sledećim karakterom niske Genom. Ukoliko dođemo do kraja niske Patern,
          zaključujemo da smo pronašli poklapanje. Tada početak niske Patern pomeramo za jedno mesto
          napred i beležimo rezultat. Ukoliko do poklapanja nije došlo na bilo kod karakteru niske
          Patern, vraćamo se na prvi karakter niske Patern i izvršavanje nastavljamo od narednog
          karaktera niske Genom. Izvršavanje zaustavljamo kada dodjemo do karaktera na poziciji
          |Genom|-|Patern|.
        </Typography>
        <Typography paragraph>
          Može se pratiti koji se trenutno karakter provera- va i različitim bojama je naglašeno da
          li je do poklapanja došlo ili ne (zelena boja za poklapanje i crvena za nepoklapanje).
          Pored ovoga, u svakom trenutku možemo videti na kojim indeksima je poklapanje pronađeno do
          tada, a kada do novog poklapanja dođe lista indeksa će se dopuniti.
        </Typography>
        <Typography paragraph>
          Za manipulaciju sa izvršavanjem algoritma imamo na raspolaganju Pause/Play dugme kojim
          možemo pauzirati izvršavanje algoritma, ako u nekom stanju hoćemo da proverimo gde je
          algoritam stao. Pored toga, kada algoritam završi izvršavanje za unesene parametre, a mi
          iz nekog razloga želimo opet da ga pokrenemo sa istim parametrima, da se ne bismo vraćali
          na stranicu za unos parametara i opet ih unosili, postoji dugme Resetuj kojim se ovo može
          izvršiti. Pored navedene dugmadi postoji i slajder kojim možemo regulisati brzinu
          izvršavanja algoritma, tj pauzu između koraka. Brzina se kreće u rasponu od 100ms do
          1000ms, tj. jedne sekunde. Incijalna brzina je 500ms.
        </Typography>
      </Box>
    </Grid>
  );
}

export default BruteForceVisual;
