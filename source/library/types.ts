export interface Config {
  namespace: string
  autoNamespacing: boolean
  escapeHTML: boolean
  quotationMark: string
  quoteAttributes: boolean
  convertTransformArray: boolean
}

export interface TransformObject {
  type: string
  degrees?: number
  x?: number
  y?: number
}

export type StyleValue = string | number | boolean | null | undefined

export type StyleObject = Record<string, StyleValue>

export type AttributeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | StyleObject
  | TransformObject[]

export type Attributes = Record<string, AttributeValue>

export type Child<Node, Result> =
  | string
  | number
  | boolean
  | null
  | undefined
  | Attributes
  | Node
  | ((element: Result) => void)
  | ShavenArray<Node, Result>
  | ShavenArray<Node, Result>[]

export type ShavenArray<Node, Result> = [
  string | Node | ShavenArray<Node, Result>,
  ...Child<Node, Result>[],
]

export type ShavenInput<Node, Result> =
  | ShavenArray<Node, Result>
  | (Partial<Config> & {elementArray: ShavenArray<Node, Result>})

export interface ShavenObject<Element, Result> {
  0: Result | false
  rootElement: Result | false
  ids: Record<string, Element>
  references: Record<string, Element>
  toString (): string
}

export type EmptyObject = Record<string, never>

export interface SugarProperties {
  tag: string
  id?: string
  class?: string
  reference?: string
  escapeHTML?: boolean
}
