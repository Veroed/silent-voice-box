import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "./AdminDashboard";

interface CreateGroupProps {
  onBack: () => void;
}

const CreateGroup = ({ onBack }: CreateGroupProps) => {
  const [companyName, setCompanyName] = useState("");
  const [groupCreated, setGroupCreated] = useState(false);
  const [groupCode, setGroupCode] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGroup = () => {
    if (!companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name to continue.",
        variant: "destructive",
      });
      return;
    }

    const newGroupCode = generateCode();
    const newAdminKey = `ADMIN-${generateCode()}-${generateCode()}`;
    
    // In a real app, this would save to database
    localStorage.setItem(`group_${newGroupCode}`, JSON.stringify({
      companyName,
      adminKey: newAdminKey,
      messages: [],
      createdAt: new Date().toISOString()
    }));

    setGroupCode(newGroupCode);
    setAdminKey(newAdminKey);
    setGroupCreated(true);

    toast({
      title: "Group created successfully!",
      description: "Share the group code with your team members.",
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
  };

  if (showDashboard) {
    return <AdminDashboard groupCode={groupCode} adminKey={adminKey} onBack={() => setShowDashboard(false)} />;
  }

  if (groupCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-secure">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-trust rounded-full mb-4 mx-auto">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-foreground">Group Created!</CardTitle>
            <CardDescription>
              Your anonymous feedback group for <strong>{companyName}</strong> is ready.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-code">Group Code (Share with team)</Label>
              <div className="flex gap-2">
                <Input
                  id="group-code"
                  value={groupCode}
                  readOnly
                  className="font-mono text-center text-lg bg-trust/5"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(groupCode, "Group code")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-key">Admin Key (Keep private!)</Label>
              <div className="flex gap-2">
                <Input
                  id="admin-key"
                  value={adminKey}
                  readOnly
                  className="font-mono text-xs bg-secure/5"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(adminKey, "Admin key")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Save this key securely - you'll need it to view messages.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setShowDashboard(true)}
                className="flex-1 bg-gradient-trust hover:opacity-90"
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-secure">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="w-fit mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl text-center">Create Your Group</CardTitle>
          <CardDescription className="text-center">
            Set up anonymous feedback for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="company">Company/Team Name</Label>
            <Input
              id="company"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreateGroup}
            className="w-full bg-gradient-trust hover:opacity-90"
            size="lg"
          >
            Create Anonymous Group
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>You'll receive:</p>
            <ul className="mt-2 space-y-1">
              <li>• A <strong>group code</strong> to share with your team</li>
              <li>• An <strong>admin key</strong> to view all messages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGroup;