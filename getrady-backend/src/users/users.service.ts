import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not, IsNull } from 'typeorm'
import { User } from './user.entity'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'
import { Like } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email;
    const exists = await this.repo.exist({ where: { email } });
    if (exists) throw new BadRequestException('Cette adresse mail est déjà utilisée.');
    const user = this.repo.create({ ...dto, email });
    await this.repo.save(user);
    return { id: user.id };
  }

  async login(dto: LoginDto) {
    const email = dto.email;
    const pass  = dto.password;
    const user = await this.repo.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Adresse mail inexistante');
    if (user.password !== pass) throw new BadRequestException('Mot de passe incorrect');
    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, name: user.name, email: user.email, birth: user.birth, isAdmin: user.isAdmin } };
  }


  async findById(id: number) {
    const user = await this.repo.findOneBy({ id })
    if (!user) throw new BadRequestException('user not found')
    return {
      id     : user.id,
      name   : user.name,
      email  : user.email,
      birth  : user.birth,
      isAdmin: user.isAdmin
    }
  }

  async updateAccount(userId: number, dto: UpdateAccountDto) {
    const payload = Object.fromEntries(
      Object.entries(dto).filter(([, v]) => v !== undefined && v !== '')
    );

    if ('email' in payload) {
      const exists = await this.repo.findOne({ where: { email: payload.email as string } });
      if (exists && exists.id !== userId) {
        throw new BadRequestException('Cette adresse mail est déjà utilisée.');
      }
    }

    if (Object.keys(payload).length === 0) {
      throw new BadRequestException('Aucune donnée à mettre à jour');
    }

    await this.repo.update(userId, payload);
    return { ok: true };
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.repo.findOneBy({ id: userId });
    if (!user || user.password !== dto.oldPassword) {
      throw new BadRequestException('Mot de passe incorrect');
    }
    if (dto.newPassword === user.password) {
      throw new BadRequestException('Le nouveau mot de passe ne peut pas être le même que l\'ancien');
    }
    await this.repo.update(userId, { password: dto.newPassword });
    return { ok: true };
  }

  async deleteAccount(userId: number) {
    await this.repo.delete(userId)
    return { ok: true }
  }

  /* -------------------- Push notifications -------------------- */
  async updatePushToken(userId: number, token: string) {
    await this.repo.update(userId, { expoPushToken: token });
    return { ok: true };
  }

  async getAllPushTokens(): Promise<string[]> {
    const rows = await this.repo.find({
      where: { expoPushToken: Not(IsNull()) },
      select: ['expoPushToken']
    });
    return rows.map(r => r.expoPushToken!).filter(Boolean);
  }

  // Ajouté: liste paginée des utilisateurs pour les admins
  async listUsers(requesterId: number, page = 1, search = '') {
    const requester = await this.repo.findOneBy({ id: requesterId })
    if (!requester?.isAdmin) {
      throw new ForbiddenException('Accès refusé')
    }

    const take = 50
    const skip = (page - 1) * take

    let whereCondition: any = {}
    if (search) {
      const pattern = `%${search}%`
      whereCondition = [
        { name: Like(pattern) },
        { email: Like(pattern) }
      ]
    }

    const [users, total] = await this.repo.findAndCount({
      where: whereCondition,
      take,
      skip,
      select: ['id', 'name', 'email', 'birth']
    })

    return {
      users,
      total,
      page,
      pageSize: take
    }
  }

  // Ajouté: suppression d'un utilisateur par un admin
  async removeUser(requesterId: number, targetId: number) {
    const requester = await this.repo.findOneBy({ id: requesterId })
    if (!requester?.isAdmin) {
      throw new ForbiddenException('Accès refusé')
    }
    if (requesterId === targetId) {
      throw new BadRequestException('Un administrateur ne peut pas se supprimer lui-même.')
    }

    await this.repo.delete(targetId)
    return { ok: true }
  }
}