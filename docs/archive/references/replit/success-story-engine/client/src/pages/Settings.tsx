import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Palette, 
  Shield, 
  Database, 
  Zap,
  Mail,
  Globe,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your platform preferences and configuration
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <CardTitle>Automation Settings</CardTitle>
          </div>
          <CardDescription>
            Configure how the automation pipeline processes stories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-generate content on submission</Label>
              <p className="text-sm text-muted-foreground">
                Automatically trigger AI content generation when forms are submitted
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-auto-generate" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Create packages automatically</Label>
              <p className="text-sm text-muted-foreground">
                Bundle content into packages as soon as all assets are ready
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-auto-package" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="processing-timeout">Processing timeout (minutes)</Label>
            <Input
              id="processing-timeout"
              type="number"
              defaultValue={15}
              placeholder="15"
              data-testid="input-timeout"
            />
            <p className="text-sm text-muted-foreground">
              Maximum time to wait before marking a story as failed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Choose when and how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about story completion and errors
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-email-notifications" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Package ready notifications</Label>
              <p className="text-sm text-muted-foreground">
                Alert when content packages are ready for download
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-package-notifications" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="notification-email">Notification email</Label>
            <div className="flex gap-2">
              <Mail className="h-9 w-9 p-2 rounded-md border bg-muted shrink-0" />
              <Input
                id="notification-email"
                type="email"
                placeholder="admin@akkedisdigital.com"
                defaultValue="admin@akkedisdigital.com"
                data-testid="input-notification-email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Branding</CardTitle>
          </div>
          <CardDescription>
            Customize how your organization appears to clients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization name</Label>
            <Input
              id="org-name"
              defaultValue="Akkedis Digital"
              data-testid="input-org-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand-color">Primary brand color</Label>
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-md border bg-primary shrink-0" />
              <Input
                id="brand-color"
                defaultValue="#2563eb"
                data-testid="input-brand-color"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-url">Logo URL</Label>
            <div className="flex gap-2">
              <Globe className="h-9 w-9 p-2 rounded-md border bg-muted shrink-0" />
              <Input
                id="logo-url"
                placeholder="https://example.com/logo.png"
                data-testid="input-logo-url"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>API Keys</CardTitle>
          </div>
          <CardDescription>
            Manage integrations and API access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>OpenAI API</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-sm bg-muted px-3 py-2 rounded-md">
                Connected via Replit AI Integrations
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Using GPT-5 model for content generation
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Video Generation API</Label>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-sm bg-muted px-3 py-2 rounded-md">
                {import.meta.env.VIDEO_API_KEY ? '✓ Configured' : '⚠ Not configured'}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://docs.replit.com/hosting/deployments/environment-variables" target="_blank" rel="noopener noreferrer">
                  Setup Guide
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add VIDEO_API_KEY as a Replit Secret (Creatomate or JSON2Video)
            </p>
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">Setup instructions</summary>
              <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                <p><strong>Step 1:</strong> Get your API key from <a href="https://creatomate.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Creatomate</a> or <a href="https://json2video.com/get-api-key" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">JSON2Video</a></p>
                <p><strong>Step 2:</strong> Open the <strong>Secrets</strong> tool in the left sidebar (🔒 icon)</p>
                <p><strong>Step 3:</strong> Add a new secret:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Key:</strong> VIDEO_API_KEY</li>
                  <li><strong>Value:</strong> Paste your API key</li>
                </ul>
                <p><strong>Step 4:</strong> (Optional) Add VIDEO_API_PROVIDER secret with value "creatomate" or "json2video" (defaults to creatomate)</p>
                <p><strong>Step 5:</strong> Restart the application workflow</p>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <CardTitle>Database</CardTitle>
          </div>
          <CardDescription>
            Database connection and storage information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Connection status</Label>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm">Connected to PostgreSQL (Neon)</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Storage usage</Label>
            <div className="text-sm text-muted-foreground">
              Database size and usage statistics available in Replit Database panel
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage authentication and access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-factor authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch data-testid="switch-2fa" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Button variant="outline" data-testid="button-change-password">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave} data-testid="button-save-settings">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
