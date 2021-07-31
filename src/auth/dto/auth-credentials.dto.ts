import { IsNotEmpty, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @MinLength(4)
  username!: string;

  @IsNotEmpty()
  @MinLength(4)
  // @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password is weak',
  // })
  password!: string;
}
