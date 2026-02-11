import { useState } from "react";
import { Sliders, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface CustomPackageBuilderProps {
  minHours: number;
  maxHours: number;
  pricePerHour: number;
  onOrder: (hours: number, specialties: string) => void;
}

const CustomPackageBuilder = ({
  minHours,
  maxHours,
  pricePerHour,
  onOrder,
}: CustomPackageBuilderProps) => {
  const [hours, setHours] = useState(minHours);
  const [specialties, setSpecialties] = useState("");

  const totalPrice = hours * pricePerHour;

  return (
    <Card className="relative overflow-hidden border-2 border-secondary shadow-gold">
      {/* Header Badge */}
      <div className="absolute top-0 left-0 right-0 gradient-gold py-2 text-center">
        <span className="text-sm font-semibold text-secondary-foreground flex items-center justify-center gap-1">
          <Sliders className="h-4 w-4" />
          صمّم باقتك بنفسك
        </span>
      </div>

      <CardHeader className="pt-14 pb-4">
        <h3 className="text-xl font-bold text-foreground">باقة مخصصة</h3>
        <p className="text-sm text-muted-foreground">
          حدد عدد الساعات والتخصصات التي تحتاجها
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Hours Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">عدد الساعات</Label>
            <span className="text-2xl font-bold text-primary">{hours}</span>
          </div>
          <Slider
            value={[hours]}
            onValueChange={(val) => setHours(val[0])}
            min={minHours}
            max={maxHours}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{minHours} ساعة</span>
            <span>{maxHours} ساعة</span>
          </div>
        </div>

        {/* Or manual input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">أو أدخل العدد يدوياً</Label>
          <Input
            type="number"
            value={hours}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                setHours(Math.max(minHours, Math.min(maxHours, val)));
              }
            }}
            min={minHours}
            max={maxHours}
            dir="ltr"
            className="text-center text-lg font-bold"
          />
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            التخصصات المطلوبة (اختياري)
          </Label>
          <Textarea
            value={specialties}
            onChange={(e) => setSpecialties(e.target.value)}
            placeholder="مثال: طب أسرة، طوارئ، باطنية..."
            rows={3}
          />
        </div>

        {/* Price Display */}
        <div className="rounded-xl bg-accent p-4 text-center space-y-1">
          <p className="text-sm text-muted-foreground">السعر التقريبي</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-foreground">
              {totalPrice.toLocaleString("ar-SA")}
            </span>
            <span className="text-lg text-muted-foreground">ر.س</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {hours} ساعة × {pricePerHour.toLocaleString("ar-SA")} ر.س
          </p>
        </div>

        {/* Order Button */}
        <Button
          variant="gold"
          className="w-full group"
          size="lg"
          onClick={() => onOrder(hours, specialties)}
        >
          اطلب الباقة المخصصة
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CustomPackageBuilder;
