// shared Quartz config (example – adjust to your theme/plugins)
export interface SiteCfg { title: string; }
export function makeBaseConfig(client: SiteCfg) {
  return {
    configuration: {
      pageTitle: client.title,
      outDir: "public",
      ignorePatterns: ["**/.DS_Store", "**/node_modules/**"],
    },
    // add shared plugins/components here later
  };
}
