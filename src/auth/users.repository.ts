import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { hash } from 'bcrypt';
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    // const found = await this.findOne({ username: username });
    // if (found) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: 'This username already exists',
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    const hashedPw = await hash(password, 12);
    const user: User = this.create({ username, password: hashedPw });
    try {
      await this.save(user);
    } catch (err) {
      if (+err.code === 23505) {
        /* duplicate username */ throw new ConflictException(
          'username already exists',
        );
      } else {
        throw new InternalServerErrorException(
          'An error Occured, Please try again later!',
        );
      }
    }
  }
}
