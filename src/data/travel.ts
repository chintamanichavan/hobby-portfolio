import type { TravelEntry } from '../types';

export const travelEntries: TravelEntry[] = [
  {
    id: '1',
    destination: 'Reykjavik',
    country: 'Iceland',
    year: 2022,
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200',
    excerpt: 'A city where the sky does most of the talking.',
    tags: ['solo', 'winter', 'northern lights'],
    body: `I went in February, which everyone said was a mistake. They were wrong.

Iceland in winter is a place that earns your attention. The days are short — barely five hours of pale, amber light — so you learn to slow down and pay attention to what's actually there: the steam rising from vents in the pavement, the way the sea looks pewter-grey at noon, the surprising warmth of a bowl of lamb soup.

I saw the northern lights twice. The first time I was standing in a supermarket parking lot. The second time I was on a black sand beach at midnight, alone except for a couple from South Korea who were crying quietly. I understood that completely.

Reykjavik itself is small and walkable. I spent a lot of time in bookshops I couldn't buy from and coffee shops I could. The architecture is practical and unpretentious. The people are the same.

I'd go back in a heartbeat. I'd go back in February.`,
  },
  {
    id: '2',
    destination: 'Kyoto',
    country: 'Japan',
    year: 2023,
    coverImage: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200',
    excerpt: "The past is not behind you here. It\u2019s beside you.",
    tags: ['culture', 'temples', 'autumn'],
    body: `I came for the temples and stayed for the rhythm.

Kyoto moves differently from Tokyo. There's a deliberateness to it — in the way tea is poured, in the way gravel is raked in gardens, in the way people queue at bus stops. It asks you to match its pace, and if you do, something loosens in you.

I visited Fushimi Inari at 6am, before the crowds. The torii gates stretch up the mountain in an unbroken chain of orange and shadow. I walked for two hours before turning back. I'm not sure I reached the top. I'm not sure it mattered.

The food in Kyoto was the quietest food I've ever eaten. Not bland — precise. Every dish felt considered. I ate kaiseki once, a formal multi-course meal that lasted three hours. I didn't understand half of what was served but understood all of it.

Autumn was everywhere. Maples in full colour. Ginkgo trees dropping yellow fans onto grey stone. I took too many photographs and none of them were quite right. Some things resist the frame.`,
  },
  {
    id: '3',
    destination: 'Lisbon',
    country: 'Portugal',
    year: 2021,
    coverImage: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200',
    excerpt: 'A city that knows how to miss things gracefully.',
    tags: ['solo', 'food', 'music', 'summer'],
    body: `Lisbon is a city built on hills and melancholy. Fado — the music you'll hear in restaurants and leaking from open windows — is the sound of longing without bitterness. It's a difficult thing to pull off and the Portuguese have been doing it for centuries.

I stayed in Alfama, the oldest neighbourhood, where the streets are steep and narrow and the tiles on the buildings are faded to a soft blue-white. Every morning I walked down to the river and had a pastel de nata and watched the light come up over the water.

The food was extraordinary and cheap. Grilled fish, fresh bread, wine that cost less than water at home. I ate lunch alone every day and never minded. There's a culture of solo dining in Lisbon that I found immediately comfortable.

One evening I took the old tram up to Bairro Alto and stayed out until 2am at a bar that had live music and no sign outside. I've been meaning to find out its name ever since.

Lisbon is the kind of city that makes you wonder why you don't just stay.`,
  },
];
