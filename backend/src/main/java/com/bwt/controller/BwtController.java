package com.bwt.controller;

import com.bwt.domain.*;
import com.bwt.service.BwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping
public class BwtController {

    private final BwtService bwtService;

    public BwtController(BwtService bwtService) {
        this.bwtService = bwtService;
    }

    @PostMapping("/pattern/trie/construction")
    public ResponseEntity<TrieArrayResponse> getPatternTrie(@RequestBody PatternTrieRequest patternTrieRequest) {
        return ResponseEntity.ok(bwtService.getPatternMatchingTrie(patternTrieRequest.getMatchingPatternList()));
    }

    @PostMapping("/suffix/compressed/trie/construction")
    public ResponseEntity<TrieArrayResponse> getCompressedSuffixTrie(@RequestBody SuffixTrieRequest suffixTrieRequest) {
        return ResponseEntity.ok(bwtService.getCompressedSuffixTrie(suffixTrieRequest.getGenome()));
    }

    @PostMapping("/suffix/trie/construction")
    public ResponseEntity<TrieArrayResponse> getSuffixTrie(@RequestBody SuffixTrieRequest suffixTrieRequest) {
        return ResponseEntity.ok(bwtService.getSuffixTrie(suffixTrieRequest.getGenome()));
    }

//    @PostMapping("/bwt")
//    public ResponseEntity<BwtResponse> getBWT(@RequestBody BwtRequest bwtRequest) {
//        return ResponseEntity.ok(bwtService.getBwt(bwtRequest.getMatchingString(), bwtRequest.getPatternString()));
//    }
}
