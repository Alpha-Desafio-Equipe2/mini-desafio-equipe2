export interface CreateSaleDTO {
  customer_id?: number;

  items: {
    medicine_id: number;
    quantity: number;
  }[];
  doctor_crm?: string;
  doctor_name?: string;
  doctor_uf?: string;
  prescription_date?: string;
  payment_method?: string;
}
