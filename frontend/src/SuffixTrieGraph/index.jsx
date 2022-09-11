import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled } from '@mui/material/styles';
import { style } from './styles';

cytoscape.use(dagre);

const CustomButton = styled(Button)(() => ({
  width: '30%',
  height: 50,
  backgroundColor: '#081054',
  color: 'white',
  margin: '5px',
}));

export const defaults = {
  // dagre algo options, uses default value on undefined
  nodeSep: 10, // the separation between adjacent nodes in the same rank
  edgeSep: undefined, // the separation between adjacent edges in the same rank
  rankSep: 40, // the separation between each rank in the layout
  rankDir: 'TB', // 'TB' for top to bottom flow, 'LR' for left to right,
  ranker: 'network-simplex', // Type of algorithm to assign a rank to each node in the input graph. Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
  // 'network-simplex', 'tight-tree' or 'longest-path'
  minLen() {
    return 1;
  }, // number of ranks to keep between the source and target of the edge
  edgeWeight() {
    return 1;
  }, // higher weight edges are generally made shorter and straighter than lower weight edges

  // general layout options
  fit: true, // whether to fit to viewport
  padding: 15, // fit padding
  spacingFactor: 1, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
  animate: false, // whether to transition the node positions
  animateFilter() {
    return true;
  }, // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
  animationDuration: 5000, // duration of animation in ms if enabled
  animationEasing: 'ease-out-expo', // easing of animation if enabled
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  transform(node, pos) {
    return pos;
  }, // a function that applies a transform to the final node position
  ready() {}, // on layoutready
  stop() {}, // on layoutstop
};

let matchedIndexes = [];
let alreadySeenMultipleNodes = [];
function SuffixTree({ genome, pattern, doStepByStep }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [resultIndex, setResultIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [suffixArray, setSuffixArray] = useState(['0 ']);
  const [currentEdge, setCurrentEdge] = useState({});
  const [value, setValue] = useState(100);
  const [sourceSearch, setSourceSearch] = useState('root');
  const [findIndexesFlag, setFindIndexesFlag] = useState(false);

  function findAllIndexesOfPatternMatching(trie, sourceNiz, nekiNiz, edgesFormated) {
    let nekiNizTmp = [...nekiNiz];
    const edgesFormatedTmp = { ...edgesFormated };
    let sourceNizTmp = [...sourceNiz];
    const source = sourceNizTmp.shift();
    if (trie[source] && Object.keys(trie[source]).length !== 0) {
      if (alreadySeenMultipleNodes.indexOf(source) === -1) {
        alreadySeenMultipleNodes.push(source);
        nekiNizTmp = [...Object.entries(trie[source]), ...nekiNizTmp];
        sourceNizTmp = [
          ...Array(Object.keys(trie[source]).length - 1).fill(source),
          ...sourceNizTmp,
        ];
      }
    }
    const c = nekiNizTmp.shift();
    if (trie[source] && c[0] === '$') {
      matchedIndexes.push(trie[source].$);
    }
    if (c && source) {
      if (data.trie[source][c[0]]) {
        edgesFormatedTmp[`${source}-${data.trie[source][c[0]]}`] = {
          data: {
            source,
            target: data.trie[source][c[0]],
            label: c[0],
            id: `${source}-${data.trie[source][c[0]]}`,
          },
          classes: 'searchIndex',
        };
        setElements({
          ...elements,
          edges: Object.values(edgesFormatedTmp),
        });
      }
      setTimeout(() => {
        if (c[0] !== '$') {
          sourceNizTmp = [c[1], ...sourceNizTmp];
        }
        findAllIndexesOfPatternMatching(trie, sourceNizTmp, nekiNizTmp, edgesFormatedTmp);
      }, value);
    } else {
      setFindIndexesFlag(false);
    }
  }

  useEffect(() => {
    if (findIndexesFlag) {
      const edgesFormated = elements.edges.reduce((previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue.data.id]: {
            ...currentValue,
          },
        };
      }, {});
      findAllIndexesOfPatternMatching(data.trie, [sourceSearch], [], edgesFormated);
    }
  }, [findIndexesFlag]);

  useEffect(() => {
    let isFound = true;
    const edgesFormated = elements.edges.reduce((previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue.data.id]: {
          ...currentValue,
        },
      };
    }, {});
    let timeout;
    if (Object.keys(edgesFormated).length > 0 && resultIndex < pattern.length) {
      timeout = setTimeout(() => {
        const c = pattern.charAt(resultIndex);
        if (!(c in data.trie[sourceSearch])) {
          // eslint-disable-next-line no-loop-func
          Object.keys(data.trie[sourceSearch]).forEach((item) => {
            edgesFormated[`${sourceSearch}-${data.trie[sourceSearch][item]}`] = {
              data: {
                source: sourceSearch,
                target: data.trie[sourceSearch][item],
                label: item,
                id: `${sourceSearch}-${data.trie[sourceSearch][item]}`,
              },
              classes: 'reallyinactive',
            };
          });
          setElements({
            ...elements,
            edges: Object.values(edgesFormated),
          });
          isFound = false;
        } else {
          edgesFormated[`${sourceSearch}-${data.trie[sourceSearch][c]}`] = {
            data: {
              source: sourceSearch,
              target: data.trie[sourceSearch][c],
              label: c,
              id: `${sourceSearch}-${data.trie[sourceSearch][c]}`,
            },
            classes: 'active',
          };
          setElements({
            ...elements,
            edges: Object.values(edgesFormated),
          });
          setSourceSearch(data.trie[sourceSearch][c]);
          setResultIndex(resultIndex + 1);
        }
      }, value);
    }
    if (isFound && resultIndex === pattern.length) {
      setFindIndexesFlag(true);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [resultIndex]);

  useEffect(() => {
    if (disableButton) {
      // Umesto na disable button da ide, ovde staviti neki poseban flag

      // eslint-disable-next-line no-loop-func
      const edgesFormated = elements.edges.reduce((previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue.data.id]: {
            ...currentValue,
            classes: 'inactive',
          },
        };
      }, {});
      setElements({
        ...elements,
        edges: Object.values(edgesFormated),
      });
      setResultIndex(0);
    }
  }, [disableButton]);

  useEffect(() => {
    fetch(`http://localhost:5555/suffix/trie/construction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ genome }),
    })
      .then((response) => response.json())
      .then((res) => setData(res))
      .catch((error) => {
        console.error('Something went wrong!', error);
      });
  }, []);

  useEffect(() => {
    const { i, edge } = currentEdge;
    const suffixArrayCopy = [...suffixArray];
    if (edge) {
      suffixArrayCopy[i] += edge;
      setSuffixArray(suffixArrayCopy);
    } else {
      suffixArrayCopy[i] = `${i} `;
      setSuffixArray(suffixArrayCopy);
    }
  }, [currentEdge]);

  function createSuffixArray() {
    const suffixArrayValues = [];
    const genomeCopy = `${genome}$`;
    for (let i = 0; i < genomeCopy.length; i += 1) {
      suffixArrayValues.push(`${i} ${genomeCopy.substring(i)}`);
    }
    return suffixArrayValues;
  }

  useEffect(() => {
    let timeout;
    if (data && isPlaying) {
      const trieSuffixArray = data.trieArray;
      if (doStepByStep) {
        timeout = setTimeout(() => {
          const { i, j } = indexes;

          const { edge, source, target } = trieSuffixArray[i][j];
          const { nodes, edges } = elements;
          const edgesFormated =
            edges.length === 0
              ? {}
              : edges.reduce((previousValue, currentValue) => {
                  return {
                    ...previousValue,
                    [currentValue.data.id]: {
                      ...currentValue,
                      classes: 'inactive',
                    },
                  };
                }, {});
          edgesFormated[`${source}-${target}`] = {
            data: {
              source,
              target,
              label: edge,
              id: `${source}-${target}`,
            },
            classes: 'active',
          };
          setCurrentEdge({ i, edge });
          setElements({
            nodes: [
              ...nodes,
              { data: { id: source, label: source } },
              { data: { id: target, label: target } },
            ],
            edges: Object.values(edgesFormated),
          });
          if (j === trieSuffixArray[i].length - 1 && i === trieSuffixArray.length - 1) {
            clearTimeout(timeout);
            setDisableButton(true);
            return;
          }

          if (j === trieSuffixArray[i].length - 1) {
            setIndexes({ i: i + 1, j: 0 });
            setCurrentEdge({ i: i + 1 });
            return;
          }

          setIndexes({ i, j: j + 1 });
        }, value);
      } else {
        const edgesFormated = {};
        let nodesFormated = [];
        trieSuffixArray.forEach((trieSuffixArrayEntry) => {
          trieSuffixArrayEntry.forEach((trieSuffixArrayEntryValueObject) => {
            const { edge, source, target } = trieSuffixArrayEntryValueObject;
            nodesFormated = [
              ...nodesFormated,
              { data: { id: source, label: source } },
              { data: { id: target, label: target } },
            ];
            edgesFormated[`${source}-${target}`] = {
              data: {
                source,
                target,
                label: edge,
                id: `${source}-${target}`,
              },
              classes: 'inactive',
            };
          });
        });
        setSuffixArray(createSuffixArray());
        setElements({
          nodes: nodesFormated,
          edges: Object.values(edgesFormated),
        });
        setDisableButton(true);
      }
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [indexes, data, isPlaying]);

  const ref = useRef(null);
  useEffect(() => {
    const cy = cytoscape({
      container: ref.current,
      boxSelectionEnabled: false,
      autounselectify: true,
      layout: {
        name: 'dagre',
        ...defaults,
      },
      zoom: 0.6,
      pan: { x: 0, y: 0 },
      minZoom: 0.1,
      maxZoom: 1,
      wheelSensitivity: 0.1,
      motionBlur: false,
      motionBlurOpacity: 0.5,
      pixelRatio: 'auto',
      textureOnViewport: false,
      style,
      elements,
    });

    return function cleanup() {
      if (cy) {
        cy.destroy();
      }
    };
  }, [elements]);

  const changeValue = (event, valueToChange) => {
    setValue(valueToChange);
  };

  const renderedOutput = suffixArray
    ? suffixArray.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid container key={index}>
          <Grid item xs={10}>
            <div style={{ padding: '6px', float: 'left' }}>
              {item.charAt(item.length - 1) === '$' ? item : item.substring(0, item.length - 1)}
            </div>
            <div style={{ fontSize: '30px', float: 'left' }}>
              {item.charAt(item.length - 1) === '$' ? '' : item.substring(item.length - 1)}
            </div>
          </Grid>
        </Grid>
      ))
    : 'Error!!!';

  const indexesMatch = matchedIndexes
    ? matchedIndexes.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item textAlign="center" key={index} style={{ marginLeft: '10px' }}>
          <div style={{ float: 'left', fontSize: '30px' }}>
            {index === matchedIndexes.length - 1 ? item : `${item}, `}
          </div>
        </Grid>
      ))
    : '';
  return (
    <Grid spacing={2} style={{ marginLeft: '300px', marginTop: '80px' }}>
      <Grid container>
        <Grid item xs={5}>
          <Box textAlign="center" style={{ margin: '5% 3% 5% 3%' }}>
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
                setCurrentEdge({});
                setElements({ nodes: [], edges: [] });
                setIndexes({ i: 0, j: 0 });
                setIsPlaying(true);
                setSuffixArray(['0 ']);
                setResultIndex(-1);
                setSourceSearch('root');
                setFindIndexesFlag(false);
                matchedIndexes = [];
                alreadySeenMultipleNodes = [];
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
          <Grid container style={{ margin: '3% 0 3% 10%', fontSize: '30px' }}>
            Genom:
            <Grid style={{ marginLeft: '20px' }}>{genome}</Grid>
          </Grid>
          <Grid container style={{ margin: '3% 0 3% 10%', fontSize: '30px' }}>
            Patern:
            <Grid style={{ marginLeft: '20px' }}>{pattern}</Grid>
          </Grid>
          {disableButton && (
            <Stack direction="row" spacing={2} style={{ marginLeft: '10%', flexWrap: 'wrap' }}>
              <div style={{ marginBottom: '5%', fontSize: '30px' }}>Pronađena rešenja:</div>{' '}
              {indexesMatch}
            </Stack>
          )}
          <Grid style={{ margin: '3% 0 0 10%', fontSize: '30px' }}>
            Sufiksi genoma:
            <Grid style={{ margin: '2% 5%', fontSize: '20px' }}>{renderedOutput}</Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Box
            style={{
              borderRadius: '25px',
              border: '2px solid #081054',
              padding: '20px',
              width: '550px',
              height: '550px',
              margin: '2% 12%',
            }}
          >
            <div
              className="topology-viewer-component canvas-css"
              ref={ref}
              style={{ width: '550px', height: '550px' }}
            />
          </Box>
        </Grid>
      </Grid>
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

export default SuffixTree;
