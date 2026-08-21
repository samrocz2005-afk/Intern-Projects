const formatCurrency = (
  amount,
  options = {}
) => {
  const {
    currency = "INR",
    locale = "en-IN",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return "₹0.00";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericAmount);
};

export default formatCurrency;