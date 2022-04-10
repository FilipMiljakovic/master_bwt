# from compressedTrie import Trie
# from compressedTrie import Node

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

def trie_construction_function(stringList):
    Trie = {}
    Trie['root'] = {}

    number_of_nodes = 1

    for i in range(len(stringList)):
        pattern = stringList[i]
        (Trie, number_of_nodes) = add_to_trie(Trie, pattern, number_of_nodes, i)

    return Trie

# def compress_trie(stringList):
#     trie = Trie()
#     for suffix in stringList:
#         trie.insert(suffix)
#     trie.print()
    # if next_branch == 'root':
    #     for item in trie[node]:
    #         next_node = trie[node][item]
    #         print('sledeci node u trie = ' + str(trie[next_node]))
    #         if len(trie[next_node]) == 1:
    #             for next_item in trie[next_node]:
    #                 print('spojene vrednosti = ' + item + next_item)
    #                 new_trie[node][item + next_item] = trie[next_node][next_item]
    #                 compress_trie(trie, node, item + next_item, new_trie)
    #         else:
    #             new_trie[node][item] = trie[node][item]
    #             for next_item in trie[next_node]:
    #                 compress_trie(trie, next_node, next_item, new_trie)
    # else:
    #     print('next_branch = ' + next_branch)
    #     print('poslednji karakter u spojenim = ' + next_branch[-1])
    #     print('node = ' + node)
    #     print('trie[node] = ' + str(trie[node]))
    #     next_node = trie[node][next_branch[-1]]
    #     if len(trie[next_node]) == 1:
    #         for next_item in trie[next_node]:
    #             print(next_branch + next_item)
    #             new_trie[node][next_branch + next_item] = trie[next_node][next_item]
    #             compress_trie(trie, node, next_branch + next_item, new_trie)
    #     else:
    #         new_trie[node][next_branch] = trie[node][next_branch[-1]]
    #         for next_item in trie[next_node]:
    #             compress_trie(trie, next_node, next_item, new_trie)

    # return trie

#Formiranje sufiksnog niza niske string
def suffix_array_construction(string):
    suffix_array = []
    string += '$'

    for i in range(len(string) - 1):
        suffix_array.append(string[i:])

    return suffix_array
	
def makeSuffixTrieArray(suffix, node, trie, trie_array_suffix_array):
    if len(suffix) != 0:
        if suffix[0] in trie[node]:
            trie_array_suffix_array.append({"source": node, "target": trie[node][suffix[0]], "edge": suffix[0]})
        makeSuffixTrieArray(suffix[1:], trie[node][suffix[0]], trie, trie_array_suffix_array)
	