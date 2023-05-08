const routers = [
  "users",
  "budgets",
  "transactions",
  "categories",
  "assets",
  "cards",
  "paymentMethods",
  "auth",
];

if (process.env.NODE_ENV?.trim() == "development") {
  routers.push("test");
}

export { routers };
