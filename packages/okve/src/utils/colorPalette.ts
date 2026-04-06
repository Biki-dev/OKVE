const PALETTE = [
  '#4f8ef7',
  '#f7724f',
  '#4ff7a0',
  '#f7c94f',
  '#c44ff7',
  '#f74f9e',
  '#4ff7f0',
  '#f7f74f',
]

const groupColorMap = new Map<string, string>()

export function getGroupColor(group?: string): string {
  if (!group) {
    return PALETTE[0]
  }

  if (!groupColorMap.has(group)) {
    groupColorMap.set(group, PALETTE[groupColorMap.size % PALETTE.length])
  }

  return groupColorMap.get(group)!
}