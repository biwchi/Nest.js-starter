import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteDto } from 'src/utils/delete.dto';
import { UserUpdateDto } from '../dto/user/user.update.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

@Controller('user')
@ApiBearerAuth()
@ApiTags('Working with users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get user list
   */
  @Get()
  public async getAllUsers() {
    return await this.userService.findAll();
  }

  /**
   * Get user by id
   */
  @Get(':id')
  public async getCard(@Param('id') id: number) {
    if (!isNaN(Number(id))) {
      return await this.userService.findOneById(Number(id));
    }
    throw new BadRequestException();
  }

  /**
   * Update user
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  public async update(@Param('id') id: number, @Body() dto: UserUpdateDto) {
    await this.userService.update(id, dto);
  }

  /**
   * Delete users
   */
  @Delete()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  public async remove(@Body() dto: DeleteDto) {
    await this.userService.delete(dto);
  }
}
