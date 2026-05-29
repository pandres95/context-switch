export interface Stash {
  id: number;
  timestamp: string;
  context: string;
  text: string;
}

export interface Context {
  id: string; // slug: "personal", "universidad-nacional"
  label: string; // display: "Personal", "Universidad Nacional"
  icon: string; // emoji: "🏠"
}
