/**
 * User Service
 * Serviço para gerenciar operações com usuários via API
 */

import { api } from "../../../shared/http/api.js";
import { User } from "../../../shared/types.js";

export interface CreateUserDTO {
  name: string;
  cpf: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER" | "CLIENT" | "attendant";
  phone?: string;
  address?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: "ADMIN" | "USER" | "CLIENT" | "attendant";
  phone?: string;
  address?: string;
  password?: string;
  balance?: number;
}

export class UserService {
  /**
   * Buscar todos os usuários
   */
  static async getAll(): Promise<User[]> {
    return api.get<User[]>("/users");
  }

  /**
   * Buscar usuário por ID
   */
  static async getById(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`);
  }

  /**
   * Criar novo usuário
   */
  static async create(data: CreateUserDTO): Promise<User> {
    return api.post<User>("/users", data);
  }

  /**
   * Atualizar usuário
   */
  static async update(id: number, data: UpdateUserDTO): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  }

  /**
   * Deletar usuário
   */
  static async delete(id: number): Promise<{ message: string }> {
    return api.delete<{ message: string }>(`/users/${id}`);
  }

  /**
   * Adicionar saldo ao usuário
   */
  static async addBalance(id: number, amount: number): Promise<{ newBalance: number }> {
    return api.post<{ newBalance: number }>(`/users/${id}/balance`, { amount });
  }
}
