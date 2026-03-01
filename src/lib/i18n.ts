import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "ar";

// ─── Translations ──────────────────────────────────────────────────────────────
const en = {
  // Brand
  "brand.tagline": "Sweets & Bakery",

  // Navbar
  "nav.dashboard": "Dashboard",
  "nav.orders": "Orders",
  "nav.menu": "Menu",
  "nav.analytics": "Analytics",
  "nav.myOrders": "My Orders",
  "nav.signOut": "Sign out",
  "nav.signIn": "Sign in",
  "nav.register": "Register",
  "nav.ownerDash": "Overview",
  "nav.users": "Users",
  "nav.purchases": "Purchases",
  "nav.ownerPurchases": "Purchases",
  "nav.guide": "How to Use",

  // Landing
  "landing.badge": "✨ Handcrafted with love",
  "landing.hero1": "Sweets that make",
  "landing.hero2": "every moment",
  "landing.hero3": "special",
  "landing.heroSub":
    "Sandry is your neighbourhood bakery — offering freshly crafted cakes, pastries, and confections, delivered straight to your door.",
  "landing.orderNow": "Order Now",
  "landing.getStarted": "Get started",
  "landing.whySandry": "Why Sandry?",
  "landing.testimonials": "What our customers say",
  "landing.ctaTitle": "Ready to order?",
  "landing.ctaSub": "Create a free account and explore our full menu of handcrafted delights.",
  "landing.createAccount": "Create your account",
  "landing.footer": "Sandry Sweets & Bakery. Made with ❤️",

  // Features
  "feat.sweets.title": "Handcrafted Sweets",
  "feat.sweets.desc": "Every item is made with love and the finest ingredients, from cakes to macarons.",
  "feat.pastry.title": "Fresh Pastries",
  "feat.pastry.desc": "Croissants, éclairs, and danishes baked fresh each morning for you.",
  "feat.order.title": "Easy Ordering",
  "feat.order.desc": "Browse our menu, add to cart, and place your order in minutes.",
  "feat.track.title": "Track Your Order",
  "feat.track.desc": "Stay updated on your order status from preparation to delivery.",

  // Testimonials
  "t1.quote": "The best chocolate lava cake I've ever had. Sandry never disappoints!",
  "t1.name": "Lara M.",
  "t2.quote": "Ordered macarons for my wife's birthday — she was absolutely thrilled.",
  "t2.name": "Ahmed K.",
  "t3.quote": "Fresh, beautiful, and delicious. The croissants are out of this world.",
  "t3.name": "Sofia P.",

  // Auth – Login
  "login.title": "Welcome back",
  "login.sub": "Sign in to your account to continue",
  "login.email": "Email address",
  "login.password": "Password",
  "login.submit": "Sign in",
  "login.submitting": "Signing in...",
  "login.noAccount": "Don't have an account?",
  "login.registerLink": "Register here",
  "login.demoLabel": "Demo accounts",
  "login.chefDemo": "👨‍🍳 Chef account",
  "login.clientDemo": "👤 Client account",
  "login.error": "Invalid email or password",

  // Auth – Register
  "register.title": "Create an account",
  "register.sub": "Join Sandry and start ordering delicious sweets",
  "register.name": "Full name",
  "register.namePlaceholder": "Your full name",
  "register.email": "Email address",
  "register.password": "Password",
  "register.passwordPlaceholder": "At least 6 characters",
  "register.confirm": "Confirm password",
  "register.confirmPlaceholder": "Repeat your password",
  "register.submit": "Create account",
  "register.submitting": "Creating account...",
  "register.haveAccount": "Already have an account?",
  "register.signIn": "Sign in",
  "register.mismatch": "Passwords do not match",

  // Client – Menu
  "menu.title": "Our Menu",
  "menu.sub": "Handcrafted sweets and pastries, made fresh for you",
  "menu.search": "Search menu...",
  "menu.all": "All",
  "menu.noItems": "No items found",
  "menu.addToCart": "Add to Cart",
  "menu.unavailable": "Unavailable",

  // Cart Drawer
  "cart.title": "Your Cart",
  "cart.empty": "Your cart is empty",
  "cart.notesPlaceholder": "Special requests or notes...",
  "cart.total": "Total",
  "cart.placeOrder": "Place Order",
  "cart.placingOrder": "Placing order...",

  // Status Badges
  "status.PENDING": "Pending",
  "status.IN_PROGRESS": "In Progress",
  "status.READY": "Ready",
  "status.DELIVERED": "Delivered",
  "status.CANCELLED": "Cancelled",

  // Client – Orders
  "orders.title": "My Orders",
  "orders.sub": "Track all your Sandry orders",
  "orders.newOrder": "+ New Order",
  "orders.empty": "No orders yet",
  "orders.browseMenu": "Browse our menu",
  "orders.total": "Total",
  "orders.note": "Note",
  "orders.edit": "Edit Order",
  "orders.saveEdit": "Save Changes",
  "orders.saving": "Saving...",
  "orders.cancelEdit": "Cancel",
  "orders.notesPlaceholder": "Special requests or notes...",
  "orders.pendingHint": "You can edit this order while it's pending.",

  // Chef – Dashboard
  "dash.title": "Dashboard",
  "dash.sub": "Welcome back, Chef! Here's what's happening today.",
  "dash.todayOrders": "Today's Orders",
  "dash.pending": "Pending",
  "dash.monthRevenue": "This Month Revenue",
  "dash.totalOrders": "Total Orders",
  "dash.recentOrders": "Recent Orders",
  "dash.viewAll": "View all →",
  "dash.noOrders": "No orders yet",

  // Chef – Orders
  "chefOrders.title": "All Orders",
  "chefOrders.sub": "Manage and update order statuses",
  "chefOrders.noOrders": "No orders found",
  "chefOrders.all": "ALL",
  "chefOrders.note": "Note",

  // Chef – Menu
  "chefMenu.title": "Menu Management",
  "chefMenu.sub": "Add, edit, or remove items from your menu",
  "chefMenu.addItem": "Add Item",
  "chefMenu.editTitle": "Edit Item",
  "chefMenu.addTitle": "Add Menu Item",
  "chefMenu.name": "Name",
  "chefMenu.namePlaceholder": "e.g. Chocolate Lava Cake",
  "chefMenu.price": "Price ($)",
  "chefMenu.category": "Category",
  "chefMenu.description": "Description",
  "chefMenu.descPlaceholder": "Brief description of the item...",
  "chefMenu.imageUrl": "Image URL",
  "chefMenu.available": "Available for ordering",
  "chefMenu.cancel": "Cancel",
  "chefMenu.save": "Save Changes",
  "chefMenu.saving": "Saving...",
  "chefMenu.addBtn": "Add Item",
  "chefMenu.edit": "Edit",
  "chefMenu.delete": "Delete",
  "chefMenu.deleteConfirm": "Delete this menu item? This cannot be undone.",

  // Owner – Dashboard & Users
  "owner.title": "Executive Overview",
  "owner.sub": "Business performance at a glance",
  "owner.totalClients": "Total Clients",
  "owner.revenueChart": "Revenue — last 14 days",
  "owner.topItems": "Top Items by Revenue",
  "owner.sold": "sold",
  "owner.users": "User Management",
  "owner.usersSub": "Manage chef and client accounts",
  "owner.makeChef": "Make Chef",
  "owner.makeClient": "Make Client",
  "owner.deactivate": "Deactivate",
  "owner.activate": "Activate",
  "owner.inactive": "Inactive",
  "owner.active": "Active",
  "owner.createUser": "Create User",
  "owner.createUserSub": "Add a new chef or client account",
  "owner.userName": "Full Name",
  "owner.userEmail": "Email Address",
  "owner.userPassword": "Password",
  "owner.userRole": "Role",
  "owner.creating": "Creating...",
  "owner.create": "Create Account",
  "owner.emailTaken": "Email already in use",
  "owner.filterClient": "Client",
  "owner.filterAllClients": "All clients",
  "owner.filterAllTime": "All time",
  "owner.filterToday": "Today",
  "owner.filter7d": "Last 7 days",
  "owner.filter30d": "Last 30 days",
  "owner.filterMonth": "This month",
  "owner.filterCustom": "Custom",
  "owner.filterFrom": "From",
  "owner.filterTo": "To",
  "owner.totalPurchases": "Total Purchases",
  "owner.actualProfit": "Actual Profit",
  "owner.actualProfitSub": "Revenue minus real purchases",
  "owner.thisMonth": "this month",
  "owner.purchases": "Purchases",

  // Chef – Purchases
  "purchases.title": "Purchases",
  "purchases.sub": "Track your ingredient and supply costs",
  "purchases.addPurchase": "Add Purchase",
  "purchases.editTitle": "Edit Purchase",
  "purchases.addTitle": "Add Purchase",
  "purchases.description": "Description",
  "purchases.descPlaceholder": "e.g. Flour, eggs, butter from market",
  "purchases.amount": "Amount ($)",
  "purchases.date": "Date",
  "purchases.thisMonth": "This Month",
  "purchases.allTime": "All Time",
  "purchases.cancel": "Cancel",
  "purchases.save": "Save Changes",
  "purchases.saving": "Saving...",
  "purchases.addBtn": "Add Purchase",
  "purchases.edit": "Edit",
  "purchases.delete": "Delete",
  "purchases.deleteConfirm": "Delete this purchase? This cannot be undone.",
  "purchases.empty": "No purchases recorded yet",

  // Chef – Analytics
  "analytics.title": "Analytics",
  "analytics.sub": "Overview of your kitchen performance",
  "analytics.totalRevenue": "Total Revenue",
  "analytics.totalSales": "Total Sales",
  "analytics.totalOrders": "Total Orders",
  "analytics.avgOrder": "Avg Order Value",
  "analytics.thisMonth": "This Month",
  "analytics.orders": "orders",
  "analytics.revChart": "Revenue — last 14 days",
  "analytics.ordersChart": "Orders — last 14 days",
  "analytics.noData": "No data yet",
  "analytics.topItems": "Top Selling Items",
  "analytics.sold": "sold",
  "analytics.byStatus": "Orders by Status",

  // Owner – Purchases
  "ownerPurchases.title": "All Purchases",
  "ownerPurchases.sub": "Purchases logged by all chefs",
  "ownerPurchases.filterChef": "Chef",
  "ownerPurchases.allChefs": "All chefs",
  "ownerPurchases.chef": "Chef",
} as const;

const ar: { [K in keyof typeof en]: string } = {
  // Brand
  "brand.tagline": "حلويات ومخبوزات",

  // Navbar
  "nav.dashboard": "لوحة التحكم",
  "nav.orders": "الطلبات",
  "nav.menu": "القائمة",
  "nav.analytics": "التحليلات",
  "nav.myOrders": "طلباتي",
  "nav.signOut": "تسجيل الخروج",
  "nav.signIn": "تسجيل الدخول",
  "nav.register": "إنشاء حساب",
  "nav.ownerDash": "نظرة عامة",
  "nav.users": "المستخدمون",
  "nav.purchases": "المشتريات",
  "nav.ownerPurchases": "المشتريات",
  "nav.guide": "دليل الاستخدام",

  // Landing
  "landing.badge": "✨ مصنوع بحب",
  "landing.hero1": "حلويات تجعل",
  "landing.hero2": "كل لحظة",
  "landing.hero3": "مميزة",
  "landing.heroSub":
    "ساندري هي مخبزتك المحلية — تقدم كعكات ومعجنات وحلويات مصنوعة يدوياً، توصل مباشرة إلى بابك.",
  "landing.orderNow": "اطلب الآن",
  "landing.getStarted": "ابدأ الآن",
  "landing.whySandry": "لماذا ساندري؟",
  "landing.testimonials": "ما يقوله عملاؤنا",
  "landing.ctaTitle": "مستعد للطلب؟",
  "landing.ctaSub": "أنشئ حساباً مجانياً واستكشف قائمتنا الكاملة من الحلويات المصنوعة يدوياً.",
  "landing.createAccount": "إنشاء حسابك",
  "landing.footer": "ساندري للحلويات والمخبوزات. مصنوع بـ ❤️",

  // Features
  "feat.sweets.title": "حلويات مصنوعة يدوياً",
  "feat.sweets.desc": "كل عنصر مصنوع بحب وبأجود المكونات، من الكعكات إلى الماكرون.",
  "feat.pastry.title": "معجنات طازجة",
  "feat.pastry.desc": "كرواسان وإكلير ودانش طازج يُخبز كل صباح لأجلك.",
  "feat.order.title": "طلب سهل",
  "feat.order.desc": "تصفح قائمتنا، أضف للسلة، وقدّم طلبك في دقائق.",
  "feat.track.title": "تتبع طلبك",
  "feat.track.desc": "ابقَ على اطلاع بحالة طلبك من التحضير حتى التوصيل.",

  // Testimonials
  "t1.quote": "أفضل كعكة اللافا بالشوكولاتة جربتها في حياتي. ساندري لا تخذل أبداً!",
  "t1.name": "لارا م.",
  "t2.quote": "طلبت ماكرون لعيد ميلاد زوجتي — كانت في غاية السعادة.",
  "t2.name": "أحمد ك.",
  "t3.quote": "طازج وجميل ولذيذ. الكرواسان رائع بكل معنى الكلمة.",
  "t3.name": "صوفيا ب.",

  // Auth – Login
  "login.title": "مرحباً بعودتك",
  "login.sub": "سجّل دخولك للمتابعة",
  "login.email": "البريد الإلكتروني",
  "login.password": "كلمة المرور",
  "login.submit": "تسجيل الدخول",
  "login.submitting": "جارٍ تسجيل الدخول...",
  "login.noAccount": "ليس لديك حساب؟",
  "login.registerLink": "سجّل هنا",
  "login.demoLabel": "حسابات تجريبية",
  "login.chefDemo": "👨‍🍳 حساب الشيف",
  "login.clientDemo": "👤 حساب العميل",
  "login.error": "البريد الإلكتروني أو كلمة المرور غير صحيحة",

  // Auth – Register
  "register.title": "إنشاء حساب",
  "register.sub": "انضم إلى ساندري وابدأ طلب الحلويات اللذيذة",
  "register.name": "الاسم الكامل",
  "register.namePlaceholder": "اسمك الكامل",
  "register.email": "البريد الإلكتروني",
  "register.password": "كلمة المرور",
  "register.passwordPlaceholder": "على الأقل 6 أحرف",
  "register.confirm": "تأكيد كلمة المرور",
  "register.confirmPlaceholder": "أعد كتابة كلمة المرور",
  "register.submit": "إنشاء الحساب",
  "register.submitting": "جارٍ الإنشاء...",
  "register.haveAccount": "لديك حساب بالفعل؟",
  "register.signIn": "تسجيل الدخول",
  "register.mismatch": "كلمتا المرور غير متطابقتين",

  // Client – Menu
  "menu.title": "قائمتنا",
  "menu.sub": "حلويات ومعجنات مصنوعة يدوياً، طازجة لك",
  "menu.search": "ابحث في القائمة...",
  "menu.all": "الكل",
  "menu.noItems": "لا توجد عناصر",
  "menu.addToCart": "أضف للسلة",
  "menu.unavailable": "غير متوفر",

  // Cart Drawer
  "cart.title": "سلتك",
  "cart.empty": "سلتك فارغة",
  "cart.notesPlaceholder": "طلبات خاصة أو ملاحظات...",
  "cart.total": "المجموع",
  "cart.placeOrder": "تأكيد الطلب",
  "cart.placingOrder": "جارٍ الطلب...",

  // Status Badges
  "status.PENDING": "قيد الانتظار",
  "status.IN_PROGRESS": "قيد التنفيذ",
  "status.READY": "جاهز",
  "status.DELIVERED": "تم التوصيل",
  "status.CANCELLED": "ملغي",

  // Client – Orders
  "orders.title": "طلباتي",
  "orders.sub": "تتبع جميع طلباتك من ساندري",
  "orders.newOrder": "+ طلب جديد",
  "orders.empty": "لا توجد طلبات بعد",
  "orders.browseMenu": "تصفح قائمتنا",
  "orders.total": "المجموع",
  "orders.note": "ملاحظة",
  "orders.edit": "تعديل الطلب",
  "orders.saveEdit": "حفظ التغييرات",
  "orders.saving": "جارٍ الحفظ...",
  "orders.cancelEdit": "إلغاء",
  "orders.notesPlaceholder": "طلبات خاصة أو ملاحظات...",
  "orders.pendingHint": "يمكنك تعديل هذا الطلب ما دام قيد الانتظار.",

  // Chef – Dashboard
  "dash.title": "لوحة التحكم",
  "dash.sub": "مرحباً بعودتك أيها الشيف! إليك ما يجري اليوم.",
  "dash.todayOrders": "طلبات اليوم",
  "dash.pending": "قيد الانتظار",
  "dash.monthRevenue": "إيرادات هذا الشهر",
  "dash.totalOrders": "إجمالي الطلبات",
  "dash.recentOrders": "الطلبات الأخيرة",
  "dash.viewAll": "عرض الكل ←",
  "dash.noOrders": "لا توجد طلبات بعد",

  // Chef – Orders
  "chefOrders.title": "جميع الطلبات",
  "chefOrders.sub": "إدارة وتحديث حالات الطلبات",
  "chefOrders.noOrders": "لا توجد طلبات",
  "chefOrders.all": "الكل",
  "chefOrders.note": "ملاحظة",

  // Chef – Menu
  "chefMenu.title": "إدارة القائمة",
  "chefMenu.sub": "أضف أو عدّل أو احذف عناصر من قائمتك",
  "chefMenu.addItem": "إضافة عنصر",
  "chefMenu.editTitle": "تعديل العنصر",
  "chefMenu.addTitle": "إضافة عنصر للقائمة",
  "chefMenu.name": "الاسم",
  "chefMenu.namePlaceholder": "مثال: كعكة اللافا بالشوكولاتة",
  "chefMenu.price": "السعر ($)",
  "chefMenu.category": "الفئة",
  "chefMenu.description": "الوصف",
  "chefMenu.descPlaceholder": "وصف مختصر للعنصر...",
  "chefMenu.imageUrl": "رابط الصورة",
  "chefMenu.available": "متاح للطلب",
  "chefMenu.cancel": "إلغاء",
  "chefMenu.save": "حفظ التغييرات",
  "chefMenu.saving": "جارٍ الحفظ...",
  "chefMenu.addBtn": "إضافة العنصر",
  "chefMenu.edit": "تعديل",
  "chefMenu.delete": "حذف",
  "chefMenu.deleteConfirm": "هل تريد حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",

  // Owner – Dashboard & Users
  "owner.title": "لوحة التحكم التنفيذية",
  "owner.sub": "أداء الأعمال دفعةً واحدة",
  "owner.totalClients": "إجمالي العملاء",
  "owner.revenueChart": "الإيرادات — آخر 14 يوماً",
  "owner.topItems": "أبرز المنتجات مبيعاً",
  "owner.sold": "مباع",
  "owner.users": "إدارة المستخدمين",
  "owner.usersSub": "إدارة حسابات الطهاة والعملاء",
  "owner.makeChef": "ترقية لطاهٍ",
  "owner.makeClient": "تحويل لعميل",
  "owner.deactivate": "تعطيل",
  "owner.activate": "تفعيل",
  "owner.inactive": "معطّل",
  "owner.active": "نشط",
  "owner.createUser": "إنشاء مستخدم",
  "owner.createUserSub": "إضافة حساب طاهٍ أو عميل جديد",
  "owner.userName": "الاسم الكامل",
  "owner.userEmail": "البريد الإلكتروني",
  "owner.userPassword": "كلمة المرور",
  "owner.userRole": "الدور",
  "owner.creating": "جارٍ الإنشاء...",
  "owner.create": "إنشاء الحساب",
  "owner.emailTaken": "البريد الإلكتروني مستخدم بالفعل",
  "owner.filterClient": "العميل",
  "owner.filterAllClients": "جميع العملاء",
  "owner.filterAllTime": "كل الوقت",
  "owner.filterToday": "اليوم",
  "owner.filter7d": "آخر 7 أيام",
  "owner.filter30d": "آخر 30 يوماً",
  "owner.filterMonth": "هذا الشهر",
  "owner.filterCustom": "مخصص",
  "owner.filterFrom": "من",
  "owner.filterTo": "إلى",
  "owner.totalPurchases": "إجمالي المشتريات",
  "owner.actualProfit": "الربح الفعلي",
  "owner.actualProfitSub": "الإيرادات ناقص المشتريات الفعلية",
  "owner.thisMonth": "هذا الشهر",
  "owner.purchases": "المشتريات",

  // Chef – Purchases
  "purchases.title": "المشتريات",
  "purchases.sub": "تتبع تكاليف المكونات واللوازم",
  "purchases.addPurchase": "إضافة مشتريات",
  "purchases.editTitle": "تعديل المشتريات",
  "purchases.addTitle": "إضافة مشتريات",
  "purchases.description": "الوصف",
  "purchases.descPlaceholder": "مثال: دقيق وبيض وزبدة من السوق",
  "purchases.amount": "المبلغ ($)",
  "purchases.date": "التاريخ",
  "purchases.thisMonth": "هذا الشهر",
  "purchases.allTime": "كل الوقت",
  "purchases.cancel": "إلغاء",
  "purchases.save": "حفظ التغييرات",
  "purchases.saving": "جارٍ الحفظ...",
  "purchases.addBtn": "إضافة المشتريات",
  "purchases.edit": "تعديل",
  "purchases.delete": "حذف",
  "purchases.deleteConfirm": "هل تريد حذف هذا السجل؟ لا يمكن التراجع.",
  "purchases.empty": "لا توجد مشتريات مسجّلة بعد",

  // Chef – Analytics
  "analytics.title": "التحليلات",
  "analytics.sub": "نظرة عامة على أداء مطبخك",
  "analytics.totalRevenue": "إجمالي الإيرادات",
  "analytics.totalSales": "إجمالي المبيعات",
  "analytics.totalOrders": "إجمالي الطلبات",
  "analytics.avgOrder": "متوسط قيمة الطلب",
  "analytics.thisMonth": "هذا الشهر",
  "analytics.orders": "طلبات",
  "analytics.revChart": "الإيرادات — آخر 14 يوماً",
  "analytics.ordersChart": "الطلبات — آخر 14 يوماً",
  "analytics.noData": "لا توجد بيانات بعد",
  "analytics.topItems": "أكثر العناصر مبيعاً",
  "analytics.sold": "مباعة",
  "analytics.byStatus": "الطلبات حسب الحالة",

  // Owner – Purchases
  "ownerPurchases.title": "جميع المشتريات",
  "ownerPurchases.sub": "المشتريات المسجّلة من قِبَل جميع الطهاة",
  "ownerPurchases.filterChef": "الطاهي",
  "ownerPurchases.allChefs": "جميع الطهاة",
  "ownerPurchases.chef": "الطاهي",
};

export type TKey = keyof typeof en;

// ─── Zustand Store ─────────────────────────────────────────────────────────────
interface LangStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLang = create<LangStore>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
    }),
    { name: "sandry-lang" }
  )
);

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useT() {
  const lang = useLang((s) => s.lang);
  const dict = lang === "ar" ? ar : en;
  return (key: TKey) => dict[key];
}
