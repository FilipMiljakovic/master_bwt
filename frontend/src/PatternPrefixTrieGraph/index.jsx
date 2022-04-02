import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { styled } from '@mui/material/styles';
import { style } from './styles';

cytoscape.use(dagre);

const CustomButton = styled(Button)(() => ({
  width: '50%',
  height: 50,
  backgroundColor: '#00FFFF',
  color: '#191970',
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

function findAllIndexesOfGenomeMatching(trie, source, genomeMatchingIndexes) {
  if (trie[source] && Object.keys(trie[source]).length === 0) {
    genomeMatchingIndexes.push(source);
  }
  Object.values(trie[source]).forEach((c) => {
    findAllIndexesOfGenomeMatching(trie, c, genomeMatchingIndexes);
  });
}

// TODO: This should be used to find matching index
function doesTrieContains(genome, trie) {
  let source = 'root';
  const genomeMatchingIndexes = [];
  for (let i = 0; i < genome.length; i += 1) {
    const c = genome.charAt(i);
    if (!(c in trie[source])) {
      // TODO: oboj u crveno sve cvorove u trie[source]
      return false;
    }
    // else {
    //   // TODO: oboj tekuci cvor u zeleno
    // }
    source = trie[source][c];
  }
  findAllIndexesOfGenomeMatching(trie, source, genomeMatchingIndexes);
  console.log(genomeMatchingIndexes);
  return genomeMatchingIndexes;
}

let k = 0;
function PatternPrefixTrie({ genome, patternList }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [suffixArray, setSuffixArray] = useState(['0 ']);
  const [currentEdge, setCurrentEdge] = useState({});

  // TODO: Ruzno je, vidi kako ovo bolje da se uradi, da zove samo jednom
  if (data && k < 1) {
    const suffixTrie = data.trie;
    doesTrieContains(genome, suffixTrie);
    k += 1;
  }
  const patternListSeparated = patternList.split(',').map((element) => {
    return `${element.trim()}$`;
  });
  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ matching_pattern_list: patternListSeparated }),
    };
    fetch('http://localhost:5000/pattern/trie/construction', requestOptions)
      .then((response) => response.json())
      .then((res) => setData(res))
      .catch((error) => {
        console.error('Something went wrong!', error);
      });
  }, []);

  useEffect(() => {
    let timeout;
    if (data && isPlaying) {
      const triePatternArray = data.trie_pattern_array;
      timeout = setTimeout(() => {
        const { i, j } = indexes;

        const { edge, source, target } = triePatternArray[i][j];
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
        if (j === triePatternArray[i].length - 1 && i === triePatternArray.length - 1) {
          clearTimeout(timeout);
          setDisableButton(true);
          return;
        }

        if (j === triePatternArray[i].length - 1) {
          setIndexes({ i: i + 1, j: 0 });
          setCurrentEdge({ i: i + 1 });
          return;
        }

        setIndexes({ i, j: j + 1 });
      }, 600);
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
    ? suffixArray.map((item) => (
        <Grid container>
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
        <Box textAlign="center" style={{ marginTop: '20%' }}>
          <CustomButton
            disabled={disableButton}
            variant="contained"
            startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            onClick={() => setIsPlaying(!isPlaying)}
          />
        </Box>
        <Box style={{ margin: '10%' }}>{renderedOutput}</Box>
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

export default PatternPrefixTrie;
