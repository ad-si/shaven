import type {Config} from './types.ts'

const defaults: Config = {
  namespace: 'xhtml',
  autoNamespacing: true,
  escapeHTML: true,
  quotationMark: '"',
  quoteAttributes: true,
  convertTransformArray: true,
}

export default defaults
