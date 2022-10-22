export interface IUpdateUserAddress {
  id: number;
  street: string;
  postalCode: string;
  number: number;
  city: string;
  state: string;
  neighborhood: string;
  complement?: string;
}
