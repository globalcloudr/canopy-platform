import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export interface StoryData {
  name: string;
  background: string;
  storyType: string;
  formData: Record<string, string>;
}

export interface GeneratedContent {
  blogPost: string;
  socialPosts: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  newsletter: string;
  pressRelease: string;
}

export async function generateAllContent(storyData: StoryData): Promise<GeneratedContent> {
  try {
    console.log(`[ContentGen] Starting content generation for ${storyData.name}...`);
    
    const [blogPost, socialPosts, newsletter, pressRelease] = await Promise.all([
      generateBlogPost(storyData),
      generateSocialPosts(storyData),
      generateNewsletter(storyData),
      generatePressRelease(storyData),
    ]);

    console.log(`[ContentGen] ✅ All content generated successfully`);
    console.log(`[ContentGen] Blog: ${blogPost.length} chars, Social: ${JSON.stringify(Object.keys(socialPosts))}, Newsletter: ${newsletter.length} chars, Press: ${pressRelease.length} chars`);

    return {
      blogPost,
      socialPosts,
      newsletter,
      pressRelease,
    };
  } catch (error) {
    console.error(`[ContentGen] ❌ Error generating content:`, error);
    throw error;
  }
}

async function generateBlogPost(storyData: StoryData): Promise<string> {
  try {
    console.log(`[ContentGen] Generating blog post...`);
    console.log(`[ContentGen] Using model: gpt-5`);
    console.log(`[ContentGen] API Base URL:`, process.env.AI_INTEGRATIONS_OPENAI_BASE_URL);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      max_completion_tokens: 16000,
      messages: [
        {
          role: "system",
          content: `You are a professional content writer for adult education success stories. Write engaging, inspirational blog posts that highlight student achievements and program impact. Use a warm, professional tone suitable for educational institutions.`
        },
        {
          role: "user",
          content: `Write a compelling blog post (800-1000 words) about this ${storyData.storyType} success story:

Name: ${storyData.name}
Background: ${storyData.background}

Additional Details:
${Object.entries(storyData.formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

The blog post should:
- Have an engaging headline
- Tell a compelling narrative arc (challenge → journey → success)
- Include specific details and quotes
- Highlight the impact of the program
- End with an inspiring call-to-action for prospective students
- Be formatted in Markdown with proper headings`
        }
      ]
    });

    console.log(`[ContentGen] API Response:`, JSON.stringify(completion, null, 2));
    const content = completion.choices[0]?.message?.content || "";
    console.log(`[ContentGen] Blog post generated: ${content.length} chars`);
    return content;
  } catch (error) {
    console.error(`[ContentGen] ❌ Error generating blog post:`, error);
    return "";
  }
}

async function generateSocialPosts(storyData: StoryData): Promise<{
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
}> {
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    max_completion_tokens: 16000,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a social media content specialist for adult education institutions. Create platform-optimized posts that drive engagement and inspire prospective students. Output valid JSON only.`
      },
      {
        role: "user",
        content: `Create social media posts for this ${storyData.storyType} success story:

Name: ${storyData.name}
Background: ${storyData.background}

Additional Details:
${Object.entries(storyData.formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Generate JSON with these exact keys:
{
  "facebook": "Engaging Facebook post (250 chars) with emojis and call-to-action",
  "instagram": "Instagram caption (150 chars) with relevant hashtags (#AdultEducation #SuccessStory etc)",
  "twitter": "Twitter/X post (280 chars max) with hashtags",
  "linkedin": "Professional LinkedIn post (300 chars) highlighting career impact"
}

Make each post platform-appropriate with the right tone and format.`
      }
    ]
  });

  const content = completion.choices[0]?.message?.content || "{}";
  try {
    const parsed = JSON.parse(content);
    return {
      facebook: parsed.facebook || "",
      instagram: parsed.instagram || "",
      twitter: parsed.twitter || "",
      linkedin: parsed.linkedin || "",
    };
  } catch (error) {
    console.error("Failed to parse social posts JSON:", error);
    return {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
    };
  }
}

async function generateNewsletter(storyData: StoryData): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    max_completion_tokens: 16000,
    messages: [
      {
        role: "system",
        content: `You are a newsletter writer for adult education institutions. Create concise, engaging newsletter content that works well in email format.`
      },
      {
        role: "user",
        content: `Write a newsletter section (400-500 words) featuring this ${storyData.storyType} success story:

Name: ${storyData.name}
Background: ${storyData.background}

Additional Details:
${Object.entries(storyData.formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

The newsletter section should:
- Have a compelling subject line
- Use a conversational, encouraging tone
- Be scannable with short paragraphs
- Include a clear call-to-action
- Work well in email format
- Be formatted in Markdown`
      }
    ]
  });

  return completion.choices[0]?.message?.content || "";
}

async function generatePressRelease(storyData: StoryData): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: "gpt-5",
    max_completion_tokens: 16000,
    messages: [
      {
        role: "system",
        content: `You are a public relations professional specializing in education. Write formal press releases following AP style guidelines.`
      },
      {
        role: "user",
        content: `Write a professional press release (500-600 words) about this ${storyData.storyType} success story:

Name: ${storyData.name}
Background: ${storyData.background}

Additional Details:
${Object.entries(storyData.formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

The press release should:
- Follow standard press release format (FOR IMMEDIATE RELEASE, dateline, etc.)
- Have a newsworthy headline
- Include who, what, when, where, why in the lead paragraph
- Feature quotes from the subject
- Highlight institutional achievements
- Include boilerplate about the institution
- End with ### or -END-
- Use formal, third-person language`
      }
    ]
  });

  return completion.choices[0]?.message?.content || "";
}
