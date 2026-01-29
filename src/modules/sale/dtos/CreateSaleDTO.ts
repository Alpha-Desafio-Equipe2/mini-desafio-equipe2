export interface CreateSaleDTO {
  customer_id?: number;
  branch_id: number;
  items: {
    medicine_id: number;
    quantity: number;
  }[];
  doctor?: {
    name: string;
    crm: string;
    uf: string;
  };
}
