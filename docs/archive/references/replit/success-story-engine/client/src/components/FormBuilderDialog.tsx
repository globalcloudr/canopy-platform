import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formTemplates, formTemplateOptions, type FormTemplateKey } from "@shared/formTemplates";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export default function FormBuilderDialog({ open, onOpenChange, projectId }: FormBuilderDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [storyType, setStoryType] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", type: "text", label: "Student/Subject Name", placeholder: "Full name", required: true },
    { id: "2", type: "email", label: "Contact Email", placeholder: "email@example.com", required: true },
  ]);

  const loadTemplate = (templateKey: string) => {
    if (templateKey === "custom" || !templateKey) {
      setTitle("");
      setDescription("");
      setStoryType("");
      setFields([
        { id: "1", type: "text", label: "Student/Subject Name", placeholder: "Full name", required: true },
        { id: "2", type: "email", label: "Contact Email", placeholder: "email@example.com", required: true },
      ]);
      return;
    }

    const template = formTemplates[templateKey as FormTemplateKey];
    if (template) {
      setTitle(template.title);
      setDescription(template.description);
      setStoryType(template.storyType);
      setFields(template.fields.map((field, index) => ({
        ...field,
        id: String(index + 1),
      })));
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate);
    }
  }, [selectedTemplate]);

  const createFormMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/forms", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Form created",
        description: "Your form template has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/forms?projectId=${projectId}`] });
      resetForm();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create form. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedTemplate("");
    setTitle("");
    setDescription("");
    setStoryType("");
    setFields([
      { id: "1", type: "text", label: "Student/Subject Name", placeholder: "Full name", required: true },
      { id: "2", type: "email", label: "Contact Email", placeholder: "email@example.com", required: true },
    ]);
  };

  const addField = () => {
    const newField: FormField = {
      id: String(Date.now()),
      type: "text",
      label: "",
      placeholder: "",
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)));
  };

  const handleSubmit = () => {
    if (!title || !storyType) {
      toast({
        title: "Missing fields",
        description: "Please provide a title and story type.",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyLabels = fields.some((field) => !field.label.trim());
    if (hasEmptyLabels) {
      toast({
        title: "Invalid fields",
        description: "All fields must have a label.",
        variant: "destructive",
      });
      return;
    }

    createFormMutation.mutate({
      projectId,
      title,
      description: description || null,
      storyType,
      fields,
      isActive: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Form Template</DialogTitle>
          <DialogDescription>
            Choose a pre-built template or design a custom form for clients to submit success story information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="template-select">Start with a Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger id="template-select" data-testid="select-template">
                <SelectValue placeholder="Choose a template or start from scratch" />
              </SelectTrigger>
              <SelectContent>
                {formTemplateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              data-testid="input-form-title"
              placeholder="e.g., ESL Student Success Form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form-description">Description (Optional)</Label>
            <Textarea
              id="form-description"
              data-testid="input-form-description"
              placeholder="Brief description of what this form is for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-type">Story Type</Label>
            <Select value={storyType} onValueChange={setStoryType}>
              <SelectTrigger id="story-type" data-testid="select-story-type">
                <SelectValue placeholder="Select story type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESL">ESL</SelectItem>
                <SelectItem value="HSD/GED">HSD/GED</SelectItem>
                <SelectItem value="CTE">CTE (Career Technical Education)</SelectItem>
                <SelectItem value="Employer">Employer Partnership</SelectItem>
                <SelectItem value="Faculty">Faculty/Staff</SelectItem>
                <SelectItem value="Transition">Transition Story</SelectItem>
                <SelectItem value="Overview">Program Overview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Form Fields</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addField}
                data-testid="button-add-field"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground mt-2 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Field Type</Label>
                            <Select
                              value={field.type}
                              onValueChange={(value) => updateField(field.id, { type: value })}
                            >
                              <SelectTrigger data-testid={`select-field-type-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="tel">Phone</SelectItem>
                                <SelectItem value="textarea">Long Text</SelectItem>
                                <SelectItem value="select">Dropdown</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Label</Label>
                            <Input
                              data-testid={`input-field-label-${index}`}
                              placeholder="Field label"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Placeholder (Optional)</Label>
                          <Input
                            data-testid={`input-field-placeholder-${index}`}
                            placeholder="Placeholder text..."
                            value={field.placeholder || ""}
                            onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                          />
                        </div>

                        {field.type === "select" && (
                          <div className="space-y-1">
                            <Label className="text-xs">Options (comma-separated)</Label>
                            <Input
                              data-testid={`input-field-options-${index}`}
                              placeholder="Option 1, Option 2, Option 3"
                              value={field.options?.join(", ") || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  options: e.target.value.split(",").map((opt) => opt.trim()).filter(Boolean),
                                })
                              }
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`required-${field.id}`}
                            data-testid={`checkbox-required-${index}`}
                            checked={field.required}
                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                            className="rounded border-input"
                          />
                          <Label htmlFor={`required-${field.id}`} className="text-xs">
                            Required field
                          </Label>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(field.id)}
                        data-testid={`button-remove-field-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-form"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createFormMutation.isPending}
            data-testid="button-save-form"
          >
            {createFormMutation.isPending ? "Creating..." : "Create Form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
