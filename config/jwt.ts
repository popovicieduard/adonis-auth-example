import Env from '@ioc:Adonis/Core/Env'

interface IJwt {
  appName: string,
  appKey: string,
  expiresIn: number
}

const jwtConfig: IJwt = {
  appName: Env.get('APP_NAME') as string || 'upnance',
  appKey: Env.getOrFail('APP_KEY') as string,
  expiresIn: 60*10,
}

export default jwtConfig
