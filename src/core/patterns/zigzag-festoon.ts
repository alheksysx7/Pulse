import type { Pattern, KnotType } from '../types';

export const zigzagFestoonPattern: Pattern = {
  id: 'zigzag-festoon',
  name: 'Nudo festón zigzag alterno',
  minThreads: 3,
  maxThreads: 3,
  evenOnly: false,
  shiftOddRows: true, // We will manually emit the sequence, but shiftOddRows lets us pair (0,1) then (1,2)
  generateSequence: (_threadsCount: number, rows: number) => {
    const sequence: KnotType[][] = [];

    // We are simulating with 3 threads.
    // If shiftOddRows = true:
    // Row 0 (Even): Thread offset = 0. Pairs available: (0,1). Thread 2 is free.
    // Row 1 (Odd): Thread offset = 1. Pairs available: (1,2). Thread 0 is free.

    // Phase 1: Guide (initially thread 0) moves right.
    // Tie 2 festoon knots with thread 0 over thread 1, then thread 0 over thread 2.
    // So thread 0 is left, thread 1 is right -> F knot (working left over guide right).
    // Wait, the instructions say:
    // "Toma el Hilo 1 (blanco); este actuará como el hilo guía y se inclina... hacia la derecha."
    // "Teje el primer nudo festón sobre el hilo guía utilizando el Hilo 2"
    // This means Guide is left, Working is right. 
    // In our `simulate.ts`, an `F` knot is: Working is Left (color1), Guide is Right (color2). 
    // If we want Guide=Left and Working=Right, that is a `B` knot (Backward knot: working right ties over guide left).
    // Let's trace it:
    // We want Guide (thread 0) to end up at thread 2 position.
    // If we do a `B` knot between (0, 1): Working (1) ties over Guide (0).
    // Next colors: left=1, right=0. Guide moved right! Working moved left!
    // So Guide is now at index 1.
    // Next, we need Guide (at index 1) to tie with thread 2.
    // Pair (1,2): B knot -> Working (2) ties over Guide (1).
    // Next colors: left=2, right=1. Guide moved right! Working moved left!
    // So Phase 1 is two `B` knots.
    // Row 0: Even -> pair (0,1) -> `B`.
    // Row 1: Odd -> pair (1,2) -> `B`.

    // Phase 2: Guide (now at thread 2) moves left.
    // It ties over thread 1, then thread 0.
    // Guide is Right, Working is Left. This is an `F` knot.
    // We need pair (1,2) to tie an `F` knot. But Row 2 is an Even row (pair (0,1)).
    // Wait, if Row 2 is Even, the pair is (0,1). But Guide is at 2! We can't tie it.
    // We can do an empty row? If Row 2 (Even) = `NONE`, then colors don't change.
    // Row 3 (Odd) = pair (1,2) -> `F`. Guide moves left from 2 to 1.
    // Row 4 (Even) = pair (0,1) -> `F`. Guide moves left from 1 to 0.
    // Row 5 (Odd) = `NONE`.

    // Let's map it:
    // R0 (E): B
    // R1 (O): B
    // R2 (E): NONE
    // R3 (O): F
    // R4 (E): F
    // R5 (O): NONE
    // This perfectly brings it back to the start!

    const patternCycle: KnotType[][] = [
      ['B'],    // R0: (0,1)
      ['B'],    // R1: (1,2)
      ['NONE'], // R2: (0,1) do nothing
      ['F'],    // R3: (1,2)
      ['F'],    // R4: (0,1)
      ['NONE']  // R5: (1,2) do nothing
    ];

    for (let r = 0; r < rows; r++) {
      sequence.push(patternCycle[r % 6]);
    }

    return sequence;
  }
};
