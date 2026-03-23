export type ProductKey =
  | "photovault"
  | "canopy_web"
  | "community_canopy"
  | "reach_canopy";

export type ProductState = "enabled" | "in_setup" | "pilot" | "paused" | "not_enabled";

export type ProductDefinition = {
  productKey: ProductKey;
  displayName: string;
  shortDescription: string;
  category: string;
  defaultLaunchPath: string;
  showWhenNotEnabled: boolean;
  sortOrder: number;
};

export type WorkspaceProductState = {
  productKey: ProductKey;
  state: ProductState;
  stateLabel: string;
  canLaunch: boolean;
  primaryActionLabel: string;
  primaryActionTarget: string;
  secondaryActionLabel?: string;
  secondaryActionTarget?: string;
  planKey?: string;
};

export type LauncherProduct = ProductDefinition & WorkspaceProductState;

const productDefinitions: ProductDefinition[] = [
  {
    productKey: "photovault",
    displayName: "PhotoVault by Canopy",
    shortDescription: "Manage approved photos, brand assets, and share-ready media.",
    category: "Asset Foundation",
    defaultLaunchPath: "/launch/photovault",
    showWhenNotEnabled: false,
    sortOrder: 1,
  },
  {
    productKey: "canopy_web",
    displayName: "Canopy Web",
    shortDescription: "Publish school websites, program pages, and public-facing information.",
    category: "Web Publishing",
    defaultLaunchPath: "/products/canopy-web",
    showWhenNotEnabled: true,
    sortOrder: 2,
  },
  {
    productKey: "community_canopy",
    displayName: "Community Canopy",
    shortDescription: "Run recurring newsletters and school-to-community communication workflows.",
    category: "Community Communication",
    defaultLaunchPath: "/products/community-canopy",
    showWhenNotEnabled: true,
    sortOrder: 3,
  },
  {
    productKey: "reach_canopy",
    displayName: "Reach Canopy",
    shortDescription: "Coordinate social storytelling, scheduling, and visibility workflows.",
    category: "Outreach and Storytelling",
    defaultLaunchPath: "/products/reach-canopy",
    showWhenNotEnabled: true,
    sortOrder: 4,
  },
];

const workspaceProductStates: Record<ProductKey, WorkspaceProductState> = {
  photovault: {
    productKey: "photovault",
    state: "enabled",
    stateLabel: "Enabled",
    canLaunch: true,
    primaryActionLabel: "Launch Product",
    primaryActionTarget: "/launch/photovault?workspace=example-adult-school",
    secondaryActionLabel: "View Details",
    secondaryActionTarget: "/products/photovault",
    planKey: "standard",
  },
  canopy_web: {
    productKey: "canopy_web",
    state: "in_setup",
    stateLabel: "In Setup",
    canLaunch: false,
    primaryActionLabel: "Continue Setup",
    primaryActionTarget: "/products/canopy-web/setup",
    secondaryActionLabel: "View Plan",
    secondaryActionTarget: "/products/canopy-web",
  },
  community_canopy: {
    productKey: "community_canopy",
    state: "pilot",
    stateLabel: "Pilot",
    canLaunch: false,
    primaryActionLabel: "View Pilot",
    primaryActionTarget: "/products/community-canopy",
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "/account/services",
  },
  reach_canopy: {
    productKey: "reach_canopy",
    state: "not_enabled",
    stateLabel: "Not Enabled",
    canLaunch: false,
    primaryActionLabel: "Learn More",
    primaryActionTarget: "/products/reach-canopy",
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "/account/services",
  },
};

export function getLauncherProducts(): LauncherProduct[] {
  return productDefinitions
    .map((definition) => ({
      ...definition,
      ...workspaceProductStates[definition.productKey],
    }))
    .filter((product) => product.showWhenNotEnabled || product.state !== "not_enabled")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
