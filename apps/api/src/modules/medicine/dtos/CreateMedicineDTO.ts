export interface CreateMedicineDTO {
  name: string;
  manufacturer?: string;
  active_principle: string;
  category: string;
  requires_prescription: boolean;
  price: number;
  stock: number;
  image_url?: string;
}
