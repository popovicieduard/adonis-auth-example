interface UserCreateParams {
  emailAddress: string,
  password: string
}

export interface UserPasswordParams {
  password: string,
  passwordConfirmation: string,
}

export interface UserUpdatePasswordParams extends UserPasswordParams {
  oldPassword: string,
}

export interface UserResetParams extends UserPasswordParams {
  token: string
}

export interface UserLoginParams extends UserCreateParams {

}

export interface UserRegisterParams extends UserCreateParams {
  username: string,
  passwordConfirmation: string
}

export interface ApiAuthParams {
  username: string,
  apiKey: string
}
