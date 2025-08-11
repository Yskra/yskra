type MethodShortcut<T extends ((...args: any) => any) = any> = T;

export interface Method<T extends ((...args: any) => any) = any> {
  type: 'method';
  value: T;
}

export interface Signal<T extends ((...args: any) => void) = any> {
  type: 'signal';
  fn: T;
}

export interface Property<T = any> {
  type: 'property';
  value: T;
}

export interface BaseBusServiceMapValue {
  methods: Map<string, Method['value']>;
  signals: Map<string, Set<(...args: Parameters<Signal['fn']>) => void>>;
  properties: Map<string, Property['value']>;
}

export interface BaseBusService {
  [name: string]: MethodShortcut | Method | Signal | Property;
}

type SplitPath<Path extends string>
    = Path extends `${infer Service}:${infer Key}` ? [Service, Key] : never;

type SplitPathGetMethod<Path extends string, Registry>
    = SplitPath<Path> extends [infer Service, infer Key]
      ? Service extends keyof Registry
        ? Key extends keyof Registry[Service]
          ? Registry[Service] extends BaseBusService
            ? Registry[Service][Key]
            : never
          : never
        : false
      : false;

type ValidatePath<Path extends string, Registry, MethodName>
    = SplitPath<Path> extends [infer Service, infer Key]
      ? Service extends keyof Registry
        ? Key extends keyof Registry[Service]
          ? Registry[Service][Key] extends MethodName
            ? Path
            : never
          : never
        : never
      : never;

type GetArgs<Path extends string, Registry, M = SplitPathGetMethod<Path, Registry>>
    = M extends Method
      ? Parameters<M['value']>
      : [];

type GetReturnType<Path extends string, Registry, M = SplitPathGetMethod<Path, Registry>>
    = M extends Method
      ? ReturnType<M['value']>
      : [];

type GetValueField<Path extends string, Registry, M = SplitPathGetMethod<Path, Registry>>
    = M extends Method
      ? M['value']
      : M extends Property
        ? M['value']
        : never;

type GetSignalArgs<Path extends string, Registry, M = SplitPathGetMethod<Path, Registry>>
    = M extends Signal
      ? Parameters<M['fn']>
      : never;

export interface Logger {
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

declare module './BaseBus' {
  // noinspection JSUnusedGlobalSymbols
  export default class BaseBus<Registry> {
    private services: Record<string, BaseBusServiceMapValue>;
    private logger: Logger;
    constructor(logger?: Logger);
    addService: (name: string, service: BaseBusService) => () => void;

    call<Path extends string>(
      path: ValidatePath<Path, Registry, Method>,
      ...args: GetArgs<Path, Registry>
    ): GetReturnType<Path, Registry>;

    emit<Path extends string>(
      path: ValidatePath<Path, Registry, Signal>,
      ...args: GetSignalArgs<Path, Registry>
    ): void;

    on<Path extends string>(
      path: ValidatePath<Path, Registry, Signal>,
      callback: (...args: GetSignalArgs<Path, Registry>) => void
    ): () => this['off'];

    off<Path extends string>(
      path: ValidatePath<Path, Registry, Signal>,
      callback: (...args: GetSignalArgs<Path, Registry>) => void
    ): void;

    set<Path extends string, T extends GetValueField<Path, Registry>>(
      path: ValidatePath<Path, Registry, Property>,
      value: T
    ): void;

    get<Path extends string>(
      path: ValidatePath<Path, Registry, Property>,
    ): GetValueField<Path, Registry>;
  }
}


