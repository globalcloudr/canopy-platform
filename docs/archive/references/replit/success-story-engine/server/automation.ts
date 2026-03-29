import { generateAllContent, type StoryData } from "./contentGeneration";
import { generateVideo, prepareVideoScript } from "./videoGeneration";
import type { IStorage } from "./storage";

export interface AutomationResult {
  success: boolean;
  packageId: string;
  error?: string;
}

export async function processStorySubmission(
  storage: IStorage,
  storyId: string
): Promise<AutomationResult> {
  try {
    console.log(`[Automation] Starting processing for story: ${storyId}`);

    const story = await storage.getStory(storyId);
    if (!story) {
      throw new Error("Story not found");
    }

    const sourceData = story.sourceData || {};
    const storyData: StoryData = {
      name: story.subjectName || sourceData.name || "Student",
      background: sourceData.background || sourceData.story || "",
      storyType: story.storyType || "student",
      formData: sourceData,
    };

    console.log(`[Automation] Generating content for: ${storyData.name}`);

    const [content, videoHighlights] = await Promise.all([
      generateAllContent(storyData),
      prepareVideoScript(storyData),
    ]);

    console.log(`[Automation] Content generated, creating video...`);

    // Extract first photo URL from sourceData if available
    const photoUrls = sourceData.photoUrls as string[] | undefined;
    let firstPhotoUrl = photoUrls && photoUrls.length > 0 ? photoUrls[0] : undefined;
    
    // Convert relative Replit Object Storage path to full URL for JSON2Video
    if (firstPhotoUrl && firstPhotoUrl.startsWith('/objects/')) {
      const replitDomain = process.env.REPLIT_DOMAINS;
      if (!replitDomain) {
        console.error(`[Automation] ❌ REPLIT_DOMAINS not set - cannot convert photo URL to full URL for JSON2Video`);
        throw new Error('REPLIT_DOMAINS environment variable is required for photo uploads in videos');
      }
      const originalUrl = firstPhotoUrl;
      firstPhotoUrl = `https://${replitDomain}${firstPhotoUrl}`;
      console.log(`[Automation] Converted photo URL: ${originalUrl} → ${firstPhotoUrl}`);
    }

    // Try to generate video, but continue automation even if it fails
    let video;
    try {
      video = await generateVideo({
        name: storyData.name,
        storyType: storyData.storyType,
        highlights: videoHighlights,
        imageUrl: firstPhotoUrl,
      });
      console.log(`[Automation] ✅ Video generated successfully`);
    } catch (error: any) {
      console.error(`[Automation] ⚠️  Video generation failed (continuing with placeholder):`, error.message);
      // Use placeholder video URL if generation fails
      video = {
        videoUrl: "[Video generation failed - check VIDEO_API_KEY configuration]",
        thumbnailUrl: "[Video thumbnail not available]",
        duration: 15,
      };
    }

    console.log(`[Automation] Creating content records...`);

    const contentRecords = [
      {
        storyId: story.id,
        channel: "blog",
        contentType: "article",
        title: "Success Story Blog Post",
        body: content.blogPost || "[Content generation in progress]",
        status: "ready",
      },
      {
        storyId: story.id,
        channel: "social",
        contentType: "facebook_post",
        title: "Facebook Post",
        body: content.socialPosts?.facebook || "[Content generation in progress]",
        status: "ready",
      },
      {
        storyId: story.id,
        channel: "social",
        contentType: "instagram_post",
        title: "Instagram Post",
        body: content.socialPosts?.instagram || "[Content generation in progress]",
        status: "ready",
      },
      {
        storyId: story.id,
        channel: "social",
        contentType: "twitter_post",
        title: "Twitter/X Post",
        body: content.socialPosts?.twitter || "[Content generation in progress]",
        status: "ready",
      },
      {
        storyId: story.id,
        channel: "social",
        contentType: "linkedin_post",
        title: "LinkedIn Post",
        body: content.socialPosts?.linkedin || "[Content generation in progress]",
        status: "ready",
      },
      {
        storyId: story.id,
        channel: "newsletter",
        contentType: "email_section",
        title: "Newsletter Section",
        body: content.newsletter || "[Content generation in progress]",
        status: "ready",
      },
      {
        storyId: story.id,
        channel: "press",
        contentType: "press_release",
        title: "Press Release",
        body: content.pressRelease || "[Content generation in progress]",
        status: "ready",
      },
    ];

    await Promise.all(contentRecords.map((record) => storage.createContent(record)));

    const videoReady = video.videoUrl && !video.videoUrl.startsWith('[');
    
    const assetRecords: any[] = [
      {
        storyId: story.id,
        assetType: "video",
        fileName: `${storyData.name}-story-video.mp4`,
        fileUrl: video.videoUrl,
        platform: "instagram",
        dimensions: "1080x1920",
        status: videoReady ? "ready" : "pending",
        metadata: null,
      },
    ];

    // Only create thumbnail asset if it's different from the video URL
    if (video.thumbnailUrl && video.thumbnailUrl !== video.videoUrl) {
      assetRecords.push({
        storyId: story.id,
        assetType: "image",
        fileName: `${storyData.name}-video-thumbnail.jpg`,
        fileUrl: video.thumbnailUrl,
        platform: "social",
        dimensions: "1080x1920",
        status: videoReady ? "ready" : "pending",
        metadata: null,
      });
    }

    await Promise.all(assetRecords.map((record) => storage.createAsset(record)));

    console.log(`[Automation] Content and assets created, assembling package...`);

    const pkg = await storage.createPackage({
      projectId: story.projectId,
      storyId: story.id,
      name: `${storyData.name} - Success Story Package`,
      description: `Complete content package for ${storyData.name}'s ${storyData.storyType} success story`,
      status: "ready",
    });

    await storage.updateStory(storyId, { status: "completed", currentStage: "delivered" });

    console.log(`[Automation] ✅ Package ${pkg.id} ready for story: ${storyId}`);

    return {
      success: true,
      packageId: pkg.id,
    };
  } catch (error) {
    console.error(`[Automation] ❌ Error processing story ${storyId}:`, error);

    await storage.updateStory(storyId, { status: "failed" });

    return {
      success: false,
      packageId: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
