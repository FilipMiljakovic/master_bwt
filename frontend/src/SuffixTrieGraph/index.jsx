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
  textTransform: 'none',
  fontSize: '20px',
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
  const [value, setValue] = useState(500);
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
      setDisableButton(true);
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
      <h1 style={{ textAlign: 'center' }}>Algoritam sufiksnim stablom- rešenje</h1>
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
              Resetuj
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
          {/* {disableButton && ( */}
          <Stack direction="row" spacing={2} style={{ marginLeft: '10%', flexWrap: 'wrap' }}>
            <div style={{ marginBottom: '5%', fontSize: '30px' }}>Pronađena rešenja:</div>{' '}
            {indexesMatch}
          </Stack>
          {/* )} */}
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
          Da bismo našli da se određeni patern nalazi u genomu kao podniska potrebno je da počev od
          prvog karaktera paterna prođemo kroz stablo Trie(Genom) krećući se od korena. Ako možemo
          da nađemo putanju u stablu a da smo prošli kroz sve karaktere paterna, onda znamo da se on
          mora pojavljivati u genomu. Ukoliko kretanjem kroz stablo dođemo do lista i poslednji
          karakter paterna se tu nalazi, odatle možemo zaključiti da je patern sufiks genoma. U tom
          slučaju možemo iz lista pročitati indeks na kojem taj sufiks počinje i tu informaciju
          vratiti kao mesto gde se patern pojavljuje u genomu.
        </Typography>
        <Typography paragraph>
          Ako se poslednjim karakterom paterna zaustavimo pre lista u nekom čvoru v, isto imamo
          poklapanje. U ovom slučaju patern može, a ne mora, da se pojavljuje više puta u niski
          genom. Tada, da bismo došli do indeksa gde patern počinje u genomu potrebno je da se
          krećemo svim granama od trenutnog čvora v do listova stabla i odatle dobijemo informaciju
          o indeksima.
        </Typography>
        <Typography paragraph>
          Moguć je i slučaj da nemamo poklapanja. Tada će pretraga stati na nekom čvoru unutar
          stabla i neće postojati grana iz tog čvora koja će odgovarati narednom karakteru paterna.
          U tom slučaju zaustavljamo pretragu i zaključujemo da se patern ne nalazi u genomu kao
          podniska.
        </Typography>
        <Typography paragraph>
          Kod prethodno objašnjenog rešenja stablo konstruišemo od svih sufiksa niske Genom, koji su
          dužine od 1 do |Genom| i imaju ukupnu dužinu |Genom|·(|Genom|+ 1)/2. Zaključujemo da je
          složenost približna vrednosti od O(|Genom|<sup>2</sup>).
        </Typography>
        <Typography paragraph>
          Na ovoj stranici se nalaze isti elementi za manipulaciju sa izvršavanjem algoritma
          (Pause/Play dugme, Resetuj dugme i slajder za regulaciju brzine) kao i na stranici za
          iterativni algoritam. Tu su i ulazni parametri (niska Genom i niska Patern). Pored ovoga
          tu je i grafički prikaz kreiranja sufiksnog stabla od sufiksa niske Genom, koji su takođe
          prikazani sa strane. Kreiranje može biti urađeno postupno (granu po granu) ili ne, u
          zavisnosti od toga da li je checkbox na prethodnoj strani štikliran. Na tom stablu će biti
          postupno prikazano i uparivanje, tj. nalaženje rešenja. Slično kao ranije, pozitivna
          poklapanja u datom trenutku će biti obojena zelenom bojom, a negativna crvenom bojom na
          granama. Pronađena rešenja su prikazana u ispod pored labele `Pronađena rešenja:`.
        </Typography>
      </Box>
    </Grid>
  );
}

export default SuffixTree;
