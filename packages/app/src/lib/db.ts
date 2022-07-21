export interface Row_Heartbeat {
  id: string;
  created_at: string;
  application_id: string; // FK -> applications.id
  body?: string;
  user_id: string; // FK -> users.id
  health: number; // 0.0-1.0
}

export interface Row_Application {
  id: string;
  created_at: string;
  secret: string;
  friendly_name: string;
  last_heartbeat_id: string; // FK -> heartbeats.id
  last_heartbeat_at: string;
  user_id: string; // FK -> users.id
  last_heartbeat_health: number; // 0.0-1.0
  emoji: string;
}
