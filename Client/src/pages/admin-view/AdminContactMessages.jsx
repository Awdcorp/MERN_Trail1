import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({});
  const [tab, setTab] = useState("messages");
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/contact-messages`, {
        withCredentials: true,
      });
      setMessages(res.data.data);
    } catch (err) {
      toast({ title: "Failed to load messages", variant: "destructive" });
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        withCredentials: true,
      });
      setSettings(res.data.contactForm || {});
    } catch (err) {
      toast({ title: "Failed to load settings", variant: "destructive" });
    }
  };

  const handleMarkAsRead = async (id) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/contact-messages/${id}/read`, {}, {
      withCredentials: true,
    });
    fetchMessages();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/contact-messages/${id}`, {
      withCredentials: true,
    });
    fetchMessages();
  };

  const saveSettings = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/settings`,
        { contactForm: settings },
        { withCredentials: true }
      );
      toast({ title: "Settings saved" });
    } catch (err) {
      toast({ title: "Failed to save settings", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchSettings();
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
return (
  <div className="p-6 flex justify-center">
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Contact Form</h2>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Form Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="space-y-4 mb-8">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="border rounded-md p-4 flex justify-between items-start bg-white shadow-sm"
              >
                <div>
                  <p className="text-sm text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</p>
                  <p className="font-semibold">{msg.name} ({msg.email})</p>
                  <p className="mt-1 text-sm">{msg.message}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  {!msg.read && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(msg._id)}>
                      Mark as Read
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(msg._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {messages.length === 0 && <p className="text-muted-foreground">No messages received yet.</p>}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6 max-w-4xl w-full space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Send Email on Submission</label>
              <Switch
                checked={settings.sendEmail || false}
                onCheckedChange={(val) => updateSetting("sendEmail", val)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Notification Email</label>
              <Input
                value={settings.notificationEmail || ""}
                onChange={(e) => updateSetting("notificationEmail", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Auto-reply Message</label>
              <Textarea
                value={settings.autoReplyText || ""}
                onChange={(e) => updateSetting("autoReplyText", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Success Text on UI</label>
              <Textarea
                value={settings.successText || ""}
                onChange={(e) => updateSetting("successText", e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable CAPTCHA</label>
              <Switch
                checked={settings.enableCaptcha || false}
                onCheckedChange={(val) => updateSetting("enableCaptcha", val)}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={saveSettings}>Save Settings</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

}
