import { api } from "../../../shared/http/api.js";
import { Medicine } from "../../../shared/types.js";

export class MedicineService {
  static async getAll(): Promise<Medicine[]> {
    try {
      // O guide menciona /medicines, vou assumir que é isso.
      const response = await api.get<Medicine[]>("/medicines");
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id: number): Promise<Medicine> {
    try {
      const response = await api.get<Medicine>(`/medicines/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async create(medicine: Omit<Medicine, "id">): Promise<Medicine> {
    try {
      const response = await api.post<Medicine>("/medicines", medicine);
      return response;
    } catch (error) {
      throw error;
    }
  }
  static async update(
    id: number,
    medicine: Partial<Medicine>,
  ): Promise<Medicine> {
    try {
      const response = await api.put<Medicine>(`/medicines/${id}`, medicine);
      return response;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await api.delete(`/medicines/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
