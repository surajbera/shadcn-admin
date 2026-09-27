import * as React from 'react'
import {
  FileArchive,
  File as FileIcon,
  FileImage,
  FileSpreadsheet,
  FileText,
  Upload,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Progress } from './progress'

export type FileUploadItem = {
  /** Stable key. `FileUpload` sets one for every file it adds. */
  id: string
  name: string
  /** Size in bytes. */
  size: number
  /** The picked file. Absent for files that are already stored. */
  file?: File
  /** 0–100 while the file uploads. Leave it unset once the upload is done. */
  progress?: number
  /** Why the file was rejected or failed to upload. Replaces the size line. */
  error?: string
}

type FileUploadProps = Omit<
  React.ComponentProps<'button'>,
  'value' | 'onChange' | 'children'
> & {
  value: FileUploadItem[]
  onValueChange: (items: FileUploadItem[]) => void
  /**
   * The files that passed `accept` and `maxSize`, right after they join the
   * list. Start uploads here and report back through `progress` and `error`.
   */
  onFilesAdded?: (items: FileUploadItem[]) => void
  /** Same syntax as the native input: `.pdf,.docx,image/*`. */
  accept?: string
  /** Without it, a new file replaces the current one. */
  multiple?: boolean
  /** Largest file in bytes. */
  maxSize?: number
  /** Heading inside the drop zone. */
  title?: React.ReactNode
  /** Line under the heading. Defaults to the accepted types and size limit. */
  description?: React.ReactNode
  buttonText?: React.ReactNode
}

const typeLabels: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/json': 'JSON',
  'application/zip': 'ZIP',
  'text/csv': 'CSV',
  'text/plain': 'TXT',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
  'image/*': 'images',
  'video/*': 'videos',
  'audio/*': 'audio',
  'text/*': 'text files',
}

/** "PDF, DOCX or PNG" from `.pdf,.docx,image/png`. Unknown MIME types are skipped. */
function describeAccept(accept?: string) {
  const labels = (accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .map((token) =>
      token.startsWith('.') ? token.slice(1).toUpperCase() : typeLabels[token]
    )
    .filter((label): label is string => Boolean(label))
  const unique = [...new Set(labels)]
  if (unique.length < 2) return unique[0] ?? null
  return `${unique.slice(0, -1).join(', ')} or ${unique[unique.length - 1]}`
}

function matchesAccept(file: File, accept?: string) {
  const tokens = (accept ?? '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token)
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${units[unit]}`
}

function iconFor(name: string) {
  const extension = name.includes('.')
    ? name.split('.').pop()!.toLowerCase()
    : ''
  if (/^(png|jpe?g|gif|webp|svg|bmp|heic)$/.test(extension)) return FileImage
  if (/^(csv|tsv|xlsx?|ods)$/.test(extension)) return FileSpreadsheet
  if (/^(zip|rar|7z|gz|tar)$/.test(extension)) return FileArchive
  if (/^(pdf|docx?|pptx?|txt|rtf|odt|md)$/.test(extension)) return FileText
  return FileIcon
}

let lastId = 0
const createId = () =>
  `file-${Date.now().toString(36)}-${(lastId++).toString(36)}`

/**
 * Pick or drop files, then follow each one through upload. The list is
 * controlled: `FileUpload` adds and removes items, the caller sets `progress`
 * and `error` while it uploads.
 *
 * Extra props (`id`, `aria-*`) go to the browse button, so it works inside
 * `FormControl`. `className` goes to the wrapper.
 */
function FileUpload({
  value,
  onValueChange,
  onFilesAdded,
  accept,
  multiple = false,
  maxSize,
  title,
  description,
  buttonText,
  disabled,
  className,
  ...props
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const dragDepth = React.useRef(0)
  const focusAfterRemove = React.useRef<number | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const [announcement, setAnnouncement] = React.useState('')
  const hintId = React.useId()

  const types = describeAccept(accept)
  const limit = maxSize
    ? `up to ${formatBytes(maxSize)}${multiple ? ' each' : ''}`
    : null
  const hint =
    description ??
    (types && limit
      ? `${types}, ${limit}`
      : types || (limit && limit[0].toUpperCase() + limit.slice(1)))

  const validate = (file: File) => {
    if (!matchesAccept(file, accept))
      return types ? `${types} only` : 'This file type is not accepted'
    if (maxSize && file.size > maxSize)
      return `Over the ${formatBytes(maxSize)} limit`
    return undefined
  }

  const addFiles = (files: FileList | null) => {
    if (disabled || !files?.length) return
    const picked = multiple ? Array.from(files) : [files[0]]
    const added = picked.map((file) => ({
      id: createId(),
      name: file.name,
      size: file.size,
      file,
      error: validate(file),
    }))
    onValueChange(multiple ? [...value, ...added] : added)

    const accepted = added.filter((item) => !item.error)
    if (accepted.length) onFilesAdded?.(accepted)
    setAnnouncement(
      [
        accepted.length === 1 && `Added ${accepted[0].name}.`,
        accepted.length > 1 && `Added ${accepted.length} files.`,
        ...added
          .filter((item) => item.error)
          .map((item) => `${item.name} not added: ${item.error}.`),
      ]
        .filter(Boolean)
        .join(' ')
    )
  }

  const remove = (index: number) => {
    focusAfterRemove.current = index
    onValueChange(value.filter((_, i) => i !== index))
    setAnnouncement(`Removed ${value[index].name}.`)
  }

  // Removing a row drops its button; keep focus in the list instead of losing it.
  React.useEffect(() => {
    if (focusAfterRemove.current === null) return
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>(
      '[data-slot=file-upload-remove]'
    )
    const next =
      buttons?.[Math.min(focusAfterRemove.current, buttons.length - 1)]
    ;(next ?? buttonRef.current)?.focus()
    focusAfterRemove.current = null
  }, [value])

  const hasFiles = (event: React.DragEvent) =>
    event.dataTransfer.types.includes('Files')

  return (
    <div data-slot='file-upload' className={cn('grid gap-3', className)}>
      <div
        data-slot='file-upload-dropzone'
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={(event) => {
          if (!hasFiles(event)) return
          event.preventDefault()
          dragDepth.current += 1
          if (!disabled) setDragging(true)
        }}
        onDragOver={(event) => {
          if (!hasFiles(event)) return
          event.preventDefault()
          event.dataTransfer.dropEffect = disabled ? 'none' : 'copy'
        }}
        onDragLeave={(event) => {
          if (!hasFiles(event)) return
          dragDepth.current = Math.max(0, dragDepth.current - 1)
          if (dragDepth.current === 0) setDragging(false)
        }}
        onDrop={(event) => {
          if (!hasFiles(event)) return
          event.preventDefault()
          dragDepth.current = 0
          setDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong bg-background px-6 py-8 text-center transition-colors duration-fast dark:bg-input/10',
          'data-dragging:border-ring data-dragging:bg-muted',
          'has-[[aria-invalid=true]]:border-destructive',
          // Muted, not faded: the text has to stay readable while disabled.
          'group data-disabled:cursor-not-allowed data-disabled:border-border',
          !disabled && 'cursor-pointer hover:bg-muted/50'
        )}
      >
        <div className='flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-data-disabled:opacity-50 [&_svg]:size-5'>
          <Upload />
        </div>
        <div className='grid gap-1'>
          <p className='text-body font-medium group-data-disabled:text-muted-foreground'>
            {title ?? (multiple ? 'Drag files here' : 'Drag a file here')}
          </p>
          {hint && (
            <p id={hintId} className='text-caption text-muted-foreground'>
              {hint}
            </p>
          )}
        </div>
        <Button
          {...props}
          ref={buttonRef}
          type='button'
          variant='outline'
          size='sm'
          disabled={disabled}
          // The drop zone border already shows the error; one red outline is enough.
          className='aria-invalid:border-input'
          aria-describedby={
            [hint ? hintId : null, props['aria-describedby']]
              .filter(Boolean)
              .join(' ') || undefined
          }
        >
          {buttonText ?? (multiple ? 'Choose files' : 'Choose file')}
        </Button>
      </div>

      <input
        ref={inputRef}
        type='file'
        hidden
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          addFiles(event.target.files)
          // Let the same file be picked again after it was removed.
          event.target.value = ''
        }}
      />

      {value.length > 0 && (
        <ul ref={listRef} data-slot='file-upload-list' className='grid gap-2'>
          {value.map((item, index) => {
            const Icon = iconFor(item.name)
            const uploading =
              !item.error && item.progress !== undefined && item.progress < 100
            return (
              <li
                key={item.id}
                data-slot='file-upload-item'
                data-invalid={item.error ? '' : undefined}
                className='flex items-center gap-3 rounded-xl border px-3 py-2.5'
              >
                <span className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4'>
                  <Icon />
                </span>
                <div className='grid min-w-0 flex-1 gap-0.5'>
                  <span className='truncate text-body font-medium'>
                    {item.name}
                  </span>
                  {item.error ? (
                    <span className='text-caption text-destructive-strong'>
                      {item.error}
                    </span>
                  ) : (
                    <span className='text-caption text-muted-foreground tabular-nums'>
                      {formatBytes(item.size)}
                      {uploading && ` · ${Math.round(item.progress!)}%`}
                    </span>
                  )}
                  {uploading && (
                    <Progress
                      value={item.progress!}
                      className='mt-1.5'
                      aria-label={`Uploading ${item.name}`}
                    />
                  )}
                </div>
                <Button
                  type='button'
                  data-slot='file-upload-remove'
                  variant='ghost'
                  size='icon-sm'
                  disabled={disabled}
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(index)}
                >
                  <X />
                </Button>
              </li>
            )
          })}
        </ul>
      )}

      <span aria-live='polite' className='sr-only'>
        {announcement}
      </span>
    </div>
  )
}

export { FileUpload }
