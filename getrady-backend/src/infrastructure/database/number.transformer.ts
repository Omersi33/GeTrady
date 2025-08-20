export const numberTransformer = {
  to: (value: number | null) => value,
  from: (value: string | null) =>
    value === null ? null : parseFloat(value)
}