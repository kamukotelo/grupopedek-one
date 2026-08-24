import type { UserRole } from '../types/auth';

export interface PortalPermissions {
  fleet: boolean;
  finances: boolean;
  operations: boolean;
  odoo: boolean;
  priorityRequest: boolean;
  globalFleet: boolean;
}

const PERMISSIONS: Record<UserRole, PortalPermissions> = {
  cliente_normal: { fleet: true, finances: true, operations: false, odoo: false, priorityRequest: true, globalFleet: false },
  cliente_vip: { fleet: true, finances: true, operations: false, odoo: false, priorityRequest: true, globalFleet: false },
  vendedor: { fleet: true, finances: false, operations: false, odoo: false, priorityRequest: false, globalFleet: false },
  gestor_reservas: { fleet: true, finances: false, operations: true, odoo: true, priorityRequest: false, globalFleet: true },
  diretor_frotas: { fleet: true, finances: false, operations: true, odoo: true, priorityRequest: false, globalFleet: true },
  motorista: { fleet: true, finances: false, operations: false, odoo: false, priorityRequest: false, globalFleet: false },
  contabilista: { fleet: false, finances: true, operations: false, odoo: true, priorityRequest: false, globalFleet: false },
  gestor_portugal: { fleet: true, finances: true, operations: true, odoo: true, priorityRequest: false, globalFleet: true },
  direcao: { fleet: true, finances: true, operations: true, odoo: true, priorityRequest: false, globalFleet: true },
};

export const getPortalPermissions = (role?: UserRole): PortalPermissions =>
  role ? PERMISSIONS[role] : {
    fleet: false,
    finances: false,
    operations: false,
    odoo: false,
    priorityRequest: false,
    globalFleet: false,
  };
