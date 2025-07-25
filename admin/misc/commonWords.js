

  const commonWords = [
    // 4-letter words
    'able', 'area', 'back', 'ball', 'bear', 'beat', 'been', 'bell', 'best', 'bill',
    'bird', 'blow', 'blue', 'boat', 'body', 'book', 'born', 'both', 'boys', 'bring',
    'call', 'came', 'care', 'case', 'cash', 'cell', 'city', 'club', 'cold', 'come',
    'cool', 'cord', 'dark', 'data', 'date', 'dead', 'deal', 'dear', 'deep', 'desk',
    'done', 'door', 'down', 'draw', 'drew', 'drop', 'drug', 'duty', 'each', 'early',
    'east', 'easy', 'edge', 'else', 'even', 'ever', 'evil', 'face', 'fact', 'fair',
    'fall', 'farm', 'fast', 'fear', 'feel', 'feet', 'fell', 'felt', 'file', 'fill',
    'film', 'find', 'fine', 'fire', 'firm', 'fish', 'five', 'flat', 'flow', 'folk',
    'food', 'foot', 'form', 'four', 'free', 'from', 'full', 'fund', 'game', 'gave',
    'gift', 'girl', 'give', 'glad', 'goal', 'gold', 'gone', 'good', 'gray', 'grew',
    'grow', 'half', 'hall', 'hand', 'hard', 'head', 'hear', 'heat', 'held', 'hell',
    'help', 'here', 'high', 'hill', 'hire', 'hold', 'hole', 'holy', 'home', 'hope',
    'host', 'hour', 'huge', 'idea', 'inch', 'into', 'iron', 'item', 'join', 'jump',
    'just', 'keep', 'kept', 'kill', 'kind', 'king', 'knew', 'know', 'lack', 'lady',
    'laid', 'land', 'last', 'late', 'lead', 'left', 'less', 'life', 'lift', 'like',
    'line', 'list', 'live', 'loan', 'lock', 'long', 'look', 'lord', 'lose', 'loss',
    'lost', 'love', 'made', 'mail', 'main', 'make', 'male', 'many', 'mark', 'mass',
    'meal', 'mean', 'meat', 'meet', 'mind', 'mine', 'miss', 'mode', 'moon', 'more',
    'most', 'move', 'must', 'name', 'near', 'neck', 'need', 'news', 'next', 'nice',
    'nine', 'none', 'noon', 'note', 'once', 'only', 'open', 'oral', 'over', 'pace',
    'pack', 'page', 'paid', 'pain', 'pair', 'park', 'part', 'pass', 'past', 'path',
    'peak', 'pick', 'pink', 'plan', 'play', 'plot', 'plus', 'poll', 'pool', 'poor',
    'port', 'post', 'pull', 'push', 'race', 'rain', 'rank', 'rate', 'read', 'real',
    'rear', 'rely', 'rent', 'rest', 'rich', 'ride', 'ring', 'rise', 'risk', 'road',
    'rock', 'role', 'roll', 'room', 'root', 'rose', 'rule', 'safe', 'said', 'sail',
    'sale', 'salt', 'same', 'sand', 'save', 'seat', 'seed', 'seek', 'seem', 'seen',
    'sell', 'send', 'sent', 'ship', 'shop', 'shot', 'show', 'shut', 'sick', 'side',
    'sign', 'sink', 'site', 'size', 'skin', 'slip', 'slow', 'snow', 'soft', 'soil',
    'sold', 'sole', 'some', 'song', 'soon', 'sort', 'soul', 'spot', 'star', 'stay',
    'step', 'stop', 'such', 'suit', 'sure', 'take', 'talk', 'tall', 'tank', 'tape',
    'task', 'team', 'tell', 'term', 'test', 'text', 'than', 'that', 'them', 'they',
    'thin', 'this', 'thus', 'till', 'time', 'tiny', 'told', 'tone', 'took', 'tool',
    'tour', 'town', 'tree', 'trip', 'true', 'tune', 'turn', 'twin', 'type', 'unit',
    'upon', 'used', 'user', 'vary', 'vast', 'very', 'vote', 'wage', 'wait', 'wake',
    'walk', 'wall', 'want', 'warm', 'wash', 'wave', 'ways', 'weak', 'wear', 'week',
    'well', 'went', 'were', 'west', 'what', 'when', 'whom', 'wide', 'wife', 'wild',
    'will', 'wind', 'wine', 'wing', 'wire', 'wise', 'wish', 'with', 'wood', 'word',
    'work', 'worn', 'yard', 'year', 'your', 'zero', 'zone',
    
    // 5-letter words
    'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after',
    'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align',
    'alike', 'alive', 'allow', 'alone', 'along', 'alter', 'among', 'anger', 'angle',
    'angry', 'apart', 'apple', 'apply', 'arena', 'argue', 'arise', 'array', 'aside',
    'asset', 'avoid', 'awake', 'award', 'aware', 'badly', 'baker', 'bases', 'basic',
    'beach', 'began', 'begin', 'being', 'below', 'bench', 'billy', 'birth', 'black',
    'blame', 'blind', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain',
    'brand', 'brave', 'bread', 'break', 'breed', 'brief', 'bring', 'broad', 'broke',
    'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch', 'cause',
    'chain', 'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest',
    'chief', 'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean', 'clear',
    'click', 'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count',
    'court', 'cover', 'craft', 'crash', 'crazy', 'cream', 'crime', 'cross', 'crowd',
    'crown', 'crude', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death',
    'debut', 'delay', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drank',
    'dream', 'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager', 'early',
    'earth', 'eight', 'elite', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal',
    'error', 'event', 'every', 'exact', 'exist', 'extra', 'faith', 'false', 'fault',
    'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash',
    'fleet', 'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found',
    'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny', 'giant',
    'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grand', 'grant', 'grass',
    'grave', 'great', 'green', 'gross', 'group', 'grown', 'guard', 'guess', 'guest',
    'guide', 'happy', 'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel',
    'house', 'human', 'humor', 'hurry', 'image', 'index', 'inner', 'input', 'irony',
    'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known', 'label', 'large',
    'laser', 'later', 'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'legal',
    'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'loose', 'lower',
    'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match',
    'maybe', 'mayor', 'meant', 'media', 'metal', 'might', 'minor', 'minus', 'mixed',
    'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved',
    'movie', 'music', 'needs', 'never', 'newly', 'night', 'noise', 'north', 'noted',
    'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought',
    'paint', 'panel', 'paper', 'party', 'peace', 'peter', 'phase', 'phone', 'photo',
    'piano', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate',
    'point', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print', 'prior',
    'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio',
    'raise', 'range', 'rapid', 'ratio', 'reach', 'ready', 'realm', 'rebel', 'refer',
    'relax', 'repay', 'reply', 'right', 'rigid', 'rival', 'river', 'robin', 'roger',
    'roman', 'rough', 'round', 'route', 'royal', 'rural', 'scale', 'scene', 'scope',
    'score', 'sense', 'serve', 'setup', 'seven', 'shall', 'shape', 'share', 'sharp',
    'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'short',
    'shown', 'sight', 'since', 'sixth', 'sixty', 'sized', 'skill', 'sleep', 'slide',
    'small', 'smart', 'smile', 'smith', 'smoke', 'snake', 'snow', 'sober', 'social',
    'solar', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare', 'speak',
    'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'staff', 'stage', 'stake',
    'stand', 'start', 'state', 'steam', 'steel', 'steep', 'steer', 'steve', 'stick',
    'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck',
    'study', 'stuff', 'style', 'sugar', 'suite', 'super', 'sweet', 'swift', 'swing',
    'swiss', 'table', 'taken', 'taste', 'taxes', 'teach', 'teeth', 'terry', 'texas',
    'thank', 'theft', 'their', 'there', 'these', 'thick', 'thing', 'think', 'third',
    'those', 'three', 'threw', 'throw', 'thumb', 'tight', 'timer', 'tired', 'title',
    'today', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'train',
    'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'truck', 'truly',
    'trunk', 'trust', 'truth', 'twice', 'uncle', 'under', 'undue', 'union', 'unity',
    'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'video',
    'virus', 'visit', 'vital', 'vocal', 'voice', 'waste', 'watch', 'water', 'wheel',
    'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world',
    'worry', 'worse', 'worst', 'worth', 'would', 'write', 'wrong', 'wrote', 'young',
    'youth'
  ];


  module.exports = commonWords