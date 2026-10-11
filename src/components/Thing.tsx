import { deskObjects } from '../data/desk';

/** The renders carry this much empty margin (in scene units) for their shadows. */
const RENDER_MARGIN = 0.5;

interface Props {
  /** File name under /media/desk, rendered by blender/objects.py. */
  name: string;
  /** Pixels per scene unit; one unit is about 10 cm, so everything keeps its true relative size. */
  scale: number;
  className?: string;
}

/** One of the rendered objects, laid out by its visible size rather than its shadow margin. */
export default function Thing({ name, scale, className }: Props) {
  const size = deskObjects.find((o) => o.name === name)?.size;
  if (!size) return null;
  // Sizes go through CSS variables so a narrow screen can shrink every object at once (see globals.css).
  const vars = { '--w': size[0], '--h': size[1], '--s': scale, '--m': RENDER_MARGIN - 0.14 } as React.CSSProperties;
  return <img src={`/media/desk/${name}.webp`} alt="" draggable={false} data-thing className={className} style={vars} />;
}
