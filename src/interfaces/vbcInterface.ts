export interface VbcCard {
  id: string;
  user_id: string;
  display_name: string;
  job_title?: string;
  company_name?: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  allow_vbc_sharing: boolean;
  is_deleted: boolean;
}

export interface CreateVbcPayload {
  user_id: string;
  display_name: string;
  job_title?: string;
  company_name?: string;
  location?: string;
  allow_vbc_sharing?: boolean;
}

export interface UpdateVbcPayload {
  display_name?: string;
  job_title?: string;
  company_name?: string;
  location?: string;
  allow_vbc_sharing: boolean;
}

export interface ShareVbcPayload {
  card_id: string;
  card_owner_id: string;
  shared_by_id: string;
  received_by_id: string;
}
