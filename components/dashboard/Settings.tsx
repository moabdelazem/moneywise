"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, DollarSign, Bell } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SettingsProps {
  initialSettings: {
    name: string;
    email: string;
    currency: string;
    emailNotifications: boolean;
  };
}

export function Settings({ initialSettings }: SettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/settings/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
      // Redirect or perform additional actions after account deletion
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAccount = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/user/settings/account/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to reset account");

      toast({
        title: "Success",
        description: "Account reset successfully",
      });
      // Redirect or perform additional actions after account reset
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-4xl mx-auto"
    >
      <Card className="relative border border-border shadow-md">
        <CardHeader className="space-y-1 pb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CardTitle className="text-3xl font-bold text-foreground">
              User Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Customize your account preferences and settings
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-xl font-semibold text-foreground">
                Personal Information
              </h3>
            </div>
            <div className="grid gap-6 pl-4">
              <div className="group space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Name
                </Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="transition-all"
                />
              </div>

              <div className="group space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="transition-all"
                />
              </div>
            </div>
          </motion.div>

          <Separator />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h3 className="text-xl font-semibold text-foreground">
                Preferences
              </h3>
            </div>
            <div className="grid gap-6 pl-4">
              <div className="group space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Currency
                </Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="EGP">EGP (E£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-card rounded-lg border-border border">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="notifications"
                    className="flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4 text-primary" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-red-600 rounded-full" />
              <h3 className="text-xl font-semibold text-red-600">
                Danger Zone
              </h3>
            </div>
            <div className="grid gap-6 pl-4">
              <div className="flex items-center justify-between gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 h-12 border-red-600 text-red-600"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Deleting Account...
                        </>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </DialogDescription>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsLoading(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Separator orientation="vertical" className="h-12" />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 h-12 border-secondary text-secondary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Resetting Account...
                        </>
                      ) : (
                        "Reset Account"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Confirm Reset</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to reset your account? This action
                      will remove all your data.
                    </DialogDescription>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsLoading(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleResetAccount}
                      >
                        Reset
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
