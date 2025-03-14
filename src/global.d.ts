// global.d.ts
declare global {
  interface DateConstructor {
    new(value?: string | number | Date): Date;
  }
}

export {}; 