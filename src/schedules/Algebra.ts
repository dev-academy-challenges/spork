export interface IAlgebra<
  TWeek,
  TDay,
  TCampusPattern,
  TRule,
  TAction,
  TResult
> {
  week(n: number): TWeek;
  mon(): TDay;
  tue(): TDay;
  wed(): TDay;
  thu(): TDay;
  fri(): TDay;

  welly(): TCampusPattern;
  akl(): TCampusPattern;
  online(): TCampusPattern;
  all(): TCampusPattern;
  except(...ps: TCampusPattern[]): TCampusPattern;

  on(week: TWeek, day: TDay, campus: TCampusPattern, action: TAction ): TRule;
  deploy(...challenges: string[]): TAction
  schedule(...rules: TRule[]): TResult 
}

export type TTemplate = <a, b, c, d, e, r>(alg: IAlgebra<a,b ,c, d, e, r>) => r
