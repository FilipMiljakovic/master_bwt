package com.bwt.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BwtResponse {
    private int bwtMatchingValue;
    private List<String> firstColumn;
    private List<String> lastColumn;
}
