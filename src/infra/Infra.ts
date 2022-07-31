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

type ReadFile = {
  (path: string): Promise<Buffer>;
  (path: string, encoding: 'utf8'): Promise<string>;
}

export interface IInfra {
  writeStdout(message: string): void;
  env(): Record<string, string | undefined>;
  spawn(...args: any[]): Promise<void>;
  cwd(): string;
  fsExists(path: string): boolean;
  fsMkDir(path: string): Promise<void>;
  fsReadFile: ReadFile;
  fsWrite(path: string, data: string,  encoding?: 'utf8',) : Promise<void>;
  require(path: string): any; // oh, I forgot about how intense this is
  newDate(p: string | number): Date;
  version(): string;
  post(...args: any[]): Promise<unknown>; 
}

export type Eff<T> = (infra: IInfra) => Promise<T>