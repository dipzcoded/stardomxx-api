export interface CreateEmergencyContactDTO {
  name: string;
  relationshipType: string;
  phoneNumber: string;
  address: string;
  address2?: string;
  town: string;
  state: string;
}
