const cron = require("node-cron");

const User = require("../models/User");
const billingService = require("../services/billing.service");

/**
 * Process billing for all active users.
 *
 * TEST MODE:
 * Runs every 1 minute and bills the previous 1 minute.
 */
const processBilling = async () => {
  const periodEnd = new Date();

  const periodStart = new Date(
    periodEnd.getTime() - 60 * 1000
  );

  console.log(
    `[BILLING] Starting billing job: ${periodStart.toISOString()} → ${periodEnd.toISOString()}`
  );

  try {
    const users = await User.find({
      isActive: true,
    }).select("_id");

    let processed = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const billing =
          await billingService.processUserBilling(
            user._id,
            periodStart,
            periodEnd
          );

        if (billing) {
          processed++;

          console.log(
            `[BILLING] User ${user._id} billed: ${billing.invoiceNumber} - ₹${billing.total}`
          );
        } else {
          console.log(
            `[BILLING] User ${user._id}: No billable usage`
          );
        }
      } catch (error) {
        failed++;

        console.error(
          `[BILLING ERROR] User ${user._id}:`,
          error.message
        );
      }
    }

    console.log(
      `[BILLING] Completed. Processed: ${processed}, Failed: ${failed}`
    );
  } catch (error) {
    console.error(
      "[BILLING JOB ERROR]",
      error
    );
  }
};

/**
 * Start billing cron.
 *
 * TEST MODE:
 * Every 1 minute.
 */
const startBillingJob = () => {
  const job = cron.schedule(
    "* * * * *",
    async () => {
      await processBilling();
    },
    {
      timezone:
        process.env.BILLING_TIMEZONE ||
        "Asia/Kolkata",
    }
  );

  console.log(
    "[BILLING] 1-minute billing cron started"
  );

  return job;
};

module.exports = {
  startBillingJob,
  processBilling,
};