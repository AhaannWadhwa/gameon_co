export interface Sport {
  id: string;
  name: string;
  icon: string;
  category: 'team' | 'individual' | 'combat' | 'fitness' | 'recreational' | 'other';
}

export const SPORTS_LIST: Sport[] = [
  // Team Sports
  { id: 'soccer', name: 'Soccer', icon: '⚽', category: 'team' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', category: 'team' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', category: 'team' },
  { id: 'american-football', name: 'American Football', icon: '🏈', category: 'team' },
  { id: 'rugby', name: 'Rugby', icon: '🏉', category: 'team' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', category: 'team' },
  { id: 'hockey', name: 'Hockey', icon: '🏒', category: 'team' },
  { id: 'baseball', name: 'Baseball', icon: '⚾', category: 'team' },
  
  // Individual Sports
  { id: 'tennis', name: 'Tennis', icon: '🎾', category: 'individual' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', category: 'individual' },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', category: 'individual' },
  { id: 'golf', name: 'Golf', icon: '⛳', category: 'individual' },
  { id: 'athletics', name: 'Athletics', icon: '🏃', category: 'individual' },
  { id: 'swimming', name: 'Swimming', icon: '🏊', category: 'individual' },
  { id: 'cycling', name: 'Cycling', icon: '🚴', category: 'individual' },
  { id: 'running', name: 'Running', icon: '👟', category: 'individual' },
  
  // Combat Sports
  { id: 'boxing', name: 'Boxing', icon: '🥊', category: 'combat' },
  { id: 'mma', name: 'MMA', icon: '🥋', category: 'combat' },
  { id: 'wrestling', name: 'Wrestling', icon: '🤼', category: 'combat' },
  { id: 'judo', name: 'Judo', icon: '🥋', category: 'combat' },
  { id: 'karate', name: 'Karate', icon: '🥋', category: 'combat' },
  { id: 'taekwondo', name: 'Taekwondo', icon: '🥋', category: 'combat' },
  
  // Fitness & Wellness
  { id: 'yoga', name: 'Yoga', icon: '🧘', category: 'fitness' },
  { id: 'pilates', name: 'Pilates', icon: '🤸', category: 'fitness' },
  { id: 'crossfit', name: 'CrossFit', icon: '🏋️', category: 'fitness' },
  { id: 'weightlifting', name: 'Weightlifting', icon: '🏋️', category: 'fitness' },
  { id: 'gymnastics', name: 'Gymnastics', icon: '🤸', category: 'fitness' },
  
  // Recreational
  { id: 'skateboarding', name: 'Skateboarding', icon: '🛹', category: 'recreational' },
  { id: 'surfing', name: 'Surfing', icon: '🏄', category: 'recreational' },
  { id: 'rock-climbing', name: 'Rock Climbing', icon: '🧗', category: 'recreational' },
  { id: 'skiing', name: 'Skiing', icon: '⛷️', category: 'recreational' },
  { id: 'snowboarding', name: 'Snowboarding', icon: '🏂', category: 'recreational' },
  
  // Other
  { id: 'esports', name: 'Esports', icon: '🎮', category: 'other' },
  { id: 'chess', name: 'Chess', icon: '♟️', category: 'other' },
  { id: 'archery', name: 'Archery', icon: '🏹', category: 'other' },
  { id: 'rowing', name: 'Rowing', icon: '🚣', category: 'other' },
  { id: 'triathlon', name: 'Triathlon', icon: '🏊', category: 'other' },
];
