import {
  FundamentalsParams,
  NodalCurrentParams,
  Fig24SupernodeParams,
  GuidedSupernodeParams,
} from '../types/circuit';

export const DEFAULT_FUNDAMENTALS: FundamentalsParams = {
  va: 12,
  vb: 4,
  vc: -2,
  r1: 4,
  r2: 3,
  referenceNode: 'ground',
};

export const DEFAULT_NODAL_CURRENT: NodalCurrentParams = {
  i1: 5,
  i1Direction: 'entering',
  i2: 4,
  i2Direction: 'leaving',
  r1: 2,
  r2: 4,
  r3: 6,
};

export const DEFAULT_FIG24_SUPERNODE: Fig24SupernodeParams = {
  vs1: 10,
  vs1Polarity: 'pos-node1',
  vsn: 5,
  vsnPolarity: 'pos-node2',
  r1: 2,
  r2: 8,
  r3: 6,
  r4: 4,
};

export const DEFAULT_GUIDED_SUPERNODE: GuidedSupernodeParams = {
  i1: 2,
  i1Direction: 'entering',
  i2: 7,
  i2Direction: 'leaving',
  vsn: 2,
  vsnPolarity: 'pos-node2',
  r1: 2,
  r2: 4,
  r3: 10,
};

export function solveFundamentals(params: FundamentalsParams) {
  const offset =
    params.referenceNode === 'ground'
      ? 0
      : params.referenceNode === 'a'
      ? params.va
      : params.referenceNode === 'b'
      ? params.vb
      : params.vc;

  const vaRel = params.va - offset;
  const vbRel = params.vb - offset;
  const vcRel = params.vc - offset;

  const vDiffAB = vaRel - vbRel;
  const iAB = vDiffAB / params.r1; // + means A -> B

  const vDiffBC = vbRel - vcRel;
  const iBC = vDiffBC / params.r2; // + means B -> C

  // External current injected/extracted at node B to maintain steady state KCL
  const iNodeBExternal = iBC - iAB;

  return {
    vaRel,
    vbRel,
    vcRel,
    vDiffAB,
    iAB,
    vDiffBC,
    iBC,
    iNodeBExternal,
    higherAB: vaRel >= vbRel ? 'a' : 'b',
    higherBC: vbRel >= vcRel ? 'b' : 'c',
  };
}

export function solveNodalCurrent(params: NodalCurrentParams) {
  const { i1, i1Direction, i2, i2Direction, r1, r2, r3 } = params;

  // Net current entering Node 1 and Node 2 from ideal current sources
  const I1NetEntering = i1Direction === 'entering' ? i1 : -i1;
  const I2NetEntering = i2Direction === 'entering' ? i2 : -i2;

  // Conductance matrix G * [v1; v2] = [I1NetEntering; I2NetEntering]
  // Node 1: v1/r1 + (v1 - v2)/r2 = I1NetEntering
  // Node 2: v2/r3 + (v2 - v1)/r2 = I2NetEntering
  const g11 = 1 / r1 + 1 / r2;
  const g12 = -1 / r2;
  const g21 = -1 / r2;
  const g22 = 1 / r2 + 1 / r3;

  const det = g11 * g22 - g12 * g21;
  const v1 = (I1NetEntering * g22 - I2NetEntering * g12) / det;
  const v2 = (g11 * I2NetEntering - g21 * I1NetEntering) / det;

  // Branch currents (defined positive leaving node to ground or from node 1 -> node 2)
  const iR1 = v1 / r1; // Node 1 -> Ground
  const iR2 = (v1 - v2) / r2; // Node 1 -> Node 2
  const iR3 = v2 / r3; // Node 2 -> Ground

  // KCL verification residuals (sum of currents leaving each node)
  const kclNode1Residual = iR1 + iR2 - I1NetEntering;
  const kclNode2Residual = iR3 - iR2 - I2NetEntering;

  return {
    v1,
    v2,
    I1NetEntering,
    I2NetEntering,
    g11,
    g12,
    g21,
    g22,
    det,
    iR1,
    iR2,
    iR3,
    kclNode1Residual,
    kclNode2Residual,
  };
}

export function solveFig24Supernode(params: Fig24SupernodeParams) {
  const { vs1, vs1Polarity, vsn, vsnPolarity, r1, r2, r3, r4 } = params;

  // Case A: Node 1 is fixed directly by Vs1 connected to ground
  const v1 = vs1Polarity === 'pos-node1' ? vs1 : -vs1;

  // Case B: Supernode between v2 and v3
  // Constraint equation (LTK):
  // If pos-node2: v2 - v3 = vsn => v2 = v3 + vsn
  // If pos-node3: v3 - v2 = vsn => v2 = v3 - vsn
  const deltaV23 = vsnPolarity === 'pos-node2' ? vsn : -vsn; // v2 - v3 = deltaV23

  // KCL at Supernode (currents leaving = 0):
  // (v2 - v1)/r1 + v2/r2 + (v3 - v1)/r4 + v3/r3 = 0
  // Substitute v2 = v3 + deltaV23:
  // v3 * (1/r1 + 1/r2 + 1/r4 + 1/r3) + deltaV23 * (1/r1 + 1/r2) = v1 * (1/r1 + 1/r4)
  const g2 = 1 / r1 + 1 / r2;
  const g3 = 1 / r4 + 1 / r3;
  const rhs = v1 * (1 / r1 + 1 / r4) - deltaV23 * g2;

  const v3 = rhs / (g2 + g3);
  const v2 = v3 + deltaV23;

  // Currents matching Figure 24 arrow directions on Page 6:
  // i1: from v1 to v2 through R1 (2 Ohm)
  // i2: from v2 to ground through R2 (8 Ohm)
  // i3: from v3 to ground through R3 (6 Ohm)
  // i4: from v1 to v3 through R4 (4 Ohm)
  const i1 = (v1 - v2) / r1;
  const i2 = v2 / r2;
  const i3 = v3 / r3;
  const i4 = (v1 - v3) / r4;

  // Current inside the supernode voltage source (from v2 -> v3)
  // By KCL at node 2: i1 = i2 + iSource2to3 => iSource2to3 = i1 - i2
  const iSource2to3 = i1 - i2;

  return {
    v1,
    v2,
    v3,
    deltaV23,
    i1,
    i2,
    i3,
    i4,
    iSource2to3,
    totalEnteringSupernode: i1 + i4,
    totalLeavingSupernode: i2 + i3,
  };
}

export function solveGuidedSupernode(params: GuidedSupernodeParams) {
  const { i1, i1Direction, i2, i2Direction, vsn, vsnPolarity, r1, r2, r3 } = params;

  // Sign convention: currents leaving supernode = 0
  // i1SignedLeaving: if i1 enters node 1, its leaving contribution is -i1
  const i1Leaving = i1Direction === 'leaving' ? i1 : -i1;
  const i2Leaving = i2Direction === 'leaving' ? i2 : -i2;
  const netSourceLeaving = i1Leaving + i2Leaving; // For 2A entering (-2) and 7A leaving (+7), net = +5 A

  // Constraint equation (LTK):
  // Default pos-node2: v2 - v1 = vsn => v2 = v1 + vsn
  // If pos-node1: v1 - v2 = vsn => v2 = v1 - vsn
  const deltaV21 = vsnPolarity === 'pos-node2' ? vsn : -vsn; // v2 - v1 = deltaV21

  // KCL at Supernode:
  // v1/r1 + v2/r2 + i1Leaving + i2Leaving = 0
  // Substitute v2 = v1 + deltaV21:
  // v1 * (1/r1 + 1/r2) + deltaV21 / r2 + netSourceLeaving = 0
  const gSum = 1 / r1 + 1 / r2;
  const v1 = (-netSourceLeaving - deltaV21 / r2) / gSum;
  const v2 = v1 + deltaV21;

  // Branch currents:
  const iR1 = v1 / r1; // Node 1 to ground
  const iR2 = v2 / r2; // Node 2 to ground
  const iR3From1To2 = (v1 - v2) / r3; // Current through parallel resistor R3 (10 Ohm) from Node 1 to Node 2

  // Current through the 2V voltage source from Node 1 to Node 2:
  // At Node 1: iR1 + iR3From1To2 + iSource1to2 + i1Leaving = 0
  const iSource1to2 = -(iR1 + iR3From1To2 + i1Leaving);

  // Integer scaled equation coefficients (multiplying by LCM-like factor r1*r2)
  const scale = r1 * r2;
  const coeffV1 = r2;
  const coeffV2 = r1;
  const rhsScaled = -netSourceLeaving * scale;

  return {
    v1,
    v2,
    i1Leaving,
    i2Leaving,
    netSourceLeaving,
    deltaV21,
    iR1,
    iR2,
    iR3From1To2,
    iSource1to2,
    coeffV1,
    coeffV2,
    rhsScaled,
  };
}

export function formatNum(val: number, decimals = 2): string {
  if (Math.abs(val) < 1e-9) return '0';
  if (Number.isInteger(Number(val.toFixed(4)))) {
    return Math.round(val).toString();
  }
  return val.toFixed(decimals);
}
