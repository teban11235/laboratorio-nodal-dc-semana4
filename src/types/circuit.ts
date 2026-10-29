export type ModuleId =
  | 'fundamentals'
  | 'nodal-current'
  | 'supernode-fig24'
  | 'supernode-guided'
  | 'concept-map'
  | 'practice-quiz';

export type SignConvention = 'leaving-zero' | 'entering-equals-leaving';

export interface FundamentalsParams {
  va: number; // V
  vb: number; // V
  vc: number; // V
  r1: number; // Ohm (between a and b)
  r2: number; // Ohm (between b and c)
  referenceNode: 'ground' | 'a' | 'b' | 'c';
}

export interface NodalCurrentParams {
  i1: number; // A (source 1 at node 1)
  i1Direction: 'entering' | 'leaving';
  i2: number; // A (source 2 at node 2)
  i2Direction: 'entering' | 'leaving';
  r1: number; // Ohm (node 1 to ground)
  r2: number; // Ohm (between node 1 and node 2)
  r3: number; // Ohm (node 2 to ground)
}

export interface Fig24SupernodeParams {
  vs1: number; // V (Case A source at node 1, default 10 V)
  vs1Polarity: 'pos-node1' | 'neg-node1';
  vsn: number; // V (Case B supernode source between v2 and v3, default 5 V)
  vsnPolarity: 'pos-node2' | 'pos-node3';
  r1: number; // Ohm (between v1 and v2, default 2 Ohm)
  r2: number; // Ohm (from v2 to ground, default 8 Ohm)
  r3: number; // Ohm (from v3 to ground, default 6 Ohm)
  r4: number; // Ohm (top resistor between v1 and v3, default 4 Ohm)
}

export interface GuidedSupernodeParams {
  i1: number; // A (at node 1, default 2 A entering)
  i1Direction: 'entering' | 'leaving';
  i2: number; // A (at node 2, default 7 A leaving)
  i2Direction: 'entering' | 'leaving';
  vsn: number; // V (between node 1 and node 2, default 2 V)
  vsnPolarity: 'pos-node2' | 'pos-node1';
  r1: number; // Ohm (node 1 to ground, default 2 Ohm)
  r2: number; // Ohm (node 2 to ground, default 4 Ohm)
  r3: number; // Ohm (parallel between node 1 and 2, default 10 Ohm)
}
