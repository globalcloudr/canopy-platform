export type CatalogKind = "product" | "service";

export type ProductKey =
  | "photovault"
  | "canopy_web"
  | "create_canopy"
  | "publish_canopy"
  | "community_canopy"
  | "reach_canopy"
  | "assist_canopy"
  | "insights_canopy"
  | "website_setup"
  | "design_support"
  | "communications_support";

export type ProductState = "enabled" | "in_setup" | "pilot" | "paused" | "not_enabled" | "service";

export type ProductDefinition = {
  productKey: ProductKey;
  displayName: string;
  shortDescription: string;
  category: string;
  kind: CatalogKind;
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

const catalogDefinitions: ProductDefinition[] = [
  {
    productKey: "photovault",
    displayName: "PhotoVault",
    shortDescription: "View school photos, brand assets, and approved media.",
    category: "Media and Brand",
    kind: "product",
    defaultLaunchPath: "/launch/photovault",
    showWhenNotEnabled: false,
    sortOrder: 1,
  },
  {
    productKey: "canopy_web",
    displayName: "Canopy Web",
    shortDescription: "Publish school websites, program pages, and public-facing information.",
    category: "Web Publishing",
    kind: "product",
    defaultLaunchPath: "/products/canopy-web",
    showWhenNotEnabled: true,
    sortOrder: 2,
  },
  {
    productKey: "create_canopy",
    displayName: "Create Canopy",
    shortDescription: "Create brochures, class catalogs, flyers, and campaign materials.",
    category: "Design Publishing",
    kind: "product",
    defaultLaunchPath: "/products/create-canopy",
    showWhenNotEnabled: true,
    sortOrder: 3,
  },
  {
    productKey: "publish_canopy",
    displayName: "Publish Canopy",
    shortDescription: "Manage digital publications, guides, and embedded catalogs.",
    category: "Publication Management",
    kind: "product",
    defaultLaunchPath: "/products/publish-canopy",
    showWhenNotEnabled: true,
    sortOrder: 4,
  },
  {
    productKey: "community_canopy",
    displayName: "Community Canopy",
    shortDescription: "Run recurring newsletters and school-to-community communication workflows.",
    category: "Community Communication",
    kind: "product",
    defaultLaunchPath: "/products/community-canopy",
    showWhenNotEnabled: true,
    sortOrder: 5,
  },
  {
    productKey: "reach_canopy",
    displayName: "Reach Canopy",
    shortDescription: "Coordinate social storytelling, scheduling, and visibility workflows.",
    category: "Outreach and Storytelling",
    kind: "product",
    defaultLaunchPath: "/products/reach-canopy",
    showWhenNotEnabled: true,
    sortOrder: 6,
  },
  {
    productKey: "assist_canopy",
    displayName: "Assist Canopy",
    shortDescription: "Give staff a knowledge and communications assistant for everyday work.",
    category: "Communication and Knowledge",
    kind: "product",
    defaultLaunchPath: "/products/assist-canopy",
    showWhenNotEnabled: true,
    sortOrder: 7,
  },
  {
    productKey: "insights_canopy",
    displayName: "Insights Canopy",
    shortDescription: "Track visibility, campaign activity, and cross-channel performance.",
    category: "Measurement and Visibility",
    kind: "product",
    defaultLaunchPath: "/products/insights-canopy",
    showWhenNotEnabled: true,
    sortOrder: 8,
  },
  {
    productKey: "website_setup",
    displayName: "School Website Setup",
    shortDescription: "Request or manage website setup and implementation support.",
    category: "Services",
    kind: "service",
    defaultLaunchPath: "/services/website-setup",
    showWhenNotEnabled: true,
    sortOrder: 9,
  },
  {
    productKey: "design_support",
    displayName: "Design Support",
    shortDescription: "Coordinate design requests, revisions, and campaign material support.",
    category: "Services",
    kind: "service",
    defaultLaunchPath: "/services/design-support",
    showWhenNotEnabled: true,
    sortOrder: 10,
  },
  {
    productKey: "communications_support",
    displayName: "Communications Support",
    shortDescription: "Manage communications help, publishing support, and platform guidance.",
    category: "Services",
    kind: "service",
    defaultLaunchPath: "/services/communications-support",
    showWhenNotEnabled: true,
    sortOrder: 11,
  },
];

const workspaceCatalogStates: Record<ProductKey, WorkspaceProductState> = {
  photovault: {
    productKey: "photovault",
    state: "enabled",
    stateLabel: "Enabled",
    canLaunch: true,
    primaryActionLabel: "View Photos",
    primaryActionTarget: "/launch/photovault?workspace=example-adult-school",
    secondaryActionLabel: "Open Brand Portal",
    secondaryActionTarget: "/products/photovault/brand-portal",
    planKey: "standard",
  },
  canopy_web: {
    productKey: "canopy_web",
    state: "in_setup",
    stateLabel: "In Setup",
    canLaunch: false,
    primaryActionLabel: "Start Website Setup",
    primaryActionTarget: "/products/canopy-web/setup",
    secondaryActionLabel: "View Plan",
    secondaryActionTarget: "/products/canopy-web",
  },
  create_canopy: {
    productKey: "create_canopy",
    state: "not_enabled",
    stateLabel: "Not Enabled",
    canLaunch: false,
    primaryActionLabel: "View Product",
    primaryActionTarget: "/products/create-canopy",
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "/account/services",
  },
  publish_canopy: {
    productKey: "publish_canopy",
    state: "not_enabled",
    stateLabel: "Not Enabled",
    canLaunch: false,
    primaryActionLabel: "View Product",
    primaryActionTarget: "/products/publish-canopy",
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "/account/services",
  },
  community_canopy: {
    productKey: "community_canopy",
    state: "pilot",
    stateLabel: "Pilot",
    canLaunch: false,
    primaryActionLabel: "Create Newsletter",
    primaryActionTarget: "/products/community-canopy",
    secondaryActionLabel: "View Campaigns",
    secondaryActionTarget: "/products/community-canopy/campaigns",
  },
  reach_canopy: {
    productKey: "reach_canopy",
    state: "not_enabled",
    stateLabel: "Not Enabled",
    canLaunch: false,
    primaryActionLabel: "View Product",
    primaryActionTarget: "/products/reach-canopy",
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "/account/services",
  },
  assist_canopy: {
    productKey: "assist_canopy",
    state: "in_setup",
    stateLabel: "In Setup",
    canLaunch: false,
    primaryActionLabel: "View Setup",
    primaryActionTarget: "/products/assist-canopy/setup",
    secondaryActionLabel: "View Product",
    secondaryActionTarget: "/products/assist-canopy",
  },
  insights_canopy: {
    productKey: "insights_canopy",
    state: "not_enabled",
    stateLabel: "Not Enabled",
    canLaunch: false,
    primaryActionLabel: "View Product",
    primaryActionTarget: "/products/insights-canopy",
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "/account/services",
  },
  website_setup: {
    productKey: "website_setup",
    state: "service",
    stateLabel: "Service",
    canLaunch: false,
    primaryActionLabel: "View Request",
    primaryActionTarget: "/services/website-setup",
    secondaryActionLabel: "Contact Canopy",
    secondaryActionTarget: "/support",
  },
  design_support: {
    productKey: "design_support",
    state: "service",
    stateLabel: "Service",
    canLaunch: false,
    primaryActionLabel: "Submit Request",
    primaryActionTarget: "/services/design-support",
    secondaryActionLabel: "View Status",
    secondaryActionTarget: "/services/design-support/status",
  },
  communications_support: {
    productKey: "communications_support",
    state: "service",
    stateLabel: "Service",
    canLaunch: false,
    primaryActionLabel: "View Support",
    primaryActionTarget: "/services/communications-support",
    secondaryActionLabel: "Contact Canopy",
    secondaryActionTarget: "/support",
  },
};

function getCatalogItems() {
  return catalogDefinitions
    .map((definition) => ({
      ...definition,
      ...workspaceCatalogStates[definition.productKey],
    }))
    .filter((item) => item.showWhenNotEnabled || item.state !== "not_enabled")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getLauncherProducts(): LauncherProduct[] {
  return getCatalogItems().filter((item) => item.kind === "product");
}

export function getEnabledLauncherProducts(): LauncherProduct[] {
  return getLauncherProducts().filter((item) => item.state !== "not_enabled");
}

export function getAdditionalLauncherProducts(): LauncherProduct[] {
  return getLauncherProducts().filter((item) => item.state === "not_enabled");
}

export function getLauncherServices(): LauncherProduct[] {
  return getCatalogItems().filter((item) => item.kind === "service");
}
