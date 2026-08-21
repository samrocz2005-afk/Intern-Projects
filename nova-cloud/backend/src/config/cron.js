const {
  startBillingJob,
} = require("../jobs/billing.job");

let billingJob = null;

const startCronJobs = () => {
  console.log(
    "[CRON] Initializing scheduled jobs..."
  );

  billingJob = startBillingJob();

  console.log(
    "[CRON] All scheduled jobs started"
  );

  return {
    billingJob,
  };
};

const stopCronJobs = () => {
  if (billingJob) {
    billingJob.stop();

    console.log(
      "[CRON] Billing job stopped"
    );
  }
};

module.exports = {
  startCronJobs,
  stopCronJobs,
};