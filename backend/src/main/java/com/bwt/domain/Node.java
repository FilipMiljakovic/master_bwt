package com.bwt.domain;

import java.util.HashMap;
import java.util.Map;

public class Node {
    private final static int SYMBOLS = 100;
    Node[] children = new Node[SYMBOLS];
    StringBuilder[] edgeLabel = new StringBuilder[SYMBOLS];
    boolean isEnd;
    String name;
    Map<String, String> mapResult = new HashMap<>();

    public Node(boolean isEnd, String name) {
        this.isEnd = isEnd;
        this.name = name;
    }
}