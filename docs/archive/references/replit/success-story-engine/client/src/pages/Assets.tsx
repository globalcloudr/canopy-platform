import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Image, Video, FileText } from "lucide-react";
import { useState } from "react";
import type { Asset, Story } from "@shared/schema";

export default function Assets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: allStories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const { data: allAssets = [], isLoading } = useQuery<Asset[]>({
    queryKey: ["/api/assets/all"],
    queryFn: async () => {
      const assets: Asset[] = [];
      for (const story of allStories) {
        const response = await fetch(`/api/assets?storyId=${story.id}`);
        if (response.ok) {
          const storyAssets = await response.json();
          assets.push(...storyAssets);
        }
      }
      return assets;
    },
    enabled: allStories.length > 0,
  });

  const filteredAssets = allAssets.filter((asset) => {
    const matchesSearch = asset.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || asset.assetType === filterType;
    return matchesSearch && matchesType;
  });

  const assetTypeCounts = {
    all: allAssets.length,
    video: allAssets.filter((a) => a.assetType === "video").length,
    image: allAssets.filter((a) => a.assetType === "image").length,
    graphic: allAssets.filter((a) => a.assetType === "graphic").length,
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Assets</h1>
        <p className="text-muted-foreground mt-1">
          All generated graphics, videos, and visual content
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover-elevate" onClick={() => setFilterType("all")}>
          <CardHeader className="pb-3">
            <CardDescription>Total Assets</CardDescription>
            <CardTitle className="text-3xl">{assetTypeCounts.all}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover-elevate" onClick={() => setFilterType("video")}>
          <CardHeader className="pb-3">
            <CardDescription>Videos</CardDescription>
            <CardTitle className="text-3xl">{assetTypeCounts.video}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover-elevate" onClick={() => setFilterType("image")}>
          <CardHeader className="pb-3">
            <CardDescription>Images</CardDescription>
            <CardTitle className="text-3xl">{assetTypeCounts.image}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="cursor-pointer hover-elevate" onClick={() => setFilterType("graphic")}>
          <CardHeader className="pb-3">
            <CardDescription>Graphics</CardDescription>
            <CardTitle className="text-3xl">{assetTypeCounts.graphic}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-assets"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading assets...</div>
      ) : filteredAssets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No assets yet</h3>
            <p className="text-sm text-muted-foreground">
              Assets will appear here when stories complete the automation pipeline
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAssets.map((asset) => {
            const Icon = getAssetIcon(asset.assetType);
            const story = allStories.find((s) => s.id === asset.storyId);
            
            return (
              <Card key={asset.id} className="hover-elevate" data-testid={`asset-${asset.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <CardTitle className="text-base truncate">{asset.fileName}</CardTitle>
                      </div>
                      {story && (
                        <CardDescription className="truncate">{story.title}</CardDescription>
                      )}
                    </div>
                    <Badge variant="secondary">{asset.assetType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {asset.platform && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Platform: </span>
                        <span className="font-medium">{asset.platform}</span>
                      </div>
                    )}
                    {asset.dimensions && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Size: </span>
                        <span className="font-medium">{asset.dimensions}</span>
                      </div>
                    )}
                    {asset.fileUrl && !asset.fileUrl.startsWith('[') && asset.status !== 'pending' ? (
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => window.open(asset.fileUrl, '_blank')}
                        data-testid={`button-download-${asset.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                        disabled
                        data-testid={`button-download-${asset.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {asset.assetType === 'video' ? 'Video Generation Coming Soon' : 'Not Available'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
