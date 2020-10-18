export interface CreateProperty {
  title: string;
  price: string;
  description: string;
  type: string;
  country: string;
  city: string;
  fromDate: string;
  toDate: string;
  [key: string]: string;
}