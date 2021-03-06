import path from 'path'
import type {Logger} from 'pino'


export type PkgJson = {
  readonly name: string,
  readonly version: string
}

export type ConfigPaths = {
  readonly shareStatic: string,
  readonly root: string
}

export type ConfigServer = {
  readonly http: {
    readonly protocol: 'http' | 'https',
    readonly address: string,
    readonly host: string,
    readonly port: number
  },
  readonly cors: {
    readonly allowedOrigins: string[],
    readonly allowedHeaders: string[]
  },
  readonly csp: {
    readonly directives: {
      readonly defaultSrc: string[],
      readonly  data: string[]
      [key: string]: string[] | any
    }
  }
}

export type LoggerConfig = {
  readonly pretty: boolean,
  readonly isoTime: boolean,
  readonly time: boolean,
  readonly level: 'info' | 'debug'
}

export type UserConfig = {
  readonly session: {
    readonly maximum: number
    readonly cookie: {
      path: string,
      domain: string,
      sameSite: boolean | "lax" | "strict" | "none" | undefined,
      maxAge: number
    }
  },
  readonly superadmin: {
    readonly password: string,
    readonly username: string,
    readonly email: string
  }
}

export type DatabaseConfig = {
  readonly credentials: {
    readonly connectionString: string
  },
  options: {
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean,
    ignoreUndefined: boolean,
    keepAlive: boolean
  }
}

export class ConfigEntity {
  public configInfo: {
    usedOverrideFilePath?: string,
    usedEnv: string[]
  }
  public readonly production: boolean
  public readonly pkgJson: PkgJson
  public readonly paths: ConfigPaths
  public readonly server: ConfigServer
  public readonly logger: LoggerConfig
  public readonly user: UserConfig
  public readonly database: DatabaseConfig

  constructor(defaultConfig: ConfigEntity) {
    this.configInfo = defaultConfig.configInfo
    this.production = defaultConfig.production
    this.pkgJson = defaultConfig.pkgJson
    this.server = defaultConfig.server
    this.logger = defaultConfig.logger
    this.user = defaultConfig.user
    this.database = defaultConfig.database

    const rootDir = path.resolve(__dirname, '../../../')

    this.paths = {
      root: rootDir,
      shareStatic: path.resolve(rootDir, 'static/share')
    }
  }

  useLogger(logger: Logger) {
    logger = logger.child({label: 'config'})
    if (this.configInfo.usedOverrideFilePath) {
      logger.info(`Use override config file ${this.configInfo.usedOverrideFilePath}`)
    }
    this.configInfo.usedEnv.forEach(env => logger.info(`Used env ${env}`))

    if (this.production) {
      if (this.logger.pretty) {
        logger.warn(`You have set "logger.pretty" to "true", the recommended value in "production" mode is "false" to improve performance`)
      }
      if (this.logger.isoTime) {
        logger.warn(`You have set "logger.isoTime" to "true", the recommended value in "production" mode is "false" to improve performance`)
      }
    }
  }
}