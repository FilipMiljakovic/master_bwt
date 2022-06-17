package com.bwt.domain;

import lombok.Data;

import java.util.List;

@Data
public class PatternTrieRequest {
    private List<String> matchingPatternList;
}
