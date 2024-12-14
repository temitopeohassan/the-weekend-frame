export type FrameConfig = {
  image: string;
  version: "vNext";
  buttons: {
    label: string;
    action: "post" | "link" | "mint";
    target?: string;
  }[];
  post_url: string;
};

export type FarcasterManifest = {
  frame: FrameConfig;
};