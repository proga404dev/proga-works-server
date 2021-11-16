export interface IUserQueryParams {
  skip?: string;
  take?: string;
  orderBy?: 'firstname' | 'lastname' | 'nickname' | 'email' | 'mobilePhoneNumber' | 'createdAt';
  id?: string;
  term?: 'asc' | 'desc';
  firstname?: string;
  lastname?: string;
  nickname?: string;
  email?: string;
  mobilePhoneNumber?: string;
  pagination?: '0' | '1';
}