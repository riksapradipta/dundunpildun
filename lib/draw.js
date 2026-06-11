export function encodeSession(session) {
  try {
    return btoa(JSON.stringify(session));
  } catch {
    return "";
  }
}

export function decodeSession(str) {
  try {
    return JSON.parse(atob(str));
  } catch {
    return null;
  }
}

export function runDraw(friends, teamSlugs) {
  const shuffled = [...teamSlugs].sort(() => Math.random() - 0.5);
  const batches = [];
  const BATCH = 4;

  let idx = 0;
  while (idx < shuffled.length) {
    for (let f = 0; f < friends.length && idx < shuffled.length; f++) {
      const teams = [];
      for (let c = 0; c < BATCH && idx < shuffled.length; c++) {
        teams.push(shuffled[idx]);
        idx++;
      }
      batches.push({ friend: friends[f], teams });
    }
  }

  return batches;
}
