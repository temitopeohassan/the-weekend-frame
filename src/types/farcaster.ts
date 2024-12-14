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

export type AccountAssociation = {
  header: string;
  payload: string;
  signature: string;
};

export type FarcasterManifest = {
  accountAssociation: AccountAssociation;
  frame: FrameConfig;
  triggers?: any[]; // You can define a more specific type if needed
}; 