declare namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    DATABASEUSER: string;
    DATABASEHOST: string;
    DATABASENAME: string;
    DATABASEPASSWORD: string;
    DATABASEPORT: string;
  }
}
