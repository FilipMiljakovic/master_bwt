package com.bwt.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class TrieArrayResponse {
    Map<String, Map<String, String>> trie;
    List<List<SourceTargetInfo>> trieArray;
}
