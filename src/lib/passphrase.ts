// Suggested passphrases for signing receipts: random words, easy to remember, hard to guess.
// 5 words from 512 = 45 bits, and every guess costs 600,000 rounds of PBKDF2 (receipt-sign.ts).

export const WORDS = [
  'able', 'acid', 'acorn', 'actor', 'adult', 'agent', 'air', 'alarm', 'album', 'alley', 'almond', 'amber',
  'angle', 'ankle', 'answer', 'ant', 'apple', 'apron', 'arch', 'arena', 'arm', 'army', 'arrow', 'art', 'ash',
  'atlas', 'attic', 'aunt', 'autumn', 'award', 'axe', 'baby', 'back', 'bacon', 'badge', 'bag', 'bait', 'baker',
  'ball', 'bamboo', 'banana', 'band', 'bank', 'barn', 'barrel', 'base', 'basket', 'bat', 'bath', 'beach',
  'bead', 'beak', 'beam', 'bean', 'bear', 'beard', 'bed', 'bee', 'beef', 'bell', 'belt', 'bench', 'berry',
  'bike', 'bird', 'biscuit', 'blade', 'blanket', 'block', 'blue', 'board', 'boat', 'body', 'bolt', 'bone',
  'book', 'boot', 'bottle', 'bowl', 'box', 'boy', 'brain', 'branch', 'brass', 'bread', 'brick', 'bride',
  'bridge', 'brush', 'bubble', 'bucket', 'bud', 'bull', 'bunch', 'bus', 'bush', 'butter', 'button', 'cabin',
  'cable', 'cactus', 'cage', 'cake', 'camel', 'camera', 'camp', 'candle', 'candy', 'cane', 'cannon', 'canoe',
  'cap', 'car', 'card', 'carpet', 'carrot', 'cart', 'castle', 'cat', 'cave', 'cedar', 'chain', 'chair',
  'chalk', 'cheese', 'cherry', 'chess', 'chest', 'chicken', 'chief', 'child', 'chili', 'chin', 'cider',
  'circle', 'city', 'clay', 'cliff', 'clock', 'cloth', 'cloud', 'clown', 'coach', 'coal', 'coast', 'coat',
  'cobra', 'cocoa', 'coconut', 'coffee', 'coin', 'comb', 'comet', 'cook', 'copper', 'coral', 'cord', 'corn',
  'cotton', 'couch', 'cow', 'crab', 'crane', 'crayon', 'cream', 'crow', 'crown', 'cube', 'cup', 'curry',
  'cushion', 'daisy', 'dance', 'date', 'deer', 'desk', 'dew', 'diamond', 'dice', 'dinner', 'dish', 'doctor',
  'dog', 'doll', 'dolphin', 'donkey', 'door', 'dove', 'dragon', 'drawer', 'dream', 'dress', 'drum', 'duck',
  'dust', 'eagle', 'ear', 'earth', 'echo', 'egg', 'elbow', 'elephant', 'engine', 'eye', 'fabric', 'face',
  'fair', 'falcon', 'farm', 'feather', 'fence', 'fern', 'ferry', 'field', 'fig', 'finger', 'fire', 'fish',
  'flag', 'flame', 'flask', 'flower', 'flute', 'fog', 'foot', 'forest', 'fork', 'fort', 'fossil', 'fox',
  'frame', 'frog', 'fruit', 'fuel', 'garden', 'garlic', 'gate', 'gem', 'ghost', 'gift', 'ginger', 'giraffe',
  'glass', 'globe', 'glove', 'goat', 'gold', 'goose', 'grape', 'grass', 'gravel', 'guitar', 'gull', 'hall',
  'hammer', 'hand', 'harbor', 'harp', 'hat', 'hawk', 'hay', 'heart', 'helmet', 'hen', 'herb', 'hill', 'hippo',
  'hive', 'honey', 'hook', 'horn', 'horse', 'hotel', 'house', 'ice', 'idea', 'igloo', 'ink', 'iron', 'island',
  'ivory', 'jacket', 'jam', 'jar', 'jasmine', 'jeep', 'jelly', 'jewel', 'juice', 'jungle', 'kettle', 'key',
  'king', 'kite', 'kitten', 'knee', 'knife', 'knot', 'koala', 'ladder', 'lake', 'lamb', 'lamp', 'lane',
  'lantern', 'laptop', 'lark', 'lawn', 'leaf', 'lemon', 'lens', 'leopard', 'letter', 'lily', 'lime', 'lion',
  'lizard', 'llama', 'lobster', 'lock', 'locket', 'log', 'lotus', 'lunch', 'magnet', 'mango', 'map', 'maple',
  'marble', 'market', 'mask', 'meadow', 'melon', 'metal', 'milk', 'mill', 'mint', 'mirror', 'mole', 'monkey',
  'moon', 'moose', 'moss', 'moth', 'motor', 'mouse', 'mouth', 'mud', 'mug', 'mule', 'music', 'nail', 'needle',
  'nest', 'net', 'night', 'noodle', 'nose', 'notebook', 'nut', 'oak', 'oar', 'ocean', 'office', 'oil', 'olive',
  'onion', 'orange', 'orchid', 'otter', 'oven', 'owl', 'paddle', 'page', 'paint', 'palace', 'palm', 'pan',
  'panda', 'paper', 'parrot', 'party', 'pasta', 'path', 'peach', 'peacock', 'peanut', 'pear', 'pearl',
  'pebble', 'pen', 'pencil', 'pepper', 'piano', 'pickle', 'pie', 'pig', 'pigeon', 'pillow', 'pilot', 'pine',
  'pipe', 'pizza', 'planet', 'plant', 'plate', 'plum', 'pocket', 'poem', 'pond', 'pony', 'pool', 'pot',
  'potato', 'powder', 'prince', 'pumpkin', 'puppet', 'puppy', 'purse', 'puzzle', 'quail', 'queen', 'quilt',
  'rabbit', 'radio', 'radish', 'raft', 'rain', 'rainbow', 'rake', 'raven', 'ribbon', 'rice', 'ring', 'river',
  'road', 'robin', 'robot', 'rock', 'rocket', 'roof', 'room', 'root', 'rope', 'rose', 'ruby', 'rug', 'ruler',
  'saddle', 'sail', 'salad', 'salt', 'sand', 'sandal', 'saucer', 'scarf', 'school', 'scooter', 'seal', 'seed',
  'shadow', 'shark', 'sheep', 'shelf', 'shell', 'ship', 'shirt', 'shoe', 'shop', 'shovel', 'silk', 'silver',
  'singer', 'sink', 'skate', 'sky', 'sled', 'sloth', 'snail', 'snake', 'snow', 'soap', 'sock', 'sofa', 'soup',
  'spice', 'spider', 'spoon', 'spring', 'square', 'squid', 'stamp', 'star', 'station', 'statue', 'steam',
  'stem', 'stick', 'stone', 'stool', 'storm', 'stove', 'straw', 'stream', 'street', 'string', 'sugar', 'suit',
  'summer', 'sun', 'swan',
];

/** Five random words, e.g. "mango river kite window tiger" (uses the browser's secure randomness) */
export function suggestPassphrase(count = 5): string {
  const picks = crypto.getRandomValues(new Uint32Array(count));
  return Array.from(picks, (n) => WORDS[n % WORDS.length]).join(' ');
}
