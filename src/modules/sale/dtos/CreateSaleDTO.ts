export interface CreateSaleDTO {
  customer_id?: number;
  branch_id: number;
  items: {
    medicine_id: number;
    quantity: number;
  }[];
  doctor_crm?: string;
  prescription_date?: string;
  payment_method?: string;
}
