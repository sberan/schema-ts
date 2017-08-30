import { schema, array, string, number, boolean, object } from '../src'

schema.type('number').TypeOf // $ExpectType number

schema.type(['string', 'number']).TypeOf // $ExpectType string | number

array.TypeOf // $ExpectType any[]

array.items(string).TypeOf // $ExpectType string[]

schema.type(['number', 'array']).items(string).TypeOf // $ExpectType number | string[]

array.items(string).additionalItems(number).TypeOf // $ExpectType (string | number)[]

array.items([string, number]).TypeOf // $ExpectType (string | number)[]

array.items([string, number]).additionalItems(boolean).TypeOf // $ExpectType (string | number | boolean)[]

object.TypeOf.someRandomProperty // $ExpectType any

object.properties({ a: string }).TypeOf.a // $ExpectType string | undefined

object.TypeOf.b // $ExpectType any

object.properties({ a: string }).required('a').TypeOf.a // $ExpectType string

object.properties({ a: string }).required('b').TypeOf.b // $ExpectType any

object.properties({ a: string }).additionalProperties(false).TypeOf.a // $ExpectType string | undefined

object.properties({ a: string }).additionalProperties(false).TypeOf.b // $ExpectError Property 'b' does not exist

object.properties({ a: string }).additionalProperties(schema.type(['string', 'boolean'])).TypeOf.b // $ExpectType string | boolean | undefined

object.properties({ a: string }).additionalProperties(false).patternProperties({ '\\w+': string, 'a': boolean }).TypeOf.c // $ExpectType string | boolean | undefined

object.properties({ a: string }).additionalProperties(false).patternProperties({ '\\w+': object.properties({a: string}) }).TypeOf.c!.a // $ExpectType string | undefined

schema.enum([true, 'a', 42]).TypeOf // $ExpectType true | "a" | 42

const b = object.properties({ brand: object.enum(['b']), b: string }).required('brand', 'b').additionalProperties(false)
const c = object.properties({ brand: object.enum(['c']), c: string }).required('brand', 'c').additionalProperties(false)
const x = object.properties({ a: number }).additionalProperties(false).anyOf([b, c]).TypeOf

x.a // $ExpectType number | undefined

if (x.brand === 'b') {
  x.b // $ExpectType string
  x.c // $ExpectError Property 'c' does not exist
} else {
  x.c // $ExpectType string
  x.b // $ExpectError Property 'b' does not exist
}

const oneOf = object.properties({ a: number }).additionalProperties(false).oneOf([b]).TypeOf

oneOf.a // $ExpectType number | undefined

oneOf.b // $ExpectType string

const ASchema = schema.type(['string', 'null'])
type ASchema = schema<typeof ASchema>

function foo (value: ASchema) {
  value // $ExpectType string | null
}

schema.const(3).TypeOf // $ExpectType 3
