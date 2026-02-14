import { useState } from "react";
import { Send, User, Phone, Stethoscope, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
// ✅ استيراد دوال WhatsApp المركزية
import { sendPackageRequest, sendCustomPackageRequest } from "@/lib/whatsapp-utils";

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whatsappNumber: string;
  packageType: "fixed" | "custom";
  packageTitle?: string;
  packagePrice?: number;
  customHours?: number;
  customSpecialties?: string;
  customPricePerHour?: number;
}

// ✅ جعل جميع الحقول إجبارية
const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "الاسم مطلوب (حرفين على الأقل)")
    .max(100, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .min(10, "رقم الهاتف غير صالح")
    .max(15, "رقم الهاتف غير صالح")
    .regex(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  specialty: z
    .string()
    .trim()
    .min(2, "التخصص مطلوب")
    .max(100, "التخصص طويل جداً"),
  licenseNumber: z
    .string()
    .trim()
    .min(1, "رقم الهيئة مطلوب") // ✅ إجباري الآن
    .max(50, "رقم الهيئة طويل جداً"),
});

const OrderForm = ({
  open,
  onOpenChange,
  whatsappNumber,
  packageType,
  packageTitle,
  packagePrice,
  customHours,
  customSpecialties,
  customPricePerHour,
}: OrderFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = formSchema.safeParse({
      name,
      phone,
      specialty,
      licenseNumber, // ✅ إرساله كما هو (مطلوب)
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // ✅ تجهيز بيانات العميل
    const customerData = {
      name,
      phone,
      specialty,
      licenseNumber, // ✅ مطلوب الآن
    };

    // ✅ إرسال الطلب مع بيانات العميل الكاملة
    if (packageType === "fixed") {
      // طلب باقة ثابتة
      sendPackageRequest(
        packageTitle || "باقة غير محددة",
        packagePrice || 0,
        whatsappNumber,
        customerData // ✅ إرسال بيانات العميل
      );
    } else {
      // طلب باقة مخصصة
      const totalPrice = (customHours || 0) * (customPricePerHour || 0);
      sendCustomPackageRequest(
        customHours || 0,
        totalPrice,
        whatsappNumber,
        customerData, // ✅ إرسال بيانات العميل
        customSpecialties // ✅ إرسال التخصصات المطلوبة
      );
    }

    toast({
      title: "تم تجهيز الطلب",
      description: "سيتم فتح واتساب لإرسال الطلب",
    });

    // Reset form
    setName("");
    setPhone("");
    setSpecialty("");
    setLicenseNumber("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            إتمام الطلب
          </DialogTitle>
        </DialogHeader>

        {/* Order Summary */}
        <div className="rounded-lg bg-accent p-4 text-sm space-y-1">
          {packageType === "fixed" ? (
            <>
              <p className="font-semibold text-foreground">{packageTitle}</p>
              {packagePrice !== undefined && (
                <p className="text-muted-foreground">
                  السعر: {packagePrice.toLocaleString("ar-SA")} ريال
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-foreground">باقة مخصصة</p>
              <p className="text-muted-foreground">
                {customHours} ساعة ×{" "}
                {(customPricePerHour || 0).toLocaleString("ar-SA")} ريال ={" "}
                {(
                  (customHours || 0) * (customPricePerHour || 0)
                ).toLocaleString("ar-SA")}{" "}
                ريال
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              الاسم الكامل *
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="د. أحمد علي"
              required
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              رقم الهاتف *
            </Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05xxxxxxxx"
              dir="ltr"
              className="text-left"
              required
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              التخصص الطبي *
            </Label>
            <Input
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="طب الأسرة"
              required
            />
            {errors.specialty && (
              <p className="text-xs text-destructive">{errors.specialty}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              رقم الهيئة *
            </Label>
            <Input
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="رقم التسجيل في الهيئة"
              dir="ltr"
              className="text-left"
              required
            />
            {errors.licenseNumber && (
              <p className="text-xs text-destructive">{errors.licenseNumber}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Send className="h-4 w-4" />
            إرسال الطلب عبر واتساب
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            سيتم فتح واتساب مع رسالة جاهزة تحتوي على تفاصيل طلبك
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;