import { useCallback, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Plus, Trash2, Sparkles, List } from 'lucide-react'
import type { FieldNode } from '#/lib/field-builder'
import { createField, fieldTreeToJson } from '#/lib/field-builder'
import { generateFieldValue } from '#/lib/faker-gen'

const FIELD_TYPES = ['string', 'number', 'boolean', 'object', 'array'] as const

interface Props {
  nodes: FieldNode[]
  onChange: (nodes: FieldNode[]) => void
  onJsonChange: (json: string) => void
}

export function FieldBuilder({ nodes, onChange, onJsonChange }: Props) {
  const [generateCounts, setGenerateCounts] = useState<Record<string, number>>(
    {},
  )
  const updateNode = useCallback(
    (id: string, patch: Partial<FieldNode>) => {
      const update = (list: FieldNode[]): FieldNode[] =>
        list.map((node) => {
          if (node.id === id) {
            const updated = { ...node, ...patch }
            return updated
          }
          return { ...node, children: update(node.children) }
        })
      const next = update(nodes)
      onChange(next)
      onJsonChange(JSON.stringify(fieldTreeToJson(next), null, 2))
    },
    [nodes, onChange, onJsonChange],
  )

  const removeNode = useCallback(
    (id: string) => {
      const remove = (list: FieldNode[]): FieldNode[] =>
        list
          .filter((node) => node.id !== id)
          .map((node) => ({ ...node, children: remove(node.children) }))
      const next = remove(nodes)
      onChange(next)
      onJsonChange(JSON.stringify(fieldTreeToJson(next), null, 2))
    },
    [nodes, onChange, onJsonChange],
  )

  const addChild = useCallback(
    (parentId: string | null) => {
      const child = createField()
      if (parentId === null) {
        const next = [...nodes, child]
        onChange(next)
        onJsonChange(JSON.stringify(fieldTreeToJson(next), null, 2))
        return
      }
      const add = (list: FieldNode[]): FieldNode[] =>
        list.map((node) => {
          if (node.id === parentId) {
            return { ...node, children: [...node.children, child] }
          }
          return { ...node, children: add(node.children) }
        })
      const next = add(nodes)
      onChange(next)
      onJsonChange(JSON.stringify(fieldTreeToJson(next), null, 2))
    },
    [nodes, onChange, onJsonChange],
  )

  const generateAll = useCallback(() => {
    const gen = (list: FieldNode[]): FieldNode[] =>
      list.map((node) => {
        if (node.type === 'object' || node.type === 'array') {
          return { ...node, children: gen(node.children) }
        }
        return {
          ...node,
          value: generateFieldValue(node.key, node.type),
        }
      })
    const next = gen(nodes)
    onChange(next)
    onJsonChange(JSON.stringify(fieldTreeToJson(next), null, 2))
  }, [nodes, onChange, onJsonChange])

  const cloneWithFaker = (f: FieldNode): FieldNode => {
    if (f.type === 'object' || f.type === 'array') {
      return {
        ...f,
        id: createField().id,
        children: f.children.map(cloneWithFaker),
      }
    }
    return {
      ...f,
      id: createField().id,
      value: generateFieldValue(f.key, f.type),
    }
  }

  const generateItems = useCallback(
    (nodeId: string) => {
      const count = generateCounts[nodeId] || 3
      const generate = (list: FieldNode[]): FieldNode[] =>
        list.map((n) => {
          if (n.id !== nodeId) return { ...n, children: generate(n.children) }

          if (n.type === 'object') {
            if (n.children.length === 0) {
              return {
                ...n,
                type: 'array',
                children: Array.from({ length: count }, () =>
                  createField({
                    key: 'item',
                    type: 'string',
                    value: generateFieldValue('item', 'string'),
                  }),
                ),
              }
            }
            return {
              ...n,
              type: 'array',
              children: Array.from({ length: count }, () => {
                const item = createField({ key: n.key, type: 'object' })
                item.children = n.children.map(cloneWithFaker)
                return item
              }),
            }
          }

          if (n.children.length === 0) {
            return {
              ...n,
              type: 'array',
              children: Array.from({ length: count }, () =>
                createField({
                  key: 'item',
                  type: 'string',
                  value: generateFieldValue('item', 'string'),
                }),
              ),
            }
          }

          return {
            ...n,
            type: 'array',
            children: Array.from({ length: count }, () =>
              cloneWithFaker(n.children[0]),
            ),
          }
        })
      const next = generate(nodes)
      onChange(next)
      onJsonChange(JSON.stringify(fieldTreeToJson(next), null, 2))
    },
    [nodes, onChange, onJsonChange, generateCounts],
  )

  const renderRow = (node: FieldNode, depth: number) => (
    <div
      key={node.id}
      className="flex flex-col"
      style={{ marginLeft: depth * 20 }}
    >
      <div className="flex items-center gap-2 py-1.5">
        <Input
          placeholder="key"
          className="h-8 w-28 text-xs font-mono shrink-0"
          value={node.key}
          onChange={(e) => updateNode(node.id, { key: e.target.value })}
        />
        <Select
          value={node.type}
          onValueChange={(v: string) =>
            updateNode(node.id, {
              type: v as FieldNode['type'],
              value: '',
              children: [],
            })
          }
        >
          <SelectTrigger className="h-8 w-22 text-xs shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="text-xs">
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {node.type === 'string' && (
          <Input
            placeholder="value"
            className="h-8 flex-1 text-xs font-mono min-w-0"
            value={node.value}
            onChange={(e) => updateNode(node.id, { value: e.target.value })}
          />
        )}
        {node.type === 'number' && (
          <Input
            type="number"
            placeholder="0"
            className="h-8 w-28 text-xs font-mono"
            value={node.value}
            onChange={(e) => updateNode(node.id, { value: e.target.value })}
          />
        )}
        {node.type === 'boolean' && (
          <Select
            value={node.value || 'false'}
            onValueChange={(v: string) => updateNode(node.id, { value: v })}
          >
            <SelectTrigger className="h-8 w-22 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true" className="text-xs">
                true
              </SelectItem>
              <SelectItem value="false" className="text-xs">
                false
              </SelectItem>
            </SelectContent>
          </Select>
        )}
        {(node.type === 'object' || node.type === 'array') && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs shrink-0"
            onClick={() => addChild(node.id)}
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 shrink-0"
          onClick={() => removeNode(node.id)}
          style={{ color: '#ef4444' }}
        >
          <Trash2 size={14} />
        </Button>
      </div>
      {(node.type === 'object' || node.type === 'array') &&
        node.children.map((child) => renderRow(child, depth + 1))}
      {(node.type === 'array' || node.type === 'object') && (
        <div
          className="flex items-center gap-2 ml-5 mt-1 mb-1"
          style={{ marginLeft: (depth + 1) * 20 }}
        >
          <List size={14} style={{ color: 'var(--sea-ink-soft)' }} />
          <Input
            type="number"
            min={1}
            max={100}
            placeholder="3"
            className="h-7 w-16 text-xs"
            value={generateCounts[node.id] ?? ''}
            onChange={(e) =>
              setGenerateCounts((prev) => ({
                ...prev,
                [node.id]: Math.max(1, Number(e.target.value)),
              }))
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => generateItems(node.id)}
          >
            Generate Items
          </Button>
          <span className="text-xs" style={{ color: 'var(--sea-ink-soft)' }}>
            {node.type === 'object'
              ? 'Convert to array & generate multiple faked items'
              : 'Generate multiple faked items'}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-2">
      <div
        className="border rounded-lg p-3 space-y-1"
        style={{ borderColor: 'var(--line)' }}
      >
        {nodes.length === 0 ? (
          <p
            className="text-xs py-2 text-center"
            style={{ color: 'var(--sea-ink-soft)' }}
          >
            No fields yet. Add a field to define the response body.
          </p>
        ) : (
          nodes.map((node) => renderRow(node, 0))
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => addChild(null)}>
          <Plus size={14} className="mr-1" />
          Add Field
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={generateAll}
          disabled={nodes.length === 0}
        >
          <Sparkles size={14} className="mr-1" />
          Generate Mock Data
        </Button>
      </div>
    </div>
  )
}
