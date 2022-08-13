import { format } from "date-fns";
import PT from "date-fns/locale/pt";

export const formatDate = (date: Date) => {
  const formatTemplate = "EEEE', 'd' de 'MMMM' às 'k':'mm";

  const formattedDate = format(new Date(date), formatTemplate, {
    locale: PT,
  });

  return formattedDate;
};
