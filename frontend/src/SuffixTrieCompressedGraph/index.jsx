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

// function findAllIndexesOfPatternMatching(trie, source, patternMatchingIndexes) {
//   if (trie[source] && Object.keys(trie[source]).length === 0) {
//     patternMatchingIndexes.push(source);
//   }
//   // Vidi kako ovu funkciju da prebacis u useEffect i da svaki prolaz modifikuje svoje grane
//   // Uvedi posebnu boju za te grane koje ce da se pretraze, u css
//   Object.values(trie[source]).forEach((c) => {
//     findAllIndexesOfPatternMatching(trie, c, patternMatchingIndexes);
//   });
// }
let matchedIndexes = [];
let alreadySeenMultipleNodes = [];
let sourceSearch = 'root';
function SuffixTrieCompressed({ genome, pattern, doStepByStep }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [suffixArray, setSuffixArray] = useState(['0 ']);
  const [currentEdge, setCurrentEdge] = useState({});
  const [value, setValue] = useState(300);
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
    if (trie[source] && c[0][c[0].length - 1] === '$') {
      matchedIndexes.push(trie[source][c[0]]);
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
        if (c[0][c[0].length - 1] !== '$') {
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
    if (disableButton) {
      // Umesto na disable button da ide, ovde staviti neki poseban flag
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
      let currentIteration = patternTmp.length;
      const interval = setInterval(() => {
        currentIteration -= 1;
        if (currentIteration === 0) {
          clearInterval(interval);
          if (isFound) {
            setFindIndexesFlag(true);
          } else {
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
          }
        }

        const patternSubstring = patternTmp.substring(0, currentIteration);
        const sourceKeys = Object.keys(data.trie[sourceSearch]);
        for (let j = 0; j < sourceKeys.length; j += 1) {
          if (
            (sourceKeys[j].startsWith(patternSubstring) &&
              currentIteration === patternTmp.length - 1 &&
              currentIteration > 0) ||
            (currentIteration !== patternTmp.length && sourceKeys[j] === patternSubstring)
          ) {
            edgesFormated[`${sourceSearch}-${data.trie[sourceSearch][sourceKeys[j]]}`] = {
              data: {
                source: sourceSearch,
                target: data.trie[sourceSearch][sourceKeys[j]],
                label: sourceKeys[j],
                id: `${sourceSearch}-${data.trie[sourceSearch][sourceKeys[j]]}`,
              },
              classes: 'active',
            };
            setElements({
              ...elements,
              edges: Object.values(edgesFormated),
            });
            sourceSearch = data.trie[sourceSearch][sourceKeys[j]];
            patternTmp = patternTmp.substring(currentIteration);
            currentIteration = patternTmp.length;
            break;
          } else if (j === sourceKeys.length - 1 && currentIteration === 1) {
            isFound = false;
          }
        }
      }, value);
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

  const indexesMatch = matchedIndexes
    ? matchedIndexes.map((item, index) => (
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
              setFindIndexesFlag(false);
              matchedIndexes = [];
              alreadySeenMultipleNodes = [];
              sourceSearch = 'root';
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
