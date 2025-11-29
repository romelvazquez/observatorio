import type { UserRole } from './enums'; 

export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  isActive: boolean;
  is_superuser: boolean;
  userprofile: {
    role: UserRole;
    organization: string;
  };
};

export type AuthUser = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  id: number;
};