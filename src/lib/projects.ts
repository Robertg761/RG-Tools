export interface Project {
  id: number;
  title: string;
  repoName: string;
  description: string;
  version: string;
  tags: string[];
  link: string;
  bugLink: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "HA-Desktop-Widget",
    repoName: "HA-Desktop-Widget",
    description:
      "A convenient tool for Home Assistant that provides quick access to your smart home devices from your desktop.",
    version: "Latest",
    tags: ["JavaScript", "Home Assistant"],
    link: "https://github.com/Robertg761/HA-Desktop-Widget",
    bugLink: "https://github.com/Robertg761/HA-Desktop-Widget/issues",
  },
  {
    id: 2,
    title: "PlayTorrio - Android",
    repoName: "PlayTorrio---Android",
    description:
      "Open source complete all in one media center with Torrent fetcher and streamer for Android",
    version: "Latest",
    tags: ["HTML", "Android"],
    link: "https://playtorrio.pages.dev/",
    bugLink: "https://github.com/Robertg761/PlayTorrio---Android/issues",
  },
  {
    id: 3,
    title: "Win-Codex",
    repoName: "Win-Codex",
    description:
      "Run Codex desktop app on Windows by converting the official macOS DMG into a portable Windows build",
    version: "Latest",
    tags: ["PowerShell", "Windows"],
    link: "https://github.com/Robertg761/Win-Codex",
    bugLink: "https://github.com/Robertg761/Win-Codex/issues",
  },
  {
    id: 4,
    title: "stremio-core",
    repoName: "stremio-core",
    description:
      "The Stremio Core: types, addon system, UI models, core logic",
    version: "Latest",
    tags: ["Core Logic", "Stremio"],
    link: "https://github.com/Robertg761/stremio-core",
    bugLink: "https://github.com/Robertg761/stremio-core/issues",
  },
  {
    id: 5,
    title: "LunarLog",
    repoName: "LunarLog",
    description: "An open source project built with Kotlin.",
    version: "Latest",
    tags: ["Kotlin"],
    link: "https://github.com/Robertg761/LunarLog",
    bugLink: "https://github.com/Robertg761/LunarLog/issues",
  },
];
