import Creatomate from 'creatomate';

export interface VideoGenerationRequest {
  name: string;
  storyType: string;
  highlights: string[];
  imageUrl?: string;
}

export interface VideoGenerationResult {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

// Check which video provider is configured
function getVideoProvider(): 'creatomate' | 'json2video' | null {
  const apiKey = process.env.VIDEO_API_KEY;
  const provider = process.env.VIDEO_API_PROVIDER || 'creatomate';
  
  if (!apiKey) {
    return null;
  }
  
  return provider as 'creatomate' | 'json2video';
}

export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
  console.log("[VideoGen] Video generation requested:", {
    name: request.name,
    storyType: request.storyType,
    highlightsCount: request.highlights.length,
    hasImage: !!request.imageUrl
  });

  const provider = getVideoProvider();
  
  if (!provider) {
    console.log("[VideoGen] ⚠️  No VIDEO_API_KEY configured, returning placeholder");
    return {
      videoUrl: "[Video generation not configured - Add VIDEO_API_KEY environment variable]",
      thumbnailUrl: "[Video thumbnail not available]",
      duration: 15,
    };
  }

  try {
    if (provider === 'creatomate') {
      return await generateWithCreatomate(request);
    } else {
      return await generateWithJSON2Video(request);
    }
  } catch (error) {
    console.error("[VideoGen] ❌ Error generating video:", error);
    throw error;
  }
}

async function generateWithCreatomate(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
  const apiKey = process.env.VIDEO_API_KEY;
  if (!apiKey) {
    throw new Error('VIDEO_API_KEY not configured');
  }

  console.log("[VideoGen] Using Creatomate API");
  const client = new Creatomate.Client(apiKey);

  // Build elements array for the video
  const elements: any[] = [];
  
  // Add background color
  elements.push({
    type: 'shape',
    track: 1,
    time: 0,
    duration: 15,
    width: '100%',
    height: '100%',
    fill_color: '#1e40af',
  });

  // Add image if provided (centered, covering portion of screen)
  if (request.imageUrl) {
    elements.push({
      type: 'image',
      track: 2,
      time: 0,
      duration: 15,
      source: request.imageUrl,
      width: '90%',
      height: '40%',
      x: '50%',
      y: '30%',
      x_alignment: '50%',
      y_alignment: '50%',
      fit: 'cover',
    });
  }

  // Add text highlights (3 seconds each, max 5 highlights)
  const maxHighlights = Math.min(request.highlights.length, 5);
  const durationPerHighlight = 15 / maxHighlights;
  
  request.highlights.slice(0, maxHighlights).forEach((highlight, index) => {
    const startTime = index * durationPerHighlight;
    
    elements.push({
      type: 'text',
      track: 3,
      time: startTime,
      duration: durationPerHighlight,
      text: highlight,
      width: '85%',
      height: '20%',
      x: '50%',
      y: request.imageUrl ? '80%' : '50%',
      x_alignment: '50%',
      y_alignment: '50%',
      fill_color: '#ffffff',
      font_family: 'Inter',
      font_size: '7 vh',
      font_weight: '700',
      text_align: 'center',
      animations: [
        {
          type: 'fade',
          time: 'start',
          duration: 0.5,
          fade: 'in',
          easing: 'quadratic-out'
        },
        {
          type: 'fade',
          time: 'end',
          duration: 0.5,
          fade: 'out',
          easing: 'quadratic-in'
        }
      ]
    });
  });

  // Create the video source JSON
  const source = {
    output_format: 'mp4',
    width: 1080,   // 9:16 aspect ratio
    height: 1920,
    frame_rate: 30,
    duration: 15,
    elements: elements,
  };

  console.log("[VideoGen] Submitting render to Creatomate...");
  
  try {
    // Render the video
    const renders = await client.render({ source });
    
    if (!renders || renders.length === 0) {
      throw new Error('No render response from Creatomate');
    }

    const render = renders[0];
    console.log("[VideoGen] ✅ Video generated:", render.url);

    return {
      videoUrl: render.url || '',
      thumbnailUrl: render.snapshotUrl || '',
      duration: 15,
    };
  } catch (error: any) {
    console.error("[VideoGen] Creatomate error:", error.message || error);
    throw new Error(`Creatomate API error: ${error.message || 'Unknown error'}`);
  }
}

async function generateWithJSON2Video(request: VideoGenerationRequest): Promise<VideoGenerationResult> {
  const apiKey = process.env.VIDEO_API_KEY;
  if (!apiKey) {
    throw new Error('VIDEO_API_KEY not configured');
  }

  console.log("[VideoGen] Using JSON2Video API");

  // Build scenes for JSON2Video
  const scenes: any[] = [];
  const maxHighlights = Math.min(request.highlights.length, 5);
  const durationPerHighlight = 15 / maxHighlights;

  // JSON2Video expects pixel values, not percentages
  // Vertical video is 1080x1920 (9:16 aspect ratio)
  const videoWidth = 1080;
  const videoHeight = 1920;

  request.highlights.slice(0, maxHighlights).forEach((highlight, index) => {
    const scene: any = {
      'background-color': '#1e40af',
      elements: []
    };

    // Add image if provided and it's the first scene
    if (request.imageUrl && index === 0) {
      scene.elements.push({
        type: 'image',
        src: request.imageUrl,
        duration: durationPerHighlight,
        start: 0,
        width: Math.round(videoWidth * 0.9),  // 90% of 1080 = 972px
        height: Math.round(videoHeight * 0.4), // 40% of 1920 = 768px
        top: Math.round(videoHeight * 0.2),    // 20% from top
        left: Math.round(videoWidth * 0.05)    // 5% from left
      });
    }

    // Add text overlay with word wrapping
    scene.elements.push({
      type: 'text',
      text: highlight,
      duration: durationPerHighlight,
      start: 0,
      style: '003',
      'font-size': 48,  // Reduced from 60 to fit better
      color: '#ffffff',
      'text-align': 'center',
      'word-wrap': true,  // Enable word wrapping
      'line-height': 1.3,  // Add line spacing
      top: request.imageUrl && index === 0 ? Math.round(videoHeight * 0.7) : Math.round(videoHeight * 0.45),
      width: Math.round(videoWidth * 0.85),    // 85% of 1080 = 918px (more padding)
      left: Math.round(videoWidth * 0.075)     // 7.5% from left (centered)
    });

    scenes.push(scene);
  });

  const requestBody = {
    resolution: 'instagram-story', // 9:16 vertical format (1080x1920)
    quality: 'high',
    scenes: scenes
  };

  console.log("[VideoGen] Submitting render to JSON2Video...");
  console.log("[VideoGen] Request body:", JSON.stringify(requestBody, null, 2));

  const response = await fetch('https://api.json2video.com/v2/movies', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[VideoGen] JSON2Video API error (${response.status}):`, errorText);
    throw new Error(`JSON2Video API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  console.log("[VideoGen] JSON2Video response:", JSON.stringify(result, null, 2));
  
  if (!result.project) {
    throw new Error(`JSON2Video response missing project ID: ${JSON.stringify(result)}`);
  }
  
  const projectId = result.project;

  console.log("[VideoGen] Video render started, project:", projectId);
  console.log("[VideoGen] Waiting for video to be ready...");

  // Poll for completion (timeout after 5 minutes)
  const maxAttempts = 60;
  let attempts = 0;
  let videoUrl = '';
  let thumbnailUrl = '';

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

    const statusResponse = await fetch(`https://api.json2video.com/v2/movies?project=${projectId}`, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!statusResponse.ok) {
      throw new Error('Failed to check video status');
    }

    const status = await statusResponse.json();
    console.log(`[VideoGen] Status response (attempt ${attempts + 1}):`, JSON.stringify(status, null, 2));
    
    if (status.movie && status.movie.status === 'done') {
      videoUrl = status.movie.url;
      thumbnailUrl = status.movie.thumbnail || status.movie.poster || videoUrl;
      console.log("[VideoGen] ✅ Video ready:", videoUrl);
      if (status.movie.thumbnail || status.movie.poster) {
        console.log("[VideoGen] Thumbnail URL:", thumbnailUrl);
      } else {
        console.log("[VideoGen] ⚠️ No thumbnail provided by JSON2Video, using video URL as fallback");
      }
      break;
    } else if (status.movie && status.movie.status === 'error') {
      const errorMsg = status.movie.error || status.movie.message || 'Unknown error';
      console.error(`[VideoGen] JSON2Video generation error:`, errorMsg);
      console.error(`[VideoGen] Full error response:`, JSON.stringify(status, null, 2));
      throw new Error(`Video generation failed: ${errorMsg}`);
    } else if (status.error) {
      // Handle direct error response
      const errorMsg = status.message || status.error || 'Unknown API error';
      console.error(`[VideoGen] JSON2Video API error:`, errorMsg);
      console.error(`[VideoGen] Full error response:`, JSON.stringify(status, null, 2));
      throw new Error(`Video generation failed: ${errorMsg}`);
    }

    attempts++;
    const currentStatus = status.movie ? status.movie.status : 'pending';
    console.log(`[VideoGen] Status: ${currentStatus}, attempt ${attempts}/${maxAttempts}`);
  }

  if (!videoUrl) {
    throw new Error('Video generation timed out');
  }

  return {
    videoUrl: videoUrl,
    thumbnailUrl: thumbnailUrl, // Use actual thumbnail from API or video URL as fallback
    duration: 15,
  };
}

export async function prepareVideoScript(storyData: { name: string; background: string; storyType: string }): Promise<string[]> {
  // Extract 3-5 key highlights for 15-second video (3 seconds per highlight)
  const highlights = [
    `${storyData.name}'s inspiring journey`,
    `Overcoming challenges through education`,
    `Achieving success in ${storyData.storyType}`,
    `Join us and write your success story`
  ];

  return highlights;
}
