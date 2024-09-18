export type Config = {
  sitemapUrl: string;
  sitemapFilter: (path: string) => boolean;
  testsDirectory: string;
  outputDirectory: string;
  openReportWhenDone: boolean;
};
