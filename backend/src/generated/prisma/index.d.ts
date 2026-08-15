/**
 * Client
 **/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Role
 *
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>;
/**
 * Model Admin
 *
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>;
/**
 * Model PasswordResetToken
 *
 */
export type PasswordResetToken =
  $Result.DefaultSelection<Prisma.$PasswordResetTokenPayload>;
/**
 * Model Attendee
 *
 */
export type Attendee = $Result.DefaultSelection<Prisma.$AttendeePayload>;
/**
 * Model Ticket
 *
 */
export type Ticket = $Result.DefaultSelection<Prisma.$TicketPayload>;
/**
 * Model Payment
 *
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const TicketStatus: {
    ACTIVE: 'ACTIVE';
    USED: 'USED';
    CANCELLED: 'CANCELLED';
    EXPIRED: 'EXPIRED';
  };

  export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];

  export const PaymentStatus: {
    PENDING: 'PENDING';
    PROCESSING: 'PROCESSING';
    SUCCESS: 'SUCCESS';
    FAILED: 'FAILED';
    REFUNDED: 'REFUNDED';
  };

  export type PaymentStatus =
    (typeof PaymentStatus)[keyof typeof PaymentStatus];
}

export type TicketStatus = $Enums.TicketStatus;

export const TicketStatus: typeof $Enums.TicketStatus;

export type PaymentStatus = $Enums.PaymentStatus;

export const PaymentStatus: typeof $Enums.PaymentStatus;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Roles
 * const roles = await prisma.role.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Roles
   * const roles = await prisma.role.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent,
    ) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Roles
   * const roles = await prisma.role.findMany()
   * ```
   */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Admins
   * const admins = await prisma.admin.findMany()
   * ```
   */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more PasswordResetTokens
   * const passwordResetTokens = await prisma.passwordResetToken.findMany()
   * ```
   */
  get passwordResetToken(): Prisma.PasswordResetTokenDelegate<
    ExtArgs,
    ClientOptions
  >;

  /**
   * `prisma.attendee`: Exposes CRUD operations for the **Attendee** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Attendees
   * const attendees = await prisma.attendee.findMany()
   * ```
   */
  get attendee(): Prisma.AttendeeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Tickets
   * const tickets = await prisma.ticket.findMany()
   * ```
   */
  get ticket(): Prisma.TicketDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Payments
   * const payments = await prisma.payment.findMany()
   * ```
   */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 7.9.1
   * Query Engine version: e922089b7d7502aff4249d5da3420f6fa55fc6ad
   */
  export type PrismaVersion = {
    client: string;
    engine: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options]
      ? PrismaClientOptions
      : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? ((Without<T, U> & U) | (Without<U, T> & T)) & object
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Role: 'Role';
    Admin: 'Admin';
    PasswordResetToken: 'PasswordResetToken';
    Attendee: 'Attendee';
    Ticket: 'Ticket';
    Payment: 'Payment';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'role'
        | 'admin'
        | 'passwordResetToken'
        | 'attendee'
        | 'ticket'
        | 'payment';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>;
        fields: Prisma.RoleFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>;
          };
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>;
          };
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[];
          };
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>;
          };
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[];
          };
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>;
          };
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>;
          };
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[];
          };
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$RolePayload>;
          };
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateRole>;
          };
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>;
            result: $Utils.Optional<RoleGroupByOutputType>[];
          };
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>;
            result: $Utils.Optional<RoleCountAggregateOutputType> | number;
          };
        };
      };
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>;
        fields: Prisma.AdminFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>;
          };
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>;
          };
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[];
          };
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>;
          };
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[];
          };
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>;
          };
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>;
          };
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AdminUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[];
          };
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>;
          };
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAdmin>;
          };
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AdminGroupByOutputType>[];
          };
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>;
            result: $Utils.Optional<AdminCountAggregateOutputType> | number;
          };
        };
      };
      PasswordResetToken: {
        payload: Prisma.$PasswordResetTokenPayload<ExtArgs>;
        fields: Prisma.PasswordResetTokenFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
          };
          findFirst: {
            args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
          };
          findMany: {
            args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
          };
          create: {
            args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
          };
          createMany: {
            args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
          };
          delete: {
            args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
          };
          update: {
            args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
          };
          deleteMany: {
            args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[];
          };
          upsert: {
            args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>;
          };
          aggregate: {
            args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePasswordResetToken>;
          };
          groupBy: {
            args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PasswordResetTokenGroupByOutputType>[];
          };
          count: {
            args: Prisma.PasswordResetTokenCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<PasswordResetTokenCountAggregateOutputType>
              | number;
          };
        };
      };
      Attendee: {
        payload: Prisma.$AttendeePayload<ExtArgs>;
        fields: Prisma.AttendeeFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AttendeeFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AttendeeFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>;
          };
          findFirst: {
            args: Prisma.AttendeeFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AttendeeFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>;
          };
          findMany: {
            args: Prisma.AttendeeFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>[];
          };
          create: {
            args: Prisma.AttendeeCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>;
          };
          createMany: {
            args: Prisma.AttendeeCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AttendeeCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>[];
          };
          delete: {
            args: Prisma.AttendeeDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>;
          };
          update: {
            args: Prisma.AttendeeUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>;
          };
          deleteMany: {
            args: Prisma.AttendeeDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AttendeeUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AttendeeUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>[];
          };
          upsert: {
            args: Prisma.AttendeeUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AttendeePayload>;
          };
          aggregate: {
            args: Prisma.AttendeeAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAttendee>;
          };
          groupBy: {
            args: Prisma.AttendeeGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AttendeeGroupByOutputType>[];
          };
          count: {
            args: Prisma.AttendeeCountArgs<ExtArgs>;
            result: $Utils.Optional<AttendeeCountAggregateOutputType> | number;
          };
        };
      };
      Ticket: {
        payload: Prisma.$TicketPayload<ExtArgs>;
        fields: Prisma.TicketFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TicketFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TicketFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>;
          };
          findFirst: {
            args: Prisma.TicketFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TicketFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>;
          };
          findMany: {
            args: Prisma.TicketFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[];
          };
          create: {
            args: Prisma.TicketCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>;
          };
          createMany: {
            args: Prisma.TicketCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TicketCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[];
          };
          delete: {
            args: Prisma.TicketDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>;
          };
          update: {
            args: Prisma.TicketUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>;
          };
          deleteMany: {
            args: Prisma.TicketDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TicketUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.TicketUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>[];
          };
          upsert: {
            args: Prisma.TicketUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TicketPayload>;
          };
          aggregate: {
            args: Prisma.TicketAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTicket>;
          };
          groupBy: {
            args: Prisma.TicketGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TicketGroupByOutputType>[];
          };
          count: {
            args: Prisma.TicketCountArgs<ExtArgs>;
            result: $Utils.Optional<TicketCountAggregateOutputType> | number;
          };
        };
      };
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>;
        fields: Prisma.PaymentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>;
          };
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>;
          };
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[];
          };
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>;
          };
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[];
          };
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>;
          };
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>;
          };
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[];
          };
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>;
          };
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePayment>;
          };
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PaymentGroupByOutputType>[];
          };
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>;
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     *
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     *
     * Learn more: https://pris.ly/d/driver-adapters
     *
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     *
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory;
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     *
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
  }
  export type GlobalOmitConfig = {
    role?: RoleOmit;
    admin?: AdminOmit;
    passwordResetToken?: PasswordResetTokenOmit;
    attendee?: AttendeeOmit;
    ticket?: TicketOmit;
    payment?: PaymentOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    admins: number;
    attendees: number;
  };

  export type RoleCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    admins?: boolean | RoleCountOutputTypeCountAdminsArgs;
    attendees?: boolean | RoleCountOutputTypeCountAttendeesArgs;
  };

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountAdminsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AdminWhereInput;
  };

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountAttendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AttendeeWhereInput;
  };

  /**
   * Count Type AdminCountOutputType
   */

  export type AdminCountOutputType = {
    invitedAdmins: number;
    passwordResetTokens: number;
  };

  export type AdminCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    invitedAdmins?: boolean | AdminCountOutputTypeCountInvitedAdminsArgs;
    passwordResetTokens?:
      | boolean
      | AdminCountOutputTypeCountPasswordResetTokensArgs;
  };

  // Custom InputTypes
  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AdminCountOutputType
     */
    select?: AdminCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeCountInvitedAdminsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AdminWhereInput;
  };

  /**
   * AdminCountOutputType without action
   */
  export type AdminCountOutputTypeCountPasswordResetTokensArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PasswordResetTokenWhereInput;
  };

  /**
   * Count Type AttendeeCountOutputType
   */

  export type AttendeeCountOutputType = {
    payments: number;
    tickets: number;
  };

  export type AttendeeCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    payments?: boolean | AttendeeCountOutputTypeCountPaymentsArgs;
    tickets?: boolean | AttendeeCountOutputTypeCountTicketsArgs;
  };

  // Custom InputTypes
  /**
   * AttendeeCountOutputType without action
   */
  export type AttendeeCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the AttendeeCountOutputType
     */
    select?: AttendeeCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * AttendeeCountOutputType without action
   */
  export type AttendeeCountOutputTypeCountPaymentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PaymentWhereInput;
  };

  /**
   * AttendeeCountOutputType without action
   */
  export type AttendeeCountOutputTypeCountTicketsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TicketWhereInput;
  };

  /**
   * Count Type PaymentCountOutputType
   */

  export type PaymentCountOutputType = {
    tickets: number;
  };

  export type PaymentCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    tickets?: boolean | PaymentCountOutputTypeCountTicketsArgs;
  };

  // Custom InputTypes
  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PaymentCountOutputType
     */
    select?: PaymentCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * PaymentCountOutputType without action
   */
  export type PaymentCountOutputTypeCountTicketsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TicketWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null;
    _min: RoleMinAggregateOutputType | null;
    _max: RoleMaxAggregateOutputType | null;
  };

  export type RoleMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type RoleMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type RoleCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    permissions: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type RoleMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type RoleMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type RoleCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    permissions?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type RoleAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Roles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Roles
     **/
    _count?: true | RoleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: RoleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: RoleMaxAggregateInputType;
  };

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
    [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>;
  };

  export type RoleGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: RoleWhereInput;
    orderBy?:
      | RoleOrderByWithAggregationInput
      | RoleOrderByWithAggregationInput[];
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum;
    having?: RoleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoleCountAggregateInputType | true;
    _min?: RoleMinAggregateInputType;
    _max?: RoleMaxAggregateInputType;
  };

  export type RoleGroupByOutputType = {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: RoleCountAggregateOutputType | null;
    _min: RoleMinAggregateOutputType | null;
    _max: RoleMaxAggregateOutputType | null;
  };

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> & {
        [P in keyof T & keyof RoleGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
          : GetScalarType<T[P], RoleGroupByOutputType[P]>;
      }
    >
  >;

  export type RoleSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      permissions?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      admins?: boolean | Role$adminsArgs<ExtArgs>;
      attendees?: boolean | Role$attendeesArgs<ExtArgs>;
      _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['role']
  >;

  export type RoleSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      permissions?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['role']
  >;

  export type RoleSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      description?: boolean;
      permissions?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['role']
  >;

  export type RoleSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    permissions?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type RoleOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'name'
    | 'description'
    | 'permissions'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['role']
  >;
  export type RoleInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    admins?: boolean | Role$adminsArgs<ExtArgs>;
    attendees?: boolean | Role$attendeesArgs<ExtArgs>;
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type RoleIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type RoleIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $RolePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Role';
    objects: {
      admins: Prisma.$AdminPayload<ExtArgs>[];
      attendees: Prisma.$AttendeePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        description: string;
        permissions: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['role']
    >;
    composites: {};
  };

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> =
    $Result.GetResult<Prisma.$RolePayload, S>;

  type RoleCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoleCountAggregateInputType | true;
  };

  export interface RoleDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Role'];
      meta: { name: 'Role' };
    };
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(
      args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(
      args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     *
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RoleFindManyArgs>(
      args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     *
     */
    create<T extends RoleCreateArgs>(
      args: SelectSubset<T, RoleCreateArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RoleCreateManyArgs>(
      args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     *
     */
    delete<T extends RoleDeleteArgs>(
      args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RoleUpdateArgs>(
      args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RoleDeleteManyArgs>(
      args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RoleUpdateManyArgs>(
      args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(
      args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
     **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends RoleAggregateArgs>(
      args: Subset<T, RoleAggregateArgs>,
    ): Prisma.PrismaPromise<GetRoleAggregateType<T>>;

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetRoleGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Role model
     */
    readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    admins<T extends Role$adminsArgs<ExtArgs> = {}>(
      args?: Subset<T, Role$adminsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AdminPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    attendees<T extends Role$attendeesArgs<ExtArgs> = {}>(
      args?: Subset<T, Role$attendeesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AttendeePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<'Role', 'String'>;
    readonly name: FieldRef<'Role', 'String'>;
    readonly description: FieldRef<'Role', 'String'>;
    readonly permissions: FieldRef<'Role', 'String[]'>;
    readonly isActive: FieldRef<'Role', 'Boolean'>;
    readonly createdAt: FieldRef<'Role', 'DateTime'>;
    readonly updatedAt: FieldRef<'Role', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput;
  };

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput;
  };

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Roles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[];
  };

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Roles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[];
  };

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Roles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[];
  };

  /**
   * Role create
   */
  export type RoleCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>;
  };

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Role update
   */
  export type RoleUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>;
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput;
  };

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>;
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput;
    /**
     * Limit how many Roles to update.
     */
    limit?: number;
  };

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>;
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput;
    /**
     * Limit how many Roles to update.
     */
    limit?: number;
  };

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput;
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>;
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>;
  };

  /**
   * Role delete
   */
  export type RoleDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput;
  };

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput;
    /**
     * Limit how many Roles to delete.
     */
    limit?: number;
  };

  /**
   * Role.admins
   */
  export type Role$adminsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    where?: AdminWhereInput;
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[];
    cursor?: AdminWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[];
  };

  /**
   * Role.attendees
   */
  export type Role$attendeesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    where?: AttendeeWhereInput;
    orderBy?:
      | AttendeeOrderByWithRelationInput
      | AttendeeOrderByWithRelationInput[];
    cursor?: AttendeeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[];
  };

  /**
   * Role without action
   */
  export type RoleDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
  };

  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null;
    _min: AdminMinAggregateOutputType | null;
    _max: AdminMaxAggregateOutputType | null;
  };

  export type AdminMinAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    email: string | null;
    password: string | null;
    roleId: string | null;
    isActive: boolean | null;
    invitedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AdminMaxAggregateOutputType = {
    id: string | null;
    fullName: string | null;
    email: string | null;
    password: string | null;
    roleId: string | null;
    isActive: boolean | null;
    invitedById: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AdminCountAggregateOutputType = {
    id: number;
    fullName: number;
    email: number;
    password: number;
    roleId: number;
    isActive: number;
    invitedById: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type AdminMinAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    password?: true;
    roleId?: true;
    isActive?: true;
    invitedById?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AdminMaxAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    password?: true;
    roleId?: true;
    isActive?: true;
    invitedById?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AdminCountAggregateInputType = {
    id?: true;
    fullName?: true;
    email?: true;
    password?: true;
    roleId?: true;
    isActive?: true;
    invitedById?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AdminAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Admins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Admins
     **/
    _count?: true | AdminCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AdminMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AdminMaxAggregateInputType;
  };

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
    [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>;
  };

  export type AdminGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AdminWhereInput;
    orderBy?:
      | AdminOrderByWithAggregationInput
      | AdminOrderByWithAggregationInput[];
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum;
    having?: AdminScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AdminCountAggregateInputType | true;
    _min?: AdminMinAggregateInputType;
    _max?: AdminMaxAggregateInputType;
  };

  export type AdminGroupByOutputType = {
    id: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive: boolean;
    invitedById: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: AdminCountAggregateOutputType | null;
    _min: AdminMinAggregateOutputType | null;
    _max: AdminMaxAggregateOutputType | null;
  };

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AdminGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AdminGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>;
        }
      >
    >;

  export type AdminSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      fullName?: boolean;
      email?: boolean;
      password?: boolean;
      roleId?: boolean;
      isActive?: boolean;
      invitedById?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      role?: boolean | RoleDefaultArgs<ExtArgs>;
      inviter?: boolean | Admin$inviterArgs<ExtArgs>;
      invitedAdmins?: boolean | Admin$invitedAdminsArgs<ExtArgs>;
      passwordResetTokens?: boolean | Admin$passwordResetTokensArgs<ExtArgs>;
      _count?: boolean | AdminCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['admin']
  >;

  export type AdminSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      fullName?: boolean;
      email?: boolean;
      password?: boolean;
      roleId?: boolean;
      isActive?: boolean;
      invitedById?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      role?: boolean | RoleDefaultArgs<ExtArgs>;
      inviter?: boolean | Admin$inviterArgs<ExtArgs>;
    },
    ExtArgs['result']['admin']
  >;

  export type AdminSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      fullName?: boolean;
      email?: boolean;
      password?: boolean;
      roleId?: boolean;
      isActive?: boolean;
      invitedById?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      role?: boolean | RoleDefaultArgs<ExtArgs>;
      inviter?: boolean | Admin$inviterArgs<ExtArgs>;
    },
    ExtArgs['result']['admin']
  >;

  export type AdminSelectScalar = {
    id?: boolean;
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    roleId?: boolean;
    isActive?: boolean;
    invitedById?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type AdminOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'fullName'
    | 'email'
    | 'password'
    | 'roleId'
    | 'isActive'
    | 'invitedById'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['admin']
  >;
  export type AdminInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    role?: boolean | RoleDefaultArgs<ExtArgs>;
    inviter?: boolean | Admin$inviterArgs<ExtArgs>;
    invitedAdmins?: boolean | Admin$invitedAdminsArgs<ExtArgs>;
    passwordResetTokens?: boolean | Admin$passwordResetTokensArgs<ExtArgs>;
    _count?: boolean | AdminCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type AdminIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    role?: boolean | RoleDefaultArgs<ExtArgs>;
    inviter?: boolean | Admin$inviterArgs<ExtArgs>;
  };
  export type AdminIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    role?: boolean | RoleDefaultArgs<ExtArgs>;
    inviter?: boolean | Admin$inviterArgs<ExtArgs>;
  };

  export type $AdminPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Admin';
    objects: {
      role: Prisma.$RolePayload<ExtArgs>;
      inviter: Prisma.$AdminPayload<ExtArgs> | null;
      invitedAdmins: Prisma.$AdminPayload<ExtArgs>[];
      passwordResetTokens: Prisma.$PasswordResetTokenPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        fullName: string;
        email: string;
        password: string;
        roleId: string;
        isActive: boolean;
        invitedById: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['admin']
    >;
    composites: {};
  };

  type AdminGetPayload<
    S extends boolean | null | undefined | AdminDefaultArgs,
  > = $Result.GetResult<Prisma.$AdminPayload, S>;

  type AdminCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AdminCountAggregateInputType | true;
  };

  export interface AdminDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Admin'];
      meta: { name: 'Admin' };
    };
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(
      args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(
      args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     *
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AdminFindManyArgs>(
      args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     *
     */
    create<T extends AdminCreateArgs>(
      args: SelectSubset<T, AdminCreateArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AdminCreateManyArgs>(
      args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     *
     */
    delete<T extends AdminDeleteArgs>(
      args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AdminUpdateArgs>(
      args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AdminDeleteManyArgs>(
      args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AdminUpdateManyArgs>(
      args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {AdminUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AdminUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AdminUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(
      args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
     **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AdminAggregateArgs>(
      args: Subset<T, AdminAggregateArgs>,
    ): Prisma.PrismaPromise<GetAdminAggregateType<T>>;

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetAdminGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Admin model
     */
    readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, RoleDefaultArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      | $Result.GetResult<
          Prisma.$RolePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    inviter<T extends Admin$inviterArgs<ExtArgs> = {}>(
      args?: Subset<T, Admin$inviterArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      $Result.GetResult<
        Prisma.$AdminPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    invitedAdmins<T extends Admin$invitedAdminsArgs<ExtArgs> = {}>(
      args?: Subset<T, Admin$invitedAdminsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AdminPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    passwordResetTokens<T extends Admin$passwordResetTokensArgs<ExtArgs> = {}>(
      args?: Subset<T, Admin$passwordResetTokensArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PasswordResetTokenPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<'Admin', 'String'>;
    readonly fullName: FieldRef<'Admin', 'String'>;
    readonly email: FieldRef<'Admin', 'String'>;
    readonly password: FieldRef<'Admin', 'String'>;
    readonly roleId: FieldRef<'Admin', 'String'>;
    readonly isActive: FieldRef<'Admin', 'Boolean'>;
    readonly invitedById: FieldRef<'Admin', 'String'>;
    readonly createdAt: FieldRef<'Admin', 'DateTime'>;
    readonly updatedAt: FieldRef<'Admin', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput;
  };

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput;
  };

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Admins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[];
  };

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Admins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[];
  };

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Admins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[];
  };

  /**
   * Admin create
   */
  export type AdminCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>;
  };

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Admin update
   */
  export type AdminUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>;
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput;
  };

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>;
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput;
    /**
     * Limit how many Admins to update.
     */
    limit?: number;
  };

  /**
   * Admin updateManyAndReturn
   */
  export type AdminUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>;
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput;
    /**
     * Limit how many Admins to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput;
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>;
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>;
  };

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput;
  };

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput;
    /**
     * Limit how many Admins to delete.
     */
    limit?: number;
  };

  /**
   * Admin.inviter
   */
  export type Admin$inviterArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    where?: AdminWhereInput;
  };

  /**
   * Admin.invitedAdmins
   */
  export type Admin$invitedAdminsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
    where?: AdminWhereInput;
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[];
    cursor?: AdminWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[];
  };

  /**
   * Admin.passwordResetTokens
   */
  export type Admin$passwordResetTokensArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    where?: PasswordResetTokenWhereInput;
    orderBy?:
      | PasswordResetTokenOrderByWithRelationInput
      | PasswordResetTokenOrderByWithRelationInput[];
    cursor?: PasswordResetTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | PasswordResetTokenScalarFieldEnum
      | PasswordResetTokenScalarFieldEnum[];
  };

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminInclude<ExtArgs> | null;
  };

  /**
   * Model PasswordResetToken
   */

  export type AggregatePasswordResetToken = {
    _count: PasswordResetTokenCountAggregateOutputType | null;
    _min: PasswordResetTokenMinAggregateOutputType | null;
    _max: PasswordResetTokenMaxAggregateOutputType | null;
  };

  export type PasswordResetTokenMinAggregateOutputType = {
    id: string | null;
    adminId: string | null;
    token: string | null;
    expiresAt: Date | null;
    usedAt: Date | null;
    createdAt: Date | null;
  };

  export type PasswordResetTokenMaxAggregateOutputType = {
    id: string | null;
    adminId: string | null;
    token: string | null;
    expiresAt: Date | null;
    usedAt: Date | null;
    createdAt: Date | null;
  };

  export type PasswordResetTokenCountAggregateOutputType = {
    id: number;
    adminId: number;
    token: number;
    expiresAt: number;
    usedAt: number;
    createdAt: number;
    _all: number;
  };

  export type PasswordResetTokenMinAggregateInputType = {
    id?: true;
    adminId?: true;
    token?: true;
    expiresAt?: true;
    usedAt?: true;
    createdAt?: true;
  };

  export type PasswordResetTokenMaxAggregateInputType = {
    id?: true;
    adminId?: true;
    token?: true;
    expiresAt?: true;
    usedAt?: true;
    createdAt?: true;
  };

  export type PasswordResetTokenCountAggregateInputType = {
    id?: true;
    adminId?: true;
    token?: true;
    expiresAt?: true;
    usedAt?: true;
    createdAt?: true;
    _all?: true;
  };

  export type PasswordResetTokenAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PasswordResetToken to aggregate.
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?:
      | PasswordResetTokenOrderByWithRelationInput
      | PasswordResetTokenOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PasswordResetTokenWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PasswordResetTokens
     **/
    _count?: true | PasswordResetTokenCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PasswordResetTokenMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PasswordResetTokenMaxAggregateInputType;
  };

  export type GetPasswordResetTokenAggregateType<
    T extends PasswordResetTokenAggregateArgs,
  > = {
    [P in keyof T & keyof AggregatePasswordResetToken]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetToken[P]>
      : GetScalarType<T[P], AggregatePasswordResetToken[P]>;
  };

  export type PasswordResetTokenGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PasswordResetTokenWhereInput;
    orderBy?:
      | PasswordResetTokenOrderByWithAggregationInput
      | PasswordResetTokenOrderByWithAggregationInput[];
    by: PasswordResetTokenScalarFieldEnum[] | PasswordResetTokenScalarFieldEnum;
    having?: PasswordResetTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PasswordResetTokenCountAggregateInputType | true;
    _min?: PasswordResetTokenMinAggregateInputType;
    _max?: PasswordResetTokenMaxAggregateInputType;
  };

  export type PasswordResetTokenGroupByOutputType = {
    id: string;
    adminId: string;
    token: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt: Date;
    _count: PasswordResetTokenCountAggregateOutputType | null;
    _min: PasswordResetTokenMinAggregateOutputType | null;
    _max: PasswordResetTokenMaxAggregateOutputType | null;
  };

  type GetPasswordResetTokenGroupByPayload<
    T extends PasswordResetTokenGroupByArgs,
  > = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokenGroupByOutputType, T['by']> & {
        [P in keyof T &
          keyof PasswordResetTokenGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
          : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>;
      }
    >
  >;

  export type PasswordResetTokenSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      adminId?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      usedAt?: boolean;
      createdAt?: boolean;
      admin?: boolean | AdminDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['passwordResetToken']
  >;

  export type PasswordResetTokenSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      adminId?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      usedAt?: boolean;
      createdAt?: boolean;
      admin?: boolean | AdminDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['passwordResetToken']
  >;

  export type PasswordResetTokenSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      adminId?: boolean;
      token?: boolean;
      expiresAt?: boolean;
      usedAt?: boolean;
      createdAt?: boolean;
      admin?: boolean | AdminDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['passwordResetToken']
  >;

  export type PasswordResetTokenSelectScalar = {
    id?: boolean;
    adminId?: boolean;
    token?: boolean;
    expiresAt?: boolean;
    usedAt?: boolean;
    createdAt?: boolean;
  };

  export type PasswordResetTokenOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'adminId' | 'token' | 'expiresAt' | 'usedAt' | 'createdAt',
    ExtArgs['result']['passwordResetToken']
  >;
  export type PasswordResetTokenInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    admin?: boolean | AdminDefaultArgs<ExtArgs>;
  };
  export type PasswordResetTokenIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    admin?: boolean | AdminDefaultArgs<ExtArgs>;
  };
  export type PasswordResetTokenIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    admin?: boolean | AdminDefaultArgs<ExtArgs>;
  };

  export type $PasswordResetTokenPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'PasswordResetToken';
    objects: {
      admin: Prisma.$AdminPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        adminId: string;
        token: string;
        expiresAt: Date;
        usedAt: Date | null;
        createdAt: Date;
      },
      ExtArgs['result']['passwordResetToken']
    >;
    composites: {};
  };

  type PasswordResetTokenGetPayload<
    S extends boolean | null | undefined | PasswordResetTokenDefaultArgs,
  > = $Result.GetResult<Prisma.$PasswordResetTokenPayload, S>;

  type PasswordResetTokenCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    PasswordResetTokenFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: PasswordResetTokenCountAggregateInputType | true;
  };

  export interface PasswordResetTokenDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetToken'];
      meta: { name: 'PasswordResetToken' };
    };
    /**
     * Find zero or one PasswordResetToken that matches the filter.
     * @param {PasswordResetTokenFindUniqueArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokenFindUniqueArgs>(
      args: SelectSubset<T, PasswordResetTokenFindUniqueArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one PasswordResetToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokenFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first PasswordResetToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokenFindFirstArgs>(
      args?: SelectSubset<T, PasswordResetTokenFindFirstArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first PasswordResetToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokenFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany()
     *
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PasswordResetTokenFindManyArgs>(
      args?: SelectSubset<T, PasswordResetTokenFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a PasswordResetToken.
     * @param {PasswordResetTokenCreateArgs} args - Arguments to create a PasswordResetToken.
     * @example
     * // Create one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.create({
     *   data: {
     *     // ... data to create a PasswordResetToken
     *   }
     * })
     *
     */
    create<T extends PasswordResetTokenCreateArgs>(
      args: SelectSubset<T, PasswordResetTokenCreateArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokenCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PasswordResetTokenCreateManyArgs>(
      args?: SelectSubset<T, PasswordResetTokenCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PasswordResetTokenCreateManyAndReturnArgs>(
      args?: SelectSubset<
        T,
        PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>
      >,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a PasswordResetToken.
     * @param {PasswordResetTokenDeleteArgs} args - Arguments to delete one PasswordResetToken.
     * @example
     * // Delete one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetToken
     *   }
     * })
     *
     */
    delete<T extends PasswordResetTokenDeleteArgs>(
      args: SelectSubset<T, PasswordResetTokenDeleteArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one PasswordResetToken.
     * @param {PasswordResetTokenUpdateArgs} args - Arguments to update one PasswordResetToken.
     * @example
     * // Update one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PasswordResetTokenUpdateArgs>(
      args: SelectSubset<T, PasswordResetTokenUpdateArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokenDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PasswordResetTokenDeleteManyArgs>(
      args?: SelectSubset<T, PasswordResetTokenDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PasswordResetTokenUpdateManyArgs>(
      args: SelectSubset<T, PasswordResetTokenUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more PasswordResetTokens and returns the data updated in the database.
     * @param {PasswordResetTokenUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetTokens.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PasswordResetTokenUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one PasswordResetToken.
     * @param {PasswordResetTokenUpsertArgs} args - Arguments to update or create a PasswordResetToken.
     * @example
     * // Update or create a PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.upsert({
     *   create: {
     *     // ... data to create a PasswordResetToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokenUpsertArgs>(
      args: SelectSubset<T, PasswordResetTokenUpsertArgs<ExtArgs>>,
    ): Prisma__PasswordResetTokenClient<
      $Result.GetResult<
        Prisma.$PasswordResetTokenPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetToken.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
     **/
    count<T extends PasswordResetTokenCountArgs>(
      args?: Subset<T, PasswordResetTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<
              T['select'],
              PasswordResetTokenCountAggregateOutputType
            >
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PasswordResetTokenAggregateArgs>(
      args: Subset<T, PasswordResetTokenAggregateArgs>,
    ): Prisma.PrismaPromise<GetPasswordResetTokenAggregateType<T>>;

    /**
     * Group by PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PasswordResetTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PasswordResetTokenGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetPasswordResetTokenGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PasswordResetToken model
     */
    readonly fields: PasswordResetTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokenClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    admin<T extends AdminDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AdminDefaultArgs<ExtArgs>>,
    ): Prisma__AdminClient<
      | $Result.GetResult<
          Prisma.$AdminPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the PasswordResetToken model
   */
  interface PasswordResetTokenFieldRefs {
    readonly id: FieldRef<'PasswordResetToken', 'String'>;
    readonly adminId: FieldRef<'PasswordResetToken', 'String'>;
    readonly token: FieldRef<'PasswordResetToken', 'String'>;
    readonly expiresAt: FieldRef<'PasswordResetToken', 'DateTime'>;
    readonly usedAt: FieldRef<'PasswordResetToken', 'DateTime'>;
    readonly createdAt: FieldRef<'PasswordResetToken', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * PasswordResetToken findUnique
   */
  export type PasswordResetTokenFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput;
  };

  /**
   * PasswordResetToken findUniqueOrThrow
   */
  export type PasswordResetTokenFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput;
  };

  /**
   * PasswordResetToken findFirst
   */
  export type PasswordResetTokenFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?:
      | PasswordResetTokenOrderByWithRelationInput
      | PasswordResetTokenOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?:
      | PasswordResetTokenScalarFieldEnum
      | PasswordResetTokenScalarFieldEnum[];
  };

  /**
   * PasswordResetToken findFirstOrThrow
   */
  export type PasswordResetTokenFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?:
      | PasswordResetTokenOrderByWithRelationInput
      | PasswordResetTokenOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?:
      | PasswordResetTokenScalarFieldEnum
      | PasswordResetTokenScalarFieldEnum[];
  };

  /**
   * PasswordResetToken findMany
   */
  export type PasswordResetTokenFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?:
      | PasswordResetTokenOrderByWithRelationInput
      | PasswordResetTokenOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?:
      | PasswordResetTokenScalarFieldEnum
      | PasswordResetTokenScalarFieldEnum[];
  };

  /**
   * PasswordResetToken create
   */
  export type PasswordResetTokenCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * The data needed to create a PasswordResetToken.
     */
    data: XOR<
      PasswordResetTokenCreateInput,
      PasswordResetTokenUncheckedCreateInput
    >;
  };

  /**
   * PasswordResetToken createMany
   */
  export type PasswordResetTokenCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data:
      | PasswordResetTokenCreateManyInput
      | PasswordResetTokenCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * PasswordResetToken createManyAndReturn
   */
  export type PasswordResetTokenCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * The data used to create many PasswordResetTokens.
     */
    data:
      | PasswordResetTokenCreateManyInput
      | PasswordResetTokenCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * PasswordResetToken update
   */
  export type PasswordResetTokenUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * The data needed to update a PasswordResetToken.
     */
    data: XOR<
      PasswordResetTokenUpdateInput,
      PasswordResetTokenUncheckedUpdateInput
    >;
    /**
     * Choose, which PasswordResetToken to update.
     */
    where: PasswordResetTokenWhereUniqueInput;
  };

  /**
   * PasswordResetToken updateMany
   */
  export type PasswordResetTokenUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<
      PasswordResetTokenUpdateManyMutationInput,
      PasswordResetTokenUncheckedUpdateManyInput
    >;
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number;
  };

  /**
   * PasswordResetToken updateManyAndReturn
   */
  export type PasswordResetTokenUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<
      PasswordResetTokenUpdateManyMutationInput,
      PasswordResetTokenUncheckedUpdateManyInput
    >;
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * PasswordResetToken upsert
   */
  export type PasswordResetTokenUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * The filter to search for the PasswordResetToken to update in case it exists.
     */
    where: PasswordResetTokenWhereUniqueInput;
    /**
     * In case the PasswordResetToken found by the `where` argument doesn't exist, create a new PasswordResetToken with this data.
     */
    create: XOR<
      PasswordResetTokenCreateInput,
      PasswordResetTokenUncheckedCreateInput
    >;
    /**
     * In case the PasswordResetToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      PasswordResetTokenUpdateInput,
      PasswordResetTokenUncheckedUpdateInput
    >;
  };

  /**
   * PasswordResetToken delete
   */
  export type PasswordResetTokenDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
    /**
     * Filter which PasswordResetToken to delete.
     */
    where: PasswordResetTokenWhereUniqueInput;
  };

  /**
   * PasswordResetToken deleteMany
   */
  export type PasswordResetTokenDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokenWhereInput;
    /**
     * Limit how many PasswordResetTokens to delete.
     */
    limit?: number;
  };

  /**
   * PasswordResetToken without action
   */
  export type PasswordResetTokenDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null;
  };

  /**
   * Model Attendee
   */

  export type AggregateAttendee = {
    _count: AttendeeCountAggregateOutputType | null;
    _min: AttendeeMinAggregateOutputType | null;
    _max: AttendeeMaxAggregateOutputType | null;
  };

  export type AttendeeMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    fullName: string | null;
    phoneNumber: string | null;
    company: string | null;
    jobTitle: string | null;
    roleId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AttendeeMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    fullName: string | null;
    phoneNumber: string | null;
    company: string | null;
    jobTitle: string | null;
    roleId: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type AttendeeCountAggregateOutputType = {
    id: number;
    email: number;
    fullName: number;
    phoneNumber: number;
    company: number;
    jobTitle: number;
    roleId: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type AttendeeMinAggregateInputType = {
    id?: true;
    email?: true;
    fullName?: true;
    phoneNumber?: true;
    company?: true;
    jobTitle?: true;
    roleId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AttendeeMaxAggregateInputType = {
    id?: true;
    email?: true;
    fullName?: true;
    phoneNumber?: true;
    company?: true;
    jobTitle?: true;
    roleId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type AttendeeCountAggregateInputType = {
    id?: true;
    email?: true;
    fullName?: true;
    phoneNumber?: true;
    company?: true;
    jobTitle?: true;
    roleId?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AttendeeAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Attendee to aggregate.
     */
    where?: AttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Attendees to fetch.
     */
    orderBy?:
      | AttendeeOrderByWithRelationInput
      | AttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Attendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Attendees
     **/
    _count?: true | AttendeeCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AttendeeMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AttendeeMaxAggregateInputType;
  };

  export type GetAttendeeAggregateType<T extends AttendeeAggregateArgs> = {
    [P in keyof T & keyof AggregateAttendee]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttendee[P]>
      : GetScalarType<T[P], AggregateAttendee[P]>;
  };

  export type AttendeeGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AttendeeWhereInput;
    orderBy?:
      | AttendeeOrderByWithAggregationInput
      | AttendeeOrderByWithAggregationInput[];
    by: AttendeeScalarFieldEnum[] | AttendeeScalarFieldEnum;
    having?: AttendeeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AttendeeCountAggregateInputType | true;
    _min?: AttendeeMinAggregateInputType;
    _max?: AttendeeMaxAggregateInputType;
  };

  export type AttendeeGroupByOutputType = {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string | null;
    company: string | null;
    jobTitle: string | null;
    roleId: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: AttendeeCountAggregateOutputType | null;
    _min: AttendeeMinAggregateOutputType | null;
    _max: AttendeeMaxAggregateOutputType | null;
  };

  type GetAttendeeGroupByPayload<T extends AttendeeGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AttendeeGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AttendeeGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AttendeeGroupByOutputType[P]>
            : GetScalarType<T[P], AttendeeGroupByOutputType[P]>;
        }
      >
    >;

  export type AttendeeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      fullName?: boolean;
      phoneNumber?: boolean;
      company?: boolean;
      jobTitle?: boolean;
      roleId?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      role?: boolean | Attendee$roleArgs<ExtArgs>;
      payments?: boolean | Attendee$paymentsArgs<ExtArgs>;
      tickets?: boolean | Attendee$ticketsArgs<ExtArgs>;
      _count?: boolean | AttendeeCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['attendee']
  >;

  export type AttendeeSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      fullName?: boolean;
      phoneNumber?: boolean;
      company?: boolean;
      jobTitle?: boolean;
      roleId?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      role?: boolean | Attendee$roleArgs<ExtArgs>;
    },
    ExtArgs['result']['attendee']
  >;

  export type AttendeeSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      email?: boolean;
      fullName?: boolean;
      phoneNumber?: boolean;
      company?: boolean;
      jobTitle?: boolean;
      roleId?: boolean;
      isActive?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      role?: boolean | Attendee$roleArgs<ExtArgs>;
    },
    ExtArgs['result']['attendee']
  >;

  export type AttendeeSelectScalar = {
    id?: boolean;
    email?: boolean;
    fullName?: boolean;
    phoneNumber?: boolean;
    company?: boolean;
    jobTitle?: boolean;
    roleId?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type AttendeeOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'company'
    | 'jobTitle'
    | 'roleId'
    | 'isActive'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['attendee']
  >;
  export type AttendeeInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    role?: boolean | Attendee$roleArgs<ExtArgs>;
    payments?: boolean | Attendee$paymentsArgs<ExtArgs>;
    tickets?: boolean | Attendee$ticketsArgs<ExtArgs>;
    _count?: boolean | AttendeeCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type AttendeeIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    role?: boolean | Attendee$roleArgs<ExtArgs>;
  };
  export type AttendeeIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    role?: boolean | Attendee$roleArgs<ExtArgs>;
  };

  export type $AttendeePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Attendee';
    objects: {
      role: Prisma.$RolePayload<ExtArgs> | null;
      payments: Prisma.$PaymentPayload<ExtArgs>[];
      tickets: Prisma.$TicketPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        email: string;
        fullName: string;
        phoneNumber: string | null;
        company: string | null;
        jobTitle: string | null;
        roleId: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['attendee']
    >;
    composites: {};
  };

  type AttendeeGetPayload<
    S extends boolean | null | undefined | AttendeeDefaultArgs,
  > = $Result.GetResult<Prisma.$AttendeePayload, S>;

  type AttendeeCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AttendeeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AttendeeCountAggregateInputType | true;
  };

  export interface AttendeeDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Attendee'];
      meta: { name: 'Attendee' };
    };
    /**
     * Find zero or one Attendee that matches the filter.
     * @param {AttendeeFindUniqueArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AttendeeFindUniqueArgs>(
      args: SelectSubset<T, AttendeeFindUniqueArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Attendee that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AttendeeFindUniqueOrThrowArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AttendeeFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AttendeeFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Attendee that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeFindFirstArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AttendeeFindFirstArgs>(
      args?: SelectSubset<T, AttendeeFindFirstArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Attendee that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeFindFirstOrThrowArgs} args - Arguments to find a Attendee
     * @example
     * // Get one Attendee
     * const attendee = await prisma.attendee.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AttendeeFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AttendeeFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Attendees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attendees
     * const attendees = await prisma.attendee.findMany()
     *
     * // Get first 10 Attendees
     * const attendees = await prisma.attendee.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const attendeeWithIdOnly = await prisma.attendee.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AttendeeFindManyArgs>(
      args?: SelectSubset<T, AttendeeFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Attendee.
     * @param {AttendeeCreateArgs} args - Arguments to create a Attendee.
     * @example
     * // Create one Attendee
     * const Attendee = await prisma.attendee.create({
     *   data: {
     *     // ... data to create a Attendee
     *   }
     * })
     *
     */
    create<T extends AttendeeCreateArgs>(
      args: SelectSubset<T, AttendeeCreateArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Attendees.
     * @param {AttendeeCreateManyArgs} args - Arguments to create many Attendees.
     * @example
     * // Create many Attendees
     * const attendee = await prisma.attendee.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AttendeeCreateManyArgs>(
      args?: SelectSubset<T, AttendeeCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Attendees and returns the data saved in the database.
     * @param {AttendeeCreateManyAndReturnArgs} args - Arguments to create many Attendees.
     * @example
     * // Create many Attendees
     * const attendee = await prisma.attendee.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Attendees and only return the `id`
     * const attendeeWithIdOnly = await prisma.attendee.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AttendeeCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AttendeeCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Attendee.
     * @param {AttendeeDeleteArgs} args - Arguments to delete one Attendee.
     * @example
     * // Delete one Attendee
     * const Attendee = await prisma.attendee.delete({
     *   where: {
     *     // ... filter to delete one Attendee
     *   }
     * })
     *
     */
    delete<T extends AttendeeDeleteArgs>(
      args: SelectSubset<T, AttendeeDeleteArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Attendee.
     * @param {AttendeeUpdateArgs} args - Arguments to update one Attendee.
     * @example
     * // Update one Attendee
     * const attendee = await prisma.attendee.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AttendeeUpdateArgs>(
      args: SelectSubset<T, AttendeeUpdateArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Attendees.
     * @param {AttendeeDeleteManyArgs} args - Arguments to filter Attendees to delete.
     * @example
     * // Delete a few Attendees
     * const { count } = await prisma.attendee.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AttendeeDeleteManyArgs>(
      args?: SelectSubset<T, AttendeeDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Attendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attendees
     * const attendee = await prisma.attendee.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AttendeeUpdateManyArgs>(
      args: SelectSubset<T, AttendeeUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Attendees and returns the data updated in the database.
     * @param {AttendeeUpdateManyAndReturnArgs} args - Arguments to update many Attendees.
     * @example
     * // Update many Attendees
     * const attendee = await prisma.attendee.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Attendees and only return the `id`
     * const attendeeWithIdOnly = await prisma.attendee.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AttendeeUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AttendeeUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Attendee.
     * @param {AttendeeUpsertArgs} args - Arguments to update or create a Attendee.
     * @example
     * // Update or create a Attendee
     * const attendee = await prisma.attendee.upsert({
     *   create: {
     *     // ... data to create a Attendee
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attendee we want to update
     *   }
     * })
     */
    upsert<T extends AttendeeUpsertArgs>(
      args: SelectSubset<T, AttendeeUpsertArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      $Result.GetResult<
        Prisma.$AttendeePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Attendees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeCountArgs} args - Arguments to filter Attendees to count.
     * @example
     * // Count the number of Attendees
     * const count = await prisma.attendee.count({
     *   where: {
     *     // ... the filter for the Attendees we want to count
     *   }
     * })
     **/
    count<T extends AttendeeCountArgs>(
      args?: Subset<T, AttendeeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AttendeeCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Attendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AttendeeAggregateArgs>(
      args: Subset<T, AttendeeAggregateArgs>,
    ): Prisma.PrismaPromise<GetAttendeeAggregateType<T>>;

    /**
     * Group by Attendee.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AttendeeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AttendeeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AttendeeGroupByArgs['orderBy'] }
        : { orderBy?: AttendeeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AttendeeGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetAttendeeGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Attendee model
     */
    readonly fields: AttendeeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Attendee.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AttendeeClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    role<T extends Attendee$roleArgs<ExtArgs> = {}>(
      args?: Subset<T, Attendee$roleArgs<ExtArgs>>,
    ): Prisma__RoleClient<
      $Result.GetResult<
        Prisma.$RolePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    payments<T extends Attendee$paymentsArgs<ExtArgs> = {}>(
      args?: Subset<T, Attendee$paymentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PaymentPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    tickets<T extends Attendee$ticketsArgs<ExtArgs> = {}>(
      args?: Subset<T, Attendee$ticketsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TicketPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Attendee model
   */
  interface AttendeeFieldRefs {
    readonly id: FieldRef<'Attendee', 'String'>;
    readonly email: FieldRef<'Attendee', 'String'>;
    readonly fullName: FieldRef<'Attendee', 'String'>;
    readonly phoneNumber: FieldRef<'Attendee', 'String'>;
    readonly company: FieldRef<'Attendee', 'String'>;
    readonly jobTitle: FieldRef<'Attendee', 'String'>;
    readonly roleId: FieldRef<'Attendee', 'String'>;
    readonly isActive: FieldRef<'Attendee', 'Boolean'>;
    readonly createdAt: FieldRef<'Attendee', 'DateTime'>;
    readonly updatedAt: FieldRef<'Attendee', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Attendee findUnique
   */
  export type AttendeeFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which Attendee to fetch.
     */
    where: AttendeeWhereUniqueInput;
  };

  /**
   * Attendee findUniqueOrThrow
   */
  export type AttendeeFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which Attendee to fetch.
     */
    where: AttendeeWhereUniqueInput;
  };

  /**
   * Attendee findFirst
   */
  export type AttendeeFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which Attendee to fetch.
     */
    where?: AttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Attendees to fetch.
     */
    orderBy?:
      | AttendeeOrderByWithRelationInput
      | AttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Attendees.
     */
    cursor?: AttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Attendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Attendees.
     */
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[];
  };

  /**
   * Attendee findFirstOrThrow
   */
  export type AttendeeFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which Attendee to fetch.
     */
    where?: AttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Attendees to fetch.
     */
    orderBy?:
      | AttendeeOrderByWithRelationInput
      | AttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Attendees.
     */
    cursor?: AttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Attendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Attendees.
     */
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[];
  };

  /**
   * Attendee findMany
   */
  export type AttendeeFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * Filter, which Attendees to fetch.
     */
    where?: AttendeeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Attendees to fetch.
     */
    orderBy?:
      | AttendeeOrderByWithRelationInput
      | AttendeeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Attendees.
     */
    cursor?: AttendeeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Attendees from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Attendees.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Attendees.
     */
    distinct?: AttendeeScalarFieldEnum | AttendeeScalarFieldEnum[];
  };

  /**
   * Attendee create
   */
  export type AttendeeCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * The data needed to create a Attendee.
     */
    data: XOR<AttendeeCreateInput, AttendeeUncheckedCreateInput>;
  };

  /**
   * Attendee createMany
   */
  export type AttendeeCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Attendees.
     */
    data: AttendeeCreateManyInput | AttendeeCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Attendee createManyAndReturn
   */
  export type AttendeeCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * The data used to create many Attendees.
     */
    data: AttendeeCreateManyInput | AttendeeCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Attendee update
   */
  export type AttendeeUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * The data needed to update a Attendee.
     */
    data: XOR<AttendeeUpdateInput, AttendeeUncheckedUpdateInput>;
    /**
     * Choose, which Attendee to update.
     */
    where: AttendeeWhereUniqueInput;
  };

  /**
   * Attendee updateMany
   */
  export type AttendeeUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Attendees.
     */
    data: XOR<
      AttendeeUpdateManyMutationInput,
      AttendeeUncheckedUpdateManyInput
    >;
    /**
     * Filter which Attendees to update
     */
    where?: AttendeeWhereInput;
    /**
     * Limit how many Attendees to update.
     */
    limit?: number;
  };

  /**
   * Attendee updateManyAndReturn
   */
  export type AttendeeUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * The data used to update Attendees.
     */
    data: XOR<
      AttendeeUpdateManyMutationInput,
      AttendeeUncheckedUpdateManyInput
    >;
    /**
     * Filter which Attendees to update
     */
    where?: AttendeeWhereInput;
    /**
     * Limit how many Attendees to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Attendee upsert
   */
  export type AttendeeUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * The filter to search for the Attendee to update in case it exists.
     */
    where: AttendeeWhereUniqueInput;
    /**
     * In case the Attendee found by the `where` argument doesn't exist, create a new Attendee with this data.
     */
    create: XOR<AttendeeCreateInput, AttendeeUncheckedCreateInput>;
    /**
     * In case the Attendee was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AttendeeUpdateInput, AttendeeUncheckedUpdateInput>;
  };

  /**
   * Attendee delete
   */
  export type AttendeeDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
    /**
     * Filter which Attendee to delete.
     */
    where: AttendeeWhereUniqueInput;
  };

  /**
   * Attendee deleteMany
   */
  export type AttendeeDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Attendees to delete
     */
    where?: AttendeeWhereInput;
    /**
     * Limit how many Attendees to delete.
     */
    limit?: number;
  };

  /**
   * Attendee.role
   */
  export type Attendee$roleArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null;
    where?: RoleWhereInput;
  };

  /**
   * Attendee.payments
   */
  export type Attendee$paymentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    where?: PaymentWhereInput;
    orderBy?:
      | PaymentOrderByWithRelationInput
      | PaymentOrderByWithRelationInput[];
    cursor?: PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[];
  };

  /**
   * Attendee.tickets
   */
  export type Attendee$ticketsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    where?: TicketWhereInput;
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[];
    cursor?: TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[];
  };

  /**
   * Attendee without action
   */
  export type AttendeeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Attendee
     */
    select?: AttendeeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Attendee
     */
    omit?: AttendeeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AttendeeInclude<ExtArgs> | null;
  };

  /**
   * Model Ticket
   */

  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null;
    _min: TicketMinAggregateOutputType | null;
    _max: TicketMaxAggregateOutputType | null;
  };

  export type TicketMinAggregateOutputType = {
    id: string | null;
    ticketNumber: string | null;
    qrCode: string | null;
    status: $Enums.TicketStatus | null;
    issuedAt: Date | null;
    validFrom: Date | null;
    validUntil: Date | null;
    ticketType: string | null;
    isCheckedIn: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    attendeeId: string | null;
    paymentId: string | null;
  };

  export type TicketMaxAggregateOutputType = {
    id: string | null;
    ticketNumber: string | null;
    qrCode: string | null;
    status: $Enums.TicketStatus | null;
    issuedAt: Date | null;
    validFrom: Date | null;
    validUntil: Date | null;
    ticketType: string | null;
    isCheckedIn: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    attendeeId: string | null;
    paymentId: string | null;
  };

  export type TicketCountAggregateOutputType = {
    id: number;
    ticketNumber: number;
    qrCode: number;
    status: number;
    issuedAt: number;
    validFrom: number;
    validUntil: number;
    ticketType: number;
    isCheckedIn: number;
    createdAt: number;
    updatedAt: number;
    attendeeId: number;
    paymentId: number;
    _all: number;
  };

  export type TicketMinAggregateInputType = {
    id?: true;
    ticketNumber?: true;
    qrCode?: true;
    status?: true;
    issuedAt?: true;
    validFrom?: true;
    validUntil?: true;
    ticketType?: true;
    isCheckedIn?: true;
    createdAt?: true;
    updatedAt?: true;
    attendeeId?: true;
    paymentId?: true;
  };

  export type TicketMaxAggregateInputType = {
    id?: true;
    ticketNumber?: true;
    qrCode?: true;
    status?: true;
    issuedAt?: true;
    validFrom?: true;
    validUntil?: true;
    ticketType?: true;
    isCheckedIn?: true;
    createdAt?: true;
    updatedAt?: true;
    attendeeId?: true;
    paymentId?: true;
  };

  export type TicketCountAggregateInputType = {
    id?: true;
    ticketNumber?: true;
    qrCode?: true;
    status?: true;
    issuedAt?: true;
    validFrom?: true;
    validUntil?: true;
    ticketType?: true;
    isCheckedIn?: true;
    createdAt?: true;
    updatedAt?: true;
    attendeeId?: true;
    paymentId?: true;
    _all?: true;
  };

  export type TicketAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tickets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Tickets
     **/
    _count?: true | TicketCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TicketMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TicketMaxAggregateInputType;
  };

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
    [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>;
  };

  export type TicketGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TicketWhereInput;
    orderBy?:
      | TicketOrderByWithAggregationInput
      | TicketOrderByWithAggregationInput[];
    by: TicketScalarFieldEnum[] | TicketScalarFieldEnum;
    having?: TicketScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TicketCountAggregateInputType | true;
    _min?: TicketMinAggregateInputType;
    _max?: TicketMaxAggregateInputType;
  };

  export type TicketGroupByOutputType = {
    id: string;
    ticketNumber: string;
    qrCode: string;
    status: $Enums.TicketStatus;
    issuedAt: Date;
    validFrom: Date;
    validUntil: Date;
    ticketType: string;
    isCheckedIn: boolean;
    createdAt: Date;
    updatedAt: Date;
    attendeeId: string;
    paymentId: string;
    _count: TicketCountAggregateOutputType | null;
    _min: TicketMinAggregateOutputType | null;
    _max: TicketMaxAggregateOutputType | null;
  };

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<TicketGroupByOutputType, T['by']> & {
          [P in keyof T & keyof TicketGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>;
        }
      >
    >;

  export type TicketSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      ticketNumber?: boolean;
      qrCode?: boolean;
      status?: boolean;
      issuedAt?: boolean;
      validFrom?: boolean;
      validUntil?: boolean;
      ticketType?: boolean;
      isCheckedIn?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      attendeeId?: boolean;
      paymentId?: boolean;
      attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
      payment?: boolean | PaymentDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['ticket']
  >;

  export type TicketSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      ticketNumber?: boolean;
      qrCode?: boolean;
      status?: boolean;
      issuedAt?: boolean;
      validFrom?: boolean;
      validUntil?: boolean;
      ticketType?: boolean;
      isCheckedIn?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      attendeeId?: boolean;
      paymentId?: boolean;
      attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
      payment?: boolean | PaymentDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['ticket']
  >;

  export type TicketSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      ticketNumber?: boolean;
      qrCode?: boolean;
      status?: boolean;
      issuedAt?: boolean;
      validFrom?: boolean;
      validUntil?: boolean;
      ticketType?: boolean;
      isCheckedIn?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      attendeeId?: boolean;
      paymentId?: boolean;
      attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
      payment?: boolean | PaymentDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['ticket']
  >;

  export type TicketSelectScalar = {
    id?: boolean;
    ticketNumber?: boolean;
    qrCode?: boolean;
    status?: boolean;
    issuedAt?: boolean;
    validFrom?: boolean;
    validUntil?: boolean;
    ticketType?: boolean;
    isCheckedIn?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    attendeeId?: boolean;
    paymentId?: boolean;
  };

  export type TicketOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'ticketNumber'
    | 'qrCode'
    | 'status'
    | 'issuedAt'
    | 'validFrom'
    | 'validUntil'
    | 'ticketType'
    | 'isCheckedIn'
    | 'createdAt'
    | 'updatedAt'
    | 'attendeeId'
    | 'paymentId',
    ExtArgs['result']['ticket']
  >;
  export type TicketInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
    payment?: boolean | PaymentDefaultArgs<ExtArgs>;
  };
  export type TicketIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
    payment?: boolean | PaymentDefaultArgs<ExtArgs>;
  };
  export type TicketIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
    payment?: boolean | PaymentDefaultArgs<ExtArgs>;
  };

  export type $TicketPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Ticket';
    objects: {
      attendee: Prisma.$AttendeePayload<ExtArgs>;
      payment: Prisma.$PaymentPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        ticketNumber: string;
        qrCode: string;
        status: $Enums.TicketStatus;
        issuedAt: Date;
        validFrom: Date;
        validUntil: Date;
        ticketType: string;
        isCheckedIn: boolean;
        createdAt: Date;
        updatedAt: Date;
        attendeeId: string;
        paymentId: string;
      },
      ExtArgs['result']['ticket']
    >;
    composites: {};
  };

  type TicketGetPayload<
    S extends boolean | null | undefined | TicketDefaultArgs,
  > = $Result.GetResult<Prisma.$TicketPayload, S>;

  type TicketCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<TicketFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TicketCountAggregateInputType | true;
  };

  export interface TicketDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Ticket'];
      meta: { name: 'Ticket' };
    };
    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TicketFindUniqueArgs>(
      args: SelectSubset<T, TicketFindUniqueArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Ticket that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TicketFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TicketFindFirstArgs>(
      args?: SelectSubset<T, TicketFindFirstArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Ticket that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TicketFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     *
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const ticketWithIdOnly = await prisma.ticket.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TicketFindManyArgs>(
      args?: SelectSubset<T, TicketFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     *
     */
    create<T extends TicketCreateArgs>(
      args: SelectSubset<T, TicketCreateArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Tickets.
     * @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TicketCreateManyArgs>(
      args?: SelectSubset<T, TicketCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Tickets and returns the data saved in the database.
     * @param {TicketCreateManyAndReturnArgs} args - Arguments to create many Tickets.
     * @example
     * // Create many Tickets
     * const ticket = await prisma.ticket.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TicketCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TicketCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     *
     */
    delete<T extends TicketDeleteArgs>(
      args: SelectSubset<T, TicketDeleteArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TicketUpdateArgs>(
      args: SelectSubset<T, TicketUpdateArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TicketDeleteManyArgs>(
      args?: SelectSubset<T, TicketDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TicketUpdateManyArgs>(
      args: SelectSubset<T, TicketUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Tickets and returns the data updated in the database.
     * @param {TicketUpdateManyAndReturnArgs} args - Arguments to update many Tickets.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Tickets and only return the `id`
     * const ticketWithIdOnly = await prisma.ticket.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TicketUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TicketUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
     */
    upsert<T extends TicketUpsertArgs>(
      args: SelectSubset<T, TicketUpsertArgs<ExtArgs>>,
    ): Prisma__TicketClient<
      $Result.GetResult<
        Prisma.$TicketPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
     **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TicketAggregateArgs>(
      args: Subset<T, TicketAggregateArgs>,
    ): Prisma.PrismaPromise<GetTicketAggregateType<T>>;

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetTicketGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Ticket model
     */
    readonly fields: TicketFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TicketClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    attendee<T extends AttendeeDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AttendeeDefaultArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      | $Result.GetResult<
          Prisma.$AttendeePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    payment<T extends PaymentDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, PaymentDefaultArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      | $Result.GetResult<
          Prisma.$PaymentPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Ticket model
   */
  interface TicketFieldRefs {
    readonly id: FieldRef<'Ticket', 'String'>;
    readonly ticketNumber: FieldRef<'Ticket', 'String'>;
    readonly qrCode: FieldRef<'Ticket', 'String'>;
    readonly status: FieldRef<'Ticket', 'TicketStatus'>;
    readonly issuedAt: FieldRef<'Ticket', 'DateTime'>;
    readonly validFrom: FieldRef<'Ticket', 'DateTime'>;
    readonly validUntil: FieldRef<'Ticket', 'DateTime'>;
    readonly ticketType: FieldRef<'Ticket', 'String'>;
    readonly isCheckedIn: FieldRef<'Ticket', 'Boolean'>;
    readonly createdAt: FieldRef<'Ticket', 'DateTime'>;
    readonly updatedAt: FieldRef<'Ticket', 'DateTime'>;
    readonly attendeeId: FieldRef<'Ticket', 'String'>;
    readonly paymentId: FieldRef<'Ticket', 'String'>;
  }

  // Custom InputTypes
  /**
   * Ticket findUnique
   */
  export type TicketFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput;
  };

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput;
  };

  /**
   * Ticket findFirst
   */
  export type TicketFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tickets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[];
  };

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tickets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[];
  };

  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tickets to fetch.
     */
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tickets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tickets.
     */
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[];
  };

  /**
   * Ticket create
   */
  export type TicketCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>;
  };

  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Ticket createManyAndReturn
   */
  export type TicketCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * The data used to create many Tickets.
     */
    data: TicketCreateManyInput | TicketCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Ticket update
   */
  export type TicketUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>;
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput;
  };

  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>;
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput;
    /**
     * Limit how many Tickets to update.
     */
    limit?: number;
  };

  /**
   * Ticket updateManyAndReturn
   */
  export type TicketUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>;
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput;
    /**
     * Limit how many Tickets to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput;
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>;
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>;
  };

  /**
   * Ticket delete
   */
  export type TicketDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput;
  };

  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput;
    /**
     * Limit how many Tickets to delete.
     */
    limit?: number;
  };

  /**
   * Ticket without action
   */
  export type TicketDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
  };

  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null;
    _avg: PaymentAvgAggregateOutputType | null;
    _sum: PaymentSumAggregateOutputType | null;
    _min: PaymentMinAggregateOutputType | null;
    _max: PaymentMaxAggregateOutputType | null;
  };

  export type PaymentAvgAggregateOutputType = {
    amount: Decimal | null;
  };

  export type PaymentSumAggregateOutputType = {
    amount: Decimal | null;
  };

  export type PaymentMinAggregateOutputType = {
    id: string | null;
    attendeeId: string | null;
    amount: Decimal | null;
    currency: string | null;
    paystackReference: string | null;
    paymentReference: string | null;
    status: $Enums.PaymentStatus | null;
    paymentMethod: string | null;
    paidAt: Date | null;
    failureReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type PaymentMaxAggregateOutputType = {
    id: string | null;
    attendeeId: string | null;
    amount: Decimal | null;
    currency: string | null;
    paystackReference: string | null;
    paymentReference: string | null;
    status: $Enums.PaymentStatus | null;
    paymentMethod: string | null;
    paidAt: Date | null;
    failureReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type PaymentCountAggregateOutputType = {
    id: number;
    attendeeId: number;
    amount: number;
    currency: number;
    paystackReference: number;
    paymentReference: number;
    status: number;
    paymentMethod: number;
    paidAt: number;
    failureReason: number;
    metadata: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type PaymentAvgAggregateInputType = {
    amount?: true;
  };

  export type PaymentSumAggregateInputType = {
    amount?: true;
  };

  export type PaymentMinAggregateInputType = {
    id?: true;
    attendeeId?: true;
    amount?: true;
    currency?: true;
    paystackReference?: true;
    paymentReference?: true;
    status?: true;
    paymentMethod?: true;
    paidAt?: true;
    failureReason?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type PaymentMaxAggregateInputType = {
    id?: true;
    attendeeId?: true;
    amount?: true;
    currency?: true;
    paystackReference?: true;
    paymentReference?: true;
    status?: true;
    paymentMethod?: true;
    paidAt?: true;
    failureReason?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type PaymentCountAggregateInputType = {
    id?: true;
    attendeeId?: true;
    amount?: true;
    currency?: true;
    paystackReference?: true;
    paymentReference?: true;
    status?: true;
    paymentMethod?: true;
    paidAt?: true;
    failureReason?: true;
    metadata?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type PaymentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Payments to fetch.
     */
    orderBy?:
      | PaymentOrderByWithRelationInput
      | PaymentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Payments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Payments
     **/
    _count?: true | PaymentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: PaymentAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: PaymentSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PaymentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PaymentMaxAggregateInputType;
  };

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
    [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>;
  };

  export type PaymentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PaymentWhereInput;
    orderBy?:
      | PaymentOrderByWithAggregationInput
      | PaymentOrderByWithAggregationInput[];
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum;
    having?: PaymentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PaymentCountAggregateInputType | true;
    _avg?: PaymentAvgAggregateInputType;
    _sum?: PaymentSumAggregateInputType;
    _min?: PaymentMinAggregateInputType;
    _max?: PaymentMaxAggregateInputType;
  };

  export type PaymentGroupByOutputType = {
    id: string;
    attendeeId: string;
    amount: Decimal;
    currency: string;
    paystackReference: string | null;
    paymentReference: string;
    status: $Enums.PaymentStatus;
    paymentMethod: string | null;
    paidAt: Date | null;
    failureReason: string | null;
    metadata: JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
    _count: PaymentCountAggregateOutputType | null;
    _avg: PaymentAvgAggregateOutputType | null;
    _sum: PaymentSumAggregateOutputType | null;
    _min: PaymentMinAggregateOutputType | null;
    _max: PaymentMaxAggregateOutputType | null;
  };

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<PaymentGroupByOutputType, T['by']> & {
          [P in keyof T & keyof PaymentGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>;
        }
      >
    >;

  export type PaymentSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      attendeeId?: boolean;
      amount?: boolean;
      currency?: boolean;
      paystackReference?: boolean;
      paymentReference?: boolean;
      status?: boolean;
      paymentMethod?: boolean;
      paidAt?: boolean;
      failureReason?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
      tickets?: boolean | Payment$ticketsArgs<ExtArgs>;
      _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['payment']
  >;

  export type PaymentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      attendeeId?: boolean;
      amount?: boolean;
      currency?: boolean;
      paystackReference?: boolean;
      paymentReference?: boolean;
      status?: boolean;
      paymentMethod?: boolean;
      paidAt?: boolean;
      failureReason?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['payment']
  >;

  export type PaymentSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      attendeeId?: boolean;
      amount?: boolean;
      currency?: boolean;
      paystackReference?: boolean;
      paymentReference?: boolean;
      status?: boolean;
      paymentMethod?: boolean;
      paidAt?: boolean;
      failureReason?: boolean;
      metadata?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['payment']
  >;

  export type PaymentSelectScalar = {
    id?: boolean;
    attendeeId?: boolean;
    amount?: boolean;
    currency?: boolean;
    paystackReference?: boolean;
    paymentReference?: boolean;
    status?: boolean;
    paymentMethod?: boolean;
    paidAt?: boolean;
    failureReason?: boolean;
    metadata?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type PaymentOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'attendeeId'
    | 'amount'
    | 'currency'
    | 'paystackReference'
    | 'paymentReference'
    | 'status'
    | 'paymentMethod'
    | 'paidAt'
    | 'failureReason'
    | 'metadata'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['payment']
  >;
  export type PaymentInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
    tickets?: boolean | Payment$ticketsArgs<ExtArgs>;
    _count?: boolean | PaymentCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type PaymentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
  };
  export type PaymentIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    attendee?: boolean | AttendeeDefaultArgs<ExtArgs>;
  };

  export type $PaymentPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Payment';
    objects: {
      attendee: Prisma.$AttendeePayload<ExtArgs>;
      tickets: Prisma.$TicketPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        attendeeId: string;
        amount: Prisma.Decimal;
        currency: string;
        paystackReference: string | null;
        paymentReference: string;
        status: $Enums.PaymentStatus;
        paymentMethod: string | null;
        paidAt: Date | null;
        failureReason: string | null;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['payment']
    >;
    composites: {};
  };

  type PaymentGetPayload<
    S extends boolean | null | undefined | PaymentDefaultArgs,
  > = $Result.GetResult<Prisma.$PaymentPayload, S>;

  type PaymentCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PaymentCountAggregateInputType | true;
  };

  export interface PaymentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Payment'];
      meta: { name: 'Payment' };
    };
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(
      args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(
      args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     *
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PaymentFindManyArgs>(
      args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     *
     */
    create<T extends PaymentCreateArgs>(
      args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PaymentCreateManyArgs>(
      args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     *
     */
    delete<T extends PaymentDeleteArgs>(
      args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PaymentUpdateArgs>(
      args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PaymentDeleteManyArgs>(
      args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PaymentUpdateManyArgs>(
      args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(
      args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>,
    ): Prisma__PaymentClient<
      $Result.GetResult<
        Prisma.$PaymentPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
     **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PaymentAggregateArgs>(
      args: Subset<T, PaymentAggregateArgs>,
    ): Prisma.PrismaPromise<GetPaymentAggregateType<T>>;

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetPaymentGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Payment model
     */
    readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    attendee<T extends AttendeeDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, AttendeeDefaultArgs<ExtArgs>>,
    ): Prisma__AttendeeClient<
      | $Result.GetResult<
          Prisma.$AttendeePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    tickets<T extends Payment$ticketsArgs<ExtArgs> = {}>(
      args?: Subset<T, Payment$ticketsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TicketPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<'Payment', 'String'>;
    readonly attendeeId: FieldRef<'Payment', 'String'>;
    readonly amount: FieldRef<'Payment', 'Decimal'>;
    readonly currency: FieldRef<'Payment', 'String'>;
    readonly paystackReference: FieldRef<'Payment', 'String'>;
    readonly paymentReference: FieldRef<'Payment', 'String'>;
    readonly status: FieldRef<'Payment', 'PaymentStatus'>;
    readonly paymentMethod: FieldRef<'Payment', 'String'>;
    readonly paidAt: FieldRef<'Payment', 'DateTime'>;
    readonly failureReason: FieldRef<'Payment', 'String'>;
    readonly metadata: FieldRef<'Payment', 'Json'>;
    readonly createdAt: FieldRef<'Payment', 'DateTime'>;
    readonly updatedAt: FieldRef<'Payment', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput;
  };

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput;
  };

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Payments to fetch.
     */
    orderBy?:
      | PaymentOrderByWithRelationInput
      | PaymentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Payments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[];
  };

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Payments to fetch.
     */
    orderBy?:
      | PaymentOrderByWithRelationInput
      | PaymentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Payments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[];
  };

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Payments to fetch.
     */
    orderBy?:
      | PaymentOrderByWithRelationInput
      | PaymentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Payments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[];
  };

  /**
   * Payment create
   */
  export type PaymentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>;
  };

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>;
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput;
  };

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>;
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput;
    /**
     * Limit how many Payments to update.
     */
    limit?: number;
  };

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>;
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput;
    /**
     * Limit how many Payments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput;
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>;
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>;
  };

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput;
  };

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput;
    /**
     * Limit how many Payments to delete.
     */
    limit?: number;
  };

  /**
   * Payment.tickets
   */
  export type Payment$ticketsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Ticket
     */
    omit?: TicketOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TicketInclude<ExtArgs> | null;
    where?: TicketWhereInput;
    orderBy?: TicketOrderByWithRelationInput | TicketOrderByWithRelationInput[];
    cursor?: TicketWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TicketScalarFieldEnum | TicketScalarFieldEnum[];
  };

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const RoleScalarFieldEnum: {
    id: 'id';
    name: 'name';
    description: 'description';
    permissions: 'permissions';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type RoleScalarFieldEnum =
    (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];

  export const AdminScalarFieldEnum: {
    id: 'id';
    fullName: 'fullName';
    email: 'email';
    password: 'password';
    roleId: 'roleId';
    isActive: 'isActive';
    invitedById: 'invitedById';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type AdminScalarFieldEnum =
    (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum];

  export const PasswordResetTokenScalarFieldEnum: {
    id: 'id';
    adminId: 'adminId';
    token: 'token';
    expiresAt: 'expiresAt';
    usedAt: 'usedAt';
    createdAt: 'createdAt';
  };

  export type PasswordResetTokenScalarFieldEnum =
    (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum];

  export const AttendeeScalarFieldEnum: {
    id: 'id';
    email: 'email';
    fullName: 'fullName';
    phoneNumber: 'phoneNumber';
    company: 'company';
    jobTitle: 'jobTitle';
    roleId: 'roleId';
    isActive: 'isActive';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type AttendeeScalarFieldEnum =
    (typeof AttendeeScalarFieldEnum)[keyof typeof AttendeeScalarFieldEnum];

  export const TicketScalarFieldEnum: {
    id: 'id';
    ticketNumber: 'ticketNumber';
    qrCode: 'qrCode';
    status: 'status';
    issuedAt: 'issuedAt';
    validFrom: 'validFrom';
    validUntil: 'validUntil';
    ticketType: 'ticketType';
    isCheckedIn: 'isCheckedIn';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
    attendeeId: 'attendeeId';
    paymentId: 'paymentId';
  };

  export type TicketScalarFieldEnum =
    (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum];

  export const PaymentScalarFieldEnum: {
    id: 'id';
    attendeeId: 'attendeeId';
    amount: 'amount';
    currency: 'currency';
    paystackReference: 'paystackReference';
    paymentReference: 'paymentReference';
    status: 'status';
    paymentMethod: 'paymentMethod';
    paidAt: 'paidAt';
    failureReason: 'failureReason';
    metadata: 'metadata';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type PaymentScalarFieldEnum =
    (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
  };

  export type NullableJsonNullValueInput =
    (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull;
    JsonNull: typeof JsonNull;
    AnyNull: typeof AnyNull;
  };

  export type JsonNullValueFilter =
    (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'TicketStatus'
   */
  export type EnumTicketStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'TicketStatus'
  >;

  /**
   * Reference to a field of type 'TicketStatus[]'
   */
  export type ListEnumTicketStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'TicketStatus[]'>;

  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Decimal'
  >;

  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Decimal[]'
  >;

  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'PaymentStatus'
  >;

  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>;

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Json'
  >;

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'QueryMode'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Deep Input Types
   */

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[];
    OR?: RoleWhereInput[];
    NOT?: RoleWhereInput | RoleWhereInput[];
    id?: StringFilter<'Role'> | string;
    name?: StringFilter<'Role'> | string;
    description?: StringFilter<'Role'> | string;
    permissions?: StringNullableListFilter<'Role'>;
    isActive?: BoolFilter<'Role'> | boolean;
    createdAt?: DateTimeFilter<'Role'> | Date | string;
    updatedAt?: DateTimeFilter<'Role'> | Date | string;
    admins?: AdminListRelationFilter;
    attendees?: AttendeeListRelationFilter;
  };

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    permissions?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    admins?: AdminOrderByRelationAggregateInput;
    attendees?: AttendeeOrderByRelationAggregateInput;
  };

  export type RoleWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      name?: string;
      AND?: RoleWhereInput | RoleWhereInput[];
      OR?: RoleWhereInput[];
      NOT?: RoleWhereInput | RoleWhereInput[];
      description?: StringFilter<'Role'> | string;
      permissions?: StringNullableListFilter<'Role'>;
      isActive?: BoolFilter<'Role'> | boolean;
      createdAt?: DateTimeFilter<'Role'> | Date | string;
      updatedAt?: DateTimeFilter<'Role'> | Date | string;
      admins?: AdminListRelationFilter;
      attendees?: AttendeeListRelationFilter;
    },
    'id' | 'name'
  >;

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    permissions?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: RoleCountOrderByAggregateInput;
    _max?: RoleMaxOrderByAggregateInput;
    _min?: RoleMinOrderByAggregateInput;
  };

  export type RoleScalarWhereWithAggregatesInput = {
    AND?:
      | RoleScalarWhereWithAggregatesInput
      | RoleScalarWhereWithAggregatesInput[];
    OR?: RoleScalarWhereWithAggregatesInput[];
    NOT?:
      | RoleScalarWhereWithAggregatesInput
      | RoleScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Role'> | string;
    name?: StringWithAggregatesFilter<'Role'> | string;
    description?: StringWithAggregatesFilter<'Role'> | string;
    permissions?: StringNullableListFilter<'Role'>;
    isActive?: BoolWithAggregatesFilter<'Role'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Role'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Role'> | Date | string;
  };

  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[];
    OR?: AdminWhereInput[];
    NOT?: AdminWhereInput | AdminWhereInput[];
    id?: StringFilter<'Admin'> | string;
    fullName?: StringFilter<'Admin'> | string;
    email?: StringFilter<'Admin'> | string;
    password?: StringFilter<'Admin'> | string;
    roleId?: StringFilter<'Admin'> | string;
    isActive?: BoolFilter<'Admin'> | boolean;
    invitedById?: StringNullableFilter<'Admin'> | string | null;
    createdAt?: DateTimeFilter<'Admin'> | Date | string;
    updatedAt?: DateTimeFilter<'Admin'> | Date | string;
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>;
    inviter?: XOR<AdminNullableScalarRelationFilter, AdminWhereInput> | null;
    invitedAdmins?: AdminListRelationFilter;
    passwordResetTokens?: PasswordResetTokenListRelationFilter;
  };

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder;
    fullName?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    invitedById?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    role?: RoleOrderByWithRelationInput;
    inviter?: AdminOrderByWithRelationInput;
    invitedAdmins?: AdminOrderByRelationAggregateInput;
    passwordResetTokens?: PasswordResetTokenOrderByRelationAggregateInput;
  };

  export type AdminWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: AdminWhereInput | AdminWhereInput[];
      OR?: AdminWhereInput[];
      NOT?: AdminWhereInput | AdminWhereInput[];
      fullName?: StringFilter<'Admin'> | string;
      password?: StringFilter<'Admin'> | string;
      roleId?: StringFilter<'Admin'> | string;
      isActive?: BoolFilter<'Admin'> | boolean;
      invitedById?: StringNullableFilter<'Admin'> | string | null;
      createdAt?: DateTimeFilter<'Admin'> | Date | string;
      updatedAt?: DateTimeFilter<'Admin'> | Date | string;
      role?: XOR<RoleScalarRelationFilter, RoleWhereInput>;
      inviter?: XOR<AdminNullableScalarRelationFilter, AdminWhereInput> | null;
      invitedAdmins?: AdminListRelationFilter;
      passwordResetTokens?: PasswordResetTokenListRelationFilter;
    },
    'id' | 'email'
  >;

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder;
    fullName?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    invitedById?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AdminCountOrderByAggregateInput;
    _max?: AdminMaxOrderByAggregateInput;
    _min?: AdminMinOrderByAggregateInput;
  };

  export type AdminScalarWhereWithAggregatesInput = {
    AND?:
      | AdminScalarWhereWithAggregatesInput
      | AdminScalarWhereWithAggregatesInput[];
    OR?: AdminScalarWhereWithAggregatesInput[];
    NOT?:
      | AdminScalarWhereWithAggregatesInput
      | AdminScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Admin'> | string;
    fullName?: StringWithAggregatesFilter<'Admin'> | string;
    email?: StringWithAggregatesFilter<'Admin'> | string;
    password?: StringWithAggregatesFilter<'Admin'> | string;
    roleId?: StringWithAggregatesFilter<'Admin'> | string;
    isActive?: BoolWithAggregatesFilter<'Admin'> | boolean;
    invitedById?: StringNullableWithAggregatesFilter<'Admin'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Admin'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Admin'> | Date | string;
  };

  export type PasswordResetTokenWhereInput = {
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[];
    OR?: PasswordResetTokenWhereInput[];
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[];
    id?: StringFilter<'PasswordResetToken'> | string;
    adminId?: StringFilter<'PasswordResetToken'> | string;
    token?: StringFilter<'PasswordResetToken'> | string;
    expiresAt?: DateTimeFilter<'PasswordResetToken'> | Date | string;
    usedAt?:
      | DateTimeNullableFilter<'PasswordResetToken'>
      | Date
      | string
      | null;
    createdAt?: DateTimeFilter<'PasswordResetToken'> | Date | string;
    admin?: XOR<AdminScalarRelationFilter, AdminWhereInput>;
  };

  export type PasswordResetTokenOrderByWithRelationInput = {
    id?: SortOrder;
    adminId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    usedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    admin?: AdminOrderByWithRelationInput;
  };

  export type PasswordResetTokenWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      token?: string;
      AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[];
      OR?: PasswordResetTokenWhereInput[];
      NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[];
      adminId?: StringFilter<'PasswordResetToken'> | string;
      expiresAt?: DateTimeFilter<'PasswordResetToken'> | Date | string;
      usedAt?:
        | DateTimeNullableFilter<'PasswordResetToken'>
        | Date
        | string
        | null;
      createdAt?: DateTimeFilter<'PasswordResetToken'> | Date | string;
      admin?: XOR<AdminScalarRelationFilter, AdminWhereInput>;
    },
    'id' | 'token'
  >;

  export type PasswordResetTokenOrderByWithAggregationInput = {
    id?: SortOrder;
    adminId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    usedAt?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: PasswordResetTokenCountOrderByAggregateInput;
    _max?: PasswordResetTokenMaxOrderByAggregateInput;
    _min?: PasswordResetTokenMinOrderByAggregateInput;
  };

  export type PasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?:
      | PasswordResetTokenScalarWhereWithAggregatesInput
      | PasswordResetTokenScalarWhereWithAggregatesInput[];
    OR?: PasswordResetTokenScalarWhereWithAggregatesInput[];
    NOT?:
      | PasswordResetTokenScalarWhereWithAggregatesInput
      | PasswordResetTokenScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'PasswordResetToken'> | string;
    adminId?: StringWithAggregatesFilter<'PasswordResetToken'> | string;
    token?: StringWithAggregatesFilter<'PasswordResetToken'> | string;
    expiresAt?:
      | DateTimeWithAggregatesFilter<'PasswordResetToken'>
      | Date
      | string;
    usedAt?:
      | DateTimeNullableWithAggregatesFilter<'PasswordResetToken'>
      | Date
      | string
      | null;
    createdAt?:
      | DateTimeWithAggregatesFilter<'PasswordResetToken'>
      | Date
      | string;
  };

  export type AttendeeWhereInput = {
    AND?: AttendeeWhereInput | AttendeeWhereInput[];
    OR?: AttendeeWhereInput[];
    NOT?: AttendeeWhereInput | AttendeeWhereInput[];
    id?: StringFilter<'Attendee'> | string;
    email?: StringFilter<'Attendee'> | string;
    fullName?: StringFilter<'Attendee'> | string;
    phoneNumber?: StringNullableFilter<'Attendee'> | string | null;
    company?: StringNullableFilter<'Attendee'> | string | null;
    jobTitle?: StringNullableFilter<'Attendee'> | string | null;
    roleId?: StringNullableFilter<'Attendee'> | string | null;
    isActive?: BoolFilter<'Attendee'> | boolean;
    createdAt?: DateTimeFilter<'Attendee'> | Date | string;
    updatedAt?: DateTimeFilter<'Attendee'> | Date | string;
    role?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null;
    payments?: PaymentListRelationFilter;
    tickets?: TicketListRelationFilter;
  };

  export type AttendeeOrderByWithRelationInput = {
    id?: SortOrder;
    email?: SortOrder;
    fullName?: SortOrder;
    phoneNumber?: SortOrderInput | SortOrder;
    company?: SortOrderInput | SortOrder;
    jobTitle?: SortOrderInput | SortOrder;
    roleId?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    role?: RoleOrderByWithRelationInput;
    payments?: PaymentOrderByRelationAggregateInput;
    tickets?: TicketOrderByRelationAggregateInput;
  };

  export type AttendeeWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      email?: string;
      AND?: AttendeeWhereInput | AttendeeWhereInput[];
      OR?: AttendeeWhereInput[];
      NOT?: AttendeeWhereInput | AttendeeWhereInput[];
      fullName?: StringFilter<'Attendee'> | string;
      phoneNumber?: StringNullableFilter<'Attendee'> | string | null;
      company?: StringNullableFilter<'Attendee'> | string | null;
      jobTitle?: StringNullableFilter<'Attendee'> | string | null;
      roleId?: StringNullableFilter<'Attendee'> | string | null;
      isActive?: BoolFilter<'Attendee'> | boolean;
      createdAt?: DateTimeFilter<'Attendee'> | Date | string;
      updatedAt?: DateTimeFilter<'Attendee'> | Date | string;
      role?: XOR<RoleNullableScalarRelationFilter, RoleWhereInput> | null;
      payments?: PaymentListRelationFilter;
      tickets?: TicketListRelationFilter;
    },
    'id' | 'email'
  >;

  export type AttendeeOrderByWithAggregationInput = {
    id?: SortOrder;
    email?: SortOrder;
    fullName?: SortOrder;
    phoneNumber?: SortOrderInput | SortOrder;
    company?: SortOrderInput | SortOrder;
    jobTitle?: SortOrderInput | SortOrder;
    roleId?: SortOrderInput | SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: AttendeeCountOrderByAggregateInput;
    _max?: AttendeeMaxOrderByAggregateInput;
    _min?: AttendeeMinOrderByAggregateInput;
  };

  export type AttendeeScalarWhereWithAggregatesInput = {
    AND?:
      | AttendeeScalarWhereWithAggregatesInput
      | AttendeeScalarWhereWithAggregatesInput[];
    OR?: AttendeeScalarWhereWithAggregatesInput[];
    NOT?:
      | AttendeeScalarWhereWithAggregatesInput
      | AttendeeScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Attendee'> | string;
    email?: StringWithAggregatesFilter<'Attendee'> | string;
    fullName?: StringWithAggregatesFilter<'Attendee'> | string;
    phoneNumber?:
      | StringNullableWithAggregatesFilter<'Attendee'>
      | string
      | null;
    company?: StringNullableWithAggregatesFilter<'Attendee'> | string | null;
    jobTitle?: StringNullableWithAggregatesFilter<'Attendee'> | string | null;
    roleId?: StringNullableWithAggregatesFilter<'Attendee'> | string | null;
    isActive?: BoolWithAggregatesFilter<'Attendee'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Attendee'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Attendee'> | Date | string;
  };

  export type TicketWhereInput = {
    AND?: TicketWhereInput | TicketWhereInput[];
    OR?: TicketWhereInput[];
    NOT?: TicketWhereInput | TicketWhereInput[];
    id?: StringFilter<'Ticket'> | string;
    ticketNumber?: StringFilter<'Ticket'> | string;
    qrCode?: StringFilter<'Ticket'> | string;
    status?: EnumTicketStatusFilter<'Ticket'> | $Enums.TicketStatus;
    issuedAt?: DateTimeFilter<'Ticket'> | Date | string;
    validFrom?: DateTimeFilter<'Ticket'> | Date | string;
    validUntil?: DateTimeFilter<'Ticket'> | Date | string;
    ticketType?: StringFilter<'Ticket'> | string;
    isCheckedIn?: BoolFilter<'Ticket'> | boolean;
    createdAt?: DateTimeFilter<'Ticket'> | Date | string;
    updatedAt?: DateTimeFilter<'Ticket'> | Date | string;
    attendeeId?: StringFilter<'Ticket'> | string;
    paymentId?: StringFilter<'Ticket'> | string;
    attendee?: XOR<AttendeeScalarRelationFilter, AttendeeWhereInput>;
    payment?: XOR<PaymentScalarRelationFilter, PaymentWhereInput>;
  };

  export type TicketOrderByWithRelationInput = {
    id?: SortOrder;
    ticketNumber?: SortOrder;
    qrCode?: SortOrder;
    status?: SortOrder;
    issuedAt?: SortOrder;
    validFrom?: SortOrder;
    validUntil?: SortOrder;
    ticketType?: SortOrder;
    isCheckedIn?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    attendeeId?: SortOrder;
    paymentId?: SortOrder;
    attendee?: AttendeeOrderByWithRelationInput;
    payment?: PaymentOrderByWithRelationInput;
  };

  export type TicketWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      ticketNumber?: string;
      qrCode?: string;
      AND?: TicketWhereInput | TicketWhereInput[];
      OR?: TicketWhereInput[];
      NOT?: TicketWhereInput | TicketWhereInput[];
      status?: EnumTicketStatusFilter<'Ticket'> | $Enums.TicketStatus;
      issuedAt?: DateTimeFilter<'Ticket'> | Date | string;
      validFrom?: DateTimeFilter<'Ticket'> | Date | string;
      validUntil?: DateTimeFilter<'Ticket'> | Date | string;
      ticketType?: StringFilter<'Ticket'> | string;
      isCheckedIn?: BoolFilter<'Ticket'> | boolean;
      createdAt?: DateTimeFilter<'Ticket'> | Date | string;
      updatedAt?: DateTimeFilter<'Ticket'> | Date | string;
      attendeeId?: StringFilter<'Ticket'> | string;
      paymentId?: StringFilter<'Ticket'> | string;
      attendee?: XOR<AttendeeScalarRelationFilter, AttendeeWhereInput>;
      payment?: XOR<PaymentScalarRelationFilter, PaymentWhereInput>;
    },
    'id' | 'ticketNumber' | 'qrCode'
  >;

  export type TicketOrderByWithAggregationInput = {
    id?: SortOrder;
    ticketNumber?: SortOrder;
    qrCode?: SortOrder;
    status?: SortOrder;
    issuedAt?: SortOrder;
    validFrom?: SortOrder;
    validUntil?: SortOrder;
    ticketType?: SortOrder;
    isCheckedIn?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    attendeeId?: SortOrder;
    paymentId?: SortOrder;
    _count?: TicketCountOrderByAggregateInput;
    _max?: TicketMaxOrderByAggregateInput;
    _min?: TicketMinOrderByAggregateInput;
  };

  export type TicketScalarWhereWithAggregatesInput = {
    AND?:
      | TicketScalarWhereWithAggregatesInput
      | TicketScalarWhereWithAggregatesInput[];
    OR?: TicketScalarWhereWithAggregatesInput[];
    NOT?:
      | TicketScalarWhereWithAggregatesInput
      | TicketScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Ticket'> | string;
    ticketNumber?: StringWithAggregatesFilter<'Ticket'> | string;
    qrCode?: StringWithAggregatesFilter<'Ticket'> | string;
    status?:
      | EnumTicketStatusWithAggregatesFilter<'Ticket'>
      | $Enums.TicketStatus;
    issuedAt?: DateTimeWithAggregatesFilter<'Ticket'> | Date | string;
    validFrom?: DateTimeWithAggregatesFilter<'Ticket'> | Date | string;
    validUntil?: DateTimeWithAggregatesFilter<'Ticket'> | Date | string;
    ticketType?: StringWithAggregatesFilter<'Ticket'> | string;
    isCheckedIn?: BoolWithAggregatesFilter<'Ticket'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Ticket'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Ticket'> | Date | string;
    attendeeId?: StringWithAggregatesFilter<'Ticket'> | string;
    paymentId?: StringWithAggregatesFilter<'Ticket'> | string;
  };

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[];
    OR?: PaymentWhereInput[];
    NOT?: PaymentWhereInput | PaymentWhereInput[];
    id?: StringFilter<'Payment'> | string;
    attendeeId?: StringFilter<'Payment'> | string;
    amount?:
      | DecimalFilter<'Payment'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFilter<'Payment'> | string;
    paystackReference?: StringNullableFilter<'Payment'> | string | null;
    paymentReference?: StringFilter<'Payment'> | string;
    status?: EnumPaymentStatusFilter<'Payment'> | $Enums.PaymentStatus;
    paymentMethod?: StringNullableFilter<'Payment'> | string | null;
    paidAt?: DateTimeNullableFilter<'Payment'> | Date | string | null;
    failureReason?: StringNullableFilter<'Payment'> | string | null;
    metadata?: JsonNullableFilter<'Payment'>;
    createdAt?: DateTimeFilter<'Payment'> | Date | string;
    updatedAt?: DateTimeFilter<'Payment'> | Date | string;
    attendee?: XOR<AttendeeScalarRelationFilter, AttendeeWhereInput>;
    tickets?: TicketListRelationFilter;
  };

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder;
    attendeeId?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    paystackReference?: SortOrderInput | SortOrder;
    paymentReference?: SortOrder;
    status?: SortOrder;
    paymentMethod?: SortOrderInput | SortOrder;
    paidAt?: SortOrderInput | SortOrder;
    failureReason?: SortOrderInput | SortOrder;
    metadata?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    attendee?: AttendeeOrderByWithRelationInput;
    tickets?: TicketOrderByRelationAggregateInput;
  };

  export type PaymentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      paystackReference?: string;
      paymentReference?: string;
      AND?: PaymentWhereInput | PaymentWhereInput[];
      OR?: PaymentWhereInput[];
      NOT?: PaymentWhereInput | PaymentWhereInput[];
      attendeeId?: StringFilter<'Payment'> | string;
      amount?:
        | DecimalFilter<'Payment'>
        | Decimal
        | DecimalJsLike
        | number
        | string;
      currency?: StringFilter<'Payment'> | string;
      status?: EnumPaymentStatusFilter<'Payment'> | $Enums.PaymentStatus;
      paymentMethod?: StringNullableFilter<'Payment'> | string | null;
      paidAt?: DateTimeNullableFilter<'Payment'> | Date | string | null;
      failureReason?: StringNullableFilter<'Payment'> | string | null;
      metadata?: JsonNullableFilter<'Payment'>;
      createdAt?: DateTimeFilter<'Payment'> | Date | string;
      updatedAt?: DateTimeFilter<'Payment'> | Date | string;
      attendee?: XOR<AttendeeScalarRelationFilter, AttendeeWhereInput>;
      tickets?: TicketListRelationFilter;
    },
    'id' | 'paystackReference' | 'paymentReference'
  >;

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder;
    attendeeId?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    paystackReference?: SortOrderInput | SortOrder;
    paymentReference?: SortOrder;
    status?: SortOrder;
    paymentMethod?: SortOrderInput | SortOrder;
    paidAt?: SortOrderInput | SortOrder;
    failureReason?: SortOrderInput | SortOrder;
    metadata?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: PaymentCountOrderByAggregateInput;
    _avg?: PaymentAvgOrderByAggregateInput;
    _max?: PaymentMaxOrderByAggregateInput;
    _min?: PaymentMinOrderByAggregateInput;
    _sum?: PaymentSumOrderByAggregateInput;
  };

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?:
      | PaymentScalarWhereWithAggregatesInput
      | PaymentScalarWhereWithAggregatesInput[];
    OR?: PaymentScalarWhereWithAggregatesInput[];
    NOT?:
      | PaymentScalarWhereWithAggregatesInput
      | PaymentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Payment'> | string;
    attendeeId?: StringWithAggregatesFilter<'Payment'> | string;
    amount?:
      | DecimalWithAggregatesFilter<'Payment'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringWithAggregatesFilter<'Payment'> | string;
    paystackReference?:
      | StringNullableWithAggregatesFilter<'Payment'>
      | string
      | null;
    paymentReference?: StringWithAggregatesFilter<'Payment'> | string;
    status?:
      | EnumPaymentStatusWithAggregatesFilter<'Payment'>
      | $Enums.PaymentStatus;
    paymentMethod?:
      | StringNullableWithAggregatesFilter<'Payment'>
      | string
      | null;
    paidAt?:
      | DateTimeNullableWithAggregatesFilter<'Payment'>
      | Date
      | string
      | null;
    failureReason?:
      | StringNullableWithAggregatesFilter<'Payment'>
      | string
      | null;
    metadata?: JsonNullableWithAggregatesFilter<'Payment'>;
    createdAt?: DateTimeWithAggregatesFilter<'Payment'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Payment'> | Date | string;
  };

  export type RoleCreateInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    admins?: AdminCreateNestedManyWithoutRoleInput;
    attendees?: AttendeeCreateNestedManyWithoutRoleInput;
  };

  export type RoleUncheckedCreateInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    admins?: AdminUncheckedCreateNestedManyWithoutRoleInput;
    attendees?: AttendeeUncheckedCreateNestedManyWithoutRoleInput;
  };

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    admins?: AdminUpdateManyWithoutRoleNestedInput;
    attendees?: AttendeeUpdateManyWithoutRoleNestedInput;
  };

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    admins?: AdminUncheckedUpdateManyWithoutRoleNestedInput;
    attendees?: AttendeeUncheckedUpdateManyWithoutRoleNestedInput;
  };

  export type RoleCreateManyInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AdminCreateInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: RoleCreateNestedOneWithoutAdminsInput;
    inviter?: AdminCreateNestedOneWithoutInvitedAdminsInput;
    invitedAdmins?: AdminCreateNestedManyWithoutInviterInput;
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutAdminInput;
  };

  export type AdminUncheckedCreateInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    invitedAdmins?: AdminUncheckedCreateNestedManyWithoutInviterInput;
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutAdminInput;
  };

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneRequiredWithoutAdminsNestedInput;
    inviter?: AdminUpdateOneWithoutInvitedAdminsNestedInput;
    invitedAdmins?: AdminUpdateManyWithoutInviterNestedInput;
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    roleId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    invitedAdmins?: AdminUncheckedUpdateManyWithoutInviterNestedInput;
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutAdminNestedInput;
  };

  export type AdminCreateManyInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    roleId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PasswordResetTokenCreateInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
    admin: AdminCreateNestedOneWithoutPasswordResetTokensInput;
  };

  export type PasswordResetTokenUncheckedCreateInput = {
    id?: string;
    adminId: string;
    token: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type PasswordResetTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    admin?: AdminUpdateOneRequiredWithoutPasswordResetTokensNestedInput;
  };

  export type PasswordResetTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    adminId?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PasswordResetTokenCreateManyInput = {
    id?: string;
    adminId: string;
    token: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type PasswordResetTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PasswordResetTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    adminId?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AttendeeCreateInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role?: RoleCreateNestedOneWithoutAttendeesInput;
    payments?: PaymentCreateNestedManyWithoutAttendeeInput;
    tickets?: TicketCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeUncheckedCreateInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    roleId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: PaymentUncheckedCreateNestedManyWithoutAttendeeInput;
    tickets?: TicketUncheckedCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneWithoutAttendeesNestedInput;
    payments?: PaymentUpdateManyWithoutAttendeeNestedInput;
    tickets?: TicketUpdateManyWithoutAttendeeNestedInput;
  };

  export type AttendeeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    roleId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: PaymentUncheckedUpdateManyWithoutAttendeeNestedInput;
    tickets?: TicketUncheckedUpdateManyWithoutAttendeeNestedInput;
  };

  export type AttendeeCreateManyInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    roleId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AttendeeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AttendeeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    roleId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TicketCreateInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendee: AttendeeCreateNestedOneWithoutTicketsInput;
    payment: PaymentCreateNestedOneWithoutTicketsInput;
  };

  export type TicketUncheckedCreateInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendeeId: string;
    paymentId: string;
  };

  export type TicketUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendee?: AttendeeUpdateOneRequiredWithoutTicketsNestedInput;
    payment?: PaymentUpdateOneRequiredWithoutTicketsNestedInput;
  };

  export type TicketUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
    paymentId?: StringFieldUpdateOperationsInput | string;
  };

  export type TicketCreateManyInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendeeId: string;
    paymentId: string;
  };

  export type TicketUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TicketUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
    paymentId?: StringFieldUpdateOperationsInput | string;
  };

  export type PaymentCreateInput = {
    id?: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendee: AttendeeCreateNestedOneWithoutPaymentsInput;
    tickets?: TicketCreateNestedManyWithoutPaymentInput;
  };

  export type PaymentUncheckedCreateInput = {
    id?: string;
    attendeeId: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: TicketUncheckedCreateNestedManyWithoutPaymentInput;
  };

  export type PaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendee?: AttendeeUpdateOneRequiredWithoutPaymentsNestedInput;
    tickets?: TicketUpdateManyWithoutPaymentNestedInput;
  };

  export type PaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: TicketUncheckedUpdateManyWithoutPaymentNestedInput;
  };

  export type PaymentCreateManyInput = {
    id?: string;
    attendeeId: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type PaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type AdminListRelationFilter = {
    every?: AdminWhereInput;
    some?: AdminWhereInput;
    none?: AdminWhereInput;
  };

  export type AttendeeListRelationFilter = {
    every?: AttendeeWhereInput;
    some?: AttendeeWhereInput;
    none?: AttendeeWhereInput;
  };

  export type AdminOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AttendeeOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    permissions?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    description?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput;
    isNot?: RoleWhereInput;
  };

  export type AdminNullableScalarRelationFilter = {
    is?: AdminWhereInput | null;
    isNot?: AdminWhereInput | null;
  };

  export type PasswordResetTokenListRelationFilter = {
    every?: PasswordResetTokenWhereInput;
    some?: PasswordResetTokenWhereInput;
    none?: PasswordResetTokenWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type PasswordResetTokenOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder;
    fullName?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    invitedById?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder;
    fullName?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    invitedById?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder;
    fullName?: SortOrder;
    email?: SortOrder;
    password?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    invitedById?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type AdminScalarRelationFilter = {
    is?: AdminWhereInput;
    isNot?: AdminWhereInput;
  };

  export type PasswordResetTokenCountOrderByAggregateInput = {
    id?: SortOrder;
    adminId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    usedAt?: SortOrder;
    createdAt?: SortOrder;
  };

  export type PasswordResetTokenMaxOrderByAggregateInput = {
    id?: SortOrder;
    adminId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    usedAt?: SortOrder;
    createdAt?: SortOrder;
  };

  export type PasswordResetTokenMinOrderByAggregateInput = {
    id?: SortOrder;
    adminId?: SortOrder;
    token?: SortOrder;
    expiresAt?: SortOrder;
    usedAt?: SortOrder;
    createdAt?: SortOrder;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type RoleNullableScalarRelationFilter = {
    is?: RoleWhereInput | null;
    isNot?: RoleWhereInput | null;
  };

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput;
    some?: PaymentWhereInput;
    none?: PaymentWhereInput;
  };

  export type TicketListRelationFilter = {
    every?: TicketWhereInput;
    some?: TicketWhereInput;
    none?: TicketWhereInput;
  };

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type AttendeeCountOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    fullName?: SortOrder;
    phoneNumber?: SortOrder;
    company?: SortOrder;
    jobTitle?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AttendeeMaxOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    fullName?: SortOrder;
    phoneNumber?: SortOrder;
    company?: SortOrder;
    jobTitle?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AttendeeMinOrderByAggregateInput = {
    id?: SortOrder;
    email?: SortOrder;
    fullName?: SortOrder;
    phoneNumber?: SortOrder;
    company?: SortOrder;
    jobTitle?: SortOrder;
    roleId?: SortOrder;
    isActive?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.TicketStatus[]
      | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.TicketStatus[]
      | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus;
  };

  export type AttendeeScalarRelationFilter = {
    is?: AttendeeWhereInput;
    isNot?: AttendeeWhereInput;
  };

  export type PaymentScalarRelationFilter = {
    is?: PaymentWhereInput;
    isNot?: PaymentWhereInput;
  };

  export type TicketCountOrderByAggregateInput = {
    id?: SortOrder;
    ticketNumber?: SortOrder;
    qrCode?: SortOrder;
    status?: SortOrder;
    issuedAt?: SortOrder;
    validFrom?: SortOrder;
    validUntil?: SortOrder;
    ticketType?: SortOrder;
    isCheckedIn?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    attendeeId?: SortOrder;
    paymentId?: SortOrder;
  };

  export type TicketMaxOrderByAggregateInput = {
    id?: SortOrder;
    ticketNumber?: SortOrder;
    qrCode?: SortOrder;
    status?: SortOrder;
    issuedAt?: SortOrder;
    validFrom?: SortOrder;
    validUntil?: SortOrder;
    ticketType?: SortOrder;
    isCheckedIn?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    attendeeId?: SortOrder;
    paymentId?: SortOrder;
  };

  export type TicketMinOrderByAggregateInput = {
    id?: SortOrder;
    ticketNumber?: SortOrder;
    qrCode?: SortOrder;
    status?: SortOrder;
    issuedAt?: SortOrder;
    validFrom?: SortOrder;
    validUntil?: SortOrder;
    ticketType?: SortOrder;
    isCheckedIn?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    attendeeId?: SortOrder;
    paymentId?: SortOrder;
  };

  export type EnumTicketStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.TicketStatus[]
      | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.TicketStatus[]
      | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.TicketStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumTicketStatusFilter<$PrismaModel>;
    _max?: NestedEnumTicketStatusFilter<$PrismaModel>;
  };

  export type DecimalFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
  };

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
  };
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder;
    attendeeId?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    paystackReference?: SortOrder;
    paymentReference?: SortOrder;
    status?: SortOrder;
    paymentMethod?: SortOrder;
    paidAt?: SortOrder;
    failureReason?: SortOrder;
    metadata?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type PaymentAvgOrderByAggregateInput = {
    amount?: SortOrder;
  };

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder;
    attendeeId?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    paystackReference?: SortOrder;
    paymentReference?: SortOrder;
    status?: SortOrder;
    paymentMethod?: SortOrder;
    paidAt?: SortOrder;
    failureReason?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder;
    attendeeId?: SortOrder;
    amount?: SortOrder;
    currency?: SortOrder;
    paystackReference?: SortOrder;
    paymentReference?: SortOrder;
    status?: SortOrder;
    paymentMethod?: SortOrder;
    paidAt?: SortOrder;
    failureReason?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type PaymentSumOrderByAggregateInput = {
    amount?: SortOrder;
  };

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalWithAggregatesFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>;
  };
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          'path'
        >
      >;

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedJsonNullableFilter<$PrismaModel>;
    _max?: NestedJsonNullableFilter<$PrismaModel>;
  };

  export type RoleCreatepermissionsInput = {
    set: string[];
  };

  export type AdminCreateNestedManyWithoutRoleInput = {
    create?:
      | XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput>
      | AdminCreateWithoutRoleInput[]
      | AdminUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutRoleInput
      | AdminCreateOrConnectWithoutRoleInput[];
    createMany?: AdminCreateManyRoleInputEnvelope;
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
  };

  export type AttendeeCreateNestedManyWithoutRoleInput = {
    create?:
      | XOR<
          AttendeeCreateWithoutRoleInput,
          AttendeeUncheckedCreateWithoutRoleInput
        >
      | AttendeeCreateWithoutRoleInput[]
      | AttendeeUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AttendeeCreateOrConnectWithoutRoleInput
      | AttendeeCreateOrConnectWithoutRoleInput[];
    createMany?: AttendeeCreateManyRoleInputEnvelope;
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
  };

  export type AdminUncheckedCreateNestedManyWithoutRoleInput = {
    create?:
      | XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput>
      | AdminCreateWithoutRoleInput[]
      | AdminUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutRoleInput
      | AdminCreateOrConnectWithoutRoleInput[];
    createMany?: AdminCreateManyRoleInputEnvelope;
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
  };

  export type AttendeeUncheckedCreateNestedManyWithoutRoleInput = {
    create?:
      | XOR<
          AttendeeCreateWithoutRoleInput,
          AttendeeUncheckedCreateWithoutRoleInput
        >
      | AttendeeCreateWithoutRoleInput[]
      | AttendeeUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AttendeeCreateOrConnectWithoutRoleInput
      | AttendeeCreateOrConnectWithoutRoleInput[];
    createMany?: AttendeeCreateManyRoleInputEnvelope;
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type RoleUpdatepermissionsInput = {
    set?: string[];
    push?: string | string[];
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type AdminUpdateManyWithoutRoleNestedInput = {
    create?:
      | XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput>
      | AdminCreateWithoutRoleInput[]
      | AdminUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutRoleInput
      | AdminCreateOrConnectWithoutRoleInput[];
    upsert?:
      | AdminUpsertWithWhereUniqueWithoutRoleInput
      | AdminUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: AdminCreateManyRoleInputEnvelope;
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    update?:
      | AdminUpdateWithWhereUniqueWithoutRoleInput
      | AdminUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?:
      | AdminUpdateManyWithWhereWithoutRoleInput
      | AdminUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[];
  };

  export type AttendeeUpdateManyWithoutRoleNestedInput = {
    create?:
      | XOR<
          AttendeeCreateWithoutRoleInput,
          AttendeeUncheckedCreateWithoutRoleInput
        >
      | AttendeeCreateWithoutRoleInput[]
      | AttendeeUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AttendeeCreateOrConnectWithoutRoleInput
      | AttendeeCreateOrConnectWithoutRoleInput[];
    upsert?:
      | AttendeeUpsertWithWhereUniqueWithoutRoleInput
      | AttendeeUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: AttendeeCreateManyRoleInputEnvelope;
    set?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    disconnect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    delete?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    update?:
      | AttendeeUpdateWithWhereUniqueWithoutRoleInput
      | AttendeeUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?:
      | AttendeeUpdateManyWithWhereWithoutRoleInput
      | AttendeeUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[];
  };

  export type AdminUncheckedUpdateManyWithoutRoleNestedInput = {
    create?:
      | XOR<AdminCreateWithoutRoleInput, AdminUncheckedCreateWithoutRoleInput>
      | AdminCreateWithoutRoleInput[]
      | AdminUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutRoleInput
      | AdminCreateOrConnectWithoutRoleInput[];
    upsert?:
      | AdminUpsertWithWhereUniqueWithoutRoleInput
      | AdminUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: AdminCreateManyRoleInputEnvelope;
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    update?:
      | AdminUpdateWithWhereUniqueWithoutRoleInput
      | AdminUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?:
      | AdminUpdateManyWithWhereWithoutRoleInput
      | AdminUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[];
  };

  export type AttendeeUncheckedUpdateManyWithoutRoleNestedInput = {
    create?:
      | XOR<
          AttendeeCreateWithoutRoleInput,
          AttendeeUncheckedCreateWithoutRoleInput
        >
      | AttendeeCreateWithoutRoleInput[]
      | AttendeeUncheckedCreateWithoutRoleInput[];
    connectOrCreate?:
      | AttendeeCreateOrConnectWithoutRoleInput
      | AttendeeCreateOrConnectWithoutRoleInput[];
    upsert?:
      | AttendeeUpsertWithWhereUniqueWithoutRoleInput
      | AttendeeUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: AttendeeCreateManyRoleInputEnvelope;
    set?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    disconnect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    delete?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    connect?: AttendeeWhereUniqueInput | AttendeeWhereUniqueInput[];
    update?:
      | AttendeeUpdateWithWhereUniqueWithoutRoleInput
      | AttendeeUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?:
      | AttendeeUpdateManyWithWhereWithoutRoleInput
      | AttendeeUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[];
  };

  export type RoleCreateNestedOneWithoutAdminsInput = {
    create?: XOR<
      RoleCreateWithoutAdminsInput,
      RoleUncheckedCreateWithoutAdminsInput
    >;
    connectOrCreate?: RoleCreateOrConnectWithoutAdminsInput;
    connect?: RoleWhereUniqueInput;
  };

  export type AdminCreateNestedOneWithoutInvitedAdminsInput = {
    create?: XOR<
      AdminCreateWithoutInvitedAdminsInput,
      AdminUncheckedCreateWithoutInvitedAdminsInput
    >;
    connectOrCreate?: AdminCreateOrConnectWithoutInvitedAdminsInput;
    connect?: AdminWhereUniqueInput;
  };

  export type AdminCreateNestedManyWithoutInviterInput = {
    create?:
      | XOR<
          AdminCreateWithoutInviterInput,
          AdminUncheckedCreateWithoutInviterInput
        >
      | AdminCreateWithoutInviterInput[]
      | AdminUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutInviterInput
      | AdminCreateOrConnectWithoutInviterInput[];
    createMany?: AdminCreateManyInviterInputEnvelope;
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
  };

  export type PasswordResetTokenCreateNestedManyWithoutAdminInput = {
    create?:
      | XOR<
          PasswordResetTokenCreateWithoutAdminInput,
          PasswordResetTokenUncheckedCreateWithoutAdminInput
        >
      | PasswordResetTokenCreateWithoutAdminInput[]
      | PasswordResetTokenUncheckedCreateWithoutAdminInput[];
    connectOrCreate?:
      | PasswordResetTokenCreateOrConnectWithoutAdminInput
      | PasswordResetTokenCreateOrConnectWithoutAdminInput[];
    createMany?: PasswordResetTokenCreateManyAdminInputEnvelope;
    connect?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
  };

  export type AdminUncheckedCreateNestedManyWithoutInviterInput = {
    create?:
      | XOR<
          AdminCreateWithoutInviterInput,
          AdminUncheckedCreateWithoutInviterInput
        >
      | AdminCreateWithoutInviterInput[]
      | AdminUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutInviterInput
      | AdminCreateOrConnectWithoutInviterInput[];
    createMany?: AdminCreateManyInviterInputEnvelope;
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
  };

  export type PasswordResetTokenUncheckedCreateNestedManyWithoutAdminInput = {
    create?:
      | XOR<
          PasswordResetTokenCreateWithoutAdminInput,
          PasswordResetTokenUncheckedCreateWithoutAdminInput
        >
      | PasswordResetTokenCreateWithoutAdminInput[]
      | PasswordResetTokenUncheckedCreateWithoutAdminInput[];
    connectOrCreate?:
      | PasswordResetTokenCreateOrConnectWithoutAdminInput
      | PasswordResetTokenCreateOrConnectWithoutAdminInput[];
    createMany?: PasswordResetTokenCreateManyAdminInputEnvelope;
    connect?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
  };

  export type RoleUpdateOneRequiredWithoutAdminsNestedInput = {
    create?: XOR<
      RoleCreateWithoutAdminsInput,
      RoleUncheckedCreateWithoutAdminsInput
    >;
    connectOrCreate?: RoleCreateOrConnectWithoutAdminsInput;
    upsert?: RoleUpsertWithoutAdminsInput;
    connect?: RoleWhereUniqueInput;
    update?: XOR<
      XOR<
        RoleUpdateToOneWithWhereWithoutAdminsInput,
        RoleUpdateWithoutAdminsInput
      >,
      RoleUncheckedUpdateWithoutAdminsInput
    >;
  };

  export type AdminUpdateOneWithoutInvitedAdminsNestedInput = {
    create?: XOR<
      AdminCreateWithoutInvitedAdminsInput,
      AdminUncheckedCreateWithoutInvitedAdminsInput
    >;
    connectOrCreate?: AdminCreateOrConnectWithoutInvitedAdminsInput;
    upsert?: AdminUpsertWithoutInvitedAdminsInput;
    disconnect?: AdminWhereInput | boolean;
    delete?: AdminWhereInput | boolean;
    connect?: AdminWhereUniqueInput;
    update?: XOR<
      XOR<
        AdminUpdateToOneWithWhereWithoutInvitedAdminsInput,
        AdminUpdateWithoutInvitedAdminsInput
      >,
      AdminUncheckedUpdateWithoutInvitedAdminsInput
    >;
  };

  export type AdminUpdateManyWithoutInviterNestedInput = {
    create?:
      | XOR<
          AdminCreateWithoutInviterInput,
          AdminUncheckedCreateWithoutInviterInput
        >
      | AdminCreateWithoutInviterInput[]
      | AdminUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutInviterInput
      | AdminCreateOrConnectWithoutInviterInput[];
    upsert?:
      | AdminUpsertWithWhereUniqueWithoutInviterInput
      | AdminUpsertWithWhereUniqueWithoutInviterInput[];
    createMany?: AdminCreateManyInviterInputEnvelope;
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    update?:
      | AdminUpdateWithWhereUniqueWithoutInviterInput
      | AdminUpdateWithWhereUniqueWithoutInviterInput[];
    updateMany?:
      | AdminUpdateManyWithWhereWithoutInviterInput
      | AdminUpdateManyWithWhereWithoutInviterInput[];
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[];
  };

  export type PasswordResetTokenUpdateManyWithoutAdminNestedInput = {
    create?:
      | XOR<
          PasswordResetTokenCreateWithoutAdminInput,
          PasswordResetTokenUncheckedCreateWithoutAdminInput
        >
      | PasswordResetTokenCreateWithoutAdminInput[]
      | PasswordResetTokenUncheckedCreateWithoutAdminInput[];
    connectOrCreate?:
      | PasswordResetTokenCreateOrConnectWithoutAdminInput
      | PasswordResetTokenCreateOrConnectWithoutAdminInput[];
    upsert?:
      | PasswordResetTokenUpsertWithWhereUniqueWithoutAdminInput
      | PasswordResetTokenUpsertWithWhereUniqueWithoutAdminInput[];
    createMany?: PasswordResetTokenCreateManyAdminInputEnvelope;
    set?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    disconnect?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    delete?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    connect?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    update?:
      | PasswordResetTokenUpdateWithWhereUniqueWithoutAdminInput
      | PasswordResetTokenUpdateWithWhereUniqueWithoutAdminInput[];
    updateMany?:
      | PasswordResetTokenUpdateManyWithWhereWithoutAdminInput
      | PasswordResetTokenUpdateManyWithWhereWithoutAdminInput[];
    deleteMany?:
      | PasswordResetTokenScalarWhereInput
      | PasswordResetTokenScalarWhereInput[];
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type AdminUncheckedUpdateManyWithoutInviterNestedInput = {
    create?:
      | XOR<
          AdminCreateWithoutInviterInput,
          AdminUncheckedCreateWithoutInviterInput
        >
      | AdminCreateWithoutInviterInput[]
      | AdminUncheckedCreateWithoutInviterInput[];
    connectOrCreate?:
      | AdminCreateOrConnectWithoutInviterInput
      | AdminCreateOrConnectWithoutInviterInput[];
    upsert?:
      | AdminUpsertWithWhereUniqueWithoutInviterInput
      | AdminUpsertWithWhereUniqueWithoutInviterInput[];
    createMany?: AdminCreateManyInviterInputEnvelope;
    set?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    disconnect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    delete?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    connect?: AdminWhereUniqueInput | AdminWhereUniqueInput[];
    update?:
      | AdminUpdateWithWhereUniqueWithoutInviterInput
      | AdminUpdateWithWhereUniqueWithoutInviterInput[];
    updateMany?:
      | AdminUpdateManyWithWhereWithoutInviterInput
      | AdminUpdateManyWithWhereWithoutInviterInput[];
    deleteMany?: AdminScalarWhereInput | AdminScalarWhereInput[];
  };

  export type PasswordResetTokenUncheckedUpdateManyWithoutAdminNestedInput = {
    create?:
      | XOR<
          PasswordResetTokenCreateWithoutAdminInput,
          PasswordResetTokenUncheckedCreateWithoutAdminInput
        >
      | PasswordResetTokenCreateWithoutAdminInput[]
      | PasswordResetTokenUncheckedCreateWithoutAdminInput[];
    connectOrCreate?:
      | PasswordResetTokenCreateOrConnectWithoutAdminInput
      | PasswordResetTokenCreateOrConnectWithoutAdminInput[];
    upsert?:
      | PasswordResetTokenUpsertWithWhereUniqueWithoutAdminInput
      | PasswordResetTokenUpsertWithWhereUniqueWithoutAdminInput[];
    createMany?: PasswordResetTokenCreateManyAdminInputEnvelope;
    set?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    disconnect?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    delete?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    connect?:
      | PasswordResetTokenWhereUniqueInput
      | PasswordResetTokenWhereUniqueInput[];
    update?:
      | PasswordResetTokenUpdateWithWhereUniqueWithoutAdminInput
      | PasswordResetTokenUpdateWithWhereUniqueWithoutAdminInput[];
    updateMany?:
      | PasswordResetTokenUpdateManyWithWhereWithoutAdminInput
      | PasswordResetTokenUpdateManyWithWhereWithoutAdminInput[];
    deleteMany?:
      | PasswordResetTokenScalarWhereInput
      | PasswordResetTokenScalarWhereInput[];
  };

  export type AdminCreateNestedOneWithoutPasswordResetTokensInput = {
    create?: XOR<
      AdminCreateWithoutPasswordResetTokensInput,
      AdminUncheckedCreateWithoutPasswordResetTokensInput
    >;
    connectOrCreate?: AdminCreateOrConnectWithoutPasswordResetTokensInput;
    connect?: AdminWhereUniqueInput;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type AdminUpdateOneRequiredWithoutPasswordResetTokensNestedInput = {
    create?: XOR<
      AdminCreateWithoutPasswordResetTokensInput,
      AdminUncheckedCreateWithoutPasswordResetTokensInput
    >;
    connectOrCreate?: AdminCreateOrConnectWithoutPasswordResetTokensInput;
    upsert?: AdminUpsertWithoutPasswordResetTokensInput;
    connect?: AdminWhereUniqueInput;
    update?: XOR<
      XOR<
        AdminUpdateToOneWithWhereWithoutPasswordResetTokensInput,
        AdminUpdateWithoutPasswordResetTokensInput
      >,
      AdminUncheckedUpdateWithoutPasswordResetTokensInput
    >;
  };

  export type RoleCreateNestedOneWithoutAttendeesInput = {
    create?: XOR<
      RoleCreateWithoutAttendeesInput,
      RoleUncheckedCreateWithoutAttendeesInput
    >;
    connectOrCreate?: RoleCreateOrConnectWithoutAttendeesInput;
    connect?: RoleWhereUniqueInput;
  };

  export type PaymentCreateNestedManyWithoutAttendeeInput = {
    create?:
      | XOR<
          PaymentCreateWithoutAttendeeInput,
          PaymentUncheckedCreateWithoutAttendeeInput
        >
      | PaymentCreateWithoutAttendeeInput[]
      | PaymentUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | PaymentCreateOrConnectWithoutAttendeeInput
      | PaymentCreateOrConnectWithoutAttendeeInput[];
    createMany?: PaymentCreateManyAttendeeInputEnvelope;
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
  };

  export type TicketCreateNestedManyWithoutAttendeeInput = {
    create?:
      | XOR<
          TicketCreateWithoutAttendeeInput,
          TicketUncheckedCreateWithoutAttendeeInput
        >
      | TicketCreateWithoutAttendeeInput[]
      | TicketUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutAttendeeInput
      | TicketCreateOrConnectWithoutAttendeeInput[];
    createMany?: TicketCreateManyAttendeeInputEnvelope;
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
  };

  export type PaymentUncheckedCreateNestedManyWithoutAttendeeInput = {
    create?:
      | XOR<
          PaymentCreateWithoutAttendeeInput,
          PaymentUncheckedCreateWithoutAttendeeInput
        >
      | PaymentCreateWithoutAttendeeInput[]
      | PaymentUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | PaymentCreateOrConnectWithoutAttendeeInput
      | PaymentCreateOrConnectWithoutAttendeeInput[];
    createMany?: PaymentCreateManyAttendeeInputEnvelope;
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
  };

  export type TicketUncheckedCreateNestedManyWithoutAttendeeInput = {
    create?:
      | XOR<
          TicketCreateWithoutAttendeeInput,
          TicketUncheckedCreateWithoutAttendeeInput
        >
      | TicketCreateWithoutAttendeeInput[]
      | TicketUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutAttendeeInput
      | TicketCreateOrConnectWithoutAttendeeInput[];
    createMany?: TicketCreateManyAttendeeInputEnvelope;
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
  };

  export type RoleUpdateOneWithoutAttendeesNestedInput = {
    create?: XOR<
      RoleCreateWithoutAttendeesInput,
      RoleUncheckedCreateWithoutAttendeesInput
    >;
    connectOrCreate?: RoleCreateOrConnectWithoutAttendeesInput;
    upsert?: RoleUpsertWithoutAttendeesInput;
    disconnect?: RoleWhereInput | boolean;
    delete?: RoleWhereInput | boolean;
    connect?: RoleWhereUniqueInput;
    update?: XOR<
      XOR<
        RoleUpdateToOneWithWhereWithoutAttendeesInput,
        RoleUpdateWithoutAttendeesInput
      >,
      RoleUncheckedUpdateWithoutAttendeesInput
    >;
  };

  export type PaymentUpdateManyWithoutAttendeeNestedInput = {
    create?:
      | XOR<
          PaymentCreateWithoutAttendeeInput,
          PaymentUncheckedCreateWithoutAttendeeInput
        >
      | PaymentCreateWithoutAttendeeInput[]
      | PaymentUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | PaymentCreateOrConnectWithoutAttendeeInput
      | PaymentCreateOrConnectWithoutAttendeeInput[];
    upsert?:
      | PaymentUpsertWithWhereUniqueWithoutAttendeeInput
      | PaymentUpsertWithWhereUniqueWithoutAttendeeInput[];
    createMany?: PaymentCreateManyAttendeeInputEnvelope;
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    update?:
      | PaymentUpdateWithWhereUniqueWithoutAttendeeInput
      | PaymentUpdateWithWhereUniqueWithoutAttendeeInput[];
    updateMany?:
      | PaymentUpdateManyWithWhereWithoutAttendeeInput
      | PaymentUpdateManyWithWhereWithoutAttendeeInput[];
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[];
  };

  export type TicketUpdateManyWithoutAttendeeNestedInput = {
    create?:
      | XOR<
          TicketCreateWithoutAttendeeInput,
          TicketUncheckedCreateWithoutAttendeeInput
        >
      | TicketCreateWithoutAttendeeInput[]
      | TicketUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutAttendeeInput
      | TicketCreateOrConnectWithoutAttendeeInput[];
    upsert?:
      | TicketUpsertWithWhereUniqueWithoutAttendeeInput
      | TicketUpsertWithWhereUniqueWithoutAttendeeInput[];
    createMany?: TicketCreateManyAttendeeInputEnvelope;
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    update?:
      | TicketUpdateWithWhereUniqueWithoutAttendeeInput
      | TicketUpdateWithWhereUniqueWithoutAttendeeInput[];
    updateMany?:
      | TicketUpdateManyWithWhereWithoutAttendeeInput
      | TicketUpdateManyWithWhereWithoutAttendeeInput[];
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[];
  };

  export type PaymentUncheckedUpdateManyWithoutAttendeeNestedInput = {
    create?:
      | XOR<
          PaymentCreateWithoutAttendeeInput,
          PaymentUncheckedCreateWithoutAttendeeInput
        >
      | PaymentCreateWithoutAttendeeInput[]
      | PaymentUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | PaymentCreateOrConnectWithoutAttendeeInput
      | PaymentCreateOrConnectWithoutAttendeeInput[];
    upsert?:
      | PaymentUpsertWithWhereUniqueWithoutAttendeeInput
      | PaymentUpsertWithWhereUniqueWithoutAttendeeInput[];
    createMany?: PaymentCreateManyAttendeeInputEnvelope;
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[];
    update?:
      | PaymentUpdateWithWhereUniqueWithoutAttendeeInput
      | PaymentUpdateWithWhereUniqueWithoutAttendeeInput[];
    updateMany?:
      | PaymentUpdateManyWithWhereWithoutAttendeeInput
      | PaymentUpdateManyWithWhereWithoutAttendeeInput[];
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[];
  };

  export type TicketUncheckedUpdateManyWithoutAttendeeNestedInput = {
    create?:
      | XOR<
          TicketCreateWithoutAttendeeInput,
          TicketUncheckedCreateWithoutAttendeeInput
        >
      | TicketCreateWithoutAttendeeInput[]
      | TicketUncheckedCreateWithoutAttendeeInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutAttendeeInput
      | TicketCreateOrConnectWithoutAttendeeInput[];
    upsert?:
      | TicketUpsertWithWhereUniqueWithoutAttendeeInput
      | TicketUpsertWithWhereUniqueWithoutAttendeeInput[];
    createMany?: TicketCreateManyAttendeeInputEnvelope;
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    update?:
      | TicketUpdateWithWhereUniqueWithoutAttendeeInput
      | TicketUpdateWithWhereUniqueWithoutAttendeeInput[];
    updateMany?:
      | TicketUpdateManyWithWhereWithoutAttendeeInput
      | TicketUpdateManyWithWhereWithoutAttendeeInput[];
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[];
  };

  export type AttendeeCreateNestedOneWithoutTicketsInput = {
    create?: XOR<
      AttendeeCreateWithoutTicketsInput,
      AttendeeUncheckedCreateWithoutTicketsInput
    >;
    connectOrCreate?: AttendeeCreateOrConnectWithoutTicketsInput;
    connect?: AttendeeWhereUniqueInput;
  };

  export type PaymentCreateNestedOneWithoutTicketsInput = {
    create?: XOR<
      PaymentCreateWithoutTicketsInput,
      PaymentUncheckedCreateWithoutTicketsInput
    >;
    connectOrCreate?: PaymentCreateOrConnectWithoutTicketsInput;
    connect?: PaymentWhereUniqueInput;
  };

  export type EnumTicketStatusFieldUpdateOperationsInput = {
    set?: $Enums.TicketStatus;
  };

  export type AttendeeUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<
      AttendeeCreateWithoutTicketsInput,
      AttendeeUncheckedCreateWithoutTicketsInput
    >;
    connectOrCreate?: AttendeeCreateOrConnectWithoutTicketsInput;
    upsert?: AttendeeUpsertWithoutTicketsInput;
    connect?: AttendeeWhereUniqueInput;
    update?: XOR<
      XOR<
        AttendeeUpdateToOneWithWhereWithoutTicketsInput,
        AttendeeUpdateWithoutTicketsInput
      >,
      AttendeeUncheckedUpdateWithoutTicketsInput
    >;
  };

  export type PaymentUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<
      PaymentCreateWithoutTicketsInput,
      PaymentUncheckedCreateWithoutTicketsInput
    >;
    connectOrCreate?: PaymentCreateOrConnectWithoutTicketsInput;
    upsert?: PaymentUpsertWithoutTicketsInput;
    connect?: PaymentWhereUniqueInput;
    update?: XOR<
      XOR<
        PaymentUpdateToOneWithWhereWithoutTicketsInput,
        PaymentUpdateWithoutTicketsInput
      >,
      PaymentUncheckedUpdateWithoutTicketsInput
    >;
  };

  export type AttendeeCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<
      AttendeeCreateWithoutPaymentsInput,
      AttendeeUncheckedCreateWithoutPaymentsInput
    >;
    connectOrCreate?: AttendeeCreateOrConnectWithoutPaymentsInput;
    connect?: AttendeeWhereUniqueInput;
  };

  export type TicketCreateNestedManyWithoutPaymentInput = {
    create?:
      | XOR<
          TicketCreateWithoutPaymentInput,
          TicketUncheckedCreateWithoutPaymentInput
        >
      | TicketCreateWithoutPaymentInput[]
      | TicketUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutPaymentInput
      | TicketCreateOrConnectWithoutPaymentInput[];
    createMany?: TicketCreateManyPaymentInputEnvelope;
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
  };

  export type TicketUncheckedCreateNestedManyWithoutPaymentInput = {
    create?:
      | XOR<
          TicketCreateWithoutPaymentInput,
          TicketUncheckedCreateWithoutPaymentInput
        >
      | TicketCreateWithoutPaymentInput[]
      | TicketUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutPaymentInput
      | TicketCreateOrConnectWithoutPaymentInput[];
    createMany?: TicketCreateManyPaymentInputEnvelope;
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
  };

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string;
    increment?: Decimal | DecimalJsLike | number | string;
    decrement?: Decimal | DecimalJsLike | number | string;
    multiply?: Decimal | DecimalJsLike | number | string;
    divide?: Decimal | DecimalJsLike | number | string;
  };

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus;
  };

  export type AttendeeUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: XOR<
      AttendeeCreateWithoutPaymentsInput,
      AttendeeUncheckedCreateWithoutPaymentsInput
    >;
    connectOrCreate?: AttendeeCreateOrConnectWithoutPaymentsInput;
    upsert?: AttendeeUpsertWithoutPaymentsInput;
    connect?: AttendeeWhereUniqueInput;
    update?: XOR<
      XOR<
        AttendeeUpdateToOneWithWhereWithoutPaymentsInput,
        AttendeeUpdateWithoutPaymentsInput
      >,
      AttendeeUncheckedUpdateWithoutPaymentsInput
    >;
  };

  export type TicketUpdateManyWithoutPaymentNestedInput = {
    create?:
      | XOR<
          TicketCreateWithoutPaymentInput,
          TicketUncheckedCreateWithoutPaymentInput
        >
      | TicketCreateWithoutPaymentInput[]
      | TicketUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutPaymentInput
      | TicketCreateOrConnectWithoutPaymentInput[];
    upsert?:
      | TicketUpsertWithWhereUniqueWithoutPaymentInput
      | TicketUpsertWithWhereUniqueWithoutPaymentInput[];
    createMany?: TicketCreateManyPaymentInputEnvelope;
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    update?:
      | TicketUpdateWithWhereUniqueWithoutPaymentInput
      | TicketUpdateWithWhereUniqueWithoutPaymentInput[];
    updateMany?:
      | TicketUpdateManyWithWhereWithoutPaymentInput
      | TicketUpdateManyWithWhereWithoutPaymentInput[];
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[];
  };

  export type TicketUncheckedUpdateManyWithoutPaymentNestedInput = {
    create?:
      | XOR<
          TicketCreateWithoutPaymentInput,
          TicketUncheckedCreateWithoutPaymentInput
        >
      | TicketCreateWithoutPaymentInput[]
      | TicketUncheckedCreateWithoutPaymentInput[];
    connectOrCreate?:
      | TicketCreateOrConnectWithoutPaymentInput
      | TicketCreateOrConnectWithoutPaymentInput[];
    upsert?:
      | TicketUpsertWithWhereUniqueWithoutPaymentInput
      | TicketUpsertWithWhereUniqueWithoutPaymentInput[];
    createMany?: TicketCreateManyPaymentInputEnvelope;
    set?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    disconnect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    delete?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    connect?: TicketWhereUniqueInput | TicketWhereUniqueInput[];
    update?:
      | TicketUpdateWithWhereUniqueWithoutPaymentInput
      | TicketUpdateWithWhereUniqueWithoutPaymentInput[];
    updateMany?:
      | TicketUpdateManyWithWhereWithoutPaymentInput
      | TicketUpdateManyWithWhereWithoutPaymentInput[];
    deleteMany?: TicketScalarWhereInput | TicketScalarWhereInput[];
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

  export type NestedEnumTicketStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TicketStatus | EnumTicketStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.TicketStatus[]
      | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.TicketStatus[]
      | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumTicketStatusFilter<$PrismaModel> | $Enums.TicketStatus;
  };

  export type NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?:
        | $Enums.TicketStatus
        | EnumTicketStatusFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.TicketStatus[]
        | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.TicketStatus[]
        | ListEnumTicketStatusFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumTicketStatusWithAggregatesFilter<$PrismaModel>
        | $Enums.TicketStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumTicketStatusFilter<$PrismaModel>;
      _max?: NestedEnumTicketStatusFilter<$PrismaModel>;
    };

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
  };

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
  };

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalWithAggregatesFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type NestedEnumPaymentStatusWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>;
  };
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<
            keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>,
            'path'
          >
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<
        Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
      >;

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
    path?: string[];
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null;
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
    not?:
      | InputJsonValue
      | JsonFieldRefInput<$PrismaModel>
      | JsonNullValueFilter;
  };

  export type AdminCreateWithoutRoleInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviter?: AdminCreateNestedOneWithoutInvitedAdminsInput;
    invitedAdmins?: AdminCreateNestedManyWithoutInviterInput;
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutAdminInput;
  };

  export type AdminUncheckedCreateWithoutRoleInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    invitedAdmins?: AdminUncheckedCreateNestedManyWithoutInviterInput;
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutAdminInput;
  };

  export type AdminCreateOrConnectWithoutRoleInput = {
    where: AdminWhereUniqueInput;
    create: XOR<
      AdminCreateWithoutRoleInput,
      AdminUncheckedCreateWithoutRoleInput
    >;
  };

  export type AdminCreateManyRoleInputEnvelope = {
    data: AdminCreateManyRoleInput | AdminCreateManyRoleInput[];
    skipDuplicates?: boolean;
  };

  export type AttendeeCreateWithoutRoleInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: PaymentCreateNestedManyWithoutAttendeeInput;
    tickets?: TicketCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeUncheckedCreateWithoutRoleInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: PaymentUncheckedCreateNestedManyWithoutAttendeeInput;
    tickets?: TicketUncheckedCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeCreateOrConnectWithoutRoleInput = {
    where: AttendeeWhereUniqueInput;
    create: XOR<
      AttendeeCreateWithoutRoleInput,
      AttendeeUncheckedCreateWithoutRoleInput
    >;
  };

  export type AttendeeCreateManyRoleInputEnvelope = {
    data: AttendeeCreateManyRoleInput | AttendeeCreateManyRoleInput[];
    skipDuplicates?: boolean;
  };

  export type AdminUpsertWithWhereUniqueWithoutRoleInput = {
    where: AdminWhereUniqueInput;
    update: XOR<
      AdminUpdateWithoutRoleInput,
      AdminUncheckedUpdateWithoutRoleInput
    >;
    create: XOR<
      AdminCreateWithoutRoleInput,
      AdminUncheckedCreateWithoutRoleInput
    >;
  };

  export type AdminUpdateWithWhereUniqueWithoutRoleInput = {
    where: AdminWhereUniqueInput;
    data: XOR<
      AdminUpdateWithoutRoleInput,
      AdminUncheckedUpdateWithoutRoleInput
    >;
  };

  export type AdminUpdateManyWithWhereWithoutRoleInput = {
    where: AdminScalarWhereInput;
    data: XOR<
      AdminUpdateManyMutationInput,
      AdminUncheckedUpdateManyWithoutRoleInput
    >;
  };

  export type AdminScalarWhereInput = {
    AND?: AdminScalarWhereInput | AdminScalarWhereInput[];
    OR?: AdminScalarWhereInput[];
    NOT?: AdminScalarWhereInput | AdminScalarWhereInput[];
    id?: StringFilter<'Admin'> | string;
    fullName?: StringFilter<'Admin'> | string;
    email?: StringFilter<'Admin'> | string;
    password?: StringFilter<'Admin'> | string;
    roleId?: StringFilter<'Admin'> | string;
    isActive?: BoolFilter<'Admin'> | boolean;
    invitedById?: StringNullableFilter<'Admin'> | string | null;
    createdAt?: DateTimeFilter<'Admin'> | Date | string;
    updatedAt?: DateTimeFilter<'Admin'> | Date | string;
  };

  export type AttendeeUpsertWithWhereUniqueWithoutRoleInput = {
    where: AttendeeWhereUniqueInput;
    update: XOR<
      AttendeeUpdateWithoutRoleInput,
      AttendeeUncheckedUpdateWithoutRoleInput
    >;
    create: XOR<
      AttendeeCreateWithoutRoleInput,
      AttendeeUncheckedCreateWithoutRoleInput
    >;
  };

  export type AttendeeUpdateWithWhereUniqueWithoutRoleInput = {
    where: AttendeeWhereUniqueInput;
    data: XOR<
      AttendeeUpdateWithoutRoleInput,
      AttendeeUncheckedUpdateWithoutRoleInput
    >;
  };

  export type AttendeeUpdateManyWithWhereWithoutRoleInput = {
    where: AttendeeScalarWhereInput;
    data: XOR<
      AttendeeUpdateManyMutationInput,
      AttendeeUncheckedUpdateManyWithoutRoleInput
    >;
  };

  export type AttendeeScalarWhereInput = {
    AND?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[];
    OR?: AttendeeScalarWhereInput[];
    NOT?: AttendeeScalarWhereInput | AttendeeScalarWhereInput[];
    id?: StringFilter<'Attendee'> | string;
    email?: StringFilter<'Attendee'> | string;
    fullName?: StringFilter<'Attendee'> | string;
    phoneNumber?: StringNullableFilter<'Attendee'> | string | null;
    company?: StringNullableFilter<'Attendee'> | string | null;
    jobTitle?: StringNullableFilter<'Attendee'> | string | null;
    roleId?: StringNullableFilter<'Attendee'> | string | null;
    isActive?: BoolFilter<'Attendee'> | boolean;
    createdAt?: DateTimeFilter<'Attendee'> | Date | string;
    updatedAt?: DateTimeFilter<'Attendee'> | Date | string;
  };

  export type RoleCreateWithoutAdminsInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendees?: AttendeeCreateNestedManyWithoutRoleInput;
  };

  export type RoleUncheckedCreateWithoutAdminsInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendees?: AttendeeUncheckedCreateNestedManyWithoutRoleInput;
  };

  export type RoleCreateOrConnectWithoutAdminsInput = {
    where: RoleWhereUniqueInput;
    create: XOR<
      RoleCreateWithoutAdminsInput,
      RoleUncheckedCreateWithoutAdminsInput
    >;
  };

  export type AdminCreateWithoutInvitedAdminsInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: RoleCreateNestedOneWithoutAdminsInput;
    inviter?: AdminCreateNestedOneWithoutInvitedAdminsInput;
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutAdminInput;
  };

  export type AdminUncheckedCreateWithoutInvitedAdminsInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutAdminInput;
  };

  export type AdminCreateOrConnectWithoutInvitedAdminsInput = {
    where: AdminWhereUniqueInput;
    create: XOR<
      AdminCreateWithoutInvitedAdminsInput,
      AdminUncheckedCreateWithoutInvitedAdminsInput
    >;
  };

  export type AdminCreateWithoutInviterInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: RoleCreateNestedOneWithoutAdminsInput;
    invitedAdmins?: AdminCreateNestedManyWithoutInviterInput;
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutAdminInput;
  };

  export type AdminUncheckedCreateWithoutInviterInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    invitedAdmins?: AdminUncheckedCreateNestedManyWithoutInviterInput;
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutAdminInput;
  };

  export type AdminCreateOrConnectWithoutInviterInput = {
    where: AdminWhereUniqueInput;
    create: XOR<
      AdminCreateWithoutInviterInput,
      AdminUncheckedCreateWithoutInviterInput
    >;
  };

  export type AdminCreateManyInviterInputEnvelope = {
    data: AdminCreateManyInviterInput | AdminCreateManyInviterInput[];
    skipDuplicates?: boolean;
  };

  export type PasswordResetTokenCreateWithoutAdminInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type PasswordResetTokenUncheckedCreateWithoutAdminInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type PasswordResetTokenCreateOrConnectWithoutAdminInput = {
    where: PasswordResetTokenWhereUniqueInput;
    create: XOR<
      PasswordResetTokenCreateWithoutAdminInput,
      PasswordResetTokenUncheckedCreateWithoutAdminInput
    >;
  };

  export type PasswordResetTokenCreateManyAdminInputEnvelope = {
    data:
      | PasswordResetTokenCreateManyAdminInput
      | PasswordResetTokenCreateManyAdminInput[];
    skipDuplicates?: boolean;
  };

  export type RoleUpsertWithoutAdminsInput = {
    update: XOR<
      RoleUpdateWithoutAdminsInput,
      RoleUncheckedUpdateWithoutAdminsInput
    >;
    create: XOR<
      RoleCreateWithoutAdminsInput,
      RoleUncheckedCreateWithoutAdminsInput
    >;
    where?: RoleWhereInput;
  };

  export type RoleUpdateToOneWithWhereWithoutAdminsInput = {
    where?: RoleWhereInput;
    data: XOR<
      RoleUpdateWithoutAdminsInput,
      RoleUncheckedUpdateWithoutAdminsInput
    >;
  };

  export type RoleUpdateWithoutAdminsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendees?: AttendeeUpdateManyWithoutRoleNestedInput;
  };

  export type RoleUncheckedUpdateWithoutAdminsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendees?: AttendeeUncheckedUpdateManyWithoutRoleNestedInput;
  };

  export type AdminUpsertWithoutInvitedAdminsInput = {
    update: XOR<
      AdminUpdateWithoutInvitedAdminsInput,
      AdminUncheckedUpdateWithoutInvitedAdminsInput
    >;
    create: XOR<
      AdminCreateWithoutInvitedAdminsInput,
      AdminUncheckedCreateWithoutInvitedAdminsInput
    >;
    where?: AdminWhereInput;
  };

  export type AdminUpdateToOneWithWhereWithoutInvitedAdminsInput = {
    where?: AdminWhereInput;
    data: XOR<
      AdminUpdateWithoutInvitedAdminsInput,
      AdminUncheckedUpdateWithoutInvitedAdminsInput
    >;
  };

  export type AdminUpdateWithoutInvitedAdminsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneRequiredWithoutAdminsNestedInput;
    inviter?: AdminUpdateOneWithoutInvitedAdminsNestedInput;
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUncheckedUpdateWithoutInvitedAdminsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    roleId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUpsertWithWhereUniqueWithoutInviterInput = {
    where: AdminWhereUniqueInput;
    update: XOR<
      AdminUpdateWithoutInviterInput,
      AdminUncheckedUpdateWithoutInviterInput
    >;
    create: XOR<
      AdminCreateWithoutInviterInput,
      AdminUncheckedCreateWithoutInviterInput
    >;
  };

  export type AdminUpdateWithWhereUniqueWithoutInviterInput = {
    where: AdminWhereUniqueInput;
    data: XOR<
      AdminUpdateWithoutInviterInput,
      AdminUncheckedUpdateWithoutInviterInput
    >;
  };

  export type AdminUpdateManyWithWhereWithoutInviterInput = {
    where: AdminScalarWhereInput;
    data: XOR<
      AdminUpdateManyMutationInput,
      AdminUncheckedUpdateManyWithoutInviterInput
    >;
  };

  export type PasswordResetTokenUpsertWithWhereUniqueWithoutAdminInput = {
    where: PasswordResetTokenWhereUniqueInput;
    update: XOR<
      PasswordResetTokenUpdateWithoutAdminInput,
      PasswordResetTokenUncheckedUpdateWithoutAdminInput
    >;
    create: XOR<
      PasswordResetTokenCreateWithoutAdminInput,
      PasswordResetTokenUncheckedCreateWithoutAdminInput
    >;
  };

  export type PasswordResetTokenUpdateWithWhereUniqueWithoutAdminInput = {
    where: PasswordResetTokenWhereUniqueInput;
    data: XOR<
      PasswordResetTokenUpdateWithoutAdminInput,
      PasswordResetTokenUncheckedUpdateWithoutAdminInput
    >;
  };

  export type PasswordResetTokenUpdateManyWithWhereWithoutAdminInput = {
    where: PasswordResetTokenScalarWhereInput;
    data: XOR<
      PasswordResetTokenUpdateManyMutationInput,
      PasswordResetTokenUncheckedUpdateManyWithoutAdminInput
    >;
  };

  export type PasswordResetTokenScalarWhereInput = {
    AND?:
      | PasswordResetTokenScalarWhereInput
      | PasswordResetTokenScalarWhereInput[];
    OR?: PasswordResetTokenScalarWhereInput[];
    NOT?:
      | PasswordResetTokenScalarWhereInput
      | PasswordResetTokenScalarWhereInput[];
    id?: StringFilter<'PasswordResetToken'> | string;
    adminId?: StringFilter<'PasswordResetToken'> | string;
    token?: StringFilter<'PasswordResetToken'> | string;
    expiresAt?: DateTimeFilter<'PasswordResetToken'> | Date | string;
    usedAt?:
      | DateTimeNullableFilter<'PasswordResetToken'>
      | Date
      | string
      | null;
    createdAt?: DateTimeFilter<'PasswordResetToken'> | Date | string;
  };

  export type AdminCreateWithoutPasswordResetTokensInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role: RoleCreateNestedOneWithoutAdminsInput;
    inviter?: AdminCreateNestedOneWithoutInvitedAdminsInput;
    invitedAdmins?: AdminCreateNestedManyWithoutInviterInput;
  };

  export type AdminUncheckedCreateWithoutPasswordResetTokensInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    invitedAdmins?: AdminUncheckedCreateNestedManyWithoutInviterInput;
  };

  export type AdminCreateOrConnectWithoutPasswordResetTokensInput = {
    where: AdminWhereUniqueInput;
    create: XOR<
      AdminCreateWithoutPasswordResetTokensInput,
      AdminUncheckedCreateWithoutPasswordResetTokensInput
    >;
  };

  export type AdminUpsertWithoutPasswordResetTokensInput = {
    update: XOR<
      AdminUpdateWithoutPasswordResetTokensInput,
      AdminUncheckedUpdateWithoutPasswordResetTokensInput
    >;
    create: XOR<
      AdminCreateWithoutPasswordResetTokensInput,
      AdminUncheckedCreateWithoutPasswordResetTokensInput
    >;
    where?: AdminWhereInput;
  };

  export type AdminUpdateToOneWithWhereWithoutPasswordResetTokensInput = {
    where?: AdminWhereInput;
    data: XOR<
      AdminUpdateWithoutPasswordResetTokensInput,
      AdminUncheckedUpdateWithoutPasswordResetTokensInput
    >;
  };

  export type AdminUpdateWithoutPasswordResetTokensInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneRequiredWithoutAdminsNestedInput;
    inviter?: AdminUpdateOneWithoutInvitedAdminsNestedInput;
    invitedAdmins?: AdminUpdateManyWithoutInviterNestedInput;
  };

  export type AdminUncheckedUpdateWithoutPasswordResetTokensInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    roleId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    invitedAdmins?: AdminUncheckedUpdateManyWithoutInviterNestedInput;
  };

  export type RoleCreateWithoutAttendeesInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    admins?: AdminCreateNestedManyWithoutRoleInput;
  };

  export type RoleUncheckedCreateWithoutAttendeesInput = {
    id?: string;
    name: string;
    description: string;
    permissions?: RoleCreatepermissionsInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    admins?: AdminUncheckedCreateNestedManyWithoutRoleInput;
  };

  export type RoleCreateOrConnectWithoutAttendeesInput = {
    where: RoleWhereUniqueInput;
    create: XOR<
      RoleCreateWithoutAttendeesInput,
      RoleUncheckedCreateWithoutAttendeesInput
    >;
  };

  export type PaymentCreateWithoutAttendeeInput = {
    id?: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: TicketCreateNestedManyWithoutPaymentInput;
  };

  export type PaymentUncheckedCreateWithoutAttendeeInput = {
    id?: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: TicketUncheckedCreateNestedManyWithoutPaymentInput;
  };

  export type PaymentCreateOrConnectWithoutAttendeeInput = {
    where: PaymentWhereUniqueInput;
    create: XOR<
      PaymentCreateWithoutAttendeeInput,
      PaymentUncheckedCreateWithoutAttendeeInput
    >;
  };

  export type PaymentCreateManyAttendeeInputEnvelope = {
    data: PaymentCreateManyAttendeeInput | PaymentCreateManyAttendeeInput[];
    skipDuplicates?: boolean;
  };

  export type TicketCreateWithoutAttendeeInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payment: PaymentCreateNestedOneWithoutTicketsInput;
  };

  export type TicketUncheckedCreateWithoutAttendeeInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentId: string;
  };

  export type TicketCreateOrConnectWithoutAttendeeInput = {
    where: TicketWhereUniqueInput;
    create: XOR<
      TicketCreateWithoutAttendeeInput,
      TicketUncheckedCreateWithoutAttendeeInput
    >;
  };

  export type TicketCreateManyAttendeeInputEnvelope = {
    data: TicketCreateManyAttendeeInput | TicketCreateManyAttendeeInput[];
    skipDuplicates?: boolean;
  };

  export type RoleUpsertWithoutAttendeesInput = {
    update: XOR<
      RoleUpdateWithoutAttendeesInput,
      RoleUncheckedUpdateWithoutAttendeesInput
    >;
    create: XOR<
      RoleCreateWithoutAttendeesInput,
      RoleUncheckedCreateWithoutAttendeesInput
    >;
    where?: RoleWhereInput;
  };

  export type RoleUpdateToOneWithWhereWithoutAttendeesInput = {
    where?: RoleWhereInput;
    data: XOR<
      RoleUpdateWithoutAttendeesInput,
      RoleUncheckedUpdateWithoutAttendeesInput
    >;
  };

  export type RoleUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    admins?: AdminUpdateManyWithoutRoleNestedInput;
  };

  export type RoleUncheckedUpdateWithoutAttendeesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    description?: StringFieldUpdateOperationsInput | string;
    permissions?: RoleUpdatepermissionsInput | string[];
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    admins?: AdminUncheckedUpdateManyWithoutRoleNestedInput;
  };

  export type PaymentUpsertWithWhereUniqueWithoutAttendeeInput = {
    where: PaymentWhereUniqueInput;
    update: XOR<
      PaymentUpdateWithoutAttendeeInput,
      PaymentUncheckedUpdateWithoutAttendeeInput
    >;
    create: XOR<
      PaymentCreateWithoutAttendeeInput,
      PaymentUncheckedCreateWithoutAttendeeInput
    >;
  };

  export type PaymentUpdateWithWhereUniqueWithoutAttendeeInput = {
    where: PaymentWhereUniqueInput;
    data: XOR<
      PaymentUpdateWithoutAttendeeInput,
      PaymentUncheckedUpdateWithoutAttendeeInput
    >;
  };

  export type PaymentUpdateManyWithWhereWithoutAttendeeInput = {
    where: PaymentScalarWhereInput;
    data: XOR<
      PaymentUpdateManyMutationInput,
      PaymentUncheckedUpdateManyWithoutAttendeeInput
    >;
  };

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[];
    OR?: PaymentScalarWhereInput[];
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[];
    id?: StringFilter<'Payment'> | string;
    attendeeId?: StringFilter<'Payment'> | string;
    amount?:
      | DecimalFilter<'Payment'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFilter<'Payment'> | string;
    paystackReference?: StringNullableFilter<'Payment'> | string | null;
    paymentReference?: StringFilter<'Payment'> | string;
    status?: EnumPaymentStatusFilter<'Payment'> | $Enums.PaymentStatus;
    paymentMethod?: StringNullableFilter<'Payment'> | string | null;
    paidAt?: DateTimeNullableFilter<'Payment'> | Date | string | null;
    failureReason?: StringNullableFilter<'Payment'> | string | null;
    metadata?: JsonNullableFilter<'Payment'>;
    createdAt?: DateTimeFilter<'Payment'> | Date | string;
    updatedAt?: DateTimeFilter<'Payment'> | Date | string;
  };

  export type TicketUpsertWithWhereUniqueWithoutAttendeeInput = {
    where: TicketWhereUniqueInput;
    update: XOR<
      TicketUpdateWithoutAttendeeInput,
      TicketUncheckedUpdateWithoutAttendeeInput
    >;
    create: XOR<
      TicketCreateWithoutAttendeeInput,
      TicketUncheckedCreateWithoutAttendeeInput
    >;
  };

  export type TicketUpdateWithWhereUniqueWithoutAttendeeInput = {
    where: TicketWhereUniqueInput;
    data: XOR<
      TicketUpdateWithoutAttendeeInput,
      TicketUncheckedUpdateWithoutAttendeeInput
    >;
  };

  export type TicketUpdateManyWithWhereWithoutAttendeeInput = {
    where: TicketScalarWhereInput;
    data: XOR<
      TicketUpdateManyMutationInput,
      TicketUncheckedUpdateManyWithoutAttendeeInput
    >;
  };

  export type TicketScalarWhereInput = {
    AND?: TicketScalarWhereInput | TicketScalarWhereInput[];
    OR?: TicketScalarWhereInput[];
    NOT?: TicketScalarWhereInput | TicketScalarWhereInput[];
    id?: StringFilter<'Ticket'> | string;
    ticketNumber?: StringFilter<'Ticket'> | string;
    qrCode?: StringFilter<'Ticket'> | string;
    status?: EnumTicketStatusFilter<'Ticket'> | $Enums.TicketStatus;
    issuedAt?: DateTimeFilter<'Ticket'> | Date | string;
    validFrom?: DateTimeFilter<'Ticket'> | Date | string;
    validUntil?: DateTimeFilter<'Ticket'> | Date | string;
    ticketType?: StringFilter<'Ticket'> | string;
    isCheckedIn?: BoolFilter<'Ticket'> | boolean;
    createdAt?: DateTimeFilter<'Ticket'> | Date | string;
    updatedAt?: DateTimeFilter<'Ticket'> | Date | string;
    attendeeId?: StringFilter<'Ticket'> | string;
    paymentId?: StringFilter<'Ticket'> | string;
  };

  export type AttendeeCreateWithoutTicketsInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role?: RoleCreateNestedOneWithoutAttendeesInput;
    payments?: PaymentCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeUncheckedCreateWithoutTicketsInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    roleId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    payments?: PaymentUncheckedCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeCreateOrConnectWithoutTicketsInput = {
    where: AttendeeWhereUniqueInput;
    create: XOR<
      AttendeeCreateWithoutTicketsInput,
      AttendeeUncheckedCreateWithoutTicketsInput
    >;
  };

  export type PaymentCreateWithoutTicketsInput = {
    id?: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendee: AttendeeCreateNestedOneWithoutPaymentsInput;
  };

  export type PaymentUncheckedCreateWithoutTicketsInput = {
    id?: string;
    attendeeId: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type PaymentCreateOrConnectWithoutTicketsInput = {
    where: PaymentWhereUniqueInput;
    create: XOR<
      PaymentCreateWithoutTicketsInput,
      PaymentUncheckedCreateWithoutTicketsInput
    >;
  };

  export type AttendeeUpsertWithoutTicketsInput = {
    update: XOR<
      AttendeeUpdateWithoutTicketsInput,
      AttendeeUncheckedUpdateWithoutTicketsInput
    >;
    create: XOR<
      AttendeeCreateWithoutTicketsInput,
      AttendeeUncheckedCreateWithoutTicketsInput
    >;
    where?: AttendeeWhereInput;
  };

  export type AttendeeUpdateToOneWithWhereWithoutTicketsInput = {
    where?: AttendeeWhereInput;
    data: XOR<
      AttendeeUpdateWithoutTicketsInput,
      AttendeeUncheckedUpdateWithoutTicketsInput
    >;
  };

  export type AttendeeUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneWithoutAttendeesNestedInput;
    payments?: PaymentUpdateManyWithoutAttendeeNestedInput;
  };

  export type AttendeeUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    roleId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: PaymentUncheckedUpdateManyWithoutAttendeeNestedInput;
  };

  export type PaymentUpsertWithoutTicketsInput = {
    update: XOR<
      PaymentUpdateWithoutTicketsInput,
      PaymentUncheckedUpdateWithoutTicketsInput
    >;
    create: XOR<
      PaymentCreateWithoutTicketsInput,
      PaymentUncheckedCreateWithoutTicketsInput
    >;
    where?: PaymentWhereInput;
  };

  export type PaymentUpdateToOneWithWhereWithoutTicketsInput = {
    where?: PaymentWhereInput;
    data: XOR<
      PaymentUpdateWithoutTicketsInput,
      PaymentUncheckedUpdateWithoutTicketsInput
    >;
  };

  export type PaymentUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendee?: AttendeeUpdateOneRequiredWithoutPaymentsNestedInput;
  };

  export type PaymentUncheckedUpdateWithoutTicketsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AttendeeCreateWithoutPaymentsInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    role?: RoleCreateNestedOneWithoutAttendeesInput;
    tickets?: TicketCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    roleId?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    tickets?: TicketUncheckedCreateNestedManyWithoutAttendeeInput;
  };

  export type AttendeeCreateOrConnectWithoutPaymentsInput = {
    where: AttendeeWhereUniqueInput;
    create: XOR<
      AttendeeCreateWithoutPaymentsInput,
      AttendeeUncheckedCreateWithoutPaymentsInput
    >;
  };

  export type TicketCreateWithoutPaymentInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendee: AttendeeCreateNestedOneWithoutTicketsInput;
  };

  export type TicketUncheckedCreateWithoutPaymentInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendeeId: string;
  };

  export type TicketCreateOrConnectWithoutPaymentInput = {
    where: TicketWhereUniqueInput;
    create: XOR<
      TicketCreateWithoutPaymentInput,
      TicketUncheckedCreateWithoutPaymentInput
    >;
  };

  export type TicketCreateManyPaymentInputEnvelope = {
    data: TicketCreateManyPaymentInput | TicketCreateManyPaymentInput[];
    skipDuplicates?: boolean;
  };

  export type AttendeeUpsertWithoutPaymentsInput = {
    update: XOR<
      AttendeeUpdateWithoutPaymentsInput,
      AttendeeUncheckedUpdateWithoutPaymentsInput
    >;
    create: XOR<
      AttendeeCreateWithoutPaymentsInput,
      AttendeeUncheckedCreateWithoutPaymentsInput
    >;
    where?: AttendeeWhereInput;
  };

  export type AttendeeUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: AttendeeWhereInput;
    data: XOR<
      AttendeeUpdateWithoutPaymentsInput,
      AttendeeUncheckedUpdateWithoutPaymentsInput
    >;
  };

  export type AttendeeUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneWithoutAttendeesNestedInput;
    tickets?: TicketUpdateManyWithoutAttendeeNestedInput;
  };

  export type AttendeeUncheckedUpdateWithoutPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    roleId?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: TicketUncheckedUpdateManyWithoutAttendeeNestedInput;
  };

  export type TicketUpsertWithWhereUniqueWithoutPaymentInput = {
    where: TicketWhereUniqueInput;
    update: XOR<
      TicketUpdateWithoutPaymentInput,
      TicketUncheckedUpdateWithoutPaymentInput
    >;
    create: XOR<
      TicketCreateWithoutPaymentInput,
      TicketUncheckedCreateWithoutPaymentInput
    >;
  };

  export type TicketUpdateWithWhereUniqueWithoutPaymentInput = {
    where: TicketWhereUniqueInput;
    data: XOR<
      TicketUpdateWithoutPaymentInput,
      TicketUncheckedUpdateWithoutPaymentInput
    >;
  };

  export type TicketUpdateManyWithWhereWithoutPaymentInput = {
    where: TicketScalarWhereInput;
    data: XOR<
      TicketUpdateManyMutationInput,
      TicketUncheckedUpdateManyWithoutPaymentInput
    >;
  };

  export type AdminCreateManyRoleInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    isActive?: boolean;
    invitedById?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AttendeeCreateManyRoleInput = {
    id?: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    company?: string | null;
    jobTitle?: string | null;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type AdminUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    inviter?: AdminUpdateOneWithoutInvitedAdminsNestedInput;
    invitedAdmins?: AdminUpdateManyWithoutInviterNestedInput;
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    invitedAdmins?: AdminUncheckedUpdateManyWithoutInviterNestedInput;
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AttendeeUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: PaymentUpdateManyWithoutAttendeeNestedInput;
    tickets?: TicketUpdateManyWithoutAttendeeNestedInput;
  };

  export type AttendeeUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    payments?: PaymentUncheckedUpdateManyWithoutAttendeeNestedInput;
    tickets?: TicketUncheckedUpdateManyWithoutAttendeeNestedInput;
  };

  export type AttendeeUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    company?: NullableStringFieldUpdateOperationsInput | string | null;
    jobTitle?: NullableStringFieldUpdateOperationsInput | string | null;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AdminCreateManyInviterInput = {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    roleId: string;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type PasswordResetTokenCreateManyAdminInput = {
    id?: string;
    token: string;
    expiresAt: Date | string;
    usedAt?: Date | string | null;
    createdAt?: Date | string;
  };

  export type AdminUpdateWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    role?: RoleUpdateOneRequiredWithoutAdminsNestedInput;
    invitedAdmins?: AdminUpdateManyWithoutInviterNestedInput;
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUncheckedUpdateWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    roleId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    invitedAdmins?: AdminUncheckedUpdateManyWithoutInviterNestedInput;
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutAdminNestedInput;
  };

  export type AdminUncheckedUpdateManyWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string;
    fullName?: StringFieldUpdateOperationsInput | string;
    email?: StringFieldUpdateOperationsInput | string;
    password?: StringFieldUpdateOperationsInput | string;
    roleId?: StringFieldUpdateOperationsInput | string;
    isActive?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PasswordResetTokenUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PasswordResetTokenUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PasswordResetTokenUncheckedUpdateManyWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string;
    token?: StringFieldUpdateOperationsInput | string;
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type PaymentCreateManyAttendeeInput = {
    id?: string;
    amount: Decimal | DecimalJsLike | number | string;
    currency?: string;
    paystackReference?: string | null;
    paymentReference: string;
    status?: $Enums.PaymentStatus;
    paymentMethod?: string | null;
    paidAt?: Date | string | null;
    failureReason?: string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TicketCreateManyAttendeeInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    paymentId: string;
  };

  export type PaymentUpdateWithoutAttendeeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: TicketUpdateManyWithoutPaymentNestedInput;
  };

  export type PaymentUncheckedUpdateWithoutAttendeeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    tickets?: TicketUncheckedUpdateManyWithoutPaymentNestedInput;
  };

  export type PaymentUncheckedUpdateManyWithoutAttendeeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    amount?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    currency?: StringFieldUpdateOperationsInput | string;
    paystackReference?:
      | NullableStringFieldUpdateOperationsInput
      | string
      | null;
    paymentReference?: StringFieldUpdateOperationsInput | string;
    status?: EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    paymentMethod?: NullableStringFieldUpdateOperationsInput | string | null;
    paidAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null;
    metadata?: NullableJsonNullValueInput | InputJsonValue;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TicketUpdateWithoutAttendeeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    payment?: PaymentUpdateOneRequiredWithoutTicketsNestedInput;
  };

  export type TicketUncheckedUpdateWithoutAttendeeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paymentId?: StringFieldUpdateOperationsInput | string;
  };

  export type TicketUncheckedUpdateManyWithoutAttendeeInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    paymentId?: StringFieldUpdateOperationsInput | string;
  };

  export type TicketCreateManyPaymentInput = {
    id?: string;
    ticketNumber: string;
    qrCode: string;
    status?: $Enums.TicketStatus;
    issuedAt?: Date | string;
    validFrom: Date | string;
    validUntil: Date | string;
    ticketType: string;
    isCheckedIn?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    attendeeId: string;
  };

  export type TicketUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendee?: AttendeeUpdateOneRequiredWithoutTicketsNestedInput;
  };

  export type TicketUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
  };

  export type TicketUncheckedUpdateManyWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    ticketNumber?: StringFieldUpdateOperationsInput | string;
    qrCode?: StringFieldUpdateOperationsInput | string;
    status?: EnumTicketStatusFieldUpdateOperationsInput | $Enums.TicketStatus;
    issuedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    validFrom?: DateTimeFieldUpdateOperationsInput | Date | string;
    validUntil?: DateTimeFieldUpdateOperationsInput | Date | string;
    ticketType?: StringFieldUpdateOperationsInput | string;
    isCheckedIn?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    attendeeId?: StringFieldUpdateOperationsInput | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
