export interface Row_Heartbeat {
  id: string;
  created_at: string;
  application_id: string; // FK -> applications.id
  body?: string;
  user_id: string; // FK -> users.id
}

export interface Row_Application {
  id: string;
  created_at: string;
  secret: string;
  friendly_name: string;
  last_heartbeat_id: string; // FK -> heartbeats.id
  last_heartbeat_at: string;
  user_id: string; // FK -> users.id
}
