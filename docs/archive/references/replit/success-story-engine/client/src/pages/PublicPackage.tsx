import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Image as ImageIcon, Video, Package as PackageIcon, Mail, Newspaper, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Package, Content, Asset } from "@shared/schema";

export default function PublicPackage() {
  const [, params] = useRoute("/package/:packageId");
  const packageId = params?.packageId;

  const { data: pkg, isLoading: pkgLoading } = useQuery<Package>({
    queryKey: [`/api/packages/${packageId}`],
    enabled: !!packageId,
  });

  const { data: content = [], isLoading: contentLoading } = useQuery<Content[]>({
    queryKey: [`/api/content?storyId=${pkg?.storyId}`],
    enabled: !!pkg?.storyId,
  });

  const { data: assets = [], isLoading: assetsLoading } = useQuery<Asset[]>({
    queryKey: [`/api/assets?storyId=${pkg?.storyId}`],
    enabled: !!pkg?.storyId,
  });

  const isLoading = pkgLoading || contentLoading || assetsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-3xl mx-4">
          <CardContent className="pt-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-3xl mx-4">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <PackageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Package Not Found</h2>
              <p className="text-muted-foreground">
                This package may have been removed or the link is incorrect.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const blogContent = content.find((c) => c.channel === "blog");
  const socialContent = content.filter((c) => c.channel === "social");
  const newsletterContent = content.find((c) => c.channel === "newsletter");
  const pressContent = content.find((c) => c.channel === "press");
  const videoAssets = assets.filter((a) => a.assetType === "video");
  const imageAssets = assets.filter((a) => a.assetType === "image");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                {pkg.description && (
                  <CardDescription>{pkg.description}</CardDescription>
                )}
              </div>
              <Badge variant={pkg.status === "ready" ? "default" : "secondary"} data-testid="badge-package-status">
                {pkg.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {pkg.status === "ready" ? (
              <>
                <div className="flex gap-3">
                  <Button className="flex-1" size="lg" data-testid="button-download-all">
                    <Download className="h-4 w-4 mr-2" />
                    Download All Content
                  </Button>
                </div>

                <Separator />

                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content" data-testid="tab-content">Content ({content.length})</TabsTrigger>
                    <TabsTrigger value="assets" data-testid="tab-assets">Assets ({assets.length})</TabsTrigger>
                    <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-4">
                    {blogContent && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{blogContent.title}</CardTitle>
                            </div>
                            <Badge variant="outline">Blog Post</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {blogContent.body}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {socialContent.length > 0 && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Social Media Posts</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {socialContent.map((post) => (
                            <div key={post.id} className="p-3 border rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline">{post.contentType.replace('_', ' ')}</Badge>
                              </div>
                              <p className="text-sm">{post.body}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {newsletterContent && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Newspaper className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{newsletterContent.title}</CardTitle>
                            </div>
                            <Badge variant="outline">Newsletter</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {newsletterContent.body}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {pressContent && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <CardTitle className="text-lg">{pressContent.title}</CardTitle>
                            </div>
                            <Badge variant="outline">Press Release</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {pressContent.body}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="assets" className="space-y-4 mt-4">
                    {videoAssets.length > 0 && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Video className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Videos</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {videoAssets.map((video) => {
                            const isAvailable = video.status === 'ready' && !video.fileUrl.startsWith('[');
                            return (
                              <div key={video.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`asset-video-${video.id}`}>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{video.fileName}</p>
                                  <p className="text-xs text-muted-foreground">{video.dimensions} • {video.platform}</p>
                                  {!isAvailable && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">Video generation coming soon</p>
                                  )}
                                </div>
                                {isAvailable ? (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={video.fileUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-download-video-${video.id}`}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View
                                    </a>
                                  </Button>
                                ) : (
                                  <Badge variant="secondary">Pending</Badge>
                                )}
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}

                    {imageAssets.length > 0 && (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">Images</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {imageAssets.map((image) => {
                            const isAvailable = image.status === 'ready' && !image.fileUrl.startsWith('[');
                            return (
                              <div key={image.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`asset-image-${image.id}`}>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{image.fileName}</p>
                                  <p className="text-xs text-muted-foreground">{image.dimensions} • {image.platform}</p>
                                  {!isAvailable && (
                                    <p className="text-xs text-muted-foreground mt-1 italic">Video thumbnail coming soon</p>
                                  )}
                                </div>
                                {isAvailable ? (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={image.fileUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-download-image-${image.id}`}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View
                                    </a>
                                  </Button>
                                ) : (
                                  <Badge variant="secondary">Pending</Badge>
                                )}
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="overview" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Package Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Content</p>
                            <p className="text-2xl font-bold">{content.length}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Assets</p>
                            <p className="text-2xl font-bold">{assets.length}</p>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Included Content:</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {blogContent && <li>✓ Blog Post</li>}
                            {socialContent.length > 0 && <li>✓ {socialContent.length} Social Media Posts</li>}
                            {newsletterContent && <li>✓ Newsletter Section</li>}
                            {pressContent && <li>✓ Press Release</li>}
                            {videoAssets.length > 0 && <li>✓ {videoAssets.length} Video(s)</li>}
                            {imageAssets.length > 0 && <li>✓ {imageAssets.length} Image(s)</li>}
                          </ul>
                        </div>

                        <Separator />

                        <div className="text-xs text-muted-foreground">
                          <p>Downloaded {pkg.downloadCount || 0} times</p>
                          {pkg.expiresAt && (
                            <p>Available until {new Date(pkg.expiresAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-center py-12">
                <PackageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">Content Being Generated</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Our AI is creating your success story content package. This usually takes 10-15 minutes.
                  Refresh this page to check the status.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
