export const isValidTitle = (title: string) => /^[^\s]+$/.test(title);
export const toValidTitle = (title: string) =>
  encodeURIComponent(title.replace(/[\s]/g, "_"));
