export class User {
  constructor(
    public id: number,
    public name:   string,
    public email:  string,
    public birth:  Date,
    public isAdmin: boolean,
  ) {}

  get displayBirth(): string {
    return this.birth.toLocaleDateString();
  }

  get age(): number {
    const diff = Date.now() - this.birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  static fromDto(dto: { id: number; name: string; email: string; birth: string; isAdmin:boolean }) {
    return new User(dto.id, dto.name, dto.email, new Date(dto.birth), dto.isAdmin);
  }

  toRegisterDto(hashedPassword: string) {
    return {
      name:     this.name,
      email:    this.email,
      birth:    this.birth.toISOString().split('T')[0],
      password: hashedPassword,
    };
  }
}