export interface JsonValidation {
  valid: boolean
  error: string | null
}

export function validateJson(input: string): JsonValidation {
  if (!input.trim()) {
    return { valid: true, error: null }
  }
  try {
    JSON.parse(input)
    return { valid: true, error: null }
  } catch (e) {
    return {
      valid: false,
      error: e instanceof SyntaxError ? e.message : 'Invalid JSON',
    }
  }
}

export function formatJson(input: string): string {
  if (!input.trim()) {
    return input
  }
  try {
    const parsed = JSON.parse(input)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return input
  }
}
