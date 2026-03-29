import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { Form } from "@shared/schema";
import type { UploadResult } from "@uppy/core";

export default function PublicForm() {
  const [, params] = useRoute("/form/:formId");
  const formId = params?.formId;
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading } = useQuery<Form>({
    queryKey: [`/api/forms/${formId}`],
    enabled: !!formId,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/submissions", data);
      return res.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Success!",
        description: "Your story submission has been received. We'll be in touch soon!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const res = await apiRequest("POST", "/api/objects/upload", {});
    const { uploadURL } = await res.json();
    return {
      method: "PUT" as const,
      url: uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    if (!result.successful || result.successful.length === 0) return;
    
    const uploaded = result.successful[0];
    if (uploaded?.uploadURL) {
      // Normalize the uploadURL to get the permanent object path
      const res = await apiRequest("PUT", "/api/photos", {
        photoURL: uploaded.uploadURL,
      });
      const { objectPath } = await res.json();
      
      // Store the permanent GET path for displaying the image
      setPhotoUrls((prev) => [...prev, objectPath]);
      toast({
        title: "Photo uploaded",
        description: "Your photo has been uploaded successfully!",
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form) return;

    // Validate required fields
    const missingFields = form.fields.filter(
      (field) => field.required && !formData[field.id]?.trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill out: ${missingFields.map((f) => f.label).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Extract submitter name and email from form data using semantic IDs or fallback to numeric
    const submitterName = formData["name"] || formData["1"] || null;
    const submitterEmail = formData["email"] || formData["2"] || null;

    submitMutation.mutate({
      formId: form.id,
      projectId: form.projectId,
      submitterName,
      submitterEmail,
      data: formData,
      photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="pt-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Form Not Found</h2>
              <p className="text-muted-foreground">
                This form may have been removed or the link is incorrect.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl mx-4">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                Your success story submission has been received successfully.
              </p>
              <p className="text-sm text-muted-foreground">
                We'll process your story and create professional content across all channels.
                You'll receive a notification when your package is ready.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          {form.description && (
            <CardDescription>{form.description}</CardDescription>
          )}
          <div className="pt-2">
            <div className="text-xs text-muted-foreground">
              Story Type: {form.storyType}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    data-testid={`input-${field.id}`}
                    placeholder={field.placeholder || ""}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    required={field.required}
                    rows={5}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={formData[field.id] || ""}
                    onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
                    required={field.required}
                  >
                    <SelectTrigger id={field.id} data-testid={`select-${field.id}`}>
                      <SelectValue placeholder={field.placeholder || "Select an option"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.id}
                    data-testid={`input-${field.id}`}
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="space-y-3 pt-2 border-t">
              <Label>Photos (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                Upload photos to include in your success story
              </p>
              
              <ObjectUploader
                maxNumberOfFiles={5}
                maxFileSize={10485760}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonVariant="outline"
              >
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Photos</span>
                </div>
              </ObjectUploader>

              {photoUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Photos ({photoUrls.length})</p>
                  <div className="grid grid-cols-2 gap-2">
                    {photoUrls.map((url, index) => (
                      <div 
                        key={index} 
                        className="relative group rounded-md border overflow-hidden"
                        data-testid={`photo-preview-${index}`}
                      >
                        <img 
                          src={url} 
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                          data-testid={`button-remove-photo-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={submitMutation.isPending}
                data-testid="button-submit-form"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Story"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
