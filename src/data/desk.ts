/** The things laid out on the first page, around the closed journal. */
export interface DeskObject {
  /** File name under /media/desk, rendered by blender/objects.py. */
  name: string;
  /** Section this object opens; fallen leaves open nothing. */
  to?: string;
  label?: string;
  /**
   * Centre of the image, in scene units from the middle of the window
   * (1 unit is about 10 cm; x to the right, y up).
   */
  at: [number, number];
  /** Image size in the same units, copied from public/media/desk/sizes.json. */
  size: [number, number];
  /** How far it drifts with the pointer; nearer things move more. */
  depth: number;
}

export const deskObjects: DeskObject[] = [
  { name: 'camera',     to: '/photography', label: 'photography', at: [-2.25, 0.85],  size: [2.465, 2.012], depth: 1.0 },
  { name: 'palette',    to: '/painting',    label: 'painting',    at: [-0.75, 1.1],   size: [2.307, 2.057], depth: 0.6 },
  { name: 'pen',        to: '/poetry',      label: 'poetry',      at: [-0.95, -0.95], size: [2.3, 2.323],   depth: 0.5 },
  { name: 'compass',    to: '/travel',      label: 'travel',      at: [2.5, 1.0],     size: [1.614, 1.719], depth: 0.7 },
  { name: 'picks',      to: '/guitar',      label: 'guitar',      at: [2.55, -1.0],   size: [1.865, 1.862], depth: 0.4 },
  { name: 'chai',       to: '/cooking',     label: 'cooking',     at: [-2.5, -0.95],  size: [2.38, 2.38],   depth: 0.9 },
  { name: 'leaf-oak',                                             at: [-1.3, 0.1],    size: [1.835, 1.871], depth: 0.3 },
  { name: 'leaf-aspen',                                           at: [2.15, 0.05],   size: [1.793, 1.818], depth: 0.3 },
];

/**
 * The closed journal. Its image is taller below the book than above, because
 * the ribbon trails out of the foot, so the book itself sits a little above
 * the image's centre.
 */
export const journal: DeskObject = { name: 'journal', at: [0.744, -0.153], size: [2.547, 3.475], depth: 0.2 };
