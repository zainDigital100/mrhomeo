import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, LogOut, User } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const updates: Partial<Profile> = {
      full_name: formData.full_name || null,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      phone: formData.phone || null,
    };

    const { error } = await updateProfile(updates);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      });
      onOpenChange(false);
    }
    
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Settings
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Email</Label>
              <Input
                value={user?.email || ""}
                disabled
                className="bg-muted/50"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                }
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                min={1}
                max={150}
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button onClick={handleSave} disabled={isSaving} className="w-full">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
