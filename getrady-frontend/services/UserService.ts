import { api } from './api';
import type { User, RegisterDto, LoginDto, AuthResponse } from '../types/auth';

export class UserService {
  static async register(dto: RegisterDto): Promise<User> {
    const { data } = await api.post<AuthResponse>('/users/register', dto);
    globalThis.token = data.token;
    return data.user;
  }

  static async login(dto: LoginDto): Promise<User> {
    const { data } = await api.post<AuthResponse>('/users/login', dto);
    globalThis.token = data.token;
    return data.user;
  }

  static async logout(): Promise<void> {
    await api.post('/users/logout');
    globalThis.token = undefined;
  }

  static async me(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  }

  /** Liste paginée des utilisateurs (admin) */
  static async listUsers(page: number = 1, search: string = ''): Promise<{
    users: User[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { data } = await api.get('/users', { params: { page, search } });
    return data;
  }

  /** Supprime un utilisateur (admin) */
  static async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}