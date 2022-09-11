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

let resultIsWrong = false;
function PatternPrefixTrie({ genome, patternList, doStepByStep }) {
  const [data, setData] = useState(null);
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [indexes, setIndexes] = useState({ i: 0, j: 0 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const [suffixArray, setSuffixArray] = useState(['0 ']);
  const [currentEdge, setCurrentEdge] = useState({});
  const [value, setValue] = useState(100);
  const [matchingIndexes, setMatchingIndexes] = useState([]);
  const [resultSearchIndexes, setResultSearchIndexes] = useState({ i: -1, j: -1 });
  const [trieState, setTrieState] = useState({});
  const [genomeObject, setGenomeObject] = useState({});
  const [genomeCopy, setGenomeCopy] = useState(genome);
  const [sourceState, setSourceState] = useState('root');
  const [resultValue, setResultValue] = useState('');
  const [genomeView, setGenomeView] = useState(
    <Grid container>
      <Stack direction="row" xs={12}>
        <div style={{ float: 'left' }}>{genome}</div>
      </Stack>
    </Grid>,
  );

  const matchingPatternList = patternList.split(',').map((element) => {
    return `${element.trim()}$`;
  });

  useEffect(() => {
    const listItem = genomeObject;
    if (listItem.index) {
      setGenomeView(
        <Grid container>
          <Stack direction="row" xs={12}>
            <div style={{ float: 'left', color: 'gray' }}>
              {genome.substring(0, listItem.index)}
            </div>
            <div style={{ float: 'left', color: 'green' }}>
              {genome.substring(listItem.index, listItem.index + listItem.jIndex - 1)}
            </div>
            {resultIsWrong && (
              <div style={{ float: 'left', color: 'red' }}>
                {genome.substring(
                  listItem.index + listItem.jIndex - 1,
                  listItem.index + listItem.jIndex,
                )}
              </div>
            )}
            {resultIsWrong && (
              <div style={{ float: 'left' }}>
                {genome.substring(listItem.index + listItem.jIndex)}
              </div>
            )}
            {!resultIsWrong && (
              <div style={{ float: 'left' }}>
                {genome.substring(listItem.index + listItem.jIndex - 1)}
              </div>
            )}
          </Stack>
        </Grid>,
      );
    }
  }, [genomeObject]);

  useEffect(() => {
    let timeout;
    if (Object.keys(trieState).length > 0 && isPlaying) {
      timeout = setTimeout(() => {
        const { i, j } = resultSearchIndexes;
        let edgesFormated = elements.edges.reduce((previousValue, currentValue) => {
          return {
            ...previousValue,
            [currentValue.data.id]: {
              ...currentValue,
            },
          };
        }, {});

        if (j !== -1) {
          const c = genomeCopy.charAt(j);
          if ('$' in trieState[sourceState]) {
            setMatchingIndexes([[resultValue, i], ...matchingIndexes]);
            if (Object.keys(trieState[sourceState]).length === 1) {
              resultIsWrong = false;
              edgesFormated[`${sourceState}-${data.trie[sourceState].$}`] = {
                data: {
                  source: sourceState,
                  target: data.trie[sourceState].$,
                  label: '$',
                  id: `${sourceState}-${data.trie[sourceState].$}`,
                },
                classes: 'active',
              };
              setElements({
                ...elements,
                edges: Object.values(edgesFormated),
              });
              setResultSearchIndexes({ i, j: -1 });
              setSourceState('root');
              setResultValue('');
            } else if (c in trieState[sourceState]) {
              setResultValue(resultValue + c);
              edgesFormated[`${sourceState}-${data.trie[sourceState][c]}`] = {
                data: {
                  source: sourceState,
                  target: data.trie[sourceState][c],
                  label: c,
                  id: `${sourceState}-${data.trie[sourceState][c]}`,
                },
                classes: 'active',
              };
              edgesFormated[`${sourceState}-${data.trie[sourceState].$}`] = {
                data: {
                  source: sourceState,
                  target: data.trie[sourceState].$,
                  label: '$',
                  id: `${sourceState}-${data.trie[sourceState].$}`,
                },
                classes: 'active',
              };
              setElements({
                ...elements,
                edges: Object.values(edgesFormated),
              });
              setSourceState(trieState[sourceState][c]);
              setResultSearchIndexes({ i, j: j + 1 });
            } else {
              resultIsWrong = true;
              setResultSearchIndexes({ i, j: -1 });
              Object.keys(data.trie[sourceState]).forEach((item) => {
                if (item !== '$') {
                  edgesFormated[`${sourceState}-${data.trie[sourceState][item]}`] = {
                    data: {
                      source: sourceState,
                      target: data.trie[sourceState][item],
                      label: item,
                      id: `${sourceState}-${data.trie[sourceState][item]}`,
                    },
                    classes: 'reallyinactive',
                  };
                }
              });
              edgesFormated[`${sourceState}-${data.trie[sourceState].$}`] = {
                data: {
                  source: sourceState,
                  target: data.trie[sourceState].$,
                  label: '$',
                  id: `${sourceState}-${data.trie[sourceState].$}`,
                },
                classes: 'active',
              };
              setElements({
                ...elements,
                edges: Object.values(edgesFormated),
              });
              setSourceState('root');
            }
          } else if (c in trieState[sourceState]) {
            setResultValue(resultValue + c);
            edgesFormated[`${sourceState}-${data.trie[sourceState][c]}`] = {
              data: {
                source: sourceState,
                target: data.trie[sourceState][c],
                label: c,
                id: `${sourceState}-${data.trie[sourceState][c]}`,
              },
              classes: 'active',
            };
            setElements({
              ...elements,
              edges: Object.values(edgesFormated),
            });
            setSourceState(trieState[sourceState][c]);
            setResultSearchIndexes({ i, j: j + 1 });
          } else {
            resultIsWrong = true;
            setResultSearchIndexes({ i, j: -1 });
            Object.keys(data.trie[sourceState]).forEach((item) => {
              edgesFormated[`${sourceState}-${data.trie[sourceState][item]}`] = {
                data: {
                  source: sourceState,
                  target: data.trie[sourceState][item],
                  label: item,
                  id: `${sourceState}-${data.trie[sourceState][item]}`,
                },
                classes: 'reallyinactive',
              };
            });
            setElements({
              ...elements,
              edges: Object.values(edgesFormated),
            });
            setSourceState('root');
            setResultValue('');
          }
          setGenomeObject({ index: i, jIndex: j + 1 });
        }

        if (i === genome.length) {
          edgesFormated = elements.edges.reduce((previousValue, currentValue) => {
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
          setDisableButton(true);
          clearTimeout(timeout);
          return;
        }

        if (j === -1) {
          if (i !== -1) {
            resultIsWrong = false;
            edgesFormated = elements.edges.reduce((previousValue, currentValue) => {
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
            setGenomeCopy(genomeCopy.substring(1));
          }
          setResultSearchIndexes({ i: i + 1, j: j + 1 });
        }
      }, value);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [trieState, resultSearchIndexes, isPlaying]);

  useEffect(() => {
    if (disableButton) {
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
    }
  }, [disableButton]);

  useEffect(() => {
    fetch(`http://localhost:5555/pattern/trie/construction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchingPatternList }),
    })
      .then((response) => response.json())
      .then((res) => setData(res))
      .catch((error) => {
        console.log('Something went wrong!', error);
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

  function createPatternList() {
    const patternListValues = [];
    for (let i = 0; i < matchingPatternList.length; i += 1) {
      patternListValues.push(`${i} ${matchingPatternList[i]}`);
    }
    return patternListValues;
  }

  useEffect(() => {
    let timeout;
    if (data && isPlaying) {
      const triePatternArray = data.trieArray;
      if (doStepByStep) {
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
            // setDisableButton(true);
            setTrieState(data.trie);
            return;
          }

          if (j === triePatternArray[i].length - 1) {
            setIndexes({ i: i + 1, j: 0 });
            setCurrentEdge({ i: i + 1 });
            return;
          }

          setIndexes({ i, j: j + 1 });
        }, value);
      } else {
        const edgesFormated = {};
        let nodesFormated = [];
        triePatternArray.forEach((triePatternArrayEntry) => {
          triePatternArrayEntry.forEach((triePatternArrayEntryValueObject) => {
            const { edge, source, target } = triePatternArrayEntryValueObject;
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
        setSuffixArray(createPatternList());
        setElements({
          nodes: nodesFormated,
          edges: Object.values(edgesFormated),
        });
        setDisableButton(true);
        setTrieState(data.trie);
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
        // TODO: ovde videti sta da stavim za key osim index-a
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

  const indexesMatch = matchingIndexes
    ? matchingIndexes.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Grid item textAlign="center" key={index} style={{ marginLeft: '10px' }}>
          <div style={{ float: 'left', fontSize: '30px' }}>
            {index === matchingIndexes.length - 1
              ? `(${item[0]},${item[1]})`
              : `(${item[0]},${item[1]}), `}
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
                setElements({ nodes: [], edges: [] });
                setIndexes({ i: 0, j: 0 });
                setIsPlaying(true);
                setSuffixArray(['0 ']);
                setCurrentEdge({});
                setMatchingIndexes([]);
                setTrieState({});
                setGenomeCopy(genome);
                setResultSearchIndexes({ i: -1, j: -1 });
                setGenomeView({});
                setSourceState('root');
                setResultValue('');
                setGenomeView(
                  <Grid container>
                    <Stack direction="row" xs={12}>
                      <div style={{ float: 'left' }}>{genome}</div>
                    </Stack>
                  </Grid>,
                );
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
          <Grid container style={{ margin: '3% 0 0 5%', fontSize: '30px' }}>
            Genom:
            <Grid style={{ marginLeft: '20px' }}>{genomeView}</Grid>
          </Grid>
          <Grid style={{ margin: '3% 0 5% 5%', fontSize: '30px' }}>
            Paterni:
            <Grid style={{ marginLeft: '5%', fontSize: '20px' }}>{renderedOutput}</Grid>
          </Grid>

          {disableButton && (
            <Stack direction="row" spacing={2} style={{ marginLeft: '10%', flexWrap: 'wrap' }}>
              <div style={{ marginBottom: '5%', fontSize: '30px' }}>Pronađena rešenja:</div>{' '}
              {indexesMatch}
            </Stack>
          )}
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
          Najočigledniji način na koji možemo kreirati prefiksno stablo je iterativno dodavanje
          svake niske iz liste paterna koji se traže u stablo idući od root čvora. Svaka grana
          stabla predstavlja karakter paterna. Pomoću ovog stabla lako možemo utvrditi da li je neka
          niska iz liste paterna prefiks genoma.
        </Typography>
        <Typography paragraph>
          Nalaženje poklapanja je objašnjeno na prethodnoj strani i podrazumeva kretanje kroz stablo
          od korena ka listovima i proveravanja da li se karakter niske Genom na kom smo trenutno
          nalazi na putanji u kreiranom stablu. Da bismo pretražili sve pozicije u niski Genom
          potrebno je pozvati objašnjeni algoritam |Genom| puta i u svakoj iteraciji odstraniti prvi
          karakter tako kreirane niske Genom, tj. odraditi prethodni postupak za svaki sufiks niske
          Genom.
        </Typography>
        <Typography paragraph>
          Osnovnim algoritmom nije pokriven slučaj ako je neki patern iz liste paterna prefiks
          drugog paterna iz liste. U tom slučaju samo kraći patern bi bio uparen, dok bi ovi duži
          bili preskočeni (na toj lokaciji). Zato je ovde implementiran unapređeni algoritam, na taj
          način što smo paterne završili karakterom $ i tako kreirali stablo. U trenutku pretrage
          ćemo onda kada dođemo do karaktera $ znati da smo na kraju jednog paterna i dotadašnju
          nisku staviti u listu rešenja. Ipak, ukoliko pored grane sa oznakom $, iz trenutnog čvora
          postoji još neka grana i ona odgovara sledećem karakteru u genomu (tj. možemo da nastavimo
          kretanje niz stablo) ići ćemo dalje, sve dok takve grane ne bude bilo, ili dok jedina
          grana iz trenutnog čora bude grana sa oznakom $. Tada odbijamo prvi karakter genoma i na-
          stavljamo dalje kao u inicijalnom algoritmu NalaženjePoklapanjaUGenomu(Genom, Trie).
        </Typography>
        <Typography paragraph>
          Na ovoj stranici se nalaze isti elementi za manipulaciju sa izvršavanjem algoritma
          (Pause/Play dugme, Resetuj dugme i slajder za regulaciju brzine) kao i na stranici za
          iterativni algoritam. Pored ovoga tu je i grafički prikaz kreiranja prefiksnog stabla od
          unesenih paterna. Sami paterni su izlistani pored radi boljeg pregleda. Kreiranje može
          biti urađeno postupno (granu po granu) ili ne, u zavisnosti od toga da li je checkbox na
          prethodnoj strani štikliran. Na tom stablu će biti postupno prikazano i uparivanje, tj.
          nalaženje rešenja. Postupak nalaženja rešenja se osim na stablu može pratiti i na niski
          Genom koja je pored prikazana. Slično kao ranije, pozitivna poklapanja u datom trenutku će
          biti obojena zelenom bojom, a negativna crvenom bojom na granama, odnosno karakterima
          genoma. Pronađena rešenja su prikazana u vidu uređenih parova (Patern, Indeks) gde je
          svaki pronađeni patern prikazan sa mestom u niski Genom gde je poklapanje pronađeno.
        </Typography>
      </Box>
    </Grid>
  );
}

export default PatternPrefixTrie;
