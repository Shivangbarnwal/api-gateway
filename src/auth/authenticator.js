export class Authenticator {
  constructor() {
    this.tokens = new Map([
      [
        "admin-token",
        {
          id: "1",
          name: "Admin",
          role: "admin",
        },
      ],
      [
        "user-token",
        {
          id: "2",
          name: "User",
          role: "user",
        },
      ],
    ]);
  }

  authenticate(token) {
    const user = this.tokens.get(token);
    if (!user) {
        return {
            authenticated: false,
    };
    }
    return {
        authenticated: true,
        user: user,
    };
  }
}