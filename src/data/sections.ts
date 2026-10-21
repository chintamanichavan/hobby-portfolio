export interface Section {
  to: string;
  label: string;
  /** The desk object that stands for this section (a file under /media/desk). */
  thing: string;
  /** A short specimen-style caption for that object. */
  caption: string;
}

/** The journal's sections, in order. */
export const sections: Section[] = [
  { to: '/photography', label: 'Photography', thing: 'camera',  caption: 'rangefinder, lens up' },
  { to: '/painting',    label: 'Painting',    thing: 'palette', caption: 'palette, paint still wet' },
  { to: '/poetry',      label: 'Poetry',      thing: 'pen',     caption: 'pen, cap off, ink open' },
  { to: '/travel',      label: 'Travel',      thing: 'compass', caption: 'pocket compass, brass' },
  { to: '/guitar',      label: 'Guitar',      thing: 'picks',   caption: 'three picks, well used' },
  { to: '/cooking',     label: 'Cooking',     thing: 'chai',    caption: 'chai, cinnamon, cardamom' },
];
