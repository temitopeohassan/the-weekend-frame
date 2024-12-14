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

export type TriggerConfig = {
  // Add trigger configurations if needed
};

export type FarcasterManifest = {
  accountAssociation: {
    header: string;
    payload: string;
    signature: string;
  };
  frame: FrameConfig;
  triggers?: TriggerConfig[];
}; 