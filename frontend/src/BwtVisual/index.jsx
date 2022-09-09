/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { styled } from '@mui/material/styles';

const CustomButton = styled(Button)(() => ({
  width: '150px',
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
  marginRight: '10px',
  marginBottom: '10px',
}));

let k = 0;
function BwtVisual({ genome, pattern }) {
  const [cyclicRotationList1, setCyclicRotationList1] = useState([]);
  const [cyclicRotationList2, setCyclicRotationList2] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [resetButton, setResetButton] = useState(false);
  const [inverseMatrix, setInverseMatrix] = useState([]);
  const [inverseMatrix2, setInverseMatrix2] = useState([]);
  const [bwtString, setBwtString] = useState('');
  const [bwtLength, setBwtLength] = useState(-1);
  const [value, setValue] = useState(500);
  const [valueFL, setValueFL] = useState(500);
  const [firstLastArray, setFirstLastArray] = useState([]);
  const [firstLast, setFirstLast] = useState(
    [].map((item, index) => (
      <Grid item textAlign="center" key={index}>
        <div>{item}</div>
      </Grid>
    )),
  );
  const [isPlayingFL, setIsPlayingFL] = useState(false);
  const [disableButtonFL, setDisableButtonFL] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0);
  const [matchingStrings, setMatchingStrings] = useState([pattern[pattern.length - 1]]);
  const [foundIndexArray, setFoundIndexArray] = useState([]);
  const [resultsFound, setResultsFound] = useState([]);
  const [runFLIteration, setRunFLIteration] = useState(false);

  useEffect(() => {
    const cyclicRotationListTmp = [];
    const genomeTmp = `${genome}$`;
    const cyclicRotationListTmpSort = [];
    for (let i = 0; i < genomeTmp.length; i += 1) {
      cyclicRotationListTmp.push(
        genomeTmp.substring(genomeTmp.length - i) + genomeTmp.substring(0, genomeTmp.length - i),
      );
      cyclicRotationListTmpSort.push(
        genomeTmp.substring(genomeTmp.length - i) + genomeTmp.substring(0, genomeTmp.length - i),
      );
    }

    setCyclicRotationList1(cyclicRotationListTmp);
    setCyclicRotationList2(cyclicRotationListTmpSort.sort());
  }, [resetButton]);

  function putIndexesOnArray(array) {
    const charactersFoundMap = {};
    const result = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i] in charactersFoundMap) {
        charactersFoundMap[array[i]] += 1;
      } else {
        charactersFoundMap[array[i]] = 1;
      }
      result.push(array[i] + charactersFoundMap[array[i]]);
    }
    return result;
  }

  function calculateGenomIndex(rowValue) {
    return Array.from(rowValue).indexOf('$') === 0
      ? rowValue.length - 3 - Array.from(rowValue).indexOf('$')
      : rowValue.length - 2 - Array.from(rowValue).indexOf('$');
  }

  function addIndexesToBwt(matrix) {
    const matrixTmp = [...matrix];
    const firstColumn = putIndexesOnArray(matrixTmp.map((item) => item[0]));
    const lastColumn = putIndexesOnArray(matrixTmp.map((item) => item[item.length - 1]));
    return matrixTmp.map((item, index) => {
      const valueMap = {};
      valueMap.firstColor = 'black';
      valueMap.value = firstColumn[index] + item.substring(1, item.length - 1) + lastColumn[index];
      valueMap.firstSubIndex = 2;
      valueMap.lastColor = 'black';
      valueMap.genomIndex = calculateGenomIndex(
        firstColumn[index] + item.substring(1, item.length - 1) + lastColumn[index],
      );
      return valueMap;
    });
  }

  useEffect(() => {
    setBwtString(cyclicRotationList2.map((listItem) => listItem.substring(listItem.length - 1)));
    setBwtLength(bwtLength + 1);
    setFirstLastArray(addIndexesToBwt(cyclicRotationList2));
  }, [cyclicRotationList2]);

  function changeIElement(firstLastArrayArg, i, firstColor, lastColor, firstSubIndex) {
    const firstLastNew = firstLastArrayArg;
    const valueMap = { ...firstLastArrayArg[i] };
    valueMap.firstColor = firstColor;
    valueMap.lastColor = lastColor;
    valueMap.firstSubIndex = firstSubIndex;
    firstLastNew[i] = valueMap;
    return firstLastNew;
  }

  useEffect(() => {
    setFirstLast(
      firstLastArray.map((listItem, index) => (
        <Grid container key={index}>
          <Stack direction="row" xs={12}>
            <div
              style={{
                paddingTop: '6px',
                width: '50px',
              }}
            >
              {listItem.genomIndex}
            </div>
            <div style={{ paddingTop: '6px', color: listItem.firstColor }}>
              {listItem.value.substring(0, listItem.firstSubIndex)}
            </div>
            <div style={{ color: 'gray', paddingTop: '6px', float: 'left' }}>
              {listItem.value.substring(listItem.firstSubIndex, listItem.value.length - 2)}
            </div>
            <div style={{ padding: '6px 0', float: 'left', color: listItem.lastColor }}>
              {listItem.value.substring(listItem.value.length - 2)}
            </div>
          </Stack>
        </Grid>
      )),
    );
    if (firstLastArray.length) {
      setRunFLIteration(true);
    }
  }, [firstLastArray]);

  function colorLeftValues() {
    const patternMatchingCharacter = pattern[pattern.length - 1 - patternIndex];
    let array = firstLastArray.map((item) => {
      const newItem = { ...item };
      newItem.firstColor = 'black';
      return newItem;
    });
    let indexArray = [];
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const item in firstLastArray) {
      for (let i = 0; i < matchingStrings.length; i += 1) {
        if (
          matchingStrings[i] ===
            firstLastArray[item].value.substring(0, matchingStrings[i].length) &&
          patternMatchingCharacter === matchingStrings[i][0]
        ) {
          array = changeIElement(array, item, '#00FFFF', array[item].lastColor, 2 + patternIndex);
          indexArray = [...indexArray, item];
          break;
        } else {
          array = changeIElement(array, item, '#FF0000', array[item].lastColor, 2);
        }
      }
    }

    setRunFLIteration(false);
    setFirstLastArray(array);
    setFoundIndexArray(indexArray);
    setMatchingStrings([]);
  }

  function colorRightValues() {
    let array = firstLastArray.map((item) => {
      const newItem = { ...item };
      newItem.lastColor = 'black';
      return newItem;
    });
    let matching = [];

    if (patternIndex === pattern.length - 1) {
      setDisableButtonFL(true);
      array = firstLastArray.map((item) => {
        const newItem = { ...item };
        newItem.lastColor = 'black';
        return newItem;
      });
      setFirstLastArray(array);
      setResultsFound(
        array
          .filter((item) => item.firstColor === '#00FFFF')
          .map((changedItem) => changedItem.genomIndex),
      );
      return;
    }

    for (const item in firstLastArray) {
      for (let i = 0; i < foundIndexArray.length; i += 1) {
        if (item === foundIndexArray[i]) {
          array = changeIElement(
            array,
            item,
            firstLastArray[item].firstColor,
            '#00FFFF',
            2 + patternIndex,
          );

          matching = [...matching, firstLastArray[foundIndexArray[i]].value.slice(-2)];
          break;
        } else {
          array = changeIElement(
            firstLastArray,
            item,
            firstLastArray[item].firstColor,
            '#FF0000',
            2,
          );
        }
      }
    }

    setFirstLastArray(array);
    setPatternIndex(patternIndex + 1);
    setMatchingStrings(matching);
  }

  useEffect(() => {
    if (runFLIteration && matchingStrings?.length && isPlayingFL) {
      setTimeout(() => {
        colorLeftValues();
      }, valueFL);
    }
  }, [runFLIteration, matchingStrings, isPlayingFL]);

  useEffect(() => {
    if (foundIndexArray?.length) {
      setTimeout(() => {
        colorRightValues();
      }, valueFL);
    }
  }, [foundIndexArray]);

  useEffect(() => {
    setInverseMatrix(Array.from(bwtString));
  }, [bwtString]);

  useEffect(() => {
    let timeout;
    if (bwtString.length !== 0 && bwtLength >= 0 && bwtLength <= bwtString.length && isPlaying) {
      timeout = setTimeout(() => {
        if (k === 0) {
          setInverseMatrix(() => {
            inverseMatrix.sort();
            return inverseMatrix;
          });
          k = 1;
          setBwtLength(bwtLength + 1);
        } else {
          setInverseMatrix2(inverseMatrix);
          setInverseMatrix(inverseMatrix.map((item, index) => bwtString[index] + item));
          k = 0;
        }
      }, value);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [inverseMatrix, bwtLength, isPlaying]);

  useEffect(() => {
    if (bwtLength !== 0 && bwtLength === bwtString.length + 1) {
      setDisableButton(true);
    }
  }, [bwtLength]);

  const changeValue = (event, valueToChange) => {
    setValue(valueToChange);
  };

  const changeValueFL = (event, valueToChangeFL) => {
    setValueFL(valueToChangeFL);
  };

  const indexMatrixRender = disableButton
    ? inverseMatrix.map((listItem, index) => (
        <Grid container key={index}>
          <Grid item xs={10}>
            {index === 0 ? (
              <div style={{ padding: '6px', color: '#081054', fontSize: '30px' }}>{listItem}</div>
            ) : (
              <div style={{ padding: '6px' }}>{listItem}</div>
            )}
          </Grid>
        </Grid>
      ))
    : inverseMatrix.map((listItem, index) => (
        <Grid container key={index}>
          <Grid item xs={10}>
            <div style={{ padding: '6px' }}>{listItem}</div>
          </Grid>
        </Grid>
      ));

  const indexesMatch = resultsFound
    ? resultsFound.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item textAlign="center" key={index} style={{ margin: '6px' }}>
          <div style={{ float: 'left', fontSize: '30px' }}>
            {index === resultsFound.length - 1 ? item : `${item}, `}
          </div>
        </Grid>
      ))
    : '';
  return (
    <Grid spacing={2} style={{ marginLeft: '300px', marginTop: '100px' }}>
      <Grid container>
        <Box textAlign="center" style={{ margin: '3% auto 3% auto' }}>
          <Grid style={{ fontSize: '30px' }}>Barouz-Vilerova transformacija</Grid>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus
            sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
            In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique
            sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo
            viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </Box>
        <Grid container style={{ marginLeft: '5%', fontSize: '30px' }}>
          Genom:
          <Grid style={{ marginLeft: '20px' }}>{genome}</Grid>
        </Grid>
        <Grid container style={{ margin: '3% 25%', fontSize: '20px' }}>
          <Grid style={{ float: 'left' }}>
            {cyclicRotationList1.map((listItem, index) => (
              <Grid container key={index}>
                <Grid item xs={10}>
                  <div style={{ padding: '6px' }}>{listItem}</div>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <DoubleArrowIcon
            style={{
              float: 'left',
              margin: 'auto 10% auto 10%',
              fontSize: '100px',
            }}
          />
          <Grid style={{ float: 'left' }}>
            {cyclicRotationList2.map((listItem, index) => (
              <Grid container key={index}>
                <Grid item xs={10}>
                  <div style={{ padding: '6px' }}>{listItem}</div>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid container style={{ marginLeft: '5%', fontSize: '30px' }}>
          BWT:
          <Grid style={{ marginLeft: '20px' }}>{bwtString}</Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Box textAlign="center" style={{ margin: '3% auto 3% auto' }}>
          <Grid style={{ fontSize: '30px' }}>Inverzna Barouz-Vilerova transformacija</Grid>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus
            sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
            In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique
            sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo
            viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </Box>
        <Box container textAlign="center" style={{ margin: '3% 35%', fontSize: '30px' }}>
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
              setBwtString('');
              setDisableButton(false);
              setIsPlaying(true);
              setInverseMatrix([]);
              setInverseMatrix2([]);
              setBwtLength(0);
              setResetButton(!resetButton);
              k = 0;
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
            min={500}
            max={1000}
            step={100}
            style={{ width: '50%', marginTop: '20px' }}
          />
        </Box>
        <Grid container style={{ margin: '3% 25%', fontSize: '20px' }}>
          <Grid style={{ float: 'left' }}>
            {inverseMatrix2.map((listItem, index) => (
              <Grid container key={index}>
                <Grid item xs={10}>
                  <div style={{ padding: '6px' }}>{listItem}</div>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <DoubleArrowIcon
            style={{
              float: 'left',
              margin: 'auto 10% auto 10%',
              fontSize: '100px',
            }}
          />
          <Grid style={{ float: 'left' }}>{indexMatrixRender}</Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Box textAlign="center" style={{ margin: '3% auto 3% auto' }}>
          <Grid style={{ fontSize: '30px' }}>Uparivanje šablona pomoću BWT</Grid>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus
            sed vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in.
            In hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
            et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique
            sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo
            viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </Box>
        <Box style={{ margin: '3% 35%' }}>
          <Grid style={{ paddingBottom: '10px', fontSize: '30px' }}>Genom: {genome}</Grid>
          <Grid style={{ paddingBottom: '10px', fontSize: '30px' }}>Patern: {pattern}</Grid>
          <Stack direction="row" spacing={2} style={{ fontSize: '30px' }}>
            <div>Pronađena rešenja:</div> {indexesMatch}
          </Stack>
        </Box>
        <Box container textAlign="center" style={{ margin: '3% 35%', fontSize: '30px' }}>
          <CustomButton
            disabled={disableButtonFL}
            variant="contained"
            startIcon={isPlayingFL ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={() => setIsPlayingFL(!isPlayingFL)}
          />
          <CustomButton
            disabled={!disableButtonFL}
            variant="contained"
            onClick={() => {
              setDisableButtonFL(false);
              setIsPlayingFL(false);
              setFirstLastArray(
                firstLastArray.map((item) => {
                  const newItem = { ...item };
                  newItem.firstColor = 'black';
                  newItem.lastColor = 'black';
                  newItem.firstSubIndex = 2;
                  return newItem;
                }),
              );
              setMatchingStrings([pattern[pattern.length - 1]]);
              setPatternIndex(0);
              setResultsFound([]);
            }}
          >
            Reset
          </CustomButton>
          <Slider
            defaultValue={50}
            aria-label="Iteration speed"
            valueLabelDisplay="auto"
            value={valueFL}
            onChange={changeValueFL}
            min={500}
            max={1000}
            step={100}
            style={{ width: '50%', marginTop: '20px' }}
          />
        </Box>
        <Grid container style={{ margin: '3% 37%', fontSize: '20px' }}>
          <Grid>{firstLast}</Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default BwtVisual;
