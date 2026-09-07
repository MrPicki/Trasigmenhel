import React from 'react';

/**
 * The identity's one motif, drawn rather than photographed.
 *
 * The old site stretched a 126 kB screenshot of cracked glass across the top
 * of the page. This is the same idea as geometry: fifteen radial cracks and
 * the chords that join them, hairline-stroked, ~3 kB, sharp at any size, and
 * able to do the one thing the raster could not — draw itself outward from
 * the point of impact when the page loads.
 *
 * Purely decorative: aria-hidden, and it settles into a static state under
 * `prefers-reduced-motion`.
 */

// Radials walk outward from the impact point in straight segments, the way a
// laminated pane actually fails. Geometry is fixed, not random at runtime.
const RADIALS = [
  'M 500.0 420.0 L 593.8 416.0 L 687.5 410.8 L 780.9 402.5 L 874.5 396.4 L 968.4 393.8',
  'M 500.0 420.0 L 619.1 470.4 L 737.5 521.9 L 864.0 558.8 L 987.4 600.9 L 1112.4 639.8 L 1223.6 705.9',
  'M 500.0 420.0 L 649.0 591.2 L 806.0 757.2 L 986.0 906.8 L 1140.4 1074.6',
  'M 500.0 420.0 L 520.9 519.9 L 545.8 619.2 L 596.9 713.0 L 610.1 815.0 L 648.1 911.5',
  'M 500.0 420.0 L 500.3 520.7 L 487.0 621.1 L 496.6 722.0 L 501.9 822.7 L 481.3 923.2 L 477.0 1023.8',
  'M 500.0 420.0 L 404.1 525.4 L 328.6 643.4 L 245.0 756.4 L 144.2 859.3 L 43.6 962.0',
  'M 500.0 420.0 L 387.4 506.6 L 260.9 579.0 L 149.8 667.5 L 42.4 759.6',
  'M 500.0 420.0 L 377.7 438.4 L 260.4 475.8 L 133.2 475.2 L 13.9 507.0 L -107.6 529.0',
  'M 500.0 420.0 L 425.0 398.5 L 351.1 374.3 L 269.8 371.0 L 198.1 338.9 L 117.9 332.9 L 40.4 319.0',
  'M 500.0 420.0 L 329.4 316.2 L 146.0 229.0 L -25.3 125.8 L -187.9 11.7',
  'M 500.0 420.0 L 445.9 324.1 L 382.3 232.4 L 325.7 137.6 L 272.4 41.3 L 222.8 -56.6',
  'M 500.0 420.0 L 470.9 297.6 L 420.8 179.6 L 384.6 58.7 L 375.8 -68.1 L 343.2 -189.8',
  'M 500.0 420.0 L 550.6 314.1 L 599.4 207.7 L 657.5 104.5 L 657.6 -17.3 L 719.8 -120.2',
  'M 500.0 420.0 L 539.5 385.2 L 569.2 343.1 L 610.4 309.3 L 649.7 274.3 L 690.2 240.2 L 719.9 197.9',
  'M 500.0 420.0 L 558.1 399.7 L 615.3 377.5 L 672.1 354.7 L 731.2 336.3 L 793.3 324.6 L 847.3 295.5',
];

// Chords connect neighbouring radials — the shards themselves.
const CHORDS = [
  'M 681.0 410.6 Q 673.1 457.3 655.0 478.3',
  'M 822.1 407.3 Q 822.4 455.3 798.3 528.2',
  'M 799.4 532.5 Q 739.4 565.7 695.1 617.2',
  'M 627.6 549.1 Q 586.0 584.7 549.2 599.7',
  'M 597.5 777.8 Q 537.1 797.9 488.8 828.1',
  'M 488.3 666.1 Q 406.8 667.0 321.5 628.6',
  'M 481.1 826.6 Q 343.0 787.5 208.7 770.0',
  'M 374.9 568.5 Q 366.9 547.9 355.3 525.7',
  'M 265.2 699.4 Q 255.1 684.9 206.3 636.9',
  'M 179.9 658.0 Q 131.1 592.8 61.2 502.3',
  'M 354.3 447.6 Q 341.3 419.7 355.5 385.7',
  'M 190.6 477.9 Q 194.2 395.5 175.6 341.9',
  'M 381.3 226.4 Q 398.3 205.0 444.2 212.5',
  'M 268.1 41.9 Q 312.5 32.1 383.0 -6.4',
  'M 535.3 335.9 Q 564.5 327.9 562.2 356.2',
  'M 579.5 340.9 Q 573.2 367.3 603.9 384.0',
  'M 631.7 371.9 Q 627.1 378.2 659.8 411.3',
  'M 752.6 329.1 Q 730.8 354.0 747.9 410.6',
];

interface FractureProps {
  className?: string;
}

const Fracture = ({ className = '' }: FractureProps) => (
  <svg
    className={`fracture ${className}`}
    viewBox="0 0 1000 840"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* The cracks fade with distance from the impact, so the pane reads as
          broken in one place rather than uniformly hatched. */}
      <radialGradient id="fracture-falloff" cx="50%" cy="50%" r="52%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="18%" stopColor="#FFFFFF" stopOpacity="0.42" />
        <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.14" />
        <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <mask id="fracture-mask">
        <rect x="0" y="0" width="1000" height="840" fill="url(#fracture-falloff)" />
      </mask>
    </defs>

    <g mask="url(#fracture-mask)" stroke="#EDE9E1" strokeLinecap="round" opacity={0.55}>
      {RADIALS.map((d, i) => (
        <path key={`r${i}`} d={d} strokeWidth={i % 3 === 0 ? 1.3 : 0.85} style={{ animationDelay: `${0.15 + i * 0.012}s` }} />
      ))}
      {CHORDS.map((d, i) => (
        <path key={`c${i}`} d={d} strokeWidth={0.6} opacity={0.6} style={{ animationDelay: `${0.4 + i * 0.018}s` }} />
      ))}
      {/* The impact itself. */}
      <circle cx="500" cy="420" r="2" fill="#EDE9E1" stroke="none" opacity={0.8} />
    </g>
  </svg>
);

export default Fracture;
