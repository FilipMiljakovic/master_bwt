import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
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
  const [isPlaying, setIsPlaying] = useState(true);
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
  const [isPlayingFL, setIsPlayingFL] = useState(true);
  const [disableButtonFL, setDisableButtonFL] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0);
  const [matchingStrings, setMatchingStrings] = useState([pattern[pattern.length - 1]]);
  const [foundIndexArray, setFoundIndexArray] = useState([]);
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

  function addIndexesToBwt(matrix) {
    const matrixTmp = [...matrix];
    const firstColumn = putIndexesOnArray(matrixTmp.map((item) => item[0]));
    const lastColumn = putIndexesOnArray(matrixTmp.map((item) => item[item.length - 1]));
    return matrixTmp.map((item, index) => {
      const valueMap = {};
      valueMap.firstColor = '#FFFFFF';
      valueMap.value = firstColumn[index] + item.substring(1, item.length - 1) + lastColumn[index];
      valueMap.firstSubIndex = 2;
      valueMap.lastColor = '#FFFFFF';
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
                color: '#00FFFF',
              }}
            >
              {Array.from(listItem.value).indexOf('$') === 0
                ? listItem.value.length - 3 - Array.from(listItem.value).indexOf('$')
                : listItem.value.length - 2 - Array.from(listItem.value).indexOf('$')}
            </div>
            <div style={{ paddingTop: '6px', color: listItem.firstColor }}>
              {listItem.value.substring(0, listItem.firstSubIndex)}
            </div>
            <div className="opacityText" style={{ paddingTop: '6px', float: 'left' }}>
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
    const iterationNumber = genome.length;
    let currentIteration = 0;
    setFirstLastArray(
      firstLastArray.map((item) => {
        const newItem = { ...item };
        newItem.firstColor = '#FFFFFF';
        return newItem;
      }),
    );
    const interval = setInterval(() => {
      if (currentIteration === iterationNumber) {
        if (patternIndex !== pattern.length) {
          setPatternIndex(patternIndex + 1);
          setMatchingStrings([]);
          // eslint-disable-next-line no-use-before-define
          colorRightValues();
        }
        clearInterval(interval);
      }
      for (let i = 0; i < matchingStrings.length; i += 1) {
        console.log(firstLastArray);
        if (
          // matchingStrings.find(
          //   (element) => element === firstLastArray[currentIteration].value[element.length],
          // )
          matchingStrings[i] ===
          firstLastArray[currentIteration].value.substring(0, matchingStrings[i].length)
        ) {
          setFirstLastArray(
            changeIElement(
              firstLastArray,
              currentIteration,
              '#00FFFF',
              firstLastArray[currentIteration].lastColor,
              2 + patternIndex,
            ),
          );
          setFoundIndexArray([...foundIndexArray, currentIteration]);
        } else {
          setFirstLastArray(
            changeIElement(
              firstLastArray,
              currentIteration,
              '#FF0000',
              firstLastArray[currentIteration].lastColor,
              2,
            ),
          );
        }
      }
      currentIteration += 1;
    }, 500);
  }

  function colorRightValues() {
    const iterationNumber = foundIndexArray.length - 1;
    let currentIteration = 0;
    setFirstLastArray(
      firstLastArray.map((item) => {
        const newItem = { ...item };
        newItem.lastColor = '#FFFFFF';
        return newItem;
      }),
    );
    const interval = setInterval(() => {
      if (currentIteration === iterationNumber) {
        colorLeftValues();
        clearInterval(interval);
      }
      if (
        pattern[pattern.length - 1 - patternIndex] ===
        firstLastArray[foundIndexArray[currentIteration]].value[genome.length + 1]
      ) {
        setFirstLastArray(
          changeIElement(
            firstLastArray,
            currentIteration,
            firstLastArray[currentIteration].firstColor,
            '#00FFFF',
            2 + pattern.length - patternIndex,
          ),
        );
        setMatchingStrings([
          ...matchingStrings,
          firstLastArray[foundIndexArray[currentIteration]].value.slice(-2),
        ]);
      } else {
        setFirstLastArray(
          changeIElement(
            firstLastArray,
            currentIteration,
            '#FF0000',
            firstLastArray[currentIteration].lastColor,
            2,
          ),
        );
      }
      currentIteration += 1;
    }, 500);
  }

  // let timeout;
  // // Mesam dve stvari, pattern i ovu listu stringova od genoma.....
  // if (patternIndex < pattern.length) {
  //   if (isPlayingFL) {
  //     timeout = setTimeout(() => {
  //       let indexFoundList = [];
  //       // array se menja u zavisnosti sta se poklapa
  //       for (let i = 0; i < firstLastArray.length && mistake >= 0; i += 1) {
  //         if (firstLastArray[i].value[0] === pattern[pattern.length - 1 - patternIndex]) {
  //           indexFoundList.push(i);
  //         }
  //       }
  //       for (let j = 0; j < indexFoundList.length; j += 1) {
  //         if (indexFoundList.length !== 0) {
  //           setFirstLastArray(
  //             changeIElement(
  //               firstLastArray,
  //               indexFoundList[j],
  //               '#FF0000',
  //               '#FFFFFF',
  //               2 + patternIndex,
  //             ),
  //           );
  //         } else if (mistake < 0) {
  //           setFirstLastArray(
  //             changeIElement(firstLastArray, j, '#FF0000', '#FFFFFF', 2 + patternIndex),
  //           );
  //           // zaustavi izvrsavanje, oboj poslednji u crveno i posle nekako vrati sve na belo
  //         } else {
  //           setMistake(mistake - 1);
  //           setFirstLastArray(
  //             changeIElement(firstLastArray, j, '#FF0000', '#FFFFFF', 2 + patternIndex),
  //           );
  //         }
  //         indexFoundList = indexFoundList.slice(1, indexFoundList.length);
  //       }
  //       // oboj i pattern u istu boju
  //       setPatternIndex(patternIndex + 1);
  //     }, valueFL);
  //   }
  // } else {
  //   setDisableButtonFL(true);
  // }
  // return () => {
  //   clearTimeout(timeout);
  // };

  useEffect(() => {
    if (runFLIteration) {
      colorLeftValues();
    }
  }, [runFLIteration]);

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
              <div style={{ padding: '6px', color: '#00FFFF', fontSize: '30px' }}>{listItem}</div>
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

  return (
    <Grid container spacing={2} style={{ padding: '0% 10% 0% 10%', color: '#FFFFFF' }}>
      <Grid container style={{ margin: '5% 0%', fontSize: '30px' }}>
        Genom:
        <Grid style={{ marginLeft: '20px' }}>{genome}</Grid>
      </Grid>
      <Grid textAlign="center" style={{ margin: '3% auto 3% auto', fontSize: '30px' }}>
        BWT transformacija
      </Grid>
      <Grid container>
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
      <Grid container style={{ margin: '5% 0%', fontSize: '30px' }}>
        Bwt:
        <Grid style={{ marginLeft: '20px' }}>{bwtString}</Grid>
      </Grid>
      <Box textAlign="center" style={{ margin: '3% auto 3% auto' }}>
        <Grid style={{ paddingBottom: '10%', fontSize: '30px' }}>Inverzna BWT transformacija</Grid>
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
      <Grid container style={{ margin: '3% auto 3% auto' }}>
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
      <Box textAlign="center" style={{ margin: '3% auto 3% auto' }}>
        <Grid style={{ paddingBottom: '10%', fontSize: '30px' }}>First-Last svojstvo</Grid>
        <Grid style={{ paddingBottom: '10%', fontSize: '30px' }}>Pattern: {pattern}</Grid>
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
            setIsPlayingFL(true);
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
        <Grid>{firstLast}</Grid>
      </Box>
    </Grid>
  );
}

export default BwtVisual;
