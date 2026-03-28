import type { PortalEntitlement, ProductKey } from "@/lib/platform";

export type CatalogKind = "product" | "service";

export type ProductState = "enabled" | "in_setup" | "pilot" | "paused" | "not_enabled" | "service";

export type ProductDefinition = {
  productKey: ProductKey;
  displayName: string;
  shortDescription: string;
  category: string;
  kind: CatalogKind;
  iconColor: string;
  defaultLaunchPath: string;
  externalUrl?: string;
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

type LauncherOptions = {
  workspaceSlug?: string;
};

function getPhotoVaultLaunchPath(path = "/") {
  const params = new URLSearchParams();
  if (path && path !== "/") {
    params.set("path", path);
  }

  const query = params.toString();
  return query ? `/auth/launch/photovault?${query}` : "/auth/launch/photovault";
}

function getStoriesLaunchPath(path = "/") {
  const params = new URLSearchParams();
  if (path && path !== "/") {
    params.set("path", path);
  }

  const query = params.toString();
  return query ? `/auth/launch/stories?${query}` : "/auth/launch/stories";
}

const catalogDefinitions: ProductDefinition[] = [
  {
    productKey: "photovault",
    displayName: "PhotoVault by Canopy",
    shortDescription: "View school photos, brand assets, and approved media.",
    category: "Media and Brand",
    kind: "product",
    iconColor: "#0f1f3d",
    defaultLaunchPath: getPhotoVaultLaunchPath(),
    externalUrl: "https://photovault.school",
    showWhenNotEnabled: false,
    sortOrder: 1,
  },
  {
    productKey: "canopy_web",
    displayName: "Canopy Website",
    shortDescription: "Publish school websites, program pages, and public-facing information.",
    category: "Web Publishing",
    kind: "product",
    iconColor: "#0d9488",
    defaultLaunchPath: "/products/canopy-web",
    showWhenNotEnabled: true,
    sortOrder: 2,
  },
  {
    productKey: "create_canopy",
    displayName: "Canopy Create",
    shortDescription: "Create brochures, class catalogs, flyers, and campaign materials.",
    category: "Design Publishing",
    kind: "product",
    iconColor: "#ea580c",
    defaultLaunchPath: "/products/create-canopy",
    showWhenNotEnabled: true,
    sortOrder: 3,
  },
  {
    productKey: "publish_canopy",
    displayName: "Canopy Publish",
    shortDescription: "Manage digital publications, guides, and embedded catalogs.",
    category: "Publication Management",
    kind: "product",
    iconColor: "#0369a1",
    defaultLaunchPath: "/products/publish-canopy",
    showWhenNotEnabled: true,
    sortOrder: 4,
  },
  {
    productKey: "stories_canopy",
    displayName: "Canopy Stories",
    shortDescription: "Turn student and staff successes into blog posts, social content, and video — automatically.",
    category: "Content Production",
    kind: "product",
    iconColor: "#d97706",
    defaultLaunchPath: getStoriesLaunchPath(),
    externalUrl: "https://stories.canopy.school",
    showWhenNotEnabled: true,
    sortOrder: 5,
  },
  {
    productKey: "community_canopy",
    displayName: "Canopy Community",
    shortDescription: "Run recurring newsletters and school-to-community communication workflows.",
    category: "Community Communication",
    kind: "product",
    iconColor: "#7c3aed",
    defaultLaunchPath: "/products/community-canopy",
    showWhenNotEnabled: true,
    sortOrder: 6,
  },
  {
    productKey: "reach_canopy",
    displayName: "Canopy Reach",
    shortDescription: "Write, schedule, and publish social media posts to your school's accounts.",
    category: "Outreach and Storytelling",
    kind: "product",
    iconColor: "#db2777",
    defaultLaunchPath: "/products/reach-canopy",
    showWhenNotEnabled: true,
    sortOrder: 7,
  },
  {
    productKey: "assist_canopy",
    displayName: "Canopy Assistant",
    shortDescription: "Give staff a knowledge and communications assistant for everyday work.",
    category: "Communication and Knowledge",
    kind: "product",
    iconColor: "#4f46e5",
    defaultLaunchPath: "/products/assist-canopy",
    showWhenNotEnabled: true,
    sortOrder: 8,
  },
  {
    productKey: "insights_canopy",
    displayName: "Canopy Insights",
    shortDescription: "Track visibility, campaign activity, and cross-channel performance.",
    category: "Measurement and Visibility",
    kind: "product",
    iconColor: "#16a34a",
    defaultLaunchPath: "/products/insights-canopy",
    showWhenNotEnabled: true,
    sortOrder: 9,
  },
  {
    productKey: "website_setup",
    displayName: "School Website Setup",
    shortDescription: "Request or manage website setup and implementation support.",
    category: "Services",
    kind: "service",
    iconColor: "#374151",
    defaultLaunchPath: "/services/website-setup",
    showWhenNotEnabled: true,
    sortOrder: 10,
  },
  {
    productKey: "design_support",
    displayName: "Creative Retainer",
    shortDescription: "Ongoing design support — Canopy handles design work on your behalf each month.",
    category: "Services",
    kind: "service",
    iconColor: "#374151",
    defaultLaunchPath: "/services/design-support",
    showWhenNotEnabled: true,
    sortOrder: 11,
  },
  {
    productKey: "communications_support",
    displayName: "Communications Support",
    shortDescription: "Managed newsletter, social, and content support handled by Canopy for your school.",
    category: "Services",
    kind: "service",
    iconColor: "#374151",
    defaultLaunchPath: "/services/communications-support",
    showWhenNotEnabled: true,
    sortOrder: 12,
  },
];

function productSlug(productKey: ProductKey): string {
  return productKey.replace(/_/g, "-");
}

function getDefaultState(definition: ProductDefinition): WorkspaceProductState {
  if (definition.kind === "service") {
    return {
      productKey: definition.productKey,
      state: "service",
      stateLabel: "Available",
      canLaunch: false,
      primaryActionLabel: "Learn More",
      primaryActionTarget: `/app/services/${productSlug(definition.productKey)}`,
    };
  }

  return {
    productKey: definition.productKey,
    state: "not_enabled",
    stateLabel: "Not Enabled",
    canLaunch: false,
    primaryActionLabel: "View Product",
    primaryActionTarget: `/app/products/${productSlug(definition.productKey)}`,
    secondaryActionLabel: "Request Access",
    secondaryActionTarget: "mailto:info@akkedisdigital.com",
  };
}

function appendWorkspaceContext(target: string, workspaceSlug?: string) {
  if (!workspaceSlug) {
    return target;
  }

  try {
    const url = target.startsWith("http")
      ? new URL(target)
      : new URL(target, "https://usecanopy.school");
    url.searchParams.set("workspace", workspaceSlug);
    return target.startsWith("http")
      ? url.toString()
      : `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return target;
  }
}

function getActionState(
  definition: ProductDefinition,
  entitlement?: PortalEntitlement,
  options?: LauncherOptions
): WorkspaceProductState {
  if (!entitlement) {
    return getDefaultState(definition);
  }

  if (definition.kind === "service") {
    return {
      productKey: definition.productKey,
      state: "service",
      stateLabel: entitlement.setupState === "in_setup" ? "In Progress" : "Service",
      canLaunch: false,
      primaryActionLabel: getPrimaryActionLabel(definition.productKey, "service"),
      primaryActionTarget: appendWorkspaceContext(definition.defaultLaunchPath, options?.workspaceSlug),
      secondaryActionLabel: getSecondaryActionLabel(definition.productKey, "service"),
      secondaryActionTarget: appendWorkspaceContext(
        getSecondaryActionTarget(definition.productKey, "service") ?? "",
        options?.workspaceSlug
      ) || undefined,
      planKey: entitlement.planKey,
    };
  }

  const state = deriveProductState(entitlement);

  return {
    productKey: definition.productKey,
    state,
    stateLabel: getStateLabel(state, entitlement),
    canLaunch: state === "enabled",
    primaryActionLabel: getPrimaryActionLabel(definition.productKey, state),
    primaryActionTarget: appendWorkspaceContext(
      getPrimaryActionTarget(definition.productKey, state),
      options?.workspaceSlug
    ),
    secondaryActionLabel: getSecondaryActionLabel(definition.productKey, state),
    secondaryActionTarget: appendWorkspaceContext(
      getSecondaryActionTarget(definition.productKey, state) ?? "",
      options?.workspaceSlug
    ) || undefined,
    planKey: entitlement.planKey,
  };
}

function deriveProductState(entitlement: PortalEntitlement): ProductState {
  if (entitlement.status === "paused") return "paused";
  if (entitlement.setupState === "in_setup" || entitlement.setupState === "blocked") return "in_setup";
  if (entitlement.status === "pilot") return "pilot";
  return "enabled";
}

function getStateLabel(state: ProductState, entitlement: PortalEntitlement) {
  if (state === "pilot") return "Pilot";
  if (state === "paused") return "Paused";
  if (state === "in_setup") return entitlement.setupState === "blocked" ? "Blocked" : "In Setup";
  if (entitlement.status === "trial") return "Trial";
  return "Enabled";
}

function getPrimaryActionLabel(productKey: ProductKey, state: ProductState) {
  const actionMap: Record<ProductKey, Partial<Record<ProductState, string>>> = {
    photovault: {
      enabled: "View Photos",
      in_setup: "Continue Setup",
      pilot: "Open Pilot",
      not_enabled: "View Product",
    },
    canopy_web: {
      enabled: "Edit Website",
      in_setup: "Start Website Setup",
      not_enabled: "View Product",
    },
    create_canopy: {
      enabled: "New Design Request",
      in_setup: "View Setup",
      not_enabled: "View Product",
    },
    publish_canopy: {
      enabled: "View Publications",
      not_enabled: "View Product",
    },
    stories_canopy: {
      enabled: "New Story",
      pilot: "New Story",
      in_setup: "View Setup",
      not_enabled: "View Product",
    },
    community_canopy: {
      enabled: "Create Newsletter",
      in_setup: "View Setup",
      pilot: "Create Newsletter",
      not_enabled: "View Product",
    },
    reach_canopy: {
      enabled: "New Post",
      in_setup: "View Setup",
      pilot: "New Post",
      not_enabled: "View Product",
    },
    assist_canopy: {
      enabled: "Open Assistant",
      in_setup: "View Setup",
      not_enabled: "View Product",
    },
    insights_canopy: {
      enabled: "View Reports",
      not_enabled: "View Product",
    },
    website_setup: {
      service: "View Request",
    },
    design_support: {
      service: "Submit Request",
    },
    communications_support: {
      service: "View Support",
    },
  };

  return actionMap[productKey][state] ?? "View Product";
}

function getPrimaryActionTarget(productKey: ProductKey, state: ProductState): string {
  const def = catalogDefinitions.find((d) => d.productKey === productKey);
  const slug = productSlug(productKey);

  // Live external products (e.g. PhotoVault at photovault.school)
  if (def?.externalUrl && (state === "enabled" || state === "pilot")) {
    if (productKey === "photovault") {
      return getPhotoVaultLaunchPath();
    }
    if (productKey === "stories_canopy") {
      return getStoriesLaunchPath();
    }

    return def.externalUrl;
  }

  // Services → service placeholder pages
  if (state === "service") {
    return `/app/services/${slug}`;
  }

  // Everything else → product placeholder page within the portal
  return `/app/products/${slug}`;
}

function getSecondaryActionLabel(productKey: ProductKey, state: ProductState) {
  const labelMap: Partial<Record<ProductKey, Partial<Record<ProductState, string>>>> = {
    photovault: {
      enabled: "Open Brand Portal",
    },
    canopy_web: {
      in_setup: "View Plan",
    },
    create_canopy: {
      enabled: "View Requests",
    },
    publish_canopy: {
      enabled: "Get Embed Code",
    },
    stories_canopy: {
      enabled: "View Stories",
      pilot: "View Stories",
    },
    community_canopy: {
      enabled: "View Campaigns",
      pilot: "View Campaigns",
    },
    reach_canopy: {
      enabled: "View Calendar",
    },
    assist_canopy: {
      in_setup: "View Product",
    },
    website_setup: {
      service: "Contact Canopy",
    },
    design_support: {
      service: "View Status",
    },
    communications_support: {
      service: "Contact Canopy",
    },
  };

  return labelMap[productKey]?.[state];
}

function getSecondaryActionTarget(productKey: ProductKey, state: ProductState) {
  const targetMap: Partial<Record<ProductKey, Partial<Record<ProductState, string>>>> = {
    photovault: {
      enabled: getPhotoVaultLaunchPath("/collections/brand-guidelines"),
    },
    canopy_web: {
      in_setup: "/products/canopy-web",
    },
    create_canopy: {
      enabled: "/products/create-canopy/requests",
    },
    publish_canopy: {
      enabled: "/products/publish-canopy/embed",
    },
    stories_canopy: {
      enabled: getStoriesLaunchPath("/stories"),
      pilot: getStoriesLaunchPath("/stories"),
    },
    community_canopy: {
      enabled: "/products/community-canopy/campaigns",
      pilot: "/products/community-canopy/campaigns",
    },
    reach_canopy: {
      enabled: "/products/reach-canopy/calendar",
    },
    assist_canopy: {
      in_setup: "/products/assist-canopy",
    },
    website_setup: {
      service: "/support",
    },
    design_support: {
      service: "/services/design-support/status",
    },
    communications_support: {
      service: "/support",
    },
  };

  return targetMap[productKey]?.[state];
}

function getCatalogItems(entitlements: PortalEntitlement[], options?: LauncherOptions) {
  const entitlementMap = new Map(entitlements.map((entitlement) => [entitlement.productKey, entitlement]));

  return catalogDefinitions
    .map((definition) => ({
      ...definition,
      ...getActionState(definition, entitlementMap.get(definition.productKey), options),
    }))
    .filter((item) => item.showWhenNotEnabled || item.state !== "not_enabled")
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getLauncherProducts(entitlements: PortalEntitlement[], options?: LauncherOptions): LauncherProduct[] {
  return getCatalogItems(entitlements, options).filter((item) => item.kind === "product");
}

export function getEnabledLauncherProducts(entitlements: PortalEntitlement[], options?: LauncherOptions): LauncherProduct[] {
  return getLauncherProducts(entitlements, options).filter((item) => item.state !== "not_enabled");
}

export function getAdditionalLauncherProducts(entitlements: PortalEntitlement[], options?: LauncherOptions): LauncherProduct[] {
  return getLauncherProducts(entitlements, options).filter((item) => item.state === "not_enabled");
}

export function getLauncherServices(entitlements: PortalEntitlement[], options?: LauncherOptions): LauncherProduct[] {
  return getCatalogItems(entitlements, options).filter((item) => item.kind === "service" && item.state !== "not_enabled");
}

export function getProductDefinition(key: ProductKey): ProductDefinition | undefined {
  return catalogDefinitions.find((d) => d.productKey === key);
}
