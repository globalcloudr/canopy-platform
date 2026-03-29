import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

const storyTypes = [
  { value: "overview", label: "Overview: History/Current/Future" },
  { value: "esl", label: "ESL Student Story" },
  { value: "hsd-ged", label: "HSD/GED Student Story" },
  { value: "cte", label: "CTE Student Story" },
  { value: "employer", label: "Employer Story" },
  { value: "staff", label: "Staff/Teacher Story" },
  { value: "partner", label: "Partner Story" },
];

interface SourceFormData {
  storyType: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  background: string;
  interviewApproval: string;
  photoApproval: string;
}

export default function SourceForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState<SourceFormData>({
    storyType: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    background: "",
    interviewApproval: "",
    photoApproval: "",
  });

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      console.log("Moving to step", step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const updateField = (field: keyof SourceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Step {step} of {totalSteps}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Story Type & Contact Information"}
            {step === 2 && "Background & Connection"}
            {step === 3 && "Approvals & Next Steps"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Select the story type and provide contact details"}
            {step === 2 && "Tell us about the source's background and expertise"}
            {step === 3 && "Confirm permissions for interview and photography"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="storyType">Story Type</Label>
                <Select
                  value={formData.storyType}
                  onValueChange={(value) => updateField("storyType", value)}
                >
                  <SelectTrigger id="storyType" data-testid="select-story-type">
                    <SelectValue placeholder="Select story type" />
                  </SelectTrigger>
                  <SelectContent>
                    {storyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Full name"
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title/Role</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Position or role"
                    data-testid="input-title"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="email@example.com"
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="City"
                    data-testid="input-city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    placeholder="State"
                    data-testid="input-state"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="background">Background & Expertise</Label>
              <Textarea
                id="background"
                value={formData.background}
                onChange={(e) => updateField("background", e.target.value)}
                placeholder="Describe their background, expertise, and connection to this story..."
                rows={6}
                data-testid="textarea-background"
              />
              <p className="text-sm text-muted-foreground">
                Include relevant experience, time at the institution, and why they're a good fit for this story.
              </p>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="interviewApproval">Interview Approval</Label>
                <Select
                  value={formData.interviewApproval}
                  onValueChange={(value) => updateField("interviewApproval", value)}
                >
                  <SelectTrigger id="interviewApproval" data-testid="select-interview-approval">
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="no">No - Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoApproval">Photo Session Approval</Label>
                <Select
                  value={formData.photoApproval}
                  onValueChange={(value) => updateField("photoApproval", value)}
                >
                  <SelectTrigger id="photoApproval" data-testid="select-photo-approval">
                    <SelectValue placeholder="Select approval status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="no">No - Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
                <p className="font-medium">Next Steps:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Reporter will contact source to schedule interview</li>
                  <li>Photographer will coordinate photo session</li>
                  <li>Media release will be provided at photo session</li>
                </ul>
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              data-testid="button-back"
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>

            <Button
              variant="outline"
              onClick={() => console.log("Saving draft:", formData)}
              data-testid="button-save-draft"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Draft
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} data-testid="button-next">
                Next
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} data-testid="button-submit">
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
