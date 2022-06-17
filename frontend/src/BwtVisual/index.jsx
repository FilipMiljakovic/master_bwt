import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
function BwtVisual({ genome, pattern, mistake }) {
  const [cyclicRotationList1, setCyclicRotationList1] = useState([]);
  const [cyclicRotationList2, setCyclicRotationList2] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [inverseMatrix, setInverseMatrix] = useState([]);
  const [inverseMatrix2, setInverseMatrix2] = useState([]);
  const [bwtString, setBwtString] = useState('');
  const [bwtLength, setBwtLength] = useState(-1);
  const [value, setValue] = useState(100);

  console.log(pattern);
  console.log(mistake);

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
  }, []);

  useEffect(() => {
    setBwtString(cyclicRotationList2.map((listItem) => listItem.substring(listItem.length - 1)));
    setBwtLength(bwtLength + 1);
  }, [cyclicRotationList2]);

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
      // Vidi kada da disablujes dugme
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

  // {inverseMatrix.map((listItem, index) => (
  //   <Grid container key={index}>
  //     <Grid item xs={10}>
  //       <div style={{ padding: '6px' }}>{listItem}</div>
  //       {/* // color: '#00FFFF', */}
  //     </Grid>
  //   </Grid>
  // ))}

  return (
    <Grid container spacing={2} style={{ padding: '0% 10% 0% 10%', color: '#FFFFFF' }}>
      <Grid container style={{ margin: '5% 0%', fontSize: '30px' }}>
        Genom:
        <Grid style={{ marginLeft: '20px' }}>{genome}</Grid>
      </Grid>
      <Grid textAline="center" style={{ margin: '3% auto 3% auto', fontSize: '30px' }}>
        BWT transformacija
      </Grid>
      <Grid container>
        <Grid style={{ float: 'left' }}>
          {cyclicRotationList1.map((listItem, index) => (
            <Grid container key={index}>
              <Grid item xs={10}>
                <div style={{ padding: '6px' }}>{listItem}</div>
                {/* // color: '#00FFFF', */}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <DoubleArrowIcon
          style={{
            float: 'left',
            margin: 'auto 10% auto 10%',
            fontSize: '100px',
            // color: '#00FFFF',
          }}
        />
        <Grid style={{ float: 'left' }}>
          {cyclicRotationList2.map((listItem, index) => (
            <Grid container key={index}>
              <Grid item xs={10}>
                <div style={{ padding: '6px' }}>{listItem}</div>
                {/* // color: '#00FFFF', */}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid container style={{ margin: '5% 0%', fontSize: '30px' }}>
        Bwt:
        <Grid style={{ marginLeft: '20px' }}>{bwtString}</Grid>
      </Grid>
      {/* // Sta kk, namesti da su dugmici iznad a ispod prikaz ovog sranje */}
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
            setBwtLength(-1);
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
          min={100}
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
                {/* // color: '#00FFFF', */}
              </Grid>
            </Grid>
          ))}
        </Grid>
        <DoubleArrowIcon
          style={{
            float: 'left',
            margin: 'auto 10% auto 10%',
            fontSize: '100px',
            // color: '#00FFFF',
          }}
        />
        <Grid style={{ float: 'left' }}>{indexMatrixRender}</Grid>
      </Grid>
    </Grid>
  );
}

export default BwtVisual;
