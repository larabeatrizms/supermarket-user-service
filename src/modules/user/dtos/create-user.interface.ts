export interface CreateUserInterface {
  id: number;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    number: number;
    city: string;
    state: string;
    neighborhood: string;
    complement?: string;
  };
}
