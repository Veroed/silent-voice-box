import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, MessageSquare, Lock } from "lucide-react";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";

const LandingPage = () => {
  const [mode, setMode] = useState<"landing" | "create" | "join">("landing");

  if (mode === "create") {
    return <CreateGroup onBack={() => setMode("landing")} />;
  }

  if (mode === "join") {
    return <JoinGroup onBack={() => setMode("landing")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-trust rounded-full mb-6 shadow-secure">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Anonymous Feedback
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A secure platform for employees to share honest feedback anonymously. 
            Speak up about what matters without fear.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-secure/20">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center p-2 bg-trust/10 rounded-full mb-4">
                <Users className="h-6 w-6 text-trust" />
              </div>
              <CardTitle className="text-2xl">Create a Group</CardTitle>
              <CardDescription className="text-base">
                Set up anonymous feedback for your team or company
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="w-full bg-gradient-trust hover:opacity-90 transition-all duration-300"
                onClick={() => setMode("create")}
              >
                Create Group
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-secure/20">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center p-2 bg-secure/10 rounded-full mb-4">
                <MessageSquare className="h-6 w-6 text-secure" />
              </div>
              <CardTitle className="text-2xl">Join a Group</CardTitle>
              <CardDescription className="text-base">
                Share your thoughts anonymously with your group code
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-secure text-secure hover:bg-secure hover:text-secure-foreground transition-all duration-300"
                onClick={() => setMode("join")}
              >
                Join Group
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
          <div className="space-y-3">
            <Lock className="h-8 w-8 mx-auto text-trust" />
            <h3 className="font-semibold text-foreground">Completely Anonymous</h3>
            <p className="text-sm text-muted-foreground">No tracking, no identification. Your identity stays private.</p>
          </div>
          <div className="space-y-3">
            <Shield className="h-8 w-8 mx-auto text-trust" />
            <h3 className="font-semibold text-foreground">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">End-to-end security ensures your messages are protected.</p>
          </div>
          <div className="space-y-3">
            <MessageSquare className="h-8 w-8 mx-auto text-trust" />
            <h3 className="font-semibold text-foreground">Open Communication</h3>
            <p className="text-sm text-muted-foreground">Say what needs to be said without fear of retaliation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;