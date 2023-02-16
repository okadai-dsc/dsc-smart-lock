export type SameProperties<T1, T2, K extends keyof T1 & keyof T2> = NonNullable<
  K extends (
    T1[K] extends T2[K] ? (T2[K] extends T1[K] ? keyof T1 : never) : never
  )
    ? K
    : null
>;

export type PickSameProperties<T1, T2> = Pick<
  T1,
  SameProperties<T1, T2, keyof T1 & keyof T2>
>;
