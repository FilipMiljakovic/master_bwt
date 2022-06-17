package com.bwt.domain;

import java.util.Map;

public class Trie {
    private final Node root = new Node(false, "root");
    private final char CASE;
    private int k = 0;

    public Trie() {
        CASE = 'a';
    }

    public Trie(char CASE) {
        this.CASE = CASE;
    }

    public void insert(String word) {
        Node trav = root;
        int i = 0;

        while (i < word.length() && trav.edgeLabel[word.charAt(i) - CASE] != null) {
            int index = word.charAt(i) - CASE, j = 0;
            StringBuilder label = trav.edgeLabel[index];

            while (j < label.length() && i < word.length() && label.charAt(j) == word.charAt(i)) {
                ++i;
                ++j;
            }

            if (j == label.length()) {
                trav = trav.children[index];
            } else {
                if (i == word.length()) {
                    Node existingChild = trav.children[index];
                    Node newChild = new Node(true, "i" + k++);
                    StringBuilder remainingLabel = strCopy(label, j);
                    label.setLength(j);
                    trav.children[index] = newChild;
                    newChild.children[remainingLabel.charAt(0) - CASE] = existingChild;
                    newChild.edgeLabel[remainingLabel.charAt(0) - CASE] = remainingLabel;
                } else {
                    StringBuilder remainingLabel = strCopy(label, j);
                    Node newChild = new Node(false, "i" + k++);
                    StringBuilder remainingWord = strCopy(word, i);
                    Node temp = trav.children[index];
                    label.setLength(j);
                    trav.children[index] = newChild;
                    newChild.edgeLabel[remainingLabel.charAt(0) - CASE] = remainingLabel;
                    newChild.children[remainingLabel.charAt(0) - CASE] = temp;
                    newChild.edgeLabel[remainingWord.charAt(0) - CASE] = remainingWord;
                    newChild.children[remainingWord.charAt(0) - CASE] = new Node(true,"i" + k++);
                }

                return;
            }
        }

        if (i < word.length()) {
            trav.edgeLabel[word.charAt(i) - CASE] = strCopy(word, i);
            trav.children[word.charAt(i) - CASE] = new Node(true,"i" + k++);
        } else {
            trav.isEnd = true;
        }
    }

    private StringBuilder strCopy(CharSequence str, int index) {
        StringBuilder result = new StringBuilder(100);

        while (index != str.length()) {
            result.append(str.charAt(index++));
        }

        return result;
    }

    public void print() {
        printUtil(root, new StringBuilder());
    }

    private void printUtil(Node node, StringBuilder str) {
        if (node.isEnd) {
            System.out.println(str);
        }

        for (int i = 0; i < node.edgeLabel.length; ++i) {
            if (node.edgeLabel[i] != null) {
                int length = str.length();

                str = str.append(node.edgeLabel[i]);
                printUtil(node.children[i], str);
                str = str.delete(length, str.length());
            }
        }
    }

    public void addToTrie(Map<String, Map<String, String>> trie) {
        addToTrie2(root, trie);
    }

    private void addToTrie2(Node node, Map<String, Map<String, String>> trie) {
        for (int i = 0; i < node.edgeLabel.length; i++) {
            if (node.edgeLabel[i] != null) {
                node.mapResult.put(node.edgeLabel[i].toString(), node.children[i].name);
                trie.put(node.name, node.mapResult);
                addToTrie2(node.children[i], trie);
            }
        }
    }

    public boolean search(String word) {
        int i = 0;
        Node trav = root;

        while (i < word.length() && trav.edgeLabel[word.charAt(i) - CASE] != null) {
            int index = word.charAt(i) - CASE;
            StringBuilder label = trav.edgeLabel[index];
            int j = 0;

            while (i < word.length() && j < label.length()) {
                if (word.charAt(i) != label.charAt(j)) {
                    return false;   // character mismatch
                }

                ++i;
                ++j;
            }

            if (j == label.length() && i <= word.length()) {
                trav = trav.children[index];
            } else {
                return false;
            }
        }

        return i == word.length() && trav.isEnd;
    }

    public boolean startsWith(String prefix) {
        int i = 0;
        Node trav = root;

        while (i < prefix.length() && trav.edgeLabel[prefix.charAt(i) - CASE] != null) {
            int index = prefix.charAt(i) - CASE;
            StringBuilder label = trav.edgeLabel[index];
            int j = 0;

            while (i < prefix.length() && j < label.length()) {
                if (prefix.charAt(i) != label.charAt(j)) {
                    return false;   // character mismatch
                }

                ++i;
                ++j;
            }

            if (j == label.length() && i <= prefix.length()) {
                trav = trav.children[index];
            } else {
                return true;
            }
        }

        return i == prefix.length();
    }
}
