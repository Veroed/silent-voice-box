import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MessageForm from "./MessageForm";

interface JoinGroupProps {
  onBack: () => void;
}

const JoinGroup = ({ onBack }: JoinGroupProps) => {
  const [groupCode, setGroupCode] = useState("");
  const [groupJoined, setGroupJoined] = useState(false);
  const [groupData, setGroupData] = useState<any>(null);
  const { toast } = useToast();

  const handleJoinGroup = () => {
    if (!groupCode.trim()) {
      toast({
        title: "Group code required",
        description: "Please enter a valid group code.",
        variant: "destructive",
      });
      return;
    }

    // Check if group exists in localStorage
    const storedGroup = localStorage.getItem(`group_${groupCode.toUpperCase()}`);
    
    if (!storedGroup) {
      toast({
        title: "Group not found",
        description: "Invalid group code. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    const groupInfo = JSON.parse(storedGroup);
    setGroupData(groupInfo);
    setGroupJoined(true);

    toast({
      title: "Successfully joined!",
      description: `Welcome to ${groupInfo.companyName}'s feedback group.`,
    });
  };

  if (groupJoined && groupData) {
    return (
      <MessageForm 
        groupCode={groupCode.toUpperCase()} 
        companyName={groupData.companyName} 
        onBack={() => setGroupJoined(false)} 
      />
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
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-secure rounded-full mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Join Anonymous Group</CardTitle>
            <CardDescription>
              Enter your group code to share feedback anonymously
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Group Code</Label>
            <Input
              id="code"
              placeholder="Enter 6-character code"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              className="text-center font-mono text-lg"
              maxLength={6}
            />
          </div>

          <Button
            onClick={handleJoinGroup}
            className="w-full bg-gradient-secure hover:opacity-90"
            size="lg"
          >
            Join Group Anonymously
          </Button>

          <div className="bg-accent/50 p-4 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-trust" />
              Your Privacy is Protected
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• No personal information collected</li>
              <li>• Messages cannot be traced back to you</li>
              <li>• Complete anonymity guaranteed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinGroup;