import os
from flask import Flask
from flask import request
from flask_cors import CORS
from subprocess import run
import trie_construction as t
import suffixArray as sa
import suffixArrayMultiple as sam
import BWT as bwt

app = Flask(__name__)
cors = CORS(app)

@app.route('/trie/construction', methods=['POST'])
def trie_construction_endpoint():
    patternString = request.get_json().get("pattern_string")
    matchingString = request.get_json().get("matching_string")
    suffix_array = t.suffix_array_construction(patternString)
    trie = t.trie_construction_function(suffix_array)
    trie_matching_value = t.trie_matching(matchingString, trie)
    trie_array = []
    for suffix in suffix_array:
        trie_array_suffix_array = []
        print(suffix)
        t.makeSuffixTrieArray(suffix, 'root', trie, trie_array_suffix_array)
        trie_array.append(trie_array_suffix_array)    
		    
    return { 'trie_matching': trie_matching_value, 'trie': trie, 'trie_suffix_array': trie_array}
	
	
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
