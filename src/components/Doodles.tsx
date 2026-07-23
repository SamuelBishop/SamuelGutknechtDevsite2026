export type DoodleName =
  'cow' | 'capitol' | 'violin' | 'solder' | 'bike' | 'needle' | 'mountains'

export function Doodle({ name }: { name: DoodleName }) {
  return <span className="doodle" data-doodle={name} aria-hidden="true" />
}
