import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create chef account
  const chefPassword = await bcrypt.hash("chef123", 10);
  const chef = await prisma.user.upsert({
    where: { email: "chef@sandry.com" },
    update: {},
    create: {
      name: "Sandry Chef",
      email: "chef@sandry.com",
      password: chefPassword,
      role: Role.CHEF,
    },
  });
  console.log("✅ Chef created:", chef.email);

  // Create a sample client
  const clientPassword = await bcrypt.hash("client123", 10);
  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "client@example.com",
      password: clientPassword,
      role: Role.CLIENT,
    },
  });
  console.log("✅ Sample client created:", client.email);

  // Create owner account
  const ownerPassword = await bcrypt.hash("owner123", 10);
  const owner = await prisma.user.upsert({
    where: { email: "owner@sandry.com" },
    update: {},
    create: {
      name: "Sandry Owner",
      email: "owner@sandry.com",
      password: ownerPassword,
      role: Role.OWNER,
    },
  });
  console.log("✅ Owner created:", owner.email);

  // Create menu items
  const menuItems = [
    {
      name: "Chocolate Lava Cake",
      description:
        "Warm chocolate cake with a gooey molten center, served with vanilla ice cream",
      price: 8.5,
      costPrice: 3.0,
      category: "Cake",
      imageUrl:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
      available: true,
    },
    {
      name: "French Croissant",
      description:
        "Buttery, flaky croissant baked fresh every morning — plain or with almond filling",
      price: 3.5,
      costPrice: 1.0,
      category: "Pastry",
      imageUrl:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
      available: true,
    },
    {
      name: "Strawberry Cheesecake",
      description:
        "Creamy New York-style cheesecake topped with fresh strawberry compote",
      price: 7.0,
      costPrice: 2.5,
      category: "Cake",
      imageUrl:
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400",
      available: true,
    },
    {
      name: "Macaron Box (6 pcs)",
      description:
        "Assorted French macarons in seasonal flavors: rose, pistachio, salted caramel, raspberry",
      price: 12.0,
      costPrice: 4.5,
      category: "Cookie",
      imageUrl:
        "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400",
      available: true,
    },
    {
      name: "Cinnamon Roll",
      description:
        "Soft, fluffy roll swirled with cinnamon sugar and drizzled with cream cheese glaze",
      price: 4.5,
      costPrice: 1.5,
      category: "Pastry",
      imageUrl:
        "https://images.unsplash.com/photo-1609428566092-ded3c18ab60d?w=400",
      available: true,
    },
    {
      name: "Tiramisu",
      description:
        "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream",
      price: 6.5,
      costPrice: 2.0,
      category: "Dessert",
      imageUrl:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
      available: true,
    },
    {
      name: "Baklava (4 pcs)",
      description:
        "Layers of crispy phyllo pastry filled with mixed nuts and soaked in honey syrup",
      price: 9.0,
      costPrice: 3.5,
      category: "Pastry",
      imageUrl:
        "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400",
      available: true,
    },
    {
      name: "Red Velvet Cupcake",
      description:
        "Moist red velvet cupcake topped with a generous swirl of cream cheese frosting",
      price: 4.0,
      costPrice: 1.2,
      category: "Cake",
      imageUrl:
        "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400",
      available: true,
    },
    {
      name: "Éclair",
      description:
        "Choux pastry filled with vanilla custard and topped with dark chocolate ganache",
      price: 5.0,
      costPrice: 1.8,
      category: "Pastry",
      imageUrl:
        "https://images.unsplash.com/photo-1625591339971-4b6b8b1db0e2?w=400",
      available: true,
    },
    {
      name: "Panna Cotta",
      description:
        "Silky Italian panna cotta with mango coulis and fresh mint",
      price: 6.0,
      costPrice: 2.0,
      category: "Dessert",
      imageUrl:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      available: true,
    },
  ];

  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  for (const item of menuItems) {
    const id = slugify(item.name);
    await prisma.menuItem.upsert({
      where: { id },
      update: { costPrice: item.costPrice },
      create: { id, ...item },
    });
  }
  console.log("✅ Menu items created:", menuItems.length);

  console.log("\n🎉 Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Owner login:  owner@sandry.com / owner123");
  console.log("Chef login:   chef@sandry.com / chef123");
  console.log("Client login: client@example.com / client123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
