import { Prisma, PrismaClient, ProductStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const createUser = async () => {
  const data: Prisma.UserCreateInput = {
    name: "Krunal Shah",
    username: "krunal-shah",
    email: "krunal@infynno.com",
    password: "$2a$12$h90jZ5prgPaxKUYKkNJ9BeLN.fmz/1VEtsSwY.0tkLvmgCX5ahAAq", // Password123#
    emailVerifiedAt: new Date(Date.now()),
  };

  const user = await prisma.user.upsert({
    where: { email: data.email },
    create: data,
    update: data,
  });

  console.log(`Upserted user: ${user.name}, ${user.email}`);

  return user;
};

const createProducts = async (userId: string) => {
  for (let i = 0; i < 5; i++) {
    const data: Prisma.ProductCreateInput = {
      title: faker.commerce.product(),
      currency: "USD",
      price: parseFloat(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      limitQuantity: faker.datatype.boolean(),
      hideQuantity: faker.datatype.boolean(),
      hideSales: faker.datatype.boolean(),
      onPurchaseRedirect: faker.datatype.boolean(),
      refundEnabled: faker.datatype.boolean(),
      status: faker.helpers.enumValue(ProductStatus),
      user: { connect: { id: userId } },
    };

    if (data.limitQuantity) {
      data.quantity = faker.number.int({ min: 1, max: 1000 });
    }
    if (data.onPurchaseRedirect) {
      data.redirectLink = faker.internet.url();
    }
    if (data.refundEnabled) {
      data.refundPolicy = faker.lorem.paragraph();
    }

    const product = await prisma.product.create({ data });

    console.log(`Created product: ${product.title}`);
  }
};

const main = async () => {
  const user = await createUser();
  await createProducts(user.id);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
