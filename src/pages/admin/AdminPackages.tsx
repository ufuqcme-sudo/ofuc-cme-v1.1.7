import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Check, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Package {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  price: number;
  duration_months: number | null;
  features: unknown;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    title_en: "",
    description: "",
    price: 0,
    duration_months: 12,
    features: "",
    is_featured: false,
    is_active: true,
    sort_order: 0,
  });

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      
      setPackages(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الباقات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openAddDialog = () => {
    setSelectedPackage(null);
    setFormData({
      title: "",
      title_en: "",
      description: "",
      price: 0,
      duration_months: 12,
      features: "",
      is_featured: false,
      is_active: true,
      sort_order: packages.length,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    const featuresArray = Array.isArray(pkg.features) 
      ? pkg.features.map(f => String(f)) 
      : [];
    setFormData({
      title: pkg.title,
      title_en: pkg.title_en || "",
      description: pkg.description || "",
      price: pkg.price,
      duration_months: pkg.duration_months || 12,
      features: featuresArray.join("\n"),
      is_featured: pkg.is_featured,
      is_active: pkg.is_active,
      sort_order: pkg.sort_order,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الباقة",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const featuresArray = formData.features
        .split("\n")
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const packageData = {
        title: formData.title,
        title_en: formData.title_en || null,
        description: formData.description || null,
        price: formData.price,
        duration_months: formData.duration_months,
        features: featuresArray,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (selectedPackage) {
        const { error } = await supabase
          .from("packages")
          .update(packageData)
          .eq("id", selectedPackage.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث الباقة بنجاح" });
      } else {
        const { error } = await supabase
          .from("packages")
          .insert(packageData);

        if (error) throw error;
        toast({ title: "تمت الإضافة", description: "تمت إضافة الباقة بنجاح" });
      }

      setIsDialogOpen(false);
      fetchPackages();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الباقة",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPackage) return;

    try {
      const { error } = await supabase
        .from("packages")
        .delete()
        .eq("id", selectedPackage.id);

      if (error) throw error;
      
      toast({ title: "تم الحذف", description: "تم حذف الباقة بنجاح" });
      setIsDeleteDialogOpen(false);
      fetchPackages();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الباقة",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="إدارة الباقات" subtitle="إضافة وتعديل وحذف الباقات">
      <Card className="border-0 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>الباقات</CardTitle>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة باقة
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد باقات بعد. أضف باقة جديدة للبدء.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>مميزة</TableHead>
                    <TableHead>نشطة</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">
                        <div>
                          {pkg.title}
                          {pkg.is_featured && (
                            <Star className="h-4 w-4 inline-block mr-2 text-gold fill-gold" />
                          )}
                        </div>
                        {pkg.title_en && (
                          <span className="text-xs text-muted-foreground">{pkg.title_en}</span>
                        )}
                      </TableCell>
                      <TableCell>{Number(pkg.price)} ر.س</TableCell>
                      <TableCell>{pkg.duration_months} شهر</TableCell>
                      <TableCell>
                        {pkg.is_featured ? (
                          <Check className="h-5 w-5 text-primary" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        {pkg.is_active ? (
                          <Check className="h-5 w-5 text-primary" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(pkg)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(pkg)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPackage ? "تعديل الباقة" : "إضافة باقة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">اسم الباقة (عربي) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="الباقة الأساسية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">اسم الباقة (إنجليزي)</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Basic Package"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مختصر للباقة..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">السعر (ر.س)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">المدة (شهر)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_months}
                  onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) || 12 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">المميزات (سطر لكل ميزة)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="الوصول لجميع الدورات&#10;شهادات معتمدة&#10;دعم فني"
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">باقة مميزة</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">نشطة</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              {selectedPackage ? "حفظ التعديلات" : "إضافة الباقة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الباقة "{selectedPackage?.title}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminPackages;
