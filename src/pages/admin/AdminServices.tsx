import { useState, useEffect, ComponentType, SVGProps } from "react";
import { 
  Plus, Pencil, Trash2, Loader2, Check, X,
  BookOpen, GraduationCap, Award, Users, RefreshCw,
  Star, Heart, Shield, Zap, Target, Clock, Calendar,
  FileText, Video, Headphones, MessageSquare, Globe
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Service {
  id: string;
  title: string;
  title_en: string | null;
  description: string | null;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

const iconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  BookOpen, GraduationCap, Award, Users, RefreshCw,
  Star, Heart, Shield, Zap, Target, Clock, Calendar,
  FileText, Video, Headphones, MessageSquare, Globe
};

const availableIcons = Object.keys(iconMap);

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    title_en: "",
    description: "",
    icon: "BookOpen",
    is_active: true,
    sort_order: 0,
  });

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الخدمات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const openAddDialog = () => {
    setSelectedService(null);
    setFormData({
      title: "",
      title_en: "",
      description: "",
      icon: "BookOpen",
      is_active: true,
      sort_order: services.length,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (service: Service) => {
    setSelectedService(service);
    setFormData({
      title: service.title,
      title_en: service.title_en || "",
      description: service.description || "",
      icon: service.icon || "BookOpen",
      is_active: service.is_active,
      sort_order: service.sort_order,
    });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال اسم الخدمة",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const serviceData = {
        title: formData.title,
        title_en: formData.title_en || null,
        description: formData.description || null,
        icon: formData.icon,
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      };

      if (selectedService) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", selectedService.id);

        if (error) throw error;
        toast({ title: "تم التحديث", description: "تم تحديث الخدمة بنجاح" });
      } else {
        const { error } = await supabase
          .from("services")
          .insert(serviceData);

        if (error) throw error;
        toast({ title: "تمت الإضافة", description: "تمت إضافة الخدمة بنجاح" });
      }

      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الخدمة",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", selectedService.id);

      if (error) throw error;
      
      toast({ title: "تم الحذف", description: "تم حذف الخدمة بنجاح" });
      setIsDeleteDialogOpen(false);
      fetchServices();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الخدمة",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="إدارة الخدمات" subtitle="إضافة وتعديل وحذف الخدمات">
      <Card className="border-0 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>الخدمات</CardTitle>
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 ml-2" />
            إضافة خدمة
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد خدمات بعد. أضف خدمة جديدة للبدء.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الأيقونة</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>نشطة</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center text-primary">
                          {getIcon(service.icon)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{service.title}</div>
                        {service.title_en && (
                          <span className="text-xs text-muted-foreground">{service.title_en}</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {service.description || "-"}
                      </TableCell>
                      <TableCell>
                        {service.is_active ? (
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
                            onClick={() => openEditDialog(service)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(service)}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">اسم الخدمة (عربي) *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="دورات تعليمية"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">اسم الخدمة (إنجليزي)</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Educational Courses"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف مختصر للخدمة..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>الأيقونة</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {getIcon(formData.icon)}
                      <span>{formData.icon}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      <div className="flex items-center gap-2">
                        {getIcon(iconName)}
                        <span>{iconName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
              {selectedService ? "حفظ التعديلات" : "إضافة الخدمة"}
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
              سيتم حذف الخدمة "{selectedService?.title}" نهائياً. لا يمكن التراجع عن هذا الإجراء.
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

export default AdminServices;
