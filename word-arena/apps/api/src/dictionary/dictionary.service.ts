import { Injectable } from '@nestjs/common';

@Injectable()
export class DictionaryService {
  // Common English words for validation (simplified dictionary for MVP)
  // In production, this would be a proper dictionary database or API
  private readonly commonWords: Set<string> = new Set([
    // A words
    'apple', 'ant', 'all', 'are', 'and', 'any', 'away', 'again', 'always',
    'about', 'after', 'above', 'across', 'against', 'along', 'among', 'around',
    'attack', 'arrive', 'agree', 'allow', 'almost', 'alone', 'alive', 'angry',
    'animal', 'answer', 'appear', 'apply', 'approach', 'argue', 'arise', 'army',
    'artist', 'aside', 'ask', 'asleep', 'aspect', 'assist', 'assume', 'assure',
    'attract', 'audience', 'author', 'available', 'average', 'avoid', 'awake', 'award',
    
    // B words
    'back', 'bad', 'bag', 'ball', 'bank', 'base', 'be', 'beat', 'beautiful',
    'because', 'become', 'bed', 'before', 'begin', 'behavior', 'behind', 'believe',
    'benefit', 'best', 'better', 'between', 'beyond', 'big', 'bill', 'bird',
    'birth', 'black', 'blue', 'board', 'boat', 'body', 'book', 'born',
    'both', 'box', 'boy', 'break', 'bring', 'brother', 'budget', 'build',
    'business', 'but', 'buy', 'by',
    
    // C words
    'call', 'camera', 'camp', 'can', 'cancer', 'candidate', 'capital', 'car',
    'card', 'care', 'career', 'carry', 'case', 'catch', 'cause', 'cell',
    'center', 'central', 'century', 'certain', 'certainly', 'chair', 'challenge', 'chance',
    'change', 'character', 'charge', 'check', 'child', 'choice', 'choose', 'church',
    'citizen', 'city', 'civil', 'claim', 'class', 'clear', 'clearly', 'close',
    'coach', 'cold', 'collection', 'college', 'color', 'come', 'commercial', 'common',
    'community', 'company', 'compare', 'computer', 'concern', 'condition', 'conference',
    'congress', 'consider', 'consumer', 'contain', 'continue', 'control', 'cost',
    'could', 'country', 'couple', 'course', 'court', 'cover', 'create', 'crime',
    'cultural', 'culture', 'cup', 'current', 'customer', 'cut',
    
    // D words
    'dark', 'data', 'daughter', 'day', 'dead', 'deal', 'death', 'debate',
    'decade', 'decide', 'decision', 'deep', 'defense', 'degree', 'democrat',
    'democratic', 'describe', 'design', 'despite', 'detail', 'determine', 'develop',
    'development', 'die', 'difference', 'different', 'difficult', 'dinner', 'direction',
    'director', 'discover', 'discuss', 'discussion', 'disease', 'do', 'doctor', 'dog',
    'door', 'down', 'draw', 'dream', 'drive', 'drop', 'drug', 'during',
    
    // E words
    'each', 'early', 'east', 'easy', 'eat', 'economic', 'economy', 'edge',
    'education', 'effect', 'effort', 'eight', 'either', 'election', 'else', 'employee',
    'end', 'energy', 'enjoy', 'enough', 'enter', 'entire', 'environment', 'environmental',
    'especially', 'establish', 'even', 'evening', 'event', 'ever', 'every', 'everybody',
    'everyone', 'everything', 'evidence', 'exact', 'exactly', 'examine', 'example',
    'executive', 'exist', 'expect', 'experience', 'expert', 'explain', 'eye',
    
    // F words
    'face', 'fact', 'factor', 'fail', 'fall', 'family', 'far', 'fast',
    'father', 'favorite', 'fear', 'federal', 'feel', 'feeling', 'few', 'field',
    'fight', 'figure', 'fill', 'film', 'final', 'finally', 'financial', 'find',
    'fine', 'finger', 'finish', 'fire', 'firm', 'first', 'fish', 'five',
    'floor', 'fly', 'focus', 'follow', 'food', 'foot', 'for', 'force',
    'foreign', 'forget', 'form', 'former', 'forward', 'four', 'free', 'friend',
    'from', 'front', 'full', 'fund', 'future',
    
    // G words
    'game', 'garden', 'gas', 'general', 'generation', 'get', 'girl', 'give',
    'glass', 'go', 'goal', 'good', 'government', 'great', 'green', 'ground',
    'group', 'grow', 'growth', 'guess', 'gun',
    
    // H words
    'hair', 'half', 'hand', 'hang', 'happen', 'happy', 'hard', 'have',
    'he', 'head', 'health', 'hear', 'heart', 'heat', 'heavy', 'help',
    'her', 'here', 'herself', 'high', 'him', 'himself', 'his', 'history',
    'hit', 'hold', 'home', 'hope', 'hospital', 'hot', 'hotel', 'hour',
    'house', 'how', 'however', 'huge', 'human', 'hundred', 'husband',
    
    // I words
    'i', 'idea', 'identify', 'if', 'image', 'imagine', 'impact', 'important',
    'improve', 'in', 'include', 'including', 'increase', 'indeed', 'indicate',
    'individual', 'industry', 'information', 'inside', 'instead', 'institution',
    'interest', 'interesting', 'international', 'interview', 'into', 'investment',
    'involve', 'issue', 'it', 'item', 'its', 'itself',
    
    // J words
    'job', 'join', 'just',
    
    // K words
    'keep', 'key', 'kid', 'kill', 'kind', 'kitchen', 'know', 'knowledge',
    
    // L words
    'land', 'language', 'large', 'last', 'late', 'later', 'laugh', 'law',
    'lay', 'lead', 'leader', 'learn', 'least', 'leave', 'left', 'leg',
    'legal', 'less', 'let', 'letter', 'level', 'lie', 'life', 'light',
    'like', 'likely', 'line', 'list', 'listen', 'little', 'live', 'local',
    'long', 'look', 'lose', 'loss', 'lot', 'love', 'low',
    
    // M words
    'machine', 'magazine', 'main', 'maintain', 'major', 'majority', 'make',
    'man', 'manage', 'management', 'manager', 'many', 'market', 'marriage',
    'material', 'matter', 'may', 'maybe', 'me', 'mean', 'measure', 'media',
    'medical', 'meet', 'meeting', 'member', 'memory', 'mention', 'message',
    'method', 'middle', 'might', 'military', 'million', 'mind', 'minute', 'miss',
    'mission', 'model', 'modern', 'moment', 'money', 'month', 'more', 'morning',
    'most', 'mother', 'mouth', 'move', 'movement', 'movie', 'mr', 'mrs',
    'much', 'music', 'must', 'my', 'myself',
    
    // N words
    'name', 'nation', 'national', 'natural', 'nature', 'near', 'nearly',
    'necessary', 'need', 'network', 'never', 'new', 'news', 'newspaper',
    'next', 'nice', 'night', 'no', 'none', 'nor', 'north', 'not', 'note',
    'nothing', 'notice', 'now', 'number',
    
    // O words
    'object', 'obvious', 'occur', 'of', 'off', 'offer', 'office', 'officer',
    'official', 'often', 'oh', 'oil', 'ok', 'old', 'on', 'once', 'one',
    'only', 'onto', 'open', 'operation', 'opportunity', 'option', 'or', 'order',
    'organization', 'other', 'others', 'our', 'out', 'outside', 'over', 'own',
    'owner',
    
    // P words
    'page', 'pain', 'paint', 'painting', 'pair', 'paper', 'parent', 'part',
    'participant', 'particular', 'particularly', 'partner', 'party', 'pass',
    'past', 'patient', 'pattern', 'pay', 'peace', 'people', 'per', 'perform',
    'performance', 'perhaps', 'period', 'person', 'personal', 'phone', 'photo',
    'phrase', 'physical', 'pick', 'picture', 'piece', 'place', 'plan', 'plant',
    'play', 'player', 'please', 'plenty', 'point', 'police', 'policy', 'political',
    'politics', 'poor', 'popular', 'population', 'position', 'positive', 'possible',
    'power', 'practice', 'prepare', 'present', 'president', 'pressure', 'pretty',
    'prevent', 'price', 'private', 'probably', 'problem', 'process', 'produce',
    'product', 'production', 'professional', 'professor', 'program', 'project',
    'property', 'protect', 'prove', 'provide', 'public', 'pull', 'purpose',
    'push', 'put',
    
    // Q words
    'quality', 'question', 'quick', 'quickly', 'quite',
    
    // R words
    'race', 'radio', 'raise', 'range', 'rate', 'rather', 'reach', 'read',
    'ready', 'real', 'reality', 'realize', 'really', 'reason', 'receive',
    'recent', 'recently', 'recognize', 'record', 'red', 'reduce', 'reflect',
    'region', 'relate', 'relationship', 'religious', 'remain', 'remember',
    'remove', 'report', 'represent', 'republican', 'require', 'research',
    'resource', 'respond', 'response', 'responsibility', 'rest', 'result',
    'return', 'reveal', 'rich', 'right', 'rise', 'risk', 'road', 'rock',
    'role', 'room', 'rule', 'run',
    
    // S words
    'safe', 'same', 'save', 'say', 'scene', 'school', 'science', 'scientist',
    'score', 'screen', 'sea', 'season', 'seat', 'second', 'section', 'security',
    'see', 'seek', 'seem', 'sell', 'send', 'senior', 'sense', 'series',
    'serious', 'serve', 'service', 'set', 'seven', 'several', 'sex', 'sexual',
    'shake', 'share', 'she', 'shoot', 'short', 'shot', 'should', 'shoulder',
    'show', 'side', 'sign', 'significant', 'similar', 'simple', 'simply',
    'since', 'sing', 'single', 'sister', 'sit', 'site', 'situation', 'six',
    'size', 'skill', 'skin', 'small', 'smile', 'so', 'social', 'society',
    'soldier', 'some', 'somebody', 'someone', 'something', 'sometimes', 'son',
    'song', 'soon', 'sort', 'sound', 'source', 'south', 'southern', 'space',
    'speak', 'special', 'specific', 'speech', 'spend', 'sport', 'spring',
    'staff', 'stage', 'stand', 'standard', 'star', 'start', 'state', 'statement',
    'station', 'stay', 'step', 'still', 'stock', 'stop', 'store', 'story',
    'strategy', 'street', 'strong', 'structure', 'student', 'study', 'stuff',
    'style', 'subject', 'success', 'successful', 'such', 'suddenly', 'suffer',
    'suggest', 'summer', 'support', 'sure', 'surface', 'system',
    
    // T words
    'table', 'take', 'talk', 'task', 'tax', 'teach', 'teacher', 'team',
    'technology', 'television', 'tell', 'ten', 'tend', 'term', 'test', 'than',
    'thank', 'that', 'the', 'their', 'them', 'themselves', 'then', 'theory',
    'there', 'these', 'they', 'thing', 'think', 'third', 'this', 'those',
    'though', 'thought', 'thousand', 'threat', 'three', 'through', 'throughout',
    'throw', 'thus', 'time', 'to', 'today', 'together', 'tonight', 'too',
    'top', 'total', 'tough', 'toward', 'town', 'trade', 'traditional', 'training',
    'travel', 'treat', 'treatment', 'tree', 'trial', 'trip', 'trouble', 'true',
    'truth', 'try', 'turn', 'tv', 'two', 'type',
    
    // U words
    'under', 'understand', 'unit', 'until', 'up', 'upon', 'us', 'use',
    'usually', 'utility',
    
    // V words
    'vacation', 'valley', 'valuable', 'value', 'various', 'very', 'victim',
    'view', 'violence', 'visit', 'voice', 'vote',
    
    // W words
    'wait', 'walk', 'wall', 'want', 'war', 'watch', 'water', 'way', 'we',
    'weapon', 'wear', 'week', 'weight', 'well', 'west', 'western', 'what',
    'whatever', 'when', 'where', 'whether', 'which', 'while', 'white', 'who',
    'whole', 'whom', 'whose', 'why', 'wide', 'wife', 'will', 'win', 'wind',
    'window', 'wish', 'with', 'within', 'without', 'woman', 'wonder', 'word',
    'work', 'worker', 'world', 'worry', 'would', 'write', 'writer', 'wrong',
    
    // X words
    'yard', 'yeah', 'year', 'yes', 'yet', 'you', 'young', 'your', 'yourself',
    'youth',
    
    // Z words
    'zone',
  ]);

  /**
   * Validate if a word is in the dictionary
   * Case insensitive comparison
   */
  isValidWord(word: string): boolean {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check basic validation
    if (!normalizedWord || normalizedWord.length < 2) {
      return false;
    }
    
    // Check if contains only letters
    if (!/^[a-z]+$/.test(normalizedWord)) {
      return false;
    }
    
    // Check against dictionary
    return this.commonWords.has(normalizedWord);
  }

  /**
   * Check if word starts with the given letter
   */
  startsWithLetter(word: string, letter: string): boolean {
    return word.toLowerCase().startsWith(letter.toLowerCase());
  }

  /**
   * Get weighted random letter for game
   * Common letters have higher probability
   */
  getRandomLetter(): string {
    const commonLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'P', 'S', 'T'];
    const rareLetters = ['Q', 'X', 'Z'];
    const normalLetters = ['I', 'J', 'K', 'L', 'N', 'O', 'R', 'U', 'V', 'W', 'Y'];

    const rand = Math.random();
    
    // 60% chance for common letters
    if (rand < 0.6) {
      return commonLetters[Math.floor(Math.random() * commonLetters.length)];
    }
    // 10% chance for rare letters
    else if (rand < 0.7) {
      return rareLetters[Math.floor(Math.random() * rareLetters.length)];
    }
    // 30% chance for normal letters
    else {
      return normalLetters[Math.floor(Math.random() * normalLetters.length)];
    }
  }
}
