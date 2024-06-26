// export default {
//   writeStdout: (str) => process.stdout.write(str),
//   env: () => process.env,
//   spawn: (...args) => spawn(...args),
//   cwd: () => process.cwd(),
//   fsExists: (...args) => existsSync(...args),
//   fsMkDir: (...args) => FS.mkdir(...args),
//   fsWrite: (...args) => FS.writeFile(...args),
//   fsReadFile: (...args) => FS.readFile(...args),
//   require: (path) => require(path),
//   newDate: (...args) => new Date(...args),
//   version: () => version,
//   post: (...args) => post(...args),
// }

import type { Duplex, Writable, Readable } from 'node:stream'

type ReadFile = {
  (path: string): Promise<Buffer>
  (path: string, encoding: 'utf8'): Promise<string>
}

export type SpawnedCP = {
  stdin: Writable
  stdout: Readable
  stderr: Readable
  exit: Promise<number>
  name: string
}

export interface IInfra {
  env(): Record<string, string | undefined>
  spawn(...args: any[]): SpawnedCP
  cwd(): string
  fsExists(path: string): boolean
  fsMkDir(path: string): Promise<void>
  fsMkDTemp(path: string): Promise<string>
  tmpDir(): string
  fsReadFile: ReadFile
  fsWrite(path: string, data: string, encoding?: 'utf8'): Promise<void>
  fsCp(src: string, dest: string, options: { recursive: true }): Promise<void>
  import(path: string): Promise<any> // oh, I forgot about how intense this is
  newDate(p: string | number): Date
  request: typeof import('./https').request
  stdout: Duplex
  stderr: Duplex
}

export type Eff<T> = (infra: IInfra) => Promise<T>
