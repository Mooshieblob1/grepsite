/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  openTicketModal: (ticket: any) => void;
  openNewTicketModal: (type?: string) => void;
  closeNewTicketModal: () => void;
  closeTicketDetailModal: () => void;
  editTicket: (id: string) => void;
  showAuditTrail: (id: string) => void;
}