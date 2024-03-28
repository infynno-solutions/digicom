export class IAuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
}

export class IRequestWithUser {
  user: IAuthUser;
}
