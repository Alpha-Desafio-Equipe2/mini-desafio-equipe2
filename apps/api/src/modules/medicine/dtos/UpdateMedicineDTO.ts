export interface UpdateMedicineDTO {
  name?: string;
  manufacturer?: string | null;
  active_principle?: string;
  category?: string;
  requires_prescription?: boolean;
  price?: number;
  stock?: number;
}
