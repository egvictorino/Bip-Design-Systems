export interface FormatCurrencyOptions {
  locale?: string;
  currency?: string;
}

export const formatCurrency = (
  amount: number,
  { locale = 'es-MX', currency = 'MXN' }: FormatCurrencyOptions = {}
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}

export const formatDate = (date: Date, { locale = 'es-MX', ...options }: FormatDateOptions = {}): string => {
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export const validateRFC = (rfc: string): boolean => {
  const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
  return rfcPattern.test(rfc);
};
