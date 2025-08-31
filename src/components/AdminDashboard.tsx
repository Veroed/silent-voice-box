import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, MessageSquare, Users, Calendar, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  nickname?: string;
  anonymous: boolean;
}

interface AdminDashboardProps {
  groupCode?: string;
  adminKey?: string;
  onBack: () => void;
}

const AdminDashboard = ({ groupCode: initialGroupCode, adminKey: initialAdminKey, onBack }: AdminDashboardProps) => {
  const [groupCode, setGroupCode] = useState(initialGroupCode || "");
  const [adminKey, setAdminKey] = useState(initialAdminKey || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialGroupCode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupData, setGroupData] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const { toast } = useToast();

  const loadMessages = () => {
    if (!groupCode) return;
    
    const storedGroup = localStorage.getItem(`group_${groupCode.toUpperCase()}`);
    if (storedGroup) {
      const data = JSON.parse(storedGroup);
      setGroupData(data);
      setMessages(data.messages || []);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadMessages();
      // Refresh messages every 5 seconds
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, groupCode]);

  const handleAdminLogin = () => {
    if (!groupCode.trim() || !adminKey.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both group code and admin key.",
        variant: "destructive",
      });
      return;
    }

    const storedGroup = localStorage.getItem(`group_${groupCode.toUpperCase()}`);
    
    if (!storedGroup) {
      toast({
        title: "Group not found",
        description: "Invalid group code.",
        variant: "destructive",
      });
      return;
    }

    const data = JSON.parse(storedGroup);
    
    if (data.adminKey !== adminKey) {
      toast({
        title: "Access denied",
        description: "Invalid admin key.",
        variant: "destructive",
      });
      return;
    }

    setIsAuthenticated(true);
    setGroupData(data);
    setMessages(data.messages || []);
    
    toast({
      title: "Access granted",
      description: `Welcome to ${data.companyName}'s admin dashboard.`,
    });
  };

  const deleteMessage = (messageId: string) => {
    if (!groupCode) return;

    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    const updatedGroupData = { ...groupData, messages: updatedMessages };
    
    localStorage.setItem(`group_${groupCode.toUpperCase()}`, JSON.stringify(updatedGroupData));
    setMessages(updatedMessages);
    setGroupData(updatedGroupData);
    setSelectedMessage(null);
    
    toast({
      title: "Message deleted",
      description: "The message has been removed.",
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isAuthenticated) {
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
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to view anonymous messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="group-code">Group Code</Label>
              <Input
                id="group-code"
                placeholder="Enter group code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="font-mono text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-key">Admin Key</Label>
              <Input
                id="admin-key"
                type="password"
                placeholder="Enter admin key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="font-mono"
              />
            </div>

            <Button
              onClick={handleAdminLogin}
              className="w-full bg-gradient-trust hover:opacity-90"
              size="lg"
            >
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {groupData?.companyName} - Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Viewing anonymous feedback for group <span className="font-mono bg-accent/50 px-2 py-1 rounded">{groupCode}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-trust" />
                <div>
                  <p className="text-2xl font-bold">{messages.length}</p>
                  <p className="text-sm text-muted-foreground">Total Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-secure" />
                <div>
                  <p className="text-2xl font-bold">{groupCode}</p>
                  <p className="text-sm text-muted-foreground">Group Code</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {groupData?.createdAt ? formatDate(groupData.createdAt).split(',')[0] : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Created</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Anonymous Messages
            </CardTitle>
            <CardDescription>
              All messages are completely anonymous and cannot be traced back to individuals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  Share your group code <span className="font-mono bg-accent/50 px-1 rounded">{groupCode}</span> with your team to start receiving feedback.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded">
                            {message.nickname || 'Anonymous'} • {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMessage(message.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {message.content.length > 200 
                          ? `${message.content.substring(0, 200)}...`
                          : message.content
                        }
                      </p>
                      {message.content.length > 200 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto mt-2"
                          onClick={() => setSelectedMessage(message)}
                        >
                          Read full message
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMessage.nickname || 'Anonymous'} Message</CardTitle>
                    <CardDescription>{formatDate(selectedMessage.timestamp)}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMessage(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedMessage(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteMessage(selectedMessage.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;