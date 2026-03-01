"use client";

import { Navbar } from "@/components/Navbar";
import { useT, useLang } from "@/lib/i18n";

interface SectionProps {
  icon: string;
  titleEn: string;
  titleAr: string;
  lang: "en" | "ar";
  children: React.ReactNode;
}

function Section({ icon, titleEn, titleAr, lang, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-xl font-semibold text-gray-900">
          {lang === "ar" ? titleAr : titleEn}
        </h2>
      </div>
      <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function FeatureRow({ icon, titleEn, titleAr, descEn, descAr, lang }: {
  icon: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  lang: "en" | "ar";
}) {
  return (
    <div className="flex gap-3 py-2 border-b border-rose-50 last:border-0">
      <span className="text-base mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="font-medium text-gray-800">
          {lang === "ar" ? titleAr : titleEn}
        </p>
        <p className="text-gray-500 mt-0.5">
          {lang === "ar" ? descAr : descEn}
        </p>
      </div>
    </div>
  );
}

function StatusRow({ status, color, descEn, descAr, lang }: {
  status: string;
  color: string;
  descEn: string;
  descAr: string;
  lang: "en" | "ar";
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-rose-50 last:border-0">
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 mt-0.5 ${color}`}>
        {status}
      </span>
      <p className="text-gray-500">{lang === "ar" ? descAr : descEn}</p>
    </div>
  );
}

export default function OwnerGuidePage() {
  const t = useT();
  const { lang } = useLang();

  return (
    <div className="min-h-screen bg-rose-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            {lang === "ar" ? "دليل الاستخدام" : "How to Use Sandry"}
          </h1>
          <p className="text-gray-500 mt-1">
            {lang === "ar"
              ? "شرح شامل لجميع الحسابات والميزات في المنصة"
              : "A complete guide to all accounts and features on the platform"}
          </p>
        </div>

        <div className="space-y-6">

          {/* ── About Sandry ── */}
          <Section icon="🍰" titleEn="About Sandry" titleAr="عن ساندري" lang={lang}>
            {lang === "ar" ? (
              <p>
                ساندري هي منصة متكاملة لإدارة مخبزة — تربط بين <strong>العملاء</strong> الذين يطلبون الحلويات،
                و<strong>الطهاة</strong> الذين يُعدّونها، و<strong>المالك</strong> الذي يتابع الأداء العام.
                توفر المنصة نظام طلب كامل، وإدارة قائمة، وتتبع مشتريات، وتحليلات مالية.
              </p>
            ) : (
              <p>
                Sandry is a full-featured bakery management platform — connecting <strong>clients</strong> who
                order sweets, <strong>chefs</strong> who prepare them, and the <strong>owner</strong> who
                monitors overall performance. The platform provides a complete ordering system, menu management,
                purchase tracking, and financial analytics.
              </p>
            )}
          </Section>

          {/* ── Owner Account ── */}
          <Section icon="👑" titleEn="Owner Account" titleAr="حساب المالك" lang={lang}>
            {lang === "ar" ? (
              <p className="mb-3">
                حساب المالك يمنحك نظرة شاملة على عمل المخبزة. لديك أربع صفحات رئيسية:
              </p>
            ) : (
              <p className="mb-3">
                The owner account gives you a full view of the bakery's operations. You have four main pages:
              </p>
            )}
            <FeatureRow
              icon="📊"
              titleEn="Overview"
              titleAr="نظرة عامة"
              descEn="See total clients, all-time revenue, a revenue chart for the last 14 days, and the top-selling menu items."
              descAr="عرض إجمالي العملاء، الإيرادات الكلية، مخطط الإيرادات لآخر 14 يوماً، وأبرز المنتجات مبيعاً."
              lang={lang}
            />
            <FeatureRow
              icon="👥"
              titleEn="Users"
              titleAr="المستخدمون"
              descEn="Create new chef or client accounts, change user roles (Chef ↔ Client), and activate or deactivate accounts."
              descAr="إنشاء حسابات طهاة أو عملاء جديدة، تغيير الأدوار (طاهٍ ↔ عميل)، وتفعيل أو تعطيل الحسابات."
              lang={lang}
            />
            <FeatureRow
              icon="🛒"
              titleEn="Purchases"
              titleAr="المشتريات"
              descEn="View all ingredient and supply purchases logged by every chef, with filters by chef name."
              descAr="عرض جميع مشتريات المكونات واللوازم المسجّلة من قِبَل الطهاة، مع إمكانية الفلترة باسم الطاهي."
              lang={lang}
            />
            <FeatureRow
              icon="📖"
              titleEn="How to Use"
              titleAr="دليل الاستخدام"
              descEn="This page — a reference guide for all platform features and account types."
              descAr="هذه الصفحة — دليل مرجعي لجميع ميزات المنصة وأنواع الحسابات."
              lang={lang}
            />
          </Section>

          {/* ── Chef Account ── */}
          <Section icon="👨‍🍳" titleEn="Chef Account" titleAr="حساب الطاهي" lang={lang}>
            {lang === "ar" ? (
              <p className="mb-3">
                يتمتع الطاهي بصلاحيات إدارة الطلبات والقائمة وتتبع التكاليف. لديه خمس صفحات:
              </p>
            ) : (
              <p className="mb-3">
                The chef has full control over orders, menu, and cost tracking. They have five pages:
              </p>
            )}
            <FeatureRow
              icon="🏠"
              titleEn="Dashboard"
              titleAr="لوحة التحكم"
              descEn="A live summary showing today's order count, pending orders, this month's revenue, and the 10 most recent orders with quick status updates."
              descAr="ملخص فوري يُظهر طلبات اليوم، الطلبات المعلّقة، إيرادات الشهر الحالي، وآخر 10 طلبات مع إمكانية تحديث الحالة فوراً."
              lang={lang}
            />
            <FeatureRow
              icon="📋"
              titleEn="Orders"
              titleAr="الطلبات"
              descEn="View all orders with filtering by status. Expand any order to see the full item list and notes. Change any order's status using the dropdown."
              descAr="عرض جميع الطلبات مع فلترة حسب الحالة. توسيع أي طلب لرؤية قائمة العناصر والملاحظات. تغيير حالة الطلب من القائمة المنسدلة."
              lang={lang}
            />
            <FeatureRow
              icon="🍽️"
              titleEn="Menu Management"
              titleAr="إدارة القائمة"
              descEn="Add new items with name, price, category, description, and image URL. Edit or delete existing items. Toggle availability to hide items from clients without deleting them."
              descAr="إضافة عناصر جديدة بالاسم والسعر والفئة والوصف ورابط الصورة. تعديل أو حذف العناصر الموجودة. تفعيل/تعطيل توفر العنصر لإخفائه عن العملاء دون حذفه."
              lang={lang}
            />
            <FeatureRow
              icon="💸"
              titleEn="Purchases"
              titleAr="المشتريات"
              descEn="Log ingredient and supply costs (description, amount, date). View this month's total and all-time total. Edit or delete any entry."
              descAr="تسجيل تكاليف المكونات واللوازم (الوصف، المبلغ، التاريخ). عرض إجمالي الشهر الحالي وإجمالي كل الوقت. تعديل أو حذف أي سجل."
              lang={lang}
            />
            <FeatureRow
              icon="📈"
              titleEn="Analytics"
              titleAr="التحليلات"
              descEn="Charts for revenue and orders over the last 14 days, top-selling items by quantity, and a breakdown of orders by status."
              descAr="مخططات الإيرادات والطلبات خلال آخر 14 يوماً، أكثر العناصر مبيعاً كمياً، وتفصيل الطلبات حسب الحالة."
              lang={lang}
            />
          </Section>

          {/* ── Client Account ── */}
          <Section icon="🛍️" titleEn="Client Account" titleAr="حساب العميل" lang={lang}>
            {lang === "ar" ? (
              <p className="mb-3">
                العميل يتصفح القائمة ويضع الطلبات ويتتبعها. لديه ثلاث صفحات رئيسية:
              </p>
            ) : (
              <p className="mb-3">
                Clients browse the menu, place orders, and track them. They have three main areas:
              </p>
            )}
            <FeatureRow
              icon="🍰"
              titleEn="Menu"
              titleAr="القائمة"
              descEn="Browse all available items. Search by name or filter by category (Cake, Pastry, Cookie, Dessert). Add items to the cart and adjust quantities directly on the card."
              descAr="تصفح جميع العناصر المتاحة. البحث بالاسم أو الفلترة حسب الفئة (كعكة، معجنات، كوكيز، حلويات). إضافة العناصر للسلة وتعديل الكميات مباشرة على البطاقة."
              lang={lang}
            />
            <FeatureRow
              icon="🛒"
              titleEn="Cart"
              titleAr="سلة التسوق"
              descEn="Review cart items, adjust quantities, add special notes or requests, then place the order. The cart slides in from the side and is accessible from the navbar."
              descAr="مراجعة عناصر السلة، تعديل الكميات، إضافة ملاحظات أو طلبات خاصة، ثم تأكيد الطلب. تنزلق السلة من الجانب ويمكن الوصول إليها من شريط التنقل."
              lang={lang}
            />
            <FeatureRow
              icon="📦"
              titleEn="My Orders"
              titleAr="طلباتي"
              descEn="View full order history. Expand any order to see the items and total. Pending orders can be edited — adjust quantities or notes before the chef starts preparing."
              descAr="عرض سجل الطلبات الكامل. توسيع أي طلب لرؤية العناصر والمجموع. الطلبات المعلّقة قابلة للتعديل — تعديل الكميات أو الملاحظات قبل أن يبدأ الطاهي بالتحضير."
              lang={lang}
            />
          </Section>

          {/* ── Order Statuses ── */}
          <Section icon="📋" titleEn="Order Statuses" titleAr="حالات الطلبات" lang={lang}>
            {lang === "ar" ? (
              <p className="mb-3">
                كل طلب يمر بمراحل واضحة. الطاهي يحدّث الحالة، والعميل يراها في الوقت الفعلي:
              </p>
            ) : (
              <p className="mb-3">
                Every order moves through clear stages. The chef updates the status; clients see it in real time:
              </p>
            )}
            <StatusRow
              status="Pending"
              color="bg-yellow-100 text-yellow-700"
              descEn="Order placed by client, waiting for the chef to start. The client can still edit the order at this stage."
              descAr="الطلب مُقدَّم من العميل وينتظر الطاهي للبدء. يمكن للعميل تعديل الطلب في هذه المرحلة."
              lang={lang}
            />
            <StatusRow
              status="In Progress"
              color="bg-blue-100 text-blue-700"
              descEn="Chef has started preparing the order. No further edits by the client are possible."
              descAr="الطاهي بدأ في تحضير الطلب. لا يمكن للعميل إجراء تعديلات إضافية."
              lang={lang}
            />
            <StatusRow
              status="Ready"
              color="bg-green-100 text-green-700"
              descEn="Order is fully prepared and ready for pickup or delivery."
              descAr="الطلب جاهز تماماً للاستلام أو التوصيل."
              lang={lang}
            />
            <StatusRow
              status="Delivered"
              color="bg-gray-100 text-gray-700"
              descEn="Order has been delivered to the client. Final state."
              descAr="تم توصيل الطلب للعميل. الحالة النهائية."
              lang={lang}
            />
            <StatusRow
              status="Cancelled"
              color="bg-red-100 text-red-600"
              descEn="Order was cancelled. Can be set by the chef at any stage."
              descAr="تم إلغاء الطلب. يمكن للطاهي تعيين هذه الحالة في أي مرحلة."
              lang={lang}
            />
          </Section>

        </div>
      </main>
    </div>
  );
}
