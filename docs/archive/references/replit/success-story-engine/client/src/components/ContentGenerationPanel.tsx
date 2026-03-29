import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContentSuggestion {
  id: string;
  type: "blog" | "social" | "newsletter" | "press-release";
  content: string;
}

interface ContentGenerationPanelProps {
  suggestions?: ContentSuggestion[];
}

const contentTypeLabels = {
  blog: "Blog Post",
  social: "Social Media",
  newsletter: "Newsletter",
  "press-release": "Press Release",
};

export default function ContentGenerationPanel({ suggestions }: ContentGenerationPanelProps) {
  const [tone, setTone] = useState("professional");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = (id: string) => {
    console.log("Regenerating content for:", id);
  };

  const handleUse = (id: string) => {
    console.log("Using content:", id);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Content Generator</CardTitle>
          </div>
          <CardDescription>
            Generate content variations for different channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium min-w-20">Tone:</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="w-48" data-testid="select-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Generate all")}
              data-testid="button-generate-all"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Generate All
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {suggestions?.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{contentTypeLabels[suggestion.type]}</CardTitle>
                  <Badge variant="secondary" className="text-xs">AI-Generated</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(suggestion.id, suggestion.content)}
                    data-testid={`button-copy-${suggestion.id}`}
                  >
                    {copiedId === suggestion.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRegenerate(suggestion.id)}
                    data-testid={`button-regenerate-${suggestion.id}`}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/50 p-4 rounded-md max-h-40 overflow-y-auto">
                {suggestion.content}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleUse(suggestion.id)}
                data-testid={`button-use-${suggestion.id}`}
              >
                Use This
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
