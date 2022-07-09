package com.bwt.service;

import com.bwt.domain.BwtResponse;
import com.bwt.domain.SourceTargetInfo;
import com.bwt.domain.Trie;
import com.bwt.domain.TrieArrayResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BwtService {

    private final static Logger LOGGER = LoggerFactory.getLogger(BwtService.class);

    public TrieArrayResponse getPatternMatchingTrie(List<String> patternList) {
        LOGGER.info("Pattern matching Trie");
        Map<String, Map<String, String>> trie = trieConstruction(patternList);
        List<List<SourceTargetInfo>> triePatternArray = triePatternArrayConstruction(trie, patternList);
        return new TrieArrayResponse(trie, triePatternArray);
    }

    public TrieArrayResponse getCompressedSuffixTrie(String genome) {
        LOGGER.info("Compressed suffix Trie");
        Trie compressedTrie = new Trie('$');
        List<String> suffixArray = createSuffixArray(genome);
        for (int i=0; i < suffixArray.size() ; i++) {
            compressedTrie.insert(suffixArray.get(i), i );
        }
        Map<String, Map<String, String>> trie = new HashMap<>();
        compressedTrie.addToTrie(trie);
        // TODO: Dodaj prazne mape za krajeve sufiksa (da ima dolar na kraju)
        List<List<SourceTargetInfo>> triePatternArray = trieCompressedArrayConstruction(trie, suffixArray);
        return new TrieArrayResponse(trie, triePatternArray);
    }

    public TrieArrayResponse getSuffixTrie(String genome) {
        LOGGER.info("Suffix Trie");
        List<String> suffixArray = createSuffixArray(genome);
        Map<String, Map<String, String>> trie = trieConstruction(suffixArray);
        List<List<SourceTargetInfo>> trieArray = triePatternArrayConstruction(trie, suffixArray);
        return new TrieArrayResponse(trie, trieArray);
    }

    private List<List<SourceTargetInfo>> trieCompressedArrayConstruction(Map<String, Map<String, String>> trie,
                                                                         List<String> suffixArray) {
        List<List<SourceTargetInfo>> trieArray = new ArrayList<>();
        for (String pattern : suffixArray) {
            List<SourceTargetInfo> trieArraySuffixArray = new ArrayList<>();
            makeCompressedSuffixTrieArray(pattern, "root", trie, trieArraySuffixArray);
            trieArray.add(trieArraySuffixArray);
        }
        return trieArray;
    }

    private void makeCompressedSuffixTrieArray(String pattern, String node,
                                               Map<String, Map<String, String>> trie,
                                               List<SourceTargetInfo> trieArraySuffixArray) {
        if (pattern.length() != 0) {
            List<String> patternSuffixes = createPrefixArray(pattern);
            for (String suffix : patternSuffixes) {
                if (trie.get(node).containsKey(suffix)) {
                    trieArraySuffixArray.add(new SourceTargetInfo(node,
                            trie.get(node).get(suffix),
                            String.valueOf(suffix)));
                    makeCompressedSuffixTrieArray(pattern.substring(suffix.length()), trie.get(node).get(suffix),
                            trie, trieArraySuffixArray);
                    break;
                }
            }
        }
    }

    private List<String> createPrefixArray(String genome) {
        List<String> prefixArray = new ArrayList<>();
        for (int i = 0; i < genome.length(); i++)
            prefixArray.add(genome.substring(0, genome.length() - i));
        return prefixArray;
    }

    private List<String> createSuffixArray(String genome) {
        List<String> suffixArray = new ArrayList<>();
        genome += "$";
        for (int i = 0; i < genome.length(); i++)
            suffixArray.add(genome.substring(i));
        return suffixArray;
    }

    private List<List<SourceTargetInfo>> triePatternArrayConstruction(Map<String, Map<String, String>> trie,
                                                                      List<String> patternList) {
        List<List<SourceTargetInfo>> trieArray = new ArrayList<>();
        for (String pattern : patternList) {
            List<SourceTargetInfo> trieArraySuffixArray = new ArrayList<>();
            makeSuffixTrieArray(pattern, "root", trie, trieArraySuffixArray);
            trieArray.add(trieArraySuffixArray);
        }
        return trieArray;
    }

    private Map<String, Map<String, String>> trieConstruction(List<String> patternList) {
        int numberOfNodes = 1;
        Map<String, Map<String, String>> trie = new HashMap<>();
        trie.put("root", new HashMap<>());
        for (int i = 0; i < patternList.size(); i++) {
            String pattern = patternList.get(i);
            numberOfNodes = addToTrie(trie, pattern, numberOfNodes, i);
        }
        return trie;
    }

    private int addToTrie(Map<String, Map<String, String>> trie, String pattern, int numberOfNodes, int i) {
        String currentNode = "root";
        for (char c : pattern.toCharArray()) {
            if (trie.get(currentNode).containsKey(String.valueOf(c))) {
                currentNode = trie.get(currentNode).get(String.valueOf(c));
            } else {
                if (c != '$') {
                    trie.put("i" + numberOfNodes, new HashMap<>());
                    Map<String, String> currentNodeValue = trie.get(currentNode);
                    currentNodeValue.put(String.valueOf(c), "i" + numberOfNodes);
                    trie.put(currentNode, currentNodeValue);
                    currentNode = "i" + numberOfNodes;
                    numberOfNodes += 1;
                } else {
                    Map<String, String> currentNodeValue = trie.get(currentNode);
                    currentNodeValue.put(String.valueOf(c), String.valueOf(i));
                    trie.put(currentNode, currentNodeValue);
                    trie.put(String.valueOf(i), new HashMap<>());
                }
            }
        }
        return numberOfNodes;
    }

    private void makeSuffixTrieArray(String pattern, String node,
                                     Map<String, Map<String, String>> trie, List<SourceTargetInfo> trieArraySuffixArray) {
        if (pattern.length() != 0) {
            if (trie.get(node).containsKey(String.valueOf(pattern.charAt(0)))) {
                trieArraySuffixArray.add(new SourceTargetInfo(node,
                        trie.get(node).get(String.valueOf(pattern.charAt(0))),
                        String.valueOf(pattern.charAt(0))));
            }
            makeSuffixTrieArray(pattern.substring(1), trie.get(node).get(String.valueOf(pattern.charAt(0))), trie, trieArraySuffixArray);
        }
    }
}