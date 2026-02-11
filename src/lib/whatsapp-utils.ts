/**
 * WhatsApp Helper Utilities
 * 
 * استخدام WhatsApp Click-to-Chat بدلاً من API
 * يعمل مع جميع المتصفحات بدون حظر
 */

/**
 * فتح محادثة واتساب مع رسالة مسبقة
 * @param phone - رقم الهاتف بصيغة دولية (مثال: 966500000000)
 * @param message - الرسالة المراد إرسالها
 */
export const openWhatsAppChat = (phone: string, message: string = '') => {
  // تنظيف رقم الهاتف من أي رموز
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // تشفير الرسالة
  const encodedMessage = encodeURIComponent(message);
  
  // بناء الرابط
  const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
  
  // فتح في تاب جديد
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

/**
 * إرسال رسالة طلب باقة ثابتة عبر واتساب مع بيانات العميل الكاملة
 * @param packageName - اسم الباقة
 * @param packagePrice - سعر الباقة
 * @param phone - رقم الواتساب من الإعدادات
 * @param customerData - بيانات العميل
 */
export const sendPackageRequest = (
  packageName: string,
  packagePrice: number,
  phone: string,
  customerData?: {
    name: string;
    phone: string;
    specialty: string;
    licenseNumber?: string;
  }
) => {
  let message = `*طلب جديد - منصة أُفُق*\n`;
  message += `---------------------------\n\n`;

  // بيانات العميل
  if (customerData) {
    message += `*بيانات العميل:*\n`;
    message += `- الاسم: ${customerData.name}\n`;
    message += `- الهاتف: ${customerData.phone}\n`;
    message += `- التخصص: ${customerData.specialty}\n`;
    if (customerData.licenseNumber) {
      message += `- رقم الهيئة: ${customerData.licenseNumber}\n`;
    }
    message += `\n---------------------------\n\n`;
  }

  // تفاصيل الباقة
  message += `*تفاصيل الباقة:*\n`;
  message += `- النوع: باقة ثابتة\n`;
  message += `- الباقة: ${packageName}\n`;
  message += `- السعر: ${packagePrice.toLocaleString("ar-SA")} ريال\n`;
  
  message += `\n---------------------------\n`;
  message += `تم الإرسال من موقع أُفُق`;

  openWhatsAppChat(phone, message);
};

/**
 * إرسال رسالة طلب باقة مخصصة عبر واتساب مع بيانات العميل الكاملة
 * @param hours - عدد الساعات
 * @param totalPrice - السعر الإجمالي
 * @param phone - رقم الواتساب
 * @param customerData - بيانات العميل
 * @param customSpecialties - التخصصات المطلوبة (اختياري)
 */
export const sendCustomPackageRequest = (
  hours: number,
  totalPrice: number,
  phone: string,
  customerData?: {
    name: string;
    phone: string;
    specialty: string;
    licenseNumber?: string;
  },
  customSpecialties?: string
) => {
  let message = `*طلب جديد - منصة أُفُق*\n`;
  message += `---------------------------\n\n`;

  // بيانات العميل
  if (customerData) {
    message += `*بيانات العميل:*\n`;
    message += `- الاسم: ${customerData.name}\n`;
    message += `- الهاتف: ${customerData.phone}\n`;
    message += `- التخصص: ${customerData.specialty}\n`;
    if (customerData.licenseNumber) {
      message += `- رقم الهيئة: ${customerData.licenseNumber}\n`;
    }
    message += `\n---------------------------\n\n`;
  }

  // تفاصيل الباقة المخصصة
  message += `*تفاصيل الباقة المخصصة:*\n`;
  message += `- النوع: باقة مخصصة\n`;
  message += `- عدد الساعات: ${hours} ساعة\n`;
  if (customSpecialties) {
    message += `- التخصصات المطلوبة: ${customSpecialties}\n`;
  }
  message += `- السعر التقريبي: ${totalPrice.toLocaleString("ar-SA")} ريال\n`;

  message += `\n---------------------------\n`;
  message += `تم الإرسال من موقع أُفُق`;

  openWhatsAppChat(phone, message);
};

/**
 * إرسال رسالة استفسار عامة
 * @param name - اسم المستخدم
 * @param email - البريد الإلكتروني
 * @param message - نص الرسالة
 * @param phone - رقم الواتساب
 */
export const sendContactMessage = (
  name: string,
  email: string,
  message: string,
  phone: string
) => {
  const whatsappMessage = `مرحبا
الاسم: ${name}
البريد: ${email}

الرسالة:
${message}`;

  openWhatsAppChat(phone, whatsappMessage);
};

/**
 * التحقق من صحة رقم الهاتف
 * @param phone - رقم الهاتف
 * @returns boolean
 */
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};
