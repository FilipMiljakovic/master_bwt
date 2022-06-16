
class Node :
    SYMBOLS = 26
    children = [None] * (SYMBOLS)
    edgeLabel = [None] * (SYMBOLS)
    isEnd = False
    def __init__(self, isEnd) :
        self.isEnd = isEnd

class Trie :
    root = Node(False)
    CASE = ''
    # 'a' for lower, 'A' for upper
    # def __init__(self) :
    #     self.CASE = 'a'
    # def __init__(self, CASE) :
    #     self.CASE = CASE

    def __init__(self, CASE='a') : 
        self.CASE = CASE

    def insert(self, word) :
        trav = self.root
        i = 0
        while (i < len(word) and trav.edgeLabel[ord(word[i]) - ord(self.CASE)] != None) :
            index = ord(word[i]) - ord(self.CASE)
            j = 0
            label = trav.edgeLabel[index]
            while (j < len(label) and i < len(word) and label[j] == word[i]) :
                i += 1
                j += 1
            if (j == len(label)) :
                trav = trav.children[index]
            else :
                if (i == len(word)) :
                    # inserting a prefix of exisiting word
                    existingChild = trav.children[index]
                    newChild = Node(True)
                    remainingLabel = self.strCopy(label, j)
                    # label.setLength(j)
                    # making "faceboook" as "face"
                    trav.children[index] = newChild
                    # new node for "face"
                    newChild.children[ord(remainingLabel[0]) - ord(self.CASE)] = existingChild
                    newChild.edgeLabel[ord(remainingLabel[0]) - ord(self.CASE)] = remainingLabel
                else :
                    # inserting word which has a partial match with existing word
                    remainingLabel = self.strCopy(label, j)
                    newChild = Node(False)
                    remainingWord = self.strCopy(word, i)
                    temp = trav.children[index]
                    # label.setLength(j)
                    trav.children[index] = newChild
                    newChild.edgeLabel[ord(remainingLabel[0]) - ord(self.CASE)] = remainingLabel
                    newChild.children[ord(remainingLabel[0]) - ord(self.CASE)] = temp
                    newChild.edgeLabel[ord(remainingWord[0]) - ord(self.CASE)] = remainingWord
                    newChild.children[ord(remainingWord[0]) - ord(self.CASE)] = Node(True)
                return
        if (i < len(word)) :
            # inserting new node for new word
            trav.edgeLabel[ord(word[i]) - ord(self.CASE)] = self.strCopy(word, i)
            trav.children[ord(word[i]) - ord(self.CASE)] = Node(True)
        else :
            # inserting "there" when "therein" and "thereafter" are existing
            trav.isEnd = True
    # Creates a new String from an existing
    # string starting from the given index
    def  strCopy(self, string,  index) :
        result = ''
        while (index != len(string)) :
            result += string[index]
            index += 1
        return result
    # def print(self) :
    #     self.printUtil(self.root,  '')
    # def printUtil(self, node,  str) :
    #     if (node.isEnd) :
    #         print(str)
    #     i = 0
    #     while (i < len(node.edgeLabel)) :
    #         if (node.edgeLabel[i] != None) :
    #             length = len(str)
    #             str = str + node.edgeLabel[i]
    #             print(node.edgeLabel[i])
    #             self.printUtil(node.children[i], str)
    #             str = str.delete(length, len(str))
    #         i += 1
    # def  search(self, word) :
    #     i = 0
    #     trav = self.root
    #     while (i < len(word) and trav.edgeLabel[ord(word[i]) - ord(self.CASE)] != None) :
    #         index = ord(word[i]) - ord(self.CASE)
    #         label = trav.edgeLabel[index]
    #         j = 0
    #         while (i < len(word) and j < len(label)) :
    #             if (word[i] != label[j]) :
    #                 return False
    #             i += 1
    #             j += 1
    #         if (j == len(label) and i <= len(word)) :
    #             trav = trav.children[index]
    #         else :
    #             # edge label is larger than target word
    #             # searching for "face" when tree has "facebook"
    #             return False
    #     # target word fully traversed and current node is a word ending
    #     return i == len(word) and trav.isEnd
    # def  startsWith(self, prefix) :
    #     i = 0
    #     trav = self.root
    #     while (i < len(prefix) and trav.edgeLabel[ord(prefix[i]) - ord(self.CASE)] != None) :
    #         index = ord(prefix[i]) - ord(self.CASE)
    #         label = trav.edgeLabel[index]
    #         j = 0
    #         while (i < len(prefix) and j < len(label)) :
    #             if (prefix[i] != label[j]) :
    #                 return False
    #             i += 1
    #             j += 1
    #         if (j == len(label)and i <= len(prefix)) :
    #             trav = trav.children[index]
    #         else :
    #             # edge label is larger than target word, which is fine
    #             return True
    #     return i == len(prefix)