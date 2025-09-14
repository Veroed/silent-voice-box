import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Shield, CheckCircle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserNickname } from "@/lib/nickname-utils";
import { supabase } from "@/integrations/supabase/client";

interface MessageFormProps {
  groupCode: string;
  companyName: string;
  groupId: string;
  onBack: () => void;
}

const MessageForm = ({ groupCode, companyName, groupId, onBack }: MessageFormProps) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messagesSent, setMessagesSent] = useState(0);
  const [userNickname, setUserNickname] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const initNickname = async () => {
      const nickname = await getUserNickname();
      setUserNickname(nickname);
    };
    initNickname();
  }, []);

  const handleSubmitMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your message before sending.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save message to Supabase
      const { error } = await supabase
        .from('messages')
        .insert({
          group_id: groupId,
          content: message.trim(),
          nickname: userNickname,
          ip_hash: 'anonymous' // We don't store actual IPs for privacy
        });

      if (error) throw error;

      toast({
        title: "Message sent anonymously!",
        description: "Your feedback has been delivered to the group admin.",
      });

      setMessage("");
      setMessagesSent(messagesSent + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group Selection
        </Button>

        <Card className="shadow-secure mb-6">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-secure rounded-full mb-4 mx-auto">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">Anonymous Feedback</CardTitle>
            <CardDescription className="text-base">
              Share your thoughts with <strong>{companyName}</strong> anonymously
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {userNickname && (
              <div className="bg-accent/30 border border-accent/50 rounded-lg p-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-muted-foreground">Posting as:</span>
                  <span className="ml-2 font-medium text-foreground">{userNickname}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This nickname is automatically generated from your device and stays the same for all your messages.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Your Anonymous Message
              </label>
              <Textarea
                id="message"
                placeholder="Share what's on your mind... concerns, suggestions, feedback, or anything you feel needs to be heard but can't say openly."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-32 resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Completely anonymous - no way to trace back to you</span>
                <span>{message.length}/1000</span>
              </div>
            </div>

            <Button
              onClick={handleSubmitMessage}
              disabled={isSubmitting || !message.trim()}
              className="w-full bg-gradient-secure hover:opacity-90"
              size="lg"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Anonymous Message
                </>
              )}
            </Button>

            {messagesSent > 0 && (
              <div className="bg-trust/10 border border-trust/20 rounded-lg p-4 text-center">
                <CheckCircle className="h-6 w-6 text-trust mx-auto mb-2" />
                <p className="text-sm font-medium text-trust">
                  {messagesSent === 1 
                    ? "Message sent successfully!" 
                    : `${messagesSent} messages sent successfully!`
                  }
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Feel free to send another message anytime.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-accent/30 border-0">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-trust" />
              Privacy Guarantee
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">What we DON'T collect:</p>
                <ul className="space-y-1">
                  <li>• Your name or email</li>
                  <li>• IP address or location</li>
                  <li>• Device information</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">How it works:</p>
                <ul className="space-y-1">
                  <li>• Messages are stored without identifiers</li>
                  <li>• Only the group admin can see them</li>
                  <li>• No way to trace messages back to you</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageForm;