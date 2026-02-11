import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <div>
          <p className="text-2xl font-bold text-foreground mb-2">
            الصفحة غير موجودة
          </p>
          <p className="text-muted-foreground">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
        </div>
        <Link to="/">
          <Button variant="default" size="lg">
            <Home className="h-5 w-5" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
