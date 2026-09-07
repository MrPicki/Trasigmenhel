import React from 'react';

/**
 * The identity's motif, drawn rather than photographed.
 *
 * Matched to the crack in the logo: the cracks there are not hairlines, they
 * are tapered white spikes — broad and bright where the pane was struck,
 * narrowing to needle points at the tips — around a cluster of small shard
 * plates at the core, with short branches splitting off the long spikes.
 * So every crack here is a filled polygon swept along a kinked centreline
 * with a half-width that falls to zero, not a stroked line.
 *
 * ~4 kB, sharp at any size, and able to do the one thing a raster could not:
 * propagate outward from the point of impact when the page loads.
 *
 * Purely decorative: aria-hidden, and it settles into a static state under
 * `prefers-reduced-motion`.
 */

// The long cracks. Geometry is fixed, not random at runtime.
const SPIKES = [
  'M 500.1 422.1 L 570.8 417 L 641.7 414.5 L 712.4 408.1 L 783.1 403.3 L 854.2 402.9 L 924.9 398 L 996 397.8 L 1066 382.7 L 1066 382.7 L 996 397.8 L 924.9 397.9 L 854.2 402.6 L 783.1 402.7 L 712.3 406.9 L 641.6 412.5 L 570.7 414 L 499.9 417.9 Z',
  'M 499.2 421.9 L 579.5 455.8 L 659.6 490.2 L 739.8 524.4 L 821.4 556.1 L 904.4 585.2 L 988 612.9 L 988 612.9 L 904.4 585.2 L 821.4 555.9 L 740 523.8 L 660.1 488.9 L 580.5 453.5 L 500.8 418.1 Z',
  'M 498.3 421.6 L 565.8 492.5 L 633.1 563.4 L 702.5 632.9 L 762 709.5 L 818.9 787.8 L 894.1 853.5 L 948.5 933.5 L 1001.8 1014.1 L 1001.8 1014.1 L 948.5 933.5 L 894.2 853.4 L 819.1 787.6 L 762.6 709.1 L 703.5 632 L 634.7 561.9 L 568.1 490.2 L 501.7 418.4 Z',
  'M 498.4 420.7 L 525.9 488.3 L 550.9 556.7 L 582.3 623.2 L 610.6 690.6 L 647.1 755.3 L 676.5 822.4 L 697 892.4 L 697 892.4 L 676.5 822.4 L 647.2 755.3 L 610.9 690.5 L 583 622.9 L 552.3 556.1 L 528.1 487.4 L 501.6 419.3 Z',
  'M 498.3 419.9 L 494 519.7 L 489.3 619.5 L 482.6 719.2 L 478.2 819.1 L 465.3 918.5 L 470 1018.7 L 470 1018.7 L 465.4 918.5 L 478.3 819.1 L 483.1 719.3 L 490.4 619.6 L 496.1 519.8 L 501.7 420.1 Z',
  'M 498.2 419.2 L 473.6 475 L 450 531.2 L 421.7 585.6 L 393.4 640.1 L 369.8 696.3 L 342.6 751.1 L 307.4 802.9 L 307.4 802.9 L 342.6 751.1 L 369.9 696.3 L 393.8 640.3 L 422.5 586.1 L 451.4 531.8 L 476 476.1 L 501.8 420.8 Z',
  'M 498.9 417.9 L 449.3 445.1 L 399.9 472.6 L 351.8 501.8 L 300.6 526.8 L 248.6 550.3 L 193.8 569.5 L 145.8 599 L 145.8 599 L 193.8 569.5 L 248.7 550.5 L 300.9 527.3 L 352.3 502.8 L 400.8 474.3 L 450.8 447.9 L 501.1 422.1 Z',
  'M 499.8 418.7 L 441.3 426.8 L 382.7 434.7 L 324.7 446 L 267.2 459.3 L 209.4 470.7 L 151.1 480 L 92 485.8 L 32.9 491.1 L 32.9 491.1 L 92 485.8 L 151.1 480.1 L 209.4 470.9 L 267.3 459.7 L 324.9 446.8 L 382.9 435.9 L 441.5 428.7 L 500.2 421.3 Z',
  'M 500.4 418 L 431.1 406 L 361.9 393.5 L 292.7 381.2 L 224 366.7 L 153.5 359.8 L 82.6 355.8 L 13.7 341.8 L -54.8 325.9 L -54.8 325.9 L 13.7 341.8 L 82.6 355.9 L 153.5 360.1 L 223.9 367.3 L 292.5 382.3 L 361.6 395.4 L 430.6 408.7 L 499.6 422 Z',
  'M 501.3 418.2 L 423.5 362.1 L 342.3 309.8 L 261.3 257.4 L 175.1 211 L 86.2 168.5 L 11.4 108.3 L -60.4 44.9 L -148.9 1.2 L -148.9 1.2 L -60.5 44.9 L 11.3 108.4 L 86 168.7 L 174.8 211.6 L 260.6 258.5 L 341.2 311.5 L 421.7 364.7 L 498.7 421.8 Z',
  'M 502.1 418.6 L 450.5 343.8 L 402.3 267.2 L 353.3 191 L 302.3 115.7 L 248.1 42.1 L 196 -32.5 L 159.4 -115.1 L 159.4 -115.1 L 195.9 -32.5 L 248 42.2 L 301.9 116 L 352.3 191.6 L 400.6 268.3 L 447.7 345.6 L 497.9 421.4 Z',
  'M 502.2 419.7 L 489.9 344.3 L 480.4 268.5 L 471.6 192.7 L 467.9 116.5 L 450.4 41.4 L 442.2 -34.4 L 442.2 -34.4 L 450.4 41.5 L 467.6 116.5 L 470.9 192.8 L 478.9 268.7 L 487.2 344.6 L 497.8 420.3 Z',
  'M 501.3 420.6 L 531.1 360.2 L 560.9 299.8 L 595.6 241.3 L 630.7 183.1 L 657.2 121.2 L 680.4 58.2 L 705.3 -4.1 L 727.7 -67.2 L 727.7 -67.2 L 705.3 -4.1 L 680.4 58.2 L 657 121.1 L 630.3 182.9 L 594.9 240.9 L 559.8 299.2 L 529.4 359.3 L 498.7 419.4 Z',
  'M 501 421.3 L 548.9 382.3 L 597.2 343.9 L 645 304.9 L 695.6 268.8 L 748.7 235.2 L 805.2 205.5 L 805.2 205.5 L 748.6 235.2 L 695.5 268.7 L 644.7 304.5 L 596.5 343 L 547.6 380.7 L 499 418.7 Z',
  'M 501 421.9 L 584.3 375.7 L 666.8 328.3 L 748.7 280.2 L 830.2 231.7 L 918.3 192.4 L 1009.9 158.3 L 1098.9 120.9 L 1194.5 94.3 L 1194.5 94.3 L 1098.9 120.9 L 1009.8 158.2 L 918.2 192.1 L 829.9 231.1 L 748.1 279.2 L 665.8 326.6 L 582.9 373.1 L 499 418.1 Z',
];

// Short cracks that leave a long one part-way out.
const BRANCHES = [
  'M 995.7 398.4 L 1068.6 431.5 L 1142.9 462.3 L 1216.9 493.5 L 1216.9 493.5 L 1142.9 462.1 L 1068.9 430.9 L 996.2 397.2 Z',
  'M 739.9 524.8 L 797.1 529.2 L 854.4 533.9 L 911.2 541.7 L 911.2 541.7 L 854.4 533.7 L 797.2 528.5 L 740 523.4 Z',
  'M 702.5 632.5 L 701.9 704.6 L 698.4 776.8 L 692.1 848.8 L 692.1 848.8 L 698.5 776.8 L 702.5 704.7 L 703.5 632.5 Z',
  'M 477.7 819.3 L 488.7 850.1 L 499.6 881.1 L 513 911.3 L 513 911.3 L 499.7 881.1 L 489.3 850 L 478.8 818.9 Z',
  'M 450.2 530.6 L 389.4 566.9 L 326.3 600.1 L 268.5 640.3 L 268.5 640.3 L 326.4 600.3 L 389.8 567.8 L 451.2 532.4 Z',
  'M 153.4 359.2 L 86.2 373.3 L 19.3 388.2 L -48.2 401.3 L -48.2 401.3 L 19.3 388.4 L 86.4 374 L 153.7 360.7 Z',
  'M 261.6 257.4 L 238 231.4 L 214.8 205.2 L 190.3 179.9 L 190.3 179.9 L 214.6 205.3 L 237.4 231.9 L 260.3 258.5 Z',
  'M 401.6 267 L 357.5 254 L 314.7 237.8 L 272.1 221.1 L 272.1 221.1 L 314.6 238 L 357.3 254.6 L 401.2 268.4 Z',
  'M 471.8 192.9 L 480.3 147.9 L 485.6 102.5 L 498.7 58.2 L 498.7 58.2 L 485.4 102.5 L 479.8 147.8 L 470.8 192.7 Z',
  'M 1098.7 121.8 L 1129.5 129.5 L 1159.3 140 L 1189 150.8 L 1189 150.8 L 1159.4 139.8 L 1129.8 128.7 L 1099.1 120 Z',
];

// The core: small plates where the pane actually gave way.
const SHARDS = [
  'M 510.2 419.2 L 488.3 440.6 L 496.6 412.7 Z',
  'M 501.8 420.4 L 499.2 423 L 497.9 416.3 Z',
  'M 496.9 414.7 L 506.7 421 L 481.3 432 Z',
  'M 497.7 424.8 L 494.8 417.1 L 500.8 413.7 L 504.7 421.5 Z',
  'M 490.5 409.3 L 511.1 420.9 L 492.7 430 Z',
  'M 501.2 397.1 L 517.4 419.2 L 484.3 425.9 Z',
  'M 506.6 421.5 L 493.7 433.2 L 486.6 412.4 L 502.7 408.9 Z',
  'M 506 431.1 L 487.7 417.5 L 517.1 407.3 Z',
  'M 505.8 420 L 498.8 422.3 L 495.1 416 Z',
  'M 489.8 425.3 L 488.8 405.3 L 513.1 412.5 L 501.9 424.9 Z',
  'M 499.7 423 L 498.5 418.6 L 505.1 419.1 Z',
];

interface FractureProps {
  className?: string;
}

const Fracture = ({ className = '' }: FractureProps) => (
  <svg
    className={`fracture ${className}`}
    viewBox="0 0 1000 840"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      {/* The cracks fade with distance, so the pane reads as broken in one
          place rather than uniformly hatched — and so the wordmark keeps the
          contrast it needs. */}
      <radialGradient id="fracture-falloff" cx="50%" cy="50%" r="52%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.5" />
        <stop offset="48%" stopColor="#FFFFFF" stopOpacity="0.17" />
        <stop offset="82%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      <mask id="fracture-falloff-mask">
        <rect x="0" y="0" width="1000" height="840" fill="url(#fracture-falloff)" />
      </mask>

      {/* The break propagating: a disc that grows from the impact point and
          reveals each crack as it passes over it. Driven by a CSS transform
          rather than an animated `r`, which older engines will not do. */}
      <mask id="fracture-grow-mask">
        <g className="fracture-grow">
          <circle cx="500" cy="420" r="1500" fill="#FFFFFF" />
        </g>
      </mask>
    </defs>

    <g mask="url(#fracture-falloff-mask)">
      <g mask="url(#fracture-grow-mask)" fill="#EDE9E1">
        {SPIKES.map((d, i) => (
          <path key={`s${i}`} d={d} />
        ))}
        {BRANCHES.map((d, i) => (
          <path key={`b${i}`} d={d} opacity={0.85} />
        ))}
        {SHARDS.map((d, i) => (
          <path key={`p${i}`} d={d} opacity={0.5} />
        ))}
      </g>
    </g>
  </svg>
);

export default Fracture;
