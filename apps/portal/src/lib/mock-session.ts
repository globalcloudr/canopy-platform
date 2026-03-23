export const mockWorkspaces = [
  {
    slug: "example-adult-school",
    displayName: "Example Adult School",
  },
  {
    slug: "north-valley-campus",
    displayName: "North Valley Campus",
  },
  {
    slug: "bay-learning-center",
    displayName: "Bay Learning Center",
  },
] as const;

export function getWorkspaceName(workspaceSlug?: string) {
  return mockWorkspaces.find((workspace) => workspace.slug === workspaceSlug)?.displayName ?? mockWorkspaces[0].displayName;
}
