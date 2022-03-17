def add_to_trie(Trie, pattern, number_of_nodes, pattern_id):
    current_node = 'root'

    for c in pattern:
        if c in Trie[current_node]:
            current_node = Trie[current_node][c]
        else:
            if c != '$':
                Trie['i'+str(number_of_nodes)] = {}
                Trie[current_node][c] = 'i'+str(number_of_nodes)
                current_node = 'i'+str(number_of_nodes)
                number_of_nodes += 1
            else:
                Trie[current_node][c] = str(pattern_id)
                Trie[str(pattern_id)] = {}

    return (Trie, number_of_nodes)

def trie_construction_function(patterns):
    Trie = {}
    Trie['root'] = {}

    number_of_nodes = 1

    for i in range(len(patterns)):
        pattern = patterns[i]
        (Trie, number_of_nodes) = add_to_trie(Trie, pattern, number_of_nodes, i)

    return Trie

#Provera da li neki element strukture Trie predstavlja prefiks niske text
def prefix_trie_pattern_matching(text, Trie):
    v = 'root'

    for c in text:
        if c not in Trie[v]:
            return False

        v = Trie[v][c]

        if '$' in Trie[v]:
            return Trie[v]['$']

    return False

#Provera da li neki element strukture Trie predstavlja podstring niske text
#TODO: proveri da li ova funkcija dobro radi, nesto je tu sumnjivo
def trie_matching(text, Trie):
    found_patterns = []
    while len(text) > 0:
        res = prefix_trie_pattern_matching(text, Trie)
        if res != False:
            found_patterns.append(res)
        text = text[1:]
    return found_patterns

#Formiranje sufiksnog niza niske string
def suffix_array_construction(string):
    suffix_array = []
    string += '$'

    for i in range(len(string) - 1):
        suffix_array.append(string[i:])

    return suffix_array
	
def makeSuffixTrieArray(suffix, node, trie, trie_array_suffix_array):
    if len(suffix) == 0:
        print("Dosli smo do kraja sufiksa")
    else:
        print(node)
        print(trie[node])
        if suffix[0] in trie[node]:
            trie_array_suffix_array.append({"source": node, "target": trie[node][suffix[0]], "edge": suffix[0]})
        makeSuffixTrieArray(suffix[1:], trie[node][suffix[0]], trie, trie_array_suffix_array)
	