package com.bwt.domain;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SourceTargetInfo {
    private String source;
    private String target;
    private String edge;
}
