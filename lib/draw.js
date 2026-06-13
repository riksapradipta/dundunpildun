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
  const allTeams = [...teamSlugs];
  const total = allTeams.length;
  const numF = friends.length;
  const BATCH = 4;

  const target = Math.max(BATCH, Math.ceil(total / (BATCH * numF)) * BATCH);
  const perFriend = friends.map(() => target);

  const batches = [];
  let assigned = friends.map(() => 0);
  const shuffled = [...allTeams].sort(() => Math.random() - 0.5);

  while (assigned.some((a, i) => a < perFriend[i])) {
    for (let f = 0; f < numF; f++) {
      const remaining = perFriend[f] - assigned[f];
      if (remaining <= 0) continue;

      const size = Math.min(BATCH, remaining);
      const teams = [];

      for (let c = 0; c < size; c++) {
        if (shuffled.length > 0) {
          const idx = Math.floor(Math.random() * shuffled.length);
          teams.push(shuffled.splice(idx, 1)[0]);
        } else {
          teams.push(allTeams[Math.floor(Math.random() * allTeams.length)]);
        }
      }

      batches.push({ friend: friends[f], teams });
      assigned[f] += size;
    }
  }

  return batches;
}
