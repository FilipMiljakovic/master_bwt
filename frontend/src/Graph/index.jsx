import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import Grid from '@mui/material/Grid';
// import axios from 'axios';
import { style } from './styles';
// import grid

cytoscape.use(dagre);

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

// const trieSuffixArray = [
//   [
//     {
//       edge: 'a',
//       source: 'root',
//       target: 'i1',
//     },
//     {
//       edge: '$',
//       source: 'i1',
//       target: '0',
//     },
//   ],
//   [
//     {
//       edge: 'a',
//       source: 'root',
//       target: 'i1',
//     },
//     {
//       edge: 'm',
//       source: 'i1',
//       target: 'i2',
//     },
//     {
//       edge: 'a',
//       source: 'i2',
//       target: 'i3',
//     },
//     {
//       edge: '$',
//       source: 'i3',
//       target: '1',
//     },
//   ],
//   [
//     {
//       edge: 'a',
//       source: 'root',
//       target: 'i1',
//     },
//     {
//       edge: 'n',
//       source: 'i1',
//       target: 'i4',
//     },
//     {
//       edge: 'a',
//       source: 'i4',
//       target: 'i5',
//     },
//     {
//       edge: 'm',
//       source: 'i5',
//       target: 'i6',
//     },
//     {
//       edge: 'a',
//       source: 'i6',
//       target: 'i7',
//     },
//     {
//       edge: '$',
//       source: 'i7',
//       target: '2',
//     },
//   ],
//   [
//     {
//       edge: 'a',
//       source: 'root',
//       target: 'i1',
//     },
//     {
//       edge: 'n',
//       source: 'i1',
//       target: 'i4',
//     },
//     {
//       edge: 'a',
//       source: 'i4',
//       target: 'i5',
//     },
//     {
//       edge: 'n',
//       source: 'i5',
//       target: 'i8',
//     },
//     {
//       edge: 'a',
//       source: 'i8',
//       target: 'i9',
//     },
//     {
//       edge: 's',
//       source: 'i9',
//       target: 'i10',
//     },
//     {
//       edge: 'p',
//       source: 'i10',
//       target: 'i11',
//     },
//     {
//       edge: 'a',
//       source: 'i11',
//       target: 'i12',
//     },
//     {
//       edge: 'n',
//       source: 'i12',
//       target: 'i13',
//     },
//     {
//       edge: 'a',
//       source: 'i13',
//       target: 'i14',
//     },
//     {
//       edge: 'm',
//       source: 'i14',
//       target: 'i15',
//     },
//     {
//       edge: 'a',
//       source: 'i15',
//       target: 'i16',
//     },
//     {
//       edge: '$',
//       source: 'i16',
//       target: '3',
//     },
//   ],
//   [
//     {
//       edge: 'a',
//       source: 'root',
//       target: 'i1',
//     },
//     {
//       edge: 'n',
//       source: 'i1',
//       target: 'i4',
//     },
//     {
//       edge: 'a',
//       source: 'i4',
//       target: 'i5',
//     },
//     {
//       edge: 's',
//       source: 'i5',
//       target: 'i17',
//     },
//     {
//       edge: 'p',
//       source: 'i17',
//       target: 'i18',
//     },
//     {
//       edge: 'a',
//       source: 'i18',
//       target: 'i19',
//     },
//     {
//       edge: 'n',
//       source: 'i19',
//       target: 'i20',
//     },
//     {
//       edge: 'a',
//       source: 'i20',
//       target: 'i21',
//     },
//     {
//       edge: 'm',
//       source: 'i21',
//       target: 'i22',
//     },
//     {
//       edge: 'a',
//       source: 'i22',
//       target: 'i23',
//     },
//     {
//       edge: '$',
//       source: 'i23',
//       target: '4',
//     },
//   ],
//   [
//     {
//       edge: 'a',
//       source: 'root',
//       target: 'i1',
//     },
//     {
//       edge: 's',
//       source: 'i1',
//       target: 'i24',
//     },
//     {
//       edge: 'p',
//       source: 'i24',
//       target: 'i25',
//     },
//     {
//       edge: 'a',
//       source: 'i25',
//       target: 'i26',
//     },
//     {
//       edge: 'n',
//       source: 'i26',
//       target: 'i27',
//     },
//     {
//       edge: 'a',
//       source: 'i27',
//       target: 'i28',
//     },
//     {
//       edge: 'm',
//       source: 'i28',
//       target: 'i29',
//     },
//     {
//       edge: 'a',
//       source: 'i29',
//       target: 'i30',
//     },
//     {
//       edge: '$',
//       source: 'i30',
//       target: '5',
//     },
//   ],
//   [
//     {
//       edge: 'b',
//       source: 'root',
//       target: 'i31',
//     },
//     {
//       edge: 'a',
//       source: 'i31',
//       target: 'i32',
//     },
//     {
//       edge: 'n',
//       source: 'i32',
//       target: 'i33',
//     },
//     {
//       edge: 'a',
//       source: 'i33',
//       target: 'i34',
//     },
//     {
//       edge: 'n',
//       source: 'i34',
//       target: 'i35',
//     },
//     {
//       edge: 'a',
//       source: 'i35',
//       target: 'i36',
//     },
//     {
//       edge: 's',
//       source: 'i36',
//       target: 'i37',
//     },
//     {
//       edge: 'p',
//       source: 'i37',
//       target: 'i38',
//     },
//     {
//       edge: 'a',
//       source: 'i38',
//       target: 'i39',
//     },
//     {
//       edge: 'n',
//       source: 'i39',
//       target: 'i40',
//     },
//     {
//       edge: 'a',
//       source: 'i40',
//       target: 'i41',
//     },
//     {
//       edge: 'm',
//       source: 'i41',
//       target: 'i42',
//     },
//     {
//       edge: 'a',
//       source: 'i42',
//       target: 'i43',
//     },
//     {
//       edge: '$',
//       source: 'i43',
//       target: '6',
//     },
//   ],
//   [
//     {
//       edge: 'm',
//       source: 'root',
//       target: 'i44',
//     },
//     {
//       edge: 'a',
//       source: 'i44',
//       target: 'i45',
//     },
//     {
//       edge: '$',
//       source: 'i45',
//       target: '7',
//     },
//   ],
//   [
//     {
//       edge: 'n',
//       source: 'root',
//       target: 'i46',
//     },
//     {
//       edge: 'a',
//       source: 'i46',
//       target: 'i47',
//     },
//     {
//       edge: 'm',
//       source: 'i47',
//       target: 'i48',
//     },
//     {
//       edge: 'a',
//       source: 'i48',
//       target: 'i49',
//     },
//     {
//       edge: '$',
//       source: 'i49',
//       target: '8',
//     },
//   ],
//   [
//     {
//       edge: 'n',
//       source: 'root',
//       target: 'i46',
//     },
//     {
//       edge: 'a',
//       source: 'i46',
//       target: 'i47',
//     },
//     {
//       edge: 'n',
//       source: 'i47',
//       target: 'i50',
//     },
//     {
//       edge: 'a',
//       source: 'i50',
//       target: 'i51',
//     },
//     {
//       edge: 's',
//       source: 'i51',
//       target: 'i52',
//     },
//     {
//       edge: 'p',
//       source: 'i52',
//       target: 'i53',
//     },
//     {
//       edge: 'a',
//       source: 'i53',
//       target: 'i54',
//     },
//     {
//       edge: 'n',
//       source: 'i54',
//       target: 'i55',
//     },
//     {
//       edge: 'a',
//       source: 'i55',
//       target: 'i56',
//     },
//     {
//       edge: 'm',
//       source: 'i56',
//       target: 'i57',
//     },
//     {
//       edge: 'a',
//       source: 'i57',
//       target: 'i58',
//     },
//     {
//       edge: '$',
//       source: 'i58',
//       target: '9',
//     },
//   ],
//   [
//     {
//       edge: 'n',
//       source: 'root',
//       target: 'i46',
//     },
//     {
//       edge: 'a',
//       source: 'i46',
//       target: 'i47',
//     },
//     {
//       edge: 's',
//       source: 'i47',
//       target: 'i59',
//     },
//     {
//       edge: 'p',
//       source: 'i59',
//       target: 'i60',
//     },
//     {
//       edge: 'a',
//       source: 'i60',
//       target: 'i61',
//     },
//     {
//       edge: 'n',
//       source: 'i61',
//       target: 'i62',
//     },
//     {
//       edge: 'a',
//       source: 'i62',
//       target: 'i63',
//     },
//     {
//       edge: 'm',
//       source: 'i63',
//       target: 'i64',
//     },
//     {
//       edge: 'a',
//       source: 'i64',
//       target: 'i65',
//     },
//     {
//       edge: '$',
//       source: 'i65',
//       target: '10',
//     },
//   ],
//   [
//     {
//       edge: 'p',
//       source: 'root',
//       target: 'i66',
//     },
//     {
//       edge: 'a',
//       source: 'i66',
//       target: 'i67',
//     },
//     {
//       edge: 'n',
//       source: 'i67',
//       target: 'i68',
//     },
//     {
//       edge: 'a',
//       source: 'i68',
//       target: 'i69',
//     },
//     {
//       edge: 'm',
//       source: 'i69',
//       target: 'i70',
//     },
//     {
//       edge: 'a',
//       source: 'i70',
//       target: 'i71',
//     },
//     {
//       edge: '$',
//       source: 'i71',
//       target: '11',
//     },
//   ],
//   [
//     {
//       edge: 's',
//       source: 'root',
//       target: 'i72',
//     },
//     {
//       edge: 'p',
//       source: 'i72',
//       target: 'i73',
//     },
//     {
//       edge: 'a',
//       source: 'i73',
//       target: 'i74',
//     },
//     {
//       edge: 'n',
//       source: 'i74',
//       target: 'i75',
//     },
//     {
//       edge: 'a',
//       source: 'i75',
//       target: 'i76',
//     },
//     {
//       edge: 'm',
//       source: 'i76',
//       target: 'i77',
//     },
//     {
//       edge: 'a',
//       source: 'i77',
//       target: 'i78',
//     },
//     {
//       edge: '$',
//       source: 'i78',
//       target: '12',
//     },
//   ],
// ];

// async function getResults(genome, pattern) {
//   axios
//     .post(
//       'http://localhost:5100/trie/construction',
//       {
//         pattern_string: pattern,
//         matching_string: genome,
//       },
//       { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
//     )
//     .then((res) => {
//       return res.data;
//     })
//     .catch((error) => {
//       console.error('Something went wrong!', error);
//     });
// }

function findAllIndexesOfPatternMatching(trie, source, patternMatchingIndexes) {
  if (trie[source] && Object.keys(trie[source]).length === 0) {
    patternMatchingIndexes.push(source);
  }
  Object.values(trie[source]).forEach((c) => {
    findAllIndexesOfPatternMatching(trie, c, patternMatchingIndexes);
  });
}

// TODO: This should be used to find matching index
function doesTrieContains(pattern, trie) {
  // def prefix_trie_pattern_matching(text, Trie):
  //   v = 'root'

  //   for c in text:
  //       if c not in Trie[v]:
  //           return False

  //       v = Trie[v][c]

  //       if '$' in Trie[v]:
  //           return Trie[v]['$']

  //   return False
  let source = 'root';
  const patternMatchingIndexes = [];
  for (let i = 0; i < pattern.length; i += 1) {
    const c = pattern.charAt(i);
    if (!(c in trie[source])) {
      // TODO: oboj u crveno sve cvorove u trie[source]
      return false;
    }
    // else {
    //   // TODO: oboj tekuci cvor u zeleno
    // }
    source = trie[source][c];
  }
  // ovde bi trebalo da ode do lista za svaki i da uzme index gde pocinje taj sufix
  findAllIndexesOfPatternMatching(trie, source, patternMatchingIndexes);
  console.log(patternMatchingIndexes);
  return patternMatchingIndexes;
}
let k = 0;
function SuffixTree({ genome, pattern }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });

  if (data && k < 1) {
    const suffixTrie = data.trie;
    doesTrieContains(pattern, suffixTrie);
    k += 1;
  }
  useEffect(() => {
    // const suffixTrieResults = async () => {
    //   const result = await getResults(genome, pattern);
    //   setData(result);
    // };
    // suffixTrieResults();
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: 'POST',
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern_string: genome, matching_string: pattern }),
    };
    fetch('http://localhost:5011/trie/construction', requestOptions)
      .then((response) => response.json())
      .then((res) => setData(res))
      .catch((error) => {
        console.error('Something went wrong!', error);
      });
  }, []);

  useEffect(() => {
    let timeout;
    if (data) {
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
          return;
        }
        if (j === trieSuffixArray[i].length - 1) {
          setIndexes({ i: i + 1, j: 0 });
          return;
        }
        setIndexes({ i, j: j + 1 });
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [indexes, data]);

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
      zoom: 1,
      pan: { x: 0, y: 0 },
      minZoom: 0.1,
      maxZoom: 0.6,
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

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={4}>
        <Box>Prvi deo</Box>
      </Grid> */}
      <Grid item xs={12}>
        <Box>
          <div className="topology-viewer-component canvas-css" ref={ref} />
        </Box>
      </Grid>
    </Grid>
  );
}

export default SuffixTree;
