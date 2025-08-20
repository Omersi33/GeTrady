// src/types/auth.ts

export interface User {
  id: number
  name:   string
  email:  string
  birth?: string
  isAdmin: boolean
}

export interface RegisterDto {
  name:     string
  email:    string
  password: string
  birth?:   string
}

export interface LoginDto {
  email:    string
  password: string
}

export interface AuthResponse {
  token: string
  user:  User
}

export interface AuthContextValue {
  user:       User | null
  isLoading:  boolean
  login:      (credentials: LoginDto) => Promise<void>
  register:   (data: RegisterDto)    => Promise<void>
  logout:     ()                    => Promise<void>
}