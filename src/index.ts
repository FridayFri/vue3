const a: string = 1

interface User {
  name: string
  age: number
}

type Func = (user: User) => void
type ParamType<T> = T extends (...args: infer P) => any ? P : T
type Param = ParamType<Func> // Param = User
type AA = ParamType<string> // string
type AB = ParamType<any> // any

type Diff<T, U> = T extends U ? never : T // 找出T的差集
type Filter<T, U> = T extends U ? T : never // 找出交集

type T30 = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'> // => "b" | "d"
type T31 = Filter<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'> // => "a" | "c"

type TTuple = [string, number, boolean]

type ElementOf<T> = T extends Array<infer E> ? E : never
type ToUnion = ElementOf<TTuple>
