export interface Stake {
  amount?: string;
  member?: Member[];
}

// TODO: Add complete types
export interface Member {
  id: string;
  address: string;
  alias: string;
  endorsementsReceived: string;
}