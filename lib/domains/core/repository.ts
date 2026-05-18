/**
 * Enterprise Base Repository Interface
 * Defines the standard contract for all domain repositories.
 */

export interface IRepository<T, CreateDTO, UpdateDTO> {
  /**
   * Find an entity by its ID, scoped to a tenant.
   */
  findById(tenantId: string, id: string): Promise<T | null>;

  /**
   * Find multiple entities matching criteria, scoped to a tenant.
   */
  findMany(tenantId: string, params: Record<string, any>): Promise<T[]>;

  /**
   * Create a new entity within a tenant.
   */
  create(tenantId: string, data: CreateDTO): Promise<T>;

  /**
   * Update an existing entity within a tenant.
   */
  update(tenantId: string, id: string, data: UpdateDTO): Promise<T>;

  /**
   * Delete an entity within a tenant.
   */
  delete(tenantId: string, id: string): Promise<boolean>;
}

/**
 * Unit of Work interface for managing transaction boundaries across repositories.
 */
export interface IUnitOfWork {
  execute<T>(fn: (tx: any) => Promise<T>): Promise<T>;
}
