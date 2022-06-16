import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
// import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
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

function BwtVisual({ genome, pattern, mistake }) {
  const [cyclicRotationList1, setCyclicRotationList1] = useState([]);
  const [cyclicRotationList2, setCyclicRotationList2] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  // const [inverseMatrix, setInverseMatrix] = useState([]);

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

  // useEffect(() => {
  //   let timeout;
  //   if (isPlaying) {
  //     timeout = setTimeout(() => {
  //       setInverseMatrix();
  //     });
  //   }
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [inverseMatrix]);

  return (
    <Grid container spacing={2} style={{ padding: '0% 10% 0% 10%', color: '#FFFFFF' }}>
      <Grid container style={{ margin: '5% 0%', fontSize: '30px' }}>
        Genome:
        <Grid style={{ marginLeft: '20px' }}>{genome}</Grid>
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
        <Grid style={{ marginLeft: '20px' }}>
          {cyclicRotationList2.map((listItem, index) => (
            <Grid key={index} style={{ float: 'left' }}>
              {listItem.substring(listItem.length - 1)}
              {/* // color: '#00FFFF', */}
            </Grid>
          ))}
        </Grid>
      </Grid>
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
          setIsPlaying(true);
        }}
      />
      {/* <Grid>{inverseMatrix}</Grid> */}
    </Grid>
  );
}

export default BwtVisual;
