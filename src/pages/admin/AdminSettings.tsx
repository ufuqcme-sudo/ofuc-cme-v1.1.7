import { useEffect, useState } from "react";
import { Save, Loader2, Phone, Mail, Clock, DollarSign, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface SettingRow {
  id: string;
  key: string;
  value: string;
  label: string | null;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Account fields
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    fetchSettings();
    fetchAdminEmail();
  }, []);

  const fetchAdminEmail = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setAdminEmail(user.email || "");
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setSettings(data || []);

      const values: Record<string, string> = {};
      data?.forEach((s: SettingRow) => {
        values[s.key] = s.value;
      });
      setFormValues(values);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const setting of settings) {
        const newValue = formValues[setting.key];
        if (newValue !== setting.value) {
          const { error } = await supabase
            .from("settings")
            .update({ value: newValue })
            .eq("key", setting.key);

          if (error) throw error;
        }
      }

      toast({
        title: "تم الحفظ",
        description: "تم تحديث الإعدادات بنجاح",
      });

      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) return;
    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      toast({
        title: "تم التحديث",
        description: "تم تغيير البريد الإلكتروني بنجاح",
      });
      setAdminEmail(newEmail.trim());
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل تحديث البريد الإلكتروني",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: "تم التحديث",
        description: "تم تغيير كلمة المرور بنجاح",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل تحديث كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getIcon = (key: string) => {
    if (key.includes("hour")) return Clock;
    if (key.includes("price")) return DollarSign;
    if (key.includes("phone") || key.includes("whatsapp")) return Phone;
    if (key.includes("email")) return Mail;
    return Clock;
  };

  const getInputType = (key: string) => {
    if (key.includes("hour") || key.includes("price")) return "number";
    if (key.includes("email")) return "email";
    return "text";
  };

  const customHoursSettings = settings.filter(
    (s) => s.key.startsWith("custom_")
  );
  const contactSettings = settings.filter(
    (s) =>
      s.key === "whatsapp_number" ||
      s.key === "phone_number" ||
      s.key === "email"
  );

  if (isLoading) {
    return (
      <AdminLayout title="الإعدادات" subtitle="إعدادات الموقع العامة">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="الإعدادات" subtitle="إعدادات الموقع العامة">
      <div className="grid gap-6 max-w-2xl">
        {/* Admin Account Settings */}
        <Card className="border-[hsl(180,55%,40%)/0.3]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-[hsl(180,55%,45%)]" />
              حساب المسؤول
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Email */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-[hsl(220,15%,70%)]">
                البريد الإلكتروني الحالي
              </Label>
              <p className="text-sm text-[hsl(220,15%,50%)] bg-[hsl(220,15%,13%)] rounded-md px-3 py-2 dir-ltr text-left">
                {adminEmail}
              </p>
              <Label className="text-sm font-medium">البريد الإلكتروني الجديد</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="البريد الجديد"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  dir="ltr"
                  className="text-left"
                />
                <Button
                  onClick={handleUpdateEmail}
                  disabled={isUpdatingEmail || !newEmail.trim()}
                  size="sm"
                  className="shrink-0"
                >
                  {isUpdatingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "تحديث"}
                </Button>
              </div>
            </div>

            <hr className="border-[hsl(220,15%,18%)]" />

            {/* Change Password */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">كلمة المرور الجديدة</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="كلمة المرور الجديدة (6 أحرف على الأقل)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  dir="ltr"
                  className="text-left pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Label className="text-sm font-medium">تأكيد كلمة المرور</Label>
              <Input
                type="password"
                placeholder="أعد كتابة كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                dir="ltr"
                className="text-left"
              />

              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                size="sm"
                className="w-full"
              >
                {isUpdatingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    تغيير كلمة المرور
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Package Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              إعدادات الباقة المخصصة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customHoursSettings.map((setting) => {
              const Icon = getIcon(setting.key);
              return (
                <div key={setting.key} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {setting.label || setting.key}
                  </Label>
                  <Input
                    type={getInputType(setting.key)}
                    value={formValues[setting.key] || ""}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [setting.key]: e.target.value,
                      }))
                    }
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              بيانات التواصل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactSettings.map((setting) => {
              const Icon = getIcon(setting.key);
              return (
                <div key={setting.key} className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {setting.label || setting.key}
                  </Label>
                  <Input
                    type={getInputType(setting.key)}
                    value={formValues[setting.key] || ""}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        [setting.key]: e.target.value,
                      }))
                    }
                    dir="ltr"
                    className="text-left"
                  />
                  {setting.key === "whatsapp_number" && (
                    <p className="text-xs text-muted-foreground">
                      أدخل الرقم بالصيغة الدولية بدون + (مثال: 966500000000)
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          حفظ الإعدادات
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
