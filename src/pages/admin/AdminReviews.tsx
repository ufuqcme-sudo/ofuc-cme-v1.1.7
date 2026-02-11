import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Loader2, Check, X, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";

interface Review {
  id: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setReviews(data || []);
    } catch {
      toast({ title: "خطأ", description: "فشل في تحميل الآراء", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("reviews")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("reviews")
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase
          .from("reviews")
          .insert({
            image_url: urlData.publicUrl,
            sort_order: reviews.length,
          });

        if (insertError) throw insertError;
      }

      toast({ title: "تم الرفع", description: `تم رفع ${files.length} صورة بنجاح` });
      fetchReviews();
    } catch {
      toast({ title: "خطأ", description: "فشل في رفع الصورة", variant: "destructive" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleActive = async (review: Review) => {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ is_active: !review.is_active })
        .eq("id", review.id);

      if (error) throw error;
      fetchReviews();
    } catch {
      toast({ title: "خطأ", description: "فشل في تحديث الحالة", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    try {
      // Extract file name from URL
      const urlParts = selectedReview.image_url.split("/");
      const fileName = urlParts[urlParts.length - 1];

      await supabase.storage.from("reviews").remove([fileName]);

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", selectedReview.id);

      if (error) throw error;

      toast({ title: "تم الحذف", description: "تم حذف الرأي بنجاح" });
      setIsDeleteDialogOpen(false);
      fetchReviews();
    } catch {
      toast({ title: "خطأ", description: "فشل في الحذف", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="آراء العملاء" subtitle="إدارة سكرين شوتات آراء العملاء">
      <Card className="border-0 shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>الآراء</CardTitle>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 ml-2" />
              )}
              رفع صور
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-3">
              <Image className="h-12 w-12 mx-auto opacity-40" />
              <p>لا توجد آراء بعد. ارفع سكرين شوتات واتساب للبدء.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={`relative rounded-xl overflow-hidden border transition-opacity ${
                    review.is_active
                      ? "border-border"
                      : "border-border opacity-50"
                  }`}
                >
                  <img
                    src={review.image_url}
                    alt="رأي عميل"
                    className="w-full h-auto object-contain bg-muted"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={review.is_active}
                        onCheckedChange={() => toggleActive(review)}
                      />
                      <span className="text-xs text-white">
                        {review.is_active ? "نشط" : "مخفي"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-red-400 hover:bg-red-500/20 h-8 w-8"
                      onClick={() => {
                        setSelectedReview(review);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا الرأي نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminReviews;
