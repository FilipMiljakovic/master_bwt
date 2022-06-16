import os
import copy
from flask import Flask
from flask import request
from flask_cors import CORS
from subprocess import run
import trie_construction as t
import suffixArray as sa
import suffixArrayMultiple as sam
import compressedTrie as ct
import BWT as bwt

app = Flask(__name__)
CORS(app)

@app.route('/suffix/trie/construction', methods=['POST'])
def suffix_trie_construction_endpoint():
    genomeString = request.get_json().get("genome")
    suffix_array = t.suffix_array_construction(genomeString)
    trie = t.trie_construction_function(suffix_array)
    trie_array = []
    for suffix in suffix_array:
        trie_array_suffix_array = []
        t.makeSuffixTrieArray(suffix, 'root', trie, trie_array_suffix_array)
        trie_array.append(trie_array_suffix_array)    
		    
    return { 'trie': trie, 'trie_suffix_array': trie_array }

@app.route('/suffix/compressed/trie/construction', methods=['POST'])
def suffix_compressed_trie_construction_endpoint():
    genomeString = request.get_json().get("genome")
    suffix_array = t.suffix_array_construction(genomeString)
    # trie = t.trie_construction_function(suffix_array)
    trie = ct.Trie()
    # new_trie = copy.deepcopy(trie)
    # compressed_trie = t.compress_trie(suffix_array)
    # trie_array = []
    for suffix in suffix_array:
        trie.insert(suffix)
        # trie.print()
        # trie_array_suffix_array = []
        # t.makeSuffixTrieArray(suffix, 'root', trie, trie_array_suffix_array)
        # trie_array.append(trie_array_suffix_array)    
		#    , 'trie_suffix_array': trie_array  
    return { 'trie': trie }

@app.route('/pattern/trie/construction', methods=['POST'])
def pattern_trie_construction_endpoint():
    patternList = request.get_json().get("matching_pattern_list")
    trie = t.trie_construction_function(patternList)
    trie_array = []
    print(trie)
    for pattern in patternList:
        trie_array_suffix_array = []
        t.makeSuffixTrieArray(pattern, 'root', trie, trie_array_suffix_array)
        trie_array.append(trie_array_suffix_array)
		    
    return { 'trie': trie, 'trie_pattern_array': trie_array }
	
@app.route('/suffix/array', methods=['POST'])
def suffix_array_endpoint():
	patternString = request.get_json().get("pattern_string")
	matchingString = request.get_json().get("matching_string")
	suffix_array = sa.suffix_array_construction(patternString)
	pattern_matching_with_suffix_array_value = sa.pattern_matching_with_suffix_array(suffix_array, matchingString)
	return { 'suffix_array': suffix_array, 'pattern_matching_with_suffix_array_value': pattern_matching_with_suffix_array_value }
	
@app.route('/suffix/array/multiple', methods=['POST'])
def suffix_array_multiple_endpoint():
	patternStrings = request.get_json().get("pattern_strings_array")
	matchingString = request.get_json().get("matching_string")
	suffix_array = sam.suffix_array_construction(patternStrings)
	pattern_matching_with_suffix_array_value = sam.pattern_matching_with_suffix_array(suffix_array, matchingString)
	return { 'suffix_array': suffix_array, 'pattern_matching_with_suffix_array_value': pattern_matching_with_suffix_array_value }

@app.route('/bwt', methods=['POST'])
def bwt_endpoint():
	patternString = request.get_json().get("pattern_string")
	matchingString = request.get_json().get("matching_string")
	last_column = bwt.BWT(patternString)
	first_column = last_column[:]
	first_column.sort()
	bw_matching_value = bwt.bw_matching(first_column, last_column, matchingString)
	return { 'bw_matching_value': bw_matching_value, 'last_column': last_column, 'first_column': first_column }

if __name__ == '__main__':
    app.run(debug=False)
