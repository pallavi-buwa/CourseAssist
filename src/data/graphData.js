// ─────────────────────────────────────────────────────────────────────────────
// Claro – Knowledge Graph Data Model
// 3 CS Subjects: Python Programming · Data Structures & Algorithms · Computer Networks
// ~210 nodes, ~400+ edges
// ─────────────────────────────────────────────────────────────────────────────

export const SUBJECTS = {
  PYTHON: { id: 'python', label: 'Python Programming', color: '#14532d', darkColor: '#0f3d22' },
  DSA:    { id: 'dsa',    label: 'Data Structures & Algorithms', color: '#1a5f45', darkColor: '#134a36' },
  CN:     { id: 'cn',     label: 'Computer Networks', color: '#3f5c4d', darkColor: '#2f463b' },
}

// ── Resource stubs (mock) ─────────────────────────────────────────────────────
const mkResources = (title) => [
  { type: 'video',   label: `${title} – Crash Course`, url: '#' },
  { type: 'article', label: `${title} – Deep Dive`,    url: '#' },
  { type: 'podcast', label: `${title} – CS Podcast Ep`, url: '#' },
]

const mkMisconceptions = (...items) => items

// ── Helper ────────────────────────────────────────────────────────────────────
let _id = 0
const n = (subject, label, weight = 1, desc = '', extra = {}) => ({
  id: `${subject}_${++_id}`,
  label,
  subject,
  weight,          // 0.2 – 3.0; drives node size
  desc: desc || `Core concept in ${label}.`,
  resources: mkResources(label),
  misconceptions: extra.mc || [],
  intervention: extra.iv || `Review ${label} fundamentals, then practice with worked examples.`,
  color: null,     // set at runtime per subject
  status: 'default', // default | active | mastered | struggling
})

const e = (src, tgt, strength = 1) => ({ source: src, target: tgt, strength })


// ═══════════════════════════════════════════════════════════════════════════════
// PYTHON PROGRAMMING  (~70 nodes)
// ═══════════════════════════════════════════════════════════════════════════════
_id = 0
const PY = {
  // Foundations
  variables:     n('python', 'Variables & Types',       2.5, 'Fundamental building block. Covers int, float, str, bool.', { mc: mkMisconceptions('Variables store values, not references', 'Dynamic typing surprises') }),
  comments:      n('python', 'Comments & Docstrings',   0.8, 'Code documentation practices.'),
  operators:     n('python', 'Operators',               1.5, 'Arithmetic, comparison, logical, bitwise operators.'),
  inputOutput:   n('python', 'Input / Output',          1.2, 'print(), input(), f-strings, format().'),
  typecast:      n('python', 'Type Casting',            1.0, 'int(), str(), float(), bool() conversions.', { mc: mkMisconceptions('Implicit vs explicit conversion confusion') }),

  // Control Flow
  ifElse:        n('python', 'Conditionals (if/elif/else)', 2.0, 'Boolean expressions and branching logic.'),
  loops:         n('python', 'Loops (for/while)',        2.5, 'Iteration, range(), enumerate(), zip().', { mc: mkMisconceptions('Off-by-one errors', 'Infinite loops') }),
  loopControl:   n('python', 'Break / Continue / Pass', 1.2, 'Loop control statements.'),
  comprehension: n('python', 'List Comprehensions',     1.8, 'Concise list generation. [expr for x in iter if cond]', { mc: mkMisconceptions('Confusing with generator expressions') }),
  genExpr:       n('python', 'Generator Expressions',   1.4, 'Lazy evaluation with generators.'),

  // Functions
  functions:     n('python', 'Functions (def)',         3.0, 'Defining, calling, return values.', { mc: mkMisconceptions('Return vs print confusion', 'Scope misunderstanding') }),
  args:          n('python', 'Args & Kwargs',           1.8, '*args, **kwargs, positional, keyword args.'),
  lambdas:       n('python', 'Lambda Functions',        1.5, 'Anonymous one-line functions.'),
  scope:         n('python', 'Scope (LEGB)',            1.8, 'Local, Enclosing, Global, Built-in scope rules.', { mc: mkMisconceptions('global keyword misuse') }),
  closures:      n('python', 'Closures',                1.4, 'Functions capturing outer scope variables.'),
  decorators:    n('python', 'Decorators',              1.6, 'Higher-order functions wrapping behavior.'),
  recursion:     n('python', 'Recursion',               2.2, 'Functions calling themselves. Base case + recursive case.', { mc: mkMisconceptions('Missing base case', 'Stack overflow intuition') }),

  // Data Structures (Python)
  lists:         n('python', 'Lists',                   2.8, 'Ordered mutable sequences. append, pop, slice.', { mc: mkMisconceptions('List copy vs reference') }),
  tuples:        n('python', 'Tuples',                  1.6, 'Immutable ordered sequences.'),
  dicts:         n('python', 'Dictionaries',            2.8, 'Key-value store. hash-based lookup.', { mc: mkMisconceptions('Key mutability requirement', 'Dict ordering (pre-3.7)') }),
  sets:          n('python', 'Sets',                    1.8, 'Unordered unique collections.'),
  strings:       n('python', 'String Methods',          2.0, 'strip, split, join, replace, format.'),
  slicing:       n('python', 'Slicing',                 1.6, 'Sequence slicing [start:stop:step].'),

  // OOP
  classes:       n('python', 'Classes & Objects',       2.8, 'OOP fundamentals. __init__, self, instance attrs.', { mc: mkMisconceptions('self is not the object', 'Class vs instance attributes') }),
  inheritance:   n('python', 'Inheritance',             2.2, 'Subclassing, method override, super().'),
  polymorphism:  n('python', 'Polymorphism',            1.8, 'Duck typing, method overriding.'),
  encapsulation: n('python', 'Encapsulation',           1.6, 'Private attrs with _/___, getters/setters.'),
  dunder:        n('python', 'Dunder Methods',          1.5, '__str__, __repr__, __len__, __eq__ etc.'),
  abstractBase:  n('python', 'Abstract Base Classes',   1.2, 'ABC module, @abstractmethod.'),

  // File & Error Handling
  exceptions:    n('python', 'Exceptions',              2.0, 'try/except/else/finally, raise.', { mc: mkMisconceptions('Catching broad Exception', 'Finally always runs') }),
  fileIO:        n('python', 'File I/O',                1.8, 'open(), read(), write(), with context manager.'),
  contextMgr:    n('python', 'Context Managers',        1.4, '__enter__, __exit__, contextlib.'),

  // Modules & Libraries
  modules:       n('python', 'Modules & Packages',      1.8, 'import, from, __init__.py, pip.'),
  stdlib:        n('python', 'Standard Library',        1.6, 'os, sys, math, random, datetime, collections.'),
  itertools:     n('python', 'itertools',               1.2, 'chain, combinations, permutations, groupby.'),
  functools:     n('python', 'functools',               1.2, 'reduce, partial, lru_cache, wraps.'),

  // Advanced
  typing:        n('python', 'Type Hints',              1.4, 'PEP 484, typing module, mypy.'),
  asyncIO:       n('python', 'async / await',           1.8, 'Coroutines, event loop, asyncio.', { mc: mkMisconceptions('async vs threading confusion') }),
  threading:     n('python', 'Threading & GIL',         1.6, 'Thread module, GIL limitations.'),
  dataclasses:   n('python', 'Dataclasses',             1.3, '@dataclass decorator, frozen, fields.'),
  envVars:       n('python', 'Environment & Config',    0.9, '.env files, os.environ, dotenv.'),
  testing:       n('python', 'Unit Testing (pytest)',   1.5, 'pytest, assert, fixtures, parametrize.'),

  // Data Science bridge
  numpy:         n('python', 'NumPy Basics',            2.0, 'Arrays, vectorized ops, broadcasting.'),
  pandas:        n('python', 'Pandas Basics',           2.0, 'DataFrame, Series, groupby, merge.'),
  matplotlib:    n('python', 'Matplotlib / Viz',        1.4, 'plot, scatter, subplots, styling.'),
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATA STRUCTURES & ALGORITHMS  (~75 nodes)
// ═══════════════════════════════════════════════════════════════════════════════
const DS = {
  // Complexity
  bigO:          n('dsa', 'Big-O Notation',             3.0, 'Time and space complexity analysis.', { mc: mkMisconceptions('Best/worst/average confusion', 'Ignoring constants incorrectly') }),
  spaceTime:     n('dsa', 'Space-Time Tradeoff',        1.8, 'Trading memory for speed and vice versa.'),
  amortized:     n('dsa', 'Amortized Analysis',         1.4, 'Averaged cost over sequence of operations.'),
  recurrence:    n('dsa', 'Recurrence Relations',       1.6, 'T(n) = 2T(n/2) + O(n), Master Theorem.'),

  // Linear Structures
  arrays:        n('dsa', 'Arrays',                     2.8, 'Contiguous memory, O(1) access, O(n) insert.', { mc: mkMisconceptions('Array vs ArrayList') }),
  linkedList:    n('dsa', 'Linked Lists',               2.5, 'Singly, doubly, circular. Pointer manipulation.', { mc: mkMisconceptions('Head pointer confusion', 'Memory leaks') }),
  stack:         n('dsa', 'Stack',                      2.2, 'LIFO. push/pop. Call stack, undo operations.'),
  queue:         n('dsa', 'Queue',                      2.2, 'FIFO. enqueue/dequeue. BFS, job scheduling.'),
  deque:         n('dsa', 'Deque',                      1.6, 'Double-ended queue. Sliding window problems.'),
  circularBuf:   n('dsa', 'Circular Buffer',            1.2, 'Ring buffer. Fixed-size FIFO.'),

  // Trees
  binaryTree:    n('dsa', 'Binary Tree',                2.5, 'Tree with ≤2 children. DFS traversals.', { mc: mkMisconceptions('Confusing traversal orders') }),
  bst:           n('dsa', 'Binary Search Tree',         2.8, 'BST property. Insert, delete, search O(h).', { mc: mkMisconceptions('Unbalanced BST degrades to O(n)') }),
  avl:           n('dsa', 'AVL Tree',                   2.0, 'Self-balancing BST. Rotation operations.'),
  redBlack:      n('dsa', 'Red-Black Tree',             1.8, 'Balanced BST used in std::map, Java TreeMap.'),
  heap:          n('dsa', 'Heap (Min/Max)',              2.5, 'Complete binary tree. O(log n) insert/extract.', { mc: mkMisconceptions('Heap ≠ sorted array') }),
  trie:          n('dsa', 'Trie (Prefix Tree)',          2.0, 'String search. Autocomplete. O(L) ops.'),
  segTree:       n('dsa', 'Segment Tree',               1.8, 'Range queries and updates in O(log n).'),
  fenwickTree:   n('dsa', 'Fenwick Tree (BIT)',          1.5, 'Efficient prefix sums. Point update.'),
  naryTree:      n('dsa', 'N-ary Tree',                 1.2, 'Tree with arbitrary children count.'),

  // Graphs
  graphBasics:   n('dsa', 'Graph Basics',               2.8, 'Vertices, edges, directed/undirected, weighted.', { mc: mkMisconceptions('Graph vs tree distinction') }),
  adjMatrix:     n('dsa', 'Adjacency Matrix',           1.6, 'O(V²) space. O(1) edge lookup.'),
  adjList:       n('dsa', 'Adjacency List',             1.8, 'O(V+E) space. Sparse graph rep.'),
  bfs:           n('dsa', 'BFS',                        2.5, 'Breadth-first search. Shortest path (unweighted).', { mc: mkMisconceptions('BFS finds shortest path only in unweighted graphs') }),
  dfs:           n('dsa', 'DFS',                        2.5, 'Depth-first search. Backtracking, cycle detection.'),
  dijkstra:      n('dsa', 'Dijkstra\'s Algorithm',      2.5, 'Shortest path. Non-negative weights. O((V+E)logV).', { mc: mkMisconceptions('Fails with negative edges') }),
  bellmanFord:   n('dsa', 'Bellman-Ford',               1.8, 'Shortest path with negative weights. O(VE).'),
  floydWarshall: n('dsa', 'Floyd-Warshall',             1.6, 'All-pairs shortest path. O(V³).'),
  kruskal:       n('dsa', 'Kruskal\'s MST',             1.8, 'Min spanning tree via sorted edges + Union-Find.'),
  prim:          n('dsa', 'Prim\'s MST',                1.6, 'Min spanning tree via greedy vertex expansion.'),
  topologicalSort: n('dsa', 'Topological Sort',         2.0, 'DAG ordering. Kahn\'s algo or DFS.'),
  unionFind:     n('dsa', 'Union-Find (DSU)',            2.0, 'Disjoint set. Path compression + union by rank.'),

  // Sorting
  bubbleSort:    n('dsa', 'Bubble Sort',                1.5, 'O(n²). Educational. Rarely used in practice.'),
  selectionSort: n('dsa', 'Selection Sort',             1.4, 'O(n²). Minimum selection per pass.'),
  insertionSort: n('dsa', 'Insertion Sort',             1.6, 'O(n²) worst, O(n) best. Good for small/nearly sorted.'),
  mergeSort:     n('dsa', 'Merge Sort',                 2.5, 'O(n log n). Divide & conquer. Stable.', { mc: mkMisconceptions('Merge step is where the work happens') }),
  quickSort:     n('dsa', 'Quick Sort',                 2.5, 'O(n log n) avg, O(n²) worst. In-place.', { mc: mkMisconceptions('Pivot choice matters', 'Not stable by default') }),
  heapSort:      n('dsa', 'Heap Sort',                  1.8, 'O(n log n). In-place using heap property.'),
  countingSort:  n('dsa', 'Counting Sort',              1.5, 'O(n+k). Works on integers in known range.'),
  radixSort:     n('dsa', 'Radix Sort',                 1.4, 'O(nk). Digit-by-digit sorting.'),
  timSort:       n('dsa', 'Tim Sort',                   1.3, 'Python/Java default sort. Hybrid merge+insertion.'),

  // Searching
  linearSearch:  n('dsa', 'Linear Search',              1.2, 'O(n). Unsorted data.'),
  binarySearch:  n('dsa', 'Binary Search',              2.8, 'O(log n). Sorted array. Pointer technique.', { mc: mkMisconceptions('Mid calculation overflow', 'Off-by-one in bounds') }),
  hashTable:     n('dsa', 'Hash Tables',                2.8, 'O(1) avg. Hash function, collision handling.', { mc: mkMisconceptions('Hash collision handling', 'Load factor importance') }),

  // Algorithm Paradigms
  divideConquer: n('dsa', 'Divide & Conquer',           2.2, 'Split → solve subproblems → combine.'),
  dynamicProg:   n('dsa', 'Dynamic Programming',        3.0, 'Memoization + tabulation. Optimal substructure.', { mc: mkMisconceptions('When DP applies vs greedy', 'State definition') }),
  greedy:        n('dsa', 'Greedy Algorithms',          2.2, 'Locally optimal choices. Proof by exchange argument.', { mc: mkMisconceptions('Greedy doesn\'t always give global optimum') }),
  backtracking:  n('dsa', 'Backtracking',               2.2, 'Explore all paths, prune dead ends. N-Queens, Sudoku.'),
  twoPointers:   n('dsa', 'Two Pointers',               2.0, 'Efficient array/string traversal with two indices.'),
  slidingWindow: n('dsa', 'Sliding Window',             2.0, 'Contiguous subarray optimization technique.'),

  // Specific DP problems
  knapsack:      n('dsa', 'Knapsack Problem',           1.8, '0/1 and unbounded variants. Classic DP.'),
  lcs:           n('dsa', 'LCS / LIS',                  1.6, 'Longest common/increasing subsequence.'),
  editDistance:  n('dsa', 'Edit Distance',              1.5, 'Levenshtein distance. String DP.'),
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPUTER NETWORKS  (~65 nodes)
// ═══════════════════════════════════════════════════════════════════════════════
const CN = {
  // Fundamentals
  networkIntro:  n('cn', 'What is a Network?',          2.0, 'Nodes, links, protocols, topology basics.'),
  osiModel:      n('cn', 'OSI Model',                   3.0, '7 layers: Physical → Data Link → Network → Transport → Session → Presentation → Application.', { mc: mkMisconceptions('Confusing OSI vs TCP/IP layers') }),
  tcpipModel:    n('cn', 'TCP/IP Model',                2.8, '4 layers: Link → Internet → Transport → Application.'),
  protocols:     n('cn', 'Protocol Basics',             2.0, 'Rules for communication. Syntax, semantics, timing.'),
  bandwidth:     n('cn', 'Bandwidth & Latency',         1.8, 'Capacity vs delay. Throughput vs goodput.'),
  encoding:      n('cn', 'Data Encoding',               1.5, 'NRZ, Manchester, 4B5B. Bit rate vs baud rate.'),

  // Physical Layer
  physical:      n('cn', 'Physical Layer',              1.8, 'Signals, cables, fiber, wireless, modulation.'),
  mediums:       n('cn', 'Transmission Media',          1.5, 'Copper, fiber optic, radio, satellite.'),
  modulation:    n('cn', 'Modulation (AM/FM/PM)',       1.3, 'Analog modulation techniques.'),
  multiplexing:  n('cn', 'Multiplexing (TDM/FDM/CDM)',  1.5, 'Sharing channel capacity.'),

  // Data Link Layer
  dataLink:      n('cn', 'Data Link Layer',             2.0, 'Framing, error detection, MAC.'),
  errorDetect:   n('cn', 'Error Detection (CRC/Parity)', 1.8, 'Parity bit, checksum, CRC-32.', { mc: mkMisconceptions('Detection ≠ correction') }),
  errorCorrect:  n('cn', 'Error Correction (Hamming)',   1.5, 'Hamming codes, forward error correction.'),
  flowControl:   n('cn', 'Flow Control',                1.6, 'Stop-and-Wait, Sliding Window protocols.'),
  mac:           n('cn', 'MAC Protocols',               1.8, 'CSMA/CD, CSMA/CA, TDMA, FDMA.'),
  ethernet:      n('cn', 'Ethernet (802.3)',             2.2, 'Most common LAN standard. Frame structure.'),
  wifi:          n('cn', 'WiFi (802.11)',                2.0, '2.4GHz/5GHz/6GHz. WPA2/WPA3.', { mc: mkMisconceptions('WiFi ≠ internet') }),
  switching:     n('cn', 'Switching (L2)',               1.8, 'MAC table, store-and-forward, cut-through.'),
  vlan:          n('cn', 'VLANs',                        1.5, 'Virtual LANs. 802.1Q tagging.'),

  // Network Layer
  networkLayer:  n('cn', 'Network Layer (IP)',          2.5, 'Logical addressing, routing, fragmentation.'),
  ipv4:          n('cn', 'IPv4',                         2.8, '32-bit addresses, classes, dotted decimal.', { mc: mkMisconceptions('IP address ≠ MAC address') }),
  ipv6:          n('cn', 'IPv6',                         2.0, '128-bit addresses. Solving exhaustion.'),
  subnetting:    n('cn', 'Subnetting & CIDR',           2.5, 'CIDR notation, subnet mask, network/host bits.', { mc: mkMisconceptions('Confusing network address with broadcast') }),
  nat:           n('cn', 'NAT',                          1.8, 'Network Address Translation. Private IPs.'),
  routing:       n('cn', 'Routing Fundamentals',        2.2, 'Routing table, forwarding decision.'),
  staticRouting: n('cn', 'Static Routing',              1.4, 'Manual routes. Admin overhead.'),
  rip:           n('cn', 'RIP (Distance Vector)',        1.5, 'Routing protocol. Bellman-Ford based.'),
  ospf:          n('cn', 'OSPF (Link State)',            1.8, 'Dijkstra-based routing protocol. Areas.'),
  bgp:           n('cn', 'BGP (Path Vector)',            1.8, 'Internet routing between ASes.'),
  icmp:          n('cn', 'ICMP & Ping',                  1.5, 'Control messages. ping, traceroute.'),
  arp:           n('cn', 'ARP',                          1.6, 'IP → MAC resolution. ARP cache.', { mc: mkMisconceptions('ARP is broadcast-based') }),

  // Transport Layer
  transport:     n('cn', 'Transport Layer',             2.2, 'End-to-end delivery. Port numbers. Segmentation.'),
  tcp:           n('cn', 'TCP',                          3.0, 'Reliable, ordered, connection-oriented. 3-way handshake.', { mc: mkMisconceptions('TCP handles reordering, not ordering', 'ACK number meaning') }),
  udp:           n('cn', 'UDP',                          2.2, 'Unreliable, fast, connectionless. DNS, video.', { mc: mkMisconceptions('UDP is always worse than TCP') }),
  ports:         n('cn', 'Ports & Sockets',             2.0, 'Well-known (0-1023), registered, ephemeral.'),
  congestionCtrl: n('cn', 'TCP Congestion Control',     2.2, 'Slow start, AIMD, congestion window, Reno/CUBIC.'),
  reliableData:  n('cn', 'Reliable Data Transfer',      1.8, 'ACK, retransmit, sequence numbers, pipelining.'),

  // Application Layer
  appLayer:      n('cn', 'Application Layer',           1.8, 'HTTP, DNS, SMTP, FTP, SSH.'),
  http:          n('cn', 'HTTP / HTTPS',                2.8, 'Request/response, methods, status codes, headers.', { mc: mkMisconceptions('HTTP is stateless', 'GET vs POST semantics') }),
  dns:           n('cn', 'DNS',                          2.5, 'Domain → IP resolution. Recursive vs iterative.', { mc: mkMisconceptions('DNS caching & TTL') }),
  tls:           n('cn', 'TLS / SSL',                   2.0, 'Handshake, certificates, symmetric + asymmetric crypto.'),
  smtp:          n('cn', 'SMTP / Email',                1.5, 'Mail transfer protocol. MX records.'),
  ftp:           n('cn', 'FTP / SFTP',                  1.2, 'File transfer. Active vs passive mode.'),
  websockets:    n('cn', 'WebSockets',                  1.6, 'Full-duplex over TCP. Persistent connection.'),

  // Security
  netSecurity:   n('cn', 'Network Security Basics',    2.0, 'CIA triad, threats, attack surface.'),
  firewall:      n('cn', 'Firewalls',                   1.8, 'Packet filter, stateful, application proxy.'),
  vpn:           n('cn', 'VPN',                          1.6, 'Tunneling, IPsec, OpenVPN.'),
  ddos:          n('cn', 'DDoS Attacks',                1.4, 'Amplification, botnet, mitigation.'),
}

// ─────────────────────────────────────────────────────────────────────────────
// Assign subject color to each node
// ─────────────────────────────────────────────────────────────────────────────
Object.values(PY).forEach(node => { node.color = SUBJECTS.PYTHON.color })
Object.values(DS).forEach(node => { node.color = SUBJECTS.DSA.color })
Object.values(CN).forEach(node => { node.color = SUBJECTS.CN.color })

// ─────────────────────────────────────────────────────────────────────────────
// EDGES
// ─────────────────────────────────────────────────────────────────────────────
const rawEdges = [
  // ── Python internal ────────────────────────────────────────────────────────
  e(PY.variables.id, PY.operators.id, 2),
  e(PY.variables.id, PY.typecast.id, 2),
  e(PY.variables.id, PY.inputOutput.id, 1.5),
  e(PY.variables.id, PY.strings.id, 1.5),
  e(PY.variables.id, PY.comments.id, 1),
  e(PY.operators.id, PY.ifElse.id, 2),
  e(PY.ifElse.id, PY.loops.id, 2),
  e(PY.loops.id, PY.loopControl.id, 1.5),
  e(PY.loops.id, PY.comprehension.id, 1.5),
  e(PY.comprehension.id, PY.genExpr.id, 1.5),
  e(PY.functions.id, PY.args.id, 2),
  e(PY.functions.id, PY.scope.id, 2),
  e(PY.functions.id, PY.recursion.id, 2),
  e(PY.functions.id, PY.lambdas.id, 1.5),
  e(PY.functions.id, PY.decorators.id, 1.5),
  e(PY.scope.id, PY.closures.id, 1.5),
  e(PY.closures.id, PY.decorators.id, 1.5),
  e(PY.variables.id, PY.functions.id, 2),
  e(PY.ifElse.id, PY.functions.id, 1),
  e(PY.loops.id, PY.functions.id, 1),
  e(PY.lists.id, PY.slicing.id, 1.5),
  e(PY.lists.id, PY.comprehension.id, 1.5),
  e(PY.lists.id, PY.tuples.id, 1),
  e(PY.lists.id, PY.sets.id, 1),
  e(PY.dicts.id, PY.sets.id, 1),
  e(PY.strings.id, PY.slicing.id, 1.5),
  e(PY.variables.id, PY.lists.id, 1.5),
  e(PY.variables.id, PY.dicts.id, 1.5),
  e(PY.functions.id, PY.itertools.id, 1.2),
  e(PY.functions.id, PY.functools.id, 1.2),
  e(PY.lambdas.id, PY.functools.id, 1.2),
  e(PY.classes.id, PY.inheritance.id, 2),
  e(PY.classes.id, PY.encapsulation.id, 1.5),
  e(PY.classes.id, PY.dunder.id, 1.5),
  e(PY.inheritance.id, PY.polymorphism.id, 1.5),
  e(PY.inheritance.id, PY.abstractBase.id, 1.2),
  e(PY.functions.id, PY.classes.id, 2),
  e(PY.exceptions.id, PY.fileIO.id, 1.5),
  e(PY.fileIO.id, PY.contextMgr.id, 1.5),
  e(PY.classes.id, PY.contextMgr.id, 1.2),
  e(PY.modules.id, PY.stdlib.id, 1.5),
  e(PY.modules.id, PY.itertools.id, 1.2),
  e(PY.modules.id, PY.functools.id, 1.2),
  e(PY.functions.id, PY.typing.id, 1.2),
  e(PY.classes.id, PY.typing.id, 1.2),
  e(PY.asyncIO.id, PY.threading.id, 1.2),
  e(PY.functions.id, PY.asyncIO.id, 1.5),
  e(PY.classes.id, PY.dataclasses.id, 1.2),
  e(PY.exceptions.id, PY.testing.id, 1.2),
  e(PY.functions.id, PY.testing.id, 1.5),
  e(PY.lists.id, PY.numpy.id, 1.5),
  e(PY.numpy.id, PY.pandas.id, 1.5),
  e(PY.pandas.id, PY.matplotlib.id, 1.2),

  // ── DSA internal ───────────────────────────────────────────────────────────
  e(DS.bigO.id, DS.spaceTime.id, 1.5),
  e(DS.bigO.id, DS.amortized.id, 1.2),
  e(DS.bigO.id, DS.recurrence.id, 1.5),
  e(DS.arrays.id, DS.linkedList.id, 1.5),
  e(DS.arrays.id, DS.stack.id, 1.5),
  e(DS.arrays.id, DS.queue.id, 1.5),
  e(DS.linkedList.id, DS.stack.id, 1),
  e(DS.linkedList.id, DS.queue.id, 1),
  e(DS.stack.id, DS.deque.id, 1.2),
  e(DS.queue.id, DS.deque.id, 1.2),
  e(DS.queue.id, DS.circularBuf.id, 1),
  e(DS.binaryTree.id, DS.bst.id, 2),
  e(DS.bst.id, DS.avl.id, 1.8),
  e(DS.bst.id, DS.redBlack.id, 1.5),
  e(DS.binaryTree.id, DS.heap.id, 1.5),
  e(DS.binaryTree.id, DS.trie.id, 1.2),
  e(DS.binaryTree.id, DS.naryTree.id, 1),
  e(DS.arrays.id, DS.segTree.id, 1.5),
  e(DS.segTree.id, DS.fenwickTree.id, 1.2),
  e(DS.graphBasics.id, DS.adjMatrix.id, 1.5),
  e(DS.graphBasics.id, DS.adjList.id, 1.5),
  e(DS.graphBasics.id, DS.bfs.id, 2),
  e(DS.graphBasics.id, DS.dfs.id, 2),
  e(DS.bfs.id, DS.dijkstra.id, 1.5),
  e(DS.dijkstra.id, DS.bellmanFord.id, 1.2),
  e(DS.dijkstra.id, DS.floydWarshall.id, 1.2),
  e(DS.kruskal.id, DS.unionFind.id, 1.5),
  e(DS.prim.id, DS.heap.id, 1.5),
  e(DS.dfs.id, DS.topologicalSort.id, 1.5),
  e(DS.graphBasics.id, DS.kruskal.id, 1.5),
  e(DS.graphBasics.id, DS.prim.id, 1.5),
  e(DS.bubbleSort.id, DS.selectionSort.id, 1),
  e(DS.selectionSort.id, DS.insertionSort.id, 1.2),
  e(DS.divideConquer.id, DS.mergeSort.id, 2),
  e(DS.divideConquer.id, DS.quickSort.id, 2),
  e(DS.heap.id, DS.heapSort.id, 1.5),
  e(DS.countingSort.id, DS.radixSort.id, 1.2),
  e(DS.mergeSort.id, DS.timSort.id, 1.2),
  e(DS.insertionSort.id, DS.timSort.id, 1),
  e(DS.linearSearch.id, DS.binarySearch.id, 1.5),
  e(DS.arrays.id, DS.binarySearch.id, 1.5),
  e(DS.hashTable.id, DS.spaceTime.id, 1.2),
  e(DS.dynamicProg.id, DS.recurrence.id, 1.5),
  e(DS.dynamicProg.id, DS.knapsack.id, 1.5),
  e(DS.dynamicProg.id, DS.lcs.id, 1.5),
  e(DS.dynamicProg.id, DS.editDistance.id, 1.2),
  e(DS.greedy.id, DS.kruskal.id, 1.2),
  e(DS.greedy.id, DS.prim.id, 1.2),
  e(DS.greedy.id, DS.dijkstra.id, 1.2),
  e(DS.backtracking.id, DS.dfs.id, 1.5),
  e(DS.twoPointers.id, DS.slidingWindow.id, 1.5),
  e(DS.arrays.id, DS.twoPointers.id, 1.5),
  e(DS.divideConquer.id, DS.binarySearch.id, 1.2),

  // ── CN internal ────────────────────────────────────────────────────────────
  e(CN.networkIntro.id, CN.osiModel.id, 2),
  e(CN.osiModel.id, CN.tcpipModel.id, 2),
  e(CN.osiModel.id, CN.protocols.id, 1.5),
  e(CN.bandwidth.id, CN.encoding.id, 1.5),
  e(CN.physical.id, CN.mediums.id, 1.5),
  e(CN.physical.id, CN.modulation.id, 1.5),
  e(CN.physical.id, CN.multiplexing.id, 1.2),
  e(CN.dataLink.id, CN.errorDetect.id, 1.5),
  e(CN.errorDetect.id, CN.errorCorrect.id, 1.2),
  e(CN.dataLink.id, CN.flowControl.id, 1.5),
  e(CN.dataLink.id, CN.mac.id, 1.5),
  e(CN.mac.id, CN.ethernet.id, 1.5),
  e(CN.mac.id, CN.wifi.id, 1.5),
  e(CN.ethernet.id, CN.switching.id, 1.5),
  e(CN.switching.id, CN.vlan.id, 1.2),
  e(CN.networkLayer.id, CN.ipv4.id, 2),
  e(CN.networkLayer.id, CN.ipv6.id, 1.5),
  e(CN.ipv4.id, CN.subnetting.id, 2),
  e(CN.ipv4.id, CN.nat.id, 1.5),
  e(CN.networkLayer.id, CN.routing.id, 2),
  e(CN.routing.id, CN.staticRouting.id, 1.2),
  e(CN.routing.id, CN.rip.id, 1.5),
  e(CN.routing.id, CN.ospf.id, 1.5),
  e(CN.routing.id, CN.bgp.id, 1.5),
  e(CN.ipv4.id, CN.icmp.id, 1.5),
  e(CN.ipv4.id, CN.arp.id, 1.5),
  e(CN.transport.id, CN.tcp.id, 2),
  e(CN.transport.id, CN.udp.id, 2),
  e(CN.transport.id, CN.ports.id, 1.5),
  e(CN.tcp.id, CN.congestionCtrl.id, 1.5),
  e(CN.tcp.id, CN.reliableData.id, 1.5),
  e(CN.flowControl.id, CN.reliableData.id, 1.2),
  e(CN.appLayer.id, CN.http.id, 2),
  e(CN.appLayer.id, CN.dns.id, 2),
  e(CN.appLayer.id, CN.smtp.id, 1.2),
  e(CN.appLayer.id, CN.ftp.id, 1),
  e(CN.http.id, CN.tls.id, 1.5),
  e(CN.http.id, CN.websockets.id, 1.2),
  e(CN.netSecurity.id, CN.firewall.id, 1.5),
  e(CN.netSecurity.id, CN.vpn.id, 1.2),
  e(CN.netSecurity.id, CN.ddos.id, 1.2),
  e(CN.tls.id, CN.netSecurity.id, 1.2),

  // ── OSI layer connections ──────────────────────────────────────────────────
  e(CN.osiModel.id, CN.physical.id, 1.5),
  e(CN.osiModel.id, CN.dataLink.id, 1.5),
  e(CN.osiModel.id, CN.networkLayer.id, 1.5),
  e(CN.osiModel.id, CN.transport.id, 1.5),
  e(CN.osiModel.id, CN.appLayer.id, 1.5),

  // ── CROSS-SUBJECT LINKS ────────────────────────────────────────────────────
  // Python → DSA
  e(PY.variables.id, DS.arrays.id, 1.2),
  e(PY.lists.id, DS.arrays.id, 2),
  e(PY.lists.id, DS.linkedList.id, 1.5),
  e(PY.dicts.id, DS.hashTable.id, 2),
  e(PY.sets.id, DS.hashTable.id, 1.2),
  e(PY.recursion.id, DS.recursion ? DS.recursion.id : DS.backtracking.id, 1.8),
  e(PY.recursion.id, DS.dynamicProg.id, 1.5),
  e(PY.recursion.id, DS.divideConquer.id, 1.5),
  e(PY.loops.id, DS.bigO.id, 1.2),
  e(PY.comprehension.id, DS.slidingWindow.id, 1),
  e(PY.classes.id, DS.bst.id, 1.2),
  e(PY.classes.id, DS.linkedList.id, 1.2),
  e(PY.classes.id, DS.graphBasics.id, 1.2),
  e(PY.functions.id, DS.divideConquer.id, 1.2),
  e(PY.numpy.id, DS.arrays.id, 1.5),
  e(PY.stdlib.id, DS.hashTable.id, 1),

  // DSA → CN
  e(DS.dijkstra.id, CN.ospf.id, 1.8),
  e(DS.bellmanFord.id, CN.rip.id, 1.5),
  e(DS.graphBasics.id, CN.routing.id, 2),
  e(DS.bfs.id, CN.routing.id, 1.2),
  e(DS.hashTable.id, CN.dns.id, 1.5),
  e(DS.queue.id, CN.tcp.id, 1.2),
  e(DS.circularBuf.id, CN.tcp.id, 1),
  e(DS.slidingWindow.id, CN.congestionCtrl.id, 1.5),
  e(DS.errorDetect ? DS.errorDetect.id : DS.bigO.id, CN.errorDetect.id, 1.2),

  // Python → CN
  e(PY.asyncIO.id, CN.websockets.id, 1.5),
  e(PY.asyncIO.id, CN.tcp.id, 1.2),
  e(PY.modules.id, CN.http.id, 1),
  e(PY.fileIO.id, CN.ftp.id, 1),
]

// ─────────────────────────────────────────────────────────────────────────────
// Compute node degrees for sizing
// ─────────────────────────────────────────────────────────────────────────────
const allNodes = [
  ...Object.values(PY),
  ...Object.values(DS),
  ...Object.values(CN),
]

const degreeMap = {}
rawEdges.forEach(({ source, target }) => {
  degreeMap[source] = (degreeMap[source] || 0) + 1
  degreeMap[target] = (degreeMap[target] || 0) + 1
})

allNodes.forEach(node => {
  node.degree = degreeMap[node.id] || 1
  // val drives sphere radius in react-force-graph-3d
  node.val = Math.max(1, node.weight * (1 + node.degree * 0.15))
})

// Filter out any broken edge references
const nodeIds = new Set(allNodes.map(n => n.id))
const edges = rawEdges.filter(({ source, target }) => nodeIds.has(source) && nodeIds.has(target))

export const graphData = { nodes: allNodes, links: edges }

export { PY, DS, CN }
