export interface FieldNode {
  id: string
  key: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  value: string
  children: FieldNode[]
}

let _nextId = 1
export function createFieldId(): string {
  return `f${_nextId++}`
}

export function createField(overrides?: Partial<FieldNode>): FieldNode {
  return {
    id: createFieldId(),
    key: '',
    type: 'string',
    value: '',
    children: [],
    ...overrides,
  }
}

export function fieldTreeToJson(nodes: FieldNode[]): unknown {
  if (nodes.length === 0) return null
  if (nodes.length === 1) return nodeToValue(nodes[0])
  const obj: Record<string, unknown> = {}
  for (const node of nodes) {
    obj[node.key || 'key'] = nodeToValue(node)
  }
  return obj
}

function nodeToValue(node: FieldNode): unknown {
  if (node.type === 'object') {
    const obj: Record<string, unknown> = {}
    for (const child of node.children) {
      obj[child.key || 'key'] = nodeToValue(child)
    }
    return obj
  }
  if (node.type === 'array') {
    return node.children.map((child) => nodeToValue(child))
  }
  if (node.type === 'number') {
    const n = Number(node.value)
    return Number.isNaN(n) ? 0 : n
  }
  if (node.type === 'boolean') {
    return node.value === 'true'
  }
  return node.value
}

function valueToFieldNode(key: string, value: unknown): FieldNode {
  if (value === null) {
    return {
      id: createFieldId(),
      key,
      type: 'string',
      value: 'null',
      children: [],
    }
  }
  if (Array.isArray(value)) {
    return {
      id: createFieldId(),
      key,
      type: 'array',
      value: '',
      children: value.map((v) => valueToFieldNode('', v)),
    }
  }
  if (typeof value === 'object') {
    return {
      id: createFieldId(),
      key,
      type: 'object',
      value: '',
      children: Object.entries(value).map(([k, v]) => valueToFieldNode(k, v)),
    }
  }
  if (typeof value === 'number') {
    return {
      id: createFieldId(),
      key,
      type: 'number',
      value: String(value),
      children: [],
    }
  }
  if (typeof value === 'boolean') {
    return {
      id: createFieldId(),
      key,
      type: 'boolean',
      value: String(value),
      children: [],
    }
  }
  return {
    id: createFieldId(),
    key,
    type: 'string',
    value: String(value),
    children: [],
  }
}

export function jsonToFieldNodes(json: string): FieldNode[] {
  const parsed = JSON.parse(json)
  if (Array.isArray(parsed)) {
    return [valueToFieldNode('', parsed)]
  }
  if (typeof parsed === 'object' && parsed !== null) {
    return Object.entries(parsed).map(([key, value]) =>
      valueToFieldNode(key, value),
    )
  }
  return [valueToFieldNode('', parsed)]
}
