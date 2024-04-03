export interface Product {
  id: string;
  title: string;
  description?: string;
  status: string;
  price: number;
  currency: string;
  limitQuantity?: boolean;
  quantity?: string;
  hideQuantity?: boolean;
  hideSales?: boolean;
  onPurchaseRedirect?: boolean;
  redirectLink?: string;
  refundEnabled?: boolean;
}
