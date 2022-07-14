import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled } from '@mui/material/styles';
import { style } from './styles';

cytoscape.use(dagre);

const CustomButton = styled(Button)(() => ({
  width: '30%',
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
  margin: '5px',
}));

export const defaults = {
  // dagre algo options, uses default value on undefined
  nodeSep: 50, // the separation between adjacent nodes in the same rank
  edgeSep: undefined, // the separation between adjacent edges in the same rank
  rankSep: 100, // the separation between each rank in the layout
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

function findAllIndexesOfPatternMatching(trie, source, patternMatchingIndexes) {
  if (trie[source] && Object.keys(trie[source]).length === 0) {
    patternMatchingIndexes.push(source);
  }
  // Vidi kako ovu funkciju da prebacis u useEffect i da svaki prolaz modifikuje svoje grane
  // Uvedi posebnu boju za te grane koje ce da se pretraze, u css
  Object.values(trie[source]).forEach((c) => {
    findAllIndexesOfPatternMatching(trie, c, patternMatchingIndexes);
  });
}

function SuffixTrieCompressed({ genome, pattern }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [suffixArray, setSuffixArray] = useState(['0 ']);
  const [currentEdge, setCurrentEdge] = useState({});
  const [value, setValue] = useState(400);
  const [matchedIndexes, setMatchedIndexes] = useState([]);

  useEffect(() => {
    if (disableButton) {
      // Umesto na disable button da ide, ovde staviti neki poseban flag
      let source = 'root';
      const patternMatchingIndexes = [];
      // VIDI KAKO PROMENITI ISFOUND I KADA!!!!!!
      let isFound = true;
      let patternTmp = `${pattern}$`;
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
      // Ovo mora da se izdvoji u indekse
      for (let i = patternTmp.length; i > 0; i -= 1) {
        const patternSubstring = patternTmp.substring(0, i);
        const sourceKeys = Object.keys(data.trie[source]);
        for (let j = 0; j < sourceKeys.length; j += 1) {
          if (sourceKeys[j].startsWith(patternSubstring)) {
            edgesFormated[`${source}-${data.trie[source][sourceKeys[j]]}`] = {
              data: {
                source,
                target: data.trie[source][sourceKeys[j]],
                label: sourceKeys[j],
                id: `${source}-${data.trie[source][sourceKeys[j]]}`,
              },
              classes: 'active',
            };
            setElements({
              ...elements,
              edges: Object.values(edgesFormated),
            });
            source = data.trie[source][sourceKeys[j]];
            patternTmp = patternTmp.substring(i);
            i = patternTmp.length;
            break;
          } else if (j === sourceKeys.length - 1 && i === 1) {
            isFound = false;
          }
        }
      }
      //   // Ako nije nasao, boji svakako sve podcvorove u crveno
      //   if (!(patternSubstring in data.trie[source])) {
      //     if (i === patternTmp.length - 1) {
      //       // eslint-disable-next-line no-loop-func
      //       Object.keys(data.trie[source]).forEach((item) => {
      //         edgesFormated[`${source}-${data.trie[source][item]}`] = {
      //           data: {
      //             source,
      //             target: data.trie[source][item],
      //             label: item,
      //             id: `${source}-${data.trie[source][item]}`,
      //           },
      //           classes: 'reallyinactive',
      //         };
      //       });
      //       setElements({
      //         ...elements,
      //         edges: Object.values(edgesFormated),
      //       });
      //       isFound = false;
      //       break;
      //     }
      //     // eslint-disable-next-line no-continue
      //     continue;
      //   }
      //   // Dva usecase-a. Ako je ostalo nesto u patternu, onda oboj ovo sto je nasao i nastavi dalje,
      //   // ako ne, onda samo taj oboj i nadji indeks (ako je stigao do kraja indeksa i nasao kao podstring postojeceg)
      //   edgesFormated[`${source}-${data.trie[source][patternSubstring]}`] = {
      //     data: {
      //       source,
      //       target: data.trie[source][patternSubstring],
      //       label: patternSubstring,
      //       id: `${source}-${data.trie[source][patternSubstring]}`,
      //     },
      //     classes: 'active',
      //   };
      //   setElements({
      //     ...elements,
      //     edges: Object.values(edgesFormated),
      //   });
      //   source = data.trie[source][patternSubstring];
      //   patternTmp = patternTmp.substring(i);
      //   i = 0;
      // }
      if (isFound) {
        findAllIndexesOfPatternMatching(data.trie, source, patternMatchingIndexes);
        setMatchedIndexes(patternMatchingIndexes);
      } else {
        Object.keys(data.trie[source]).forEach((item) => {
          edgesFormated[`${source}-${data.trie[source][item]}`] = {
            data: {
              source,
              target: data.trie[source][item],
              label: item,
              id: `${source}-${data.trie[source][item]}`,
            },
            classes: 'reallyinactive',
          };
        });
        setElements({
          ...elements,
          edges: Object.values(edgesFormated),
        });
      }
    }
  }, [disableButton]);

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ genome }),
    };
    fetch('http://localhost:5555/suffix/compressed/trie/construction', requestOptions)
      .then((response) => response.json())
      .then((res) => setData(res))
      .catch((error) => {
        console.error('Something went wrong!', error);
      });
  }, []);

  useEffect(() => {
    let timeout;
    if (data && isPlaying) {
      const trieSuffixArray = data.trieArray;
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
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [indexes, data, isPlaying]);

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

  const indexesMatch = matchedIndexes
    ? matchedIndexes.sort().map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item textAlign="center" key={index} style={{ marginLeft: '10px' }}>
          <div style={{ color: '#00FFFF', float: 'left', fontSize: '30px' }}>
            {index === matchedIndexes.length - 1 ? item : `${item}, `}
          </div>
        </Grid>
      ))
    : '';

  const renderedOutput = suffixArray
    ? suffixArray.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid container key={index}>
          <Grid item xs={10}>
            <div style={{ color: '#00FFFF', padding: '6px', float: 'left' }}>
              {item.charAt(item.length - 1) === '$' ? item : item.substring(0, item.length - 1)}
            </div>
            <div style={{ color: '#00FFFF', fontSize: '30px', float: 'left' }}>
              {item.charAt(item.length - 1) === '$' ? '' : item.substring(item.length - 1)}
            </div>
          </Grid>
        </Grid>
      ))
    : 'Error!!!';
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
              setElements({ nodes: [], edges: [] });
              setIndexes({ i: 0, j: 0 });
              setIsPlaying(true);
              setSuffixArray(['0 ']);
              setCurrentEdge({});
              setMatchedIndexes([]);
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
        {disableButton && (
          <Stack direction="row" spacing={2} style={{ margin: '5% 0 2% 10%', color: '#00FFFF' }}>
            <div style={{ margin: '6px' }}>Indexses found:</div> {indexesMatch}
          </Stack>
        )}
        <Box style={{ marginLeft: '10%' }}>{renderedOutput}</Box>
      </Grid>
      <Grid item xs={8}>
        <Box
          style={{
            borderRadius: '25px',
            border: '2px solid #00FFFF',
            padding: '20px',
            width: '650px',
            height: '650px',
            margin: '2% 12%',
          }}
        >
          <div
            className="topology-viewer-component canvas-css"
            ref={ref}
            style={{ width: '650px', height: '650px' }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default SuffixTrieCompressed;
