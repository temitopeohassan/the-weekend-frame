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

export type TriggerConfig = {
  event: "frame_added" | "frame_removed" | "notifications_enabled" | "notifications_disabled";
  notificationDetails?: {
    title: string;
    body: string;
  };
};

export type FarcasterManifest = {
  accountAssociation: AccountAssociation;
  frame: FrameConfig;
  triggers?: TriggerConfig[];
}; 