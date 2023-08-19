export type NumericRange<
  start extends number,
  end extends number,
  arr extends unknown[] = [],
  acc extends number = never, // Accumulator（アキュムレータ）Accumulatorは反復的な計算を行う過程で中間の結果を保持する変数や値を指すことが多い
> = arr['length'] extends end
  ? acc | start | end
  : NumericRange<start, end, [...arr, 1], arr[start] extends undefined ? acc : acc | arr['length']>;

export type NonSlashedString<S extends string> = S extends `/${string}` ? never : S;
