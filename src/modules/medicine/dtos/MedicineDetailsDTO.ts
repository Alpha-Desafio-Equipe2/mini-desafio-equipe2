export interface MedicineDetailsDTO {
  id: number;
  name: string;
  manufacturer: string | null;
  activePrinciple: string;
  requiresPrescription: boolean;
  price: number;
  stock: number;
}
