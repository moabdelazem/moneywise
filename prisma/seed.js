// prisma/seed.js
// const { PrismaClient } = require("@prisma/client");
//  const faker = require("faker");
import { PrismaClient, Category } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FIXED_PASSWORD = "password123";
const CURRENT_YEAR = 2025;
const TARGET_MONTHS = [4, 5]; // April, May
const CATEGORIES_TO_SEED = [
  Category.FOOD,
  Category.TRANSPORTATION,
  Category.UTILITIES,
  Category.ENTERTAINMENT,
  Category.HOUSING,
];

// Helper function to get start and end dates for a month
const getMonthDateRange = (year, month) => {
  const start = new Date(year, month - 1, 1); // Month is 0-indexed in JS Date
  const end = new Date(year, month, 0); // Day 0 of next month gives last day of current month
  end.setHours(23, 59, 59, 999); // Set to end of the day
  return { start, end };
};

async function main() {
  console.log(`Seeding database... Using fixed password: ${FIXED_PASSWORD}`);
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(FIXED_PASSWORD, salt);

  console.log(
    `Generating data for year ${CURRENT_YEAR}, months: ${TARGET_MONTHS.join(
      ", "
    )}`
  );

  // Create Users
  for (let i = 0; i < 5; i++) {
    const userEmail = faker.internet.email();
    const userName = faker.person.fullName();

    const budgetsData = [];
    const expensesData = [];

    // Generate budgets and expenses for target months and categories
    for (const month of TARGET_MONTHS) {
      const { start: monthStart, end: monthEnd } = getMonthDateRange(
        CURRENT_YEAR,
        month
      );

      for (const category of CATEGORIES_TO_SEED) {
        const budgetAmount = faker.number.int({ min: 500, max: 5000 }); // Define budget amount
        let totalSpent = 0;
        const numExpenses = faker.number.int({ min: 5, max: 15 }); // Realistic number of expenses

        // Generate expenses for this budget category/month
        for (let j = 0; j < numExpenses; j++) {
          const expenseAmount = faker.number.float({
            min: 5,
            max: (budgetAmount / numExpenses) * 1.5,
            precision: 0.01,
          }); // Expense amount related to budget
          totalSpent += expenseAmount;
          expensesData.push({
            amount: expenseAmount,
            description: faker.commerce.productName(),
            date: faker.date.between({ from: monthStart, to: monthEnd }), // Date within the target month
            category: category,
            status: "PENDING", // Or use faker.helpers.arrayElement(['PENDING', 'CLEARED'])
            notes: faker.lorem.sentence(3),
          });
        }

        // Ensure spent doesn't exceed budget amount (optional, for realism)
        totalSpent = Math.min(totalSpent, budgetAmount);
        const remainingAmount = budgetAmount - totalSpent;

        // Add budget data
        budgetsData.push({
          category: category,
          amount: budgetAmount,
          spent: totalSpent,
          remaining: remainingAmount,
          month: month,
          year: CURRENT_YEAR,
        });
      }
    }

    // Generate some random reminders (optional)
    const remindersData = [];
    if (faker.datatype.boolean(0.7)) {
      // 70% chance of having reminders
      const numReminders = faker.number.int({ min: 1, max: 3 });
      for (let k = 0; k < numReminders; k++) {
        remindersData.push({
          title: `Reminder ${k + 1}: ${faker.lorem.words(3)}`,
          amount: faker.number.int({ min: 50, max: 500 }),
          dueDate: faker.date.future({ years: 1 }),
          category: faker.helpers.arrayElement(CATEGORIES_TO_SEED),
          status: "PENDING",
          isRecurring: faker.datatype.boolean(),
          frequency: faker.helpers.arrayElement([
            "MONTHLY",
            "WEEKLY",
            "YEARLY",
            null,
          ]),
        });
      }
    }

    const user = await prisma.user.create({
      data: {
        name: userName,
        email: userEmail,
        password: hashedPassword,
        currency: "EGP",
        emailNotifications: faker.datatype.boolean(),
        // Use nested writes to create budgets and expenses
        budgets: {
          create: budgetsData,
        },
        expenses: {
          create: expensesData,
        },
        Reminder: {
          // Correct casing as per schema
          create: remindersData,
        },
      },
      include: {
        // Include created data for logging if needed (optional)
        budgets: true,
        expenses: true,
      },
    });
    console.log(
      `Created user: ${user.email} (ID: ${user.id}) with password: ${FIXED_PASSWORD}`
    );
    console.log(
      `  - Created ${budgetsData.length} budgets and ${
        expensesData.length
      } expenses for months ${TARGET_MONTHS.join(", ")}.`
    );
    if (remindersData.length > 0) {
      console.log(`  - Created ${remindersData.length} reminders.`);
    }
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e); // More specific error logging
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
