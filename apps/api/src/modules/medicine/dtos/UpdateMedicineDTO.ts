export interface UpdateMedicineDTO {
  name?: string;
  manufacturer?: string | null;
  active_principle?: string;
  requires_prescription?: boolean;
  price?: number;
  category?: string;
  stock?: number;
}
