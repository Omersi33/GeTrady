import { Controller, Post, Body, UseGuards, Req, Delete, Patch, Get, Query, Param } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { UpdateAccountDto } from './dto/update-account.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

interface JwtRequest extends Request {
  user: { userId: number };
}

@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.svc.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.svc.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: JwtRequest) {
    return this.svc.findById(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout() {
    return { ok: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  update(@Req() req: JwtRequest, @Body() dto: UpdateAccountDto) {
    return this.svc.updateAccount(req.user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('change-password')
  changePass(@Req() req: JwtRequest, @Body() dto: UpdatePasswordDto) {
    return this.svc.updatePassword(req.user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  delete(@Req() req: JwtRequest) {
    return this.svc.deleteAccount(req.user.userId);
  }

  /* ------- Push token -------- */
  @UseGuards(AuthGuard('jwt'))
  @Patch('push-token')
  setPushToken(@Req() req: JwtRequest, @Body('token') token: string) {
    return this.svc.updatePushToken(req.user.userId, token);
  }

  // Endpoint list users (admin only)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  listUsers(
    @Req() req: JwtRequest,
    @Query('page') page = '1',
    @Query('search') search = ''
  ) {
    return this.svc.listUsers(req.user.userId, Number(page), search);
  }

  // Endpoint delete user by id (admin only)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removeUser(
    @Req() req: JwtRequest,
    @Param('id') id: string
  ) {
    return this.svc.removeUser(req.user.userId, Number(id));
  }
}