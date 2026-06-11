export const FRIEND_COLORS = [
  {
    id: "emerald",
    bg: "bg-emerald-100",
    border: "border-emerald-400",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    ring: "ring-emerald-400",
    light: "#d1fae5",
    hex: "#10b981",
  },
  {
    id: "blue",
    bg: "bg-blue-100",
    border: "border-blue-400",
    text: "text-blue-700",
    dot: "bg-blue-500",
    ring: "ring-blue-400",
    light: "#dbeafe",
    hex: "#3b82f6",
  },
  {
    id: "purple",
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-700",
    dot: "bg-purple-500",
    ring: "ring-purple-400",
    light: "#f3e8ff",
    hex: "#a855f7",
  },
  {
    id: "orange",
    bg: "bg-orange-100",
    border: "border-orange-400",
    text: "text-orange-700",
    dot: "bg-orange-500",
    ring: "ring-orange-400",
    light: "#ffedd5",
    hex: "#f97316",
  },
  {
    id: "pink",
    bg: "bg-pink-100",
    border: "border-pink-400",
    text: "text-pink-700",
    dot: "bg-pink-500",
    ring: "ring-pink-400",
    light: "#fce7f3",
    hex: "#ec4899",
  },
  {
    id: "teal",
    bg: "bg-teal-100",
    border: "border-teal-400",
    text: "text-teal-700",
    dot: "bg-teal-500",
    ring: "ring-teal-400",
    light: "#ccfbf1",
    hex: "#14b8a6",
  },
  {
    id: "red",
    bg: "bg-red-100",
    border: "border-red-400",
    text: "text-red-700",
    dot: "bg-red-500",
    ring: "ring-red-400",
    light: "#fee2e2",
    hex: "#ef4444",
  },
  {
    id: "indigo",
    bg: "bg-indigo-100",
    border: "border-indigo-400",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
    ring: "ring-indigo-400",
    light: "#e0e7ff",
    hex: "#6366f1",
  },
];

export function getColor(index) {
  return FRIEND_COLORS[index % FRIEND_COLORS.length];
}

export function getColorByFriend(friends, friendName) {
  const idx = friends.indexOf(friendName);
  return idx >= 0 ? getColor(idx) : FRIEND_COLORS[0];
}
