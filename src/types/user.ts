// Temporary User type definition for Redis implementation
// This will be replaced by the actual Prisma-generated types once the client is generated
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}