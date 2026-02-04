export interface UpdateMedicineDTO {
  name?: string;
  manufacturer?: string | null;
  category?: string;
  active_principle?: string;
  requires_prescription?: boolean;
  price?: number;
  stock?: number;
}
