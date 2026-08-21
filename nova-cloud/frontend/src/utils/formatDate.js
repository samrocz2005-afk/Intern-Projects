const formatDate = (
  date,
  options = {}
) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  const {
    locale = "en-IN",
    dateStyle = "medium",
    timeStyle,
  } = options;

  return new Intl.DateTimeFormat(locale, {
    dateStyle,
    ...(timeStyle && {
      timeStyle,
    }),
  }).format(parsedDate);
};

export default formatDate;