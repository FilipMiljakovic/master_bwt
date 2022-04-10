# # Node class
# class Node:
 
#     def __init__(self, isEnd):
#         # Number of symbols
#         self.SYMBOLS = 26
#         self.children = [None]*26
#         self.edgeLabel = [None]*SYMBOLS
#         self.isEnd=isEnd
 
#     # Function to check if the end
#     # of the string is reached
#     def Node(isEnd):
#         self.isEnd = isEnd

# class Trie:
 
#     # Root Node
#     root = Node(False)
#     CASE=''
 
#     # Default self.CASE
#     def Trie(self, CASE='a') : self.CASE = CASE
     
 
#     # Function to insert a word in
#     # the compressed trie
#     def insert(self,word):
#         # Store the root
#         trav = root
#         i = 0
 
#         # Iterate i less than word
#         # length
#         while (i < word.length() and trav.edgeLabel[word.charAt(i) - self.CASE] is not None) :
 
#             # Find the index
#             index = ord(word[i]) - ord(self.CASE); j = 0
#             label = trav.edgeLabel[index]
 
#             # Iterate till j is less
#             # than label length
#             while (j < len(label) and i < len(word) and label[j] == word[i]) :
#                 i+=1
#                 j+=1
             
 
#             # If is the same as the
#             # label length
#             if (j == label.length()) :
#                 trav = trav.children[index]
             
#             else :
 
#                 # Inserting a prefix of
#                 # the existing word
#                 if (i == word.length()) :
#                     existingChild = trav.children[index]
#                     newChild = Node(True)
#                     remainingLabel = strCopy(label, j)
 
#                     # Making "facebook"
#                     # as "face"
#                     label.setLength(j)
 
#                     # New node for "face"
#                     trav.children[index] = newChild
#                     newChild.children[ord(remainingLabel[0])-ord(self.CASE)] = existingChild
#                     newChild.edgeLabel[ord(remainingLabel.charAt(0))- ord(self.CASE)] = remainingLabel
                 
#                 else :
 
#                     # Inserting word which has
#                     # a partial match with
#                     # existing word
#                     remainingLabel = strCopy(label, j)
 
#                     newChild = Node(False)
#                     remainingWord = strCopy(word, i)
 
#                     # Store the trav in
#                     # temp node
#                     temp = trav.children[index]
 
#                     trav.children[index] = newChild
#                     newChild.edgeLabel[ord(remainingLabel.charAt(0)) - ord(self.CASE)]=remainingLabel
#                     newChild.children[ord(remainingLabel.charAt(0)) - ord(self.CASE)]=temp
#                     newChild.edgeLabel[ord(remainingWord.charAt(0)) - ord(self.CASE)] = remainingWord
#                     newChild.children[ord(remainingWord.charAt(0)) - ord(self.CASE)] = Node(True)
#                 return
             
         
 
#         # Insert new node for new word
#         if (i < len(word)):
#             trav.edgeLabel[ord(word.charAt(i)) - ord(self.CASE)] = strCopy(word, i)
#             trav.children[ord(word.charAt(i)) - ord(self.CASE)] = Node(True)
         
#         else :
 
#             # Insert "there" when "therein"
#             # and "thereafter" are existing
#             trav.isEnd = True
         
     
 
#     # Function that creates new String
#     # from an existing string starting
#     # from the given index
#     def strCopy(self, str, index):
#         result = ''
 
#         while (index != len(str)) :
#             result+=str.charAt(index)
#             index+=1
         
 
#         return result
     
 
#     # Function to print the word
#     # starting from the given node
#     def printUtil(self,node, str):
#         if (node.isEnd) :
#             print(str)
         
 
#         for i in range(node.edgeLabel.length):
 
#             # If edgeLabel is not
#             # None
#             if (node.edgeLabel[i] != None) :
#                 length = len(str)
 
#                 str = str.append(node.edgeLabel[i])
#                 printUtil(node.children[i], str)
#                 str = str.delete(length, str.length())
             
         
     
 
#     # Function to search a word
#     def search(self,word):
#         i = 0
 
#         # Stores the root
#         trav = root
 
#         while (i < len(word) and trav.edgeLabel[ord(word.charAt(i)) - ord(self.CASE)]
#                       != None) :
#             index = ord(word.charAt(i)) - ord(self.CASE)
#             label = trav.edgeLabel[index]
#             j = 0
 
#             while (i < word.length() and j < label.length()) :
 
#                 # Character mismatch
#                 if (word.charAt(i) != label.charAt(j)) :
#                     return False
                 
 
#                 i+=1
#                 j+=1
             
 
#             if (j == len(label) and i <= len(word)) :
 
#                 # Traverse further
#                 trav = trav.children[index]
             
#             else :
 
#                 # Edge label is larger
#                 # than target word
#                 # searching for "face"
#                 # when tree has "facebook"
#                 return False
             
         
 
#         # Target word fully traversed
#         # and current node is word
#         return i == len(word) and trav.isEnd
     
 
#     # Function to search the prefix
#     def startsWith(self,prefix):
#         i = 0
 
#         # Stores the root
#         trav = root
 
#         while (i < prefix.length() and trav.edgeLabel[prefix.charAt(i) - self.CASE]is not None) :
#             index = ord(prefix.charAt(i)) - ord(self.CASE)
#             label = trav.edgeLabel[index]
#             j = 0
 
#             while (i < prefix.length() and j < label.length()) :
 
#                 # Character mismatch
#                 if (prefix.charAt(i) != label.charAt(j)) :
#                     return False
                 
 
#                 i+=1
#                 j+=1
             
 
#             if (j == len(label) and j<= len(prefix)) :
 
#                 # Traverse further
#                 trav = trav.children[index]
             
#             else :
 
#                 # Edge label is larger
#                 # than target word,
#                 # which is fine
#                 return True
             
         
 
#         return i == prefix.length()