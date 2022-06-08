import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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

function findAllIndexesOfPatternMatching(trie, source, patternMatchingIndexes) {
  if (trie[source] && Object.keys(trie[source]).length === 0) {
    patternMatchingIndexes.push(source);
  }
  Object.values(trie[source]).forEach((c) => {
    findAllIndexesOfPatternMatching(trie, c, patternMatchingIndexes);
  });
}

let k = 0;
function SuffixTree({ genome, pattern }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [suffixArray, setSuffixArray] = useState(['0 ']);
  const [currentEdge, setCurrentEdge] = useState({});
  const [matchedIndexes, setMatchedIndexes] = useState([]);

  // TODO: Ruzno je, vidi kako ovo bolje da se uradi, da zove samo jednom
  if (data && k < 1) {
    // const suffixTrie = data.trie;
    // Ova funkcija vraca indekse
    // doesTrieContains(pattern, suffixTrie);
    k += 1;
  }

  useEffect(() => {
    if (disableButton) {
      let source = 'root';
      const patternMatchingIndexes = [];
      let isFound = true;
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
      for (let i = 0; i < pattern.length; i += 1) {
        const c = pattern.charAt(i);
        if (!(c in data.trie[source])) {
          // eslint-disable-next-line no-loop-func
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
          isFound = false;
          break;
        }
        edgesFormated[`${source}-${data.trie[source][c]}`] = {
          data: {
            source,
            target: data.trie[source][c],
            label: c,
            id: `${source}-${data.trie[source][c]}`,
          },
          classes: 'active',
        };
        setElements({
          ...elements,
          edges: Object.values(edgesFormated),
        });
        source = data.trie[source][c];
      }
      if (isFound) {
        findAllIndexesOfPatternMatching(data.trie, source, patternMatchingIndexes);
        console.log(patternMatchingIndexes);
        setMatchedIndexes(patternMatchingIndexes);
      }
    }
  }, [disableButton]);

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      mode: 'cors',
      headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' },
      body: JSON.stringify({ genome }),
    };
    fetch('/suffix/trie/construction', requestOptions)
      .then((response) => response.json())
      .then((res) => setData(res))
      .catch((error) => {
        console.error('Something went wrong!', error);
      });
  }, []);

  useEffect(() => {
    let timeout;
    if (data && isPlaying) {
      const trieSuffixArray = data.trie_suffix_array;
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
      }, 100);
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
    console.log(elements);
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

  const indexesMatch = matchedIndexes
    ? matchedIndexes.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item textAlign="center" key={index}>
          <div style={{ color: '#00FFFF', padding: '6px', float: 'left', fontSize: '50px' }}>
            {index === matchedIndexes.length - 1 ? item : `${item}, `}
          </div>
        </Grid>
      ))
    : '';
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
        </Box>
        {disableButton && (
          <Stack direction="row" spacing={2} style={{ margin: '5% 0 2% 10%' }}>
            {indexesMatch}
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

export default SuffixTree;
