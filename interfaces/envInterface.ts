export interface EnvInterface {
  APP: {
    NAME: string;
    PORT: number | string;
    ENV: string;
  };
  DB: {
    HOST: string;
    PORT: number;
    USERNAME: string;
    PASSWORD: string;
    NAME: string;
  };
  JWT: {
    SECRET: string;
  };
}
