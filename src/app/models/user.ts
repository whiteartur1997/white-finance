export interface User {
  idToken:	string;
  email:	string;
  refreshToken:	string;
  expiresIn:	string;
  localId: string;
  registered:	boolean;
  expirationDateInMs: number
}
