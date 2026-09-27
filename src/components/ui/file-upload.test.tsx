import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { FileUpload, type FileUploadItem } from './file-upload'

type HarnessProps = Omit<
  React.ComponentProps<typeof FileUpload>,
  'value' | 'onValueChange'
> & {
  initial?: FileUploadItem[]
  onChange?: (items: FileUploadItem[]) => void
}

/** FileUpload is controlled; the harness owns the list like a screen would. */
function Harness({ initial = [], onChange, ...props }: HarnessProps) {
  const [items, setItems] = useState(initial)
  return (
    <FileUpload
      {...props}
      value={items}
      onValueChange={(next) => {
        setItems(next)
        onChange?.(next)
      }}
    />
  )
}

const file = (name: string, size: number, type: string) =>
  new File([new Uint8Array(size)], name, { type })

const pdf = (name: string, size = 100) => file(name, size, 'application/pdf')

describe('FileUpload', () => {
  it('describes the accepted types and the size limit', async () => {
    const screen = await render(
      <Harness multiple accept='.pdf,image/png' maxSize={2 * 1024 * 1024} />
    )

    await expect
      .element(screen.getByText('PDF or PNG, up to 2 MB each'))
      .toBeInTheDocument()
    await expect
      .element(screen.getByRole('button', { name: 'Choose files' }))
      .toHaveAccessibleDescription('PDF or PNG, up to 2 MB each')
  })

  it('adds picked files, rejects the wrong type and size, and reports the accepted ones', async () => {
    const onFilesAdded = vi.fn()
    const screen = await render(
      <Harness
        multiple
        accept='.pdf'
        maxSize={1024}
        onFilesAdded={onFilesAdded}
      />
    )

    await userEvent.upload(
      screen.container.querySelector('input[type=file]')!,
      [
        pdf('evidence.pdf', 512),
        file('notes.txt', 10, 'text/plain'),
        pdf('recording.pdf', 2048),
      ]
    )

    await expect
      .element(screen.getByText('evidence.pdf', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('PDF only', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('Over the 1 KB limit', { exact: true }))
      .toBeInTheDocument()
    expect(onFilesAdded).toHaveBeenCalledOnce()
    expect(
      onFilesAdded.mock.calls[0][0].map((item: FileUploadItem) => item.name)
    ).toEqual(['evidence.pdf'])
  })

  it('replaces the file when only one is allowed', async () => {
    const screen = await render(
      <Harness initial={[{ id: 'a', name: 'old-source.docx', size: 100 }]} />
    )

    await userEvent.upload(
      screen.container.querySelector('input[type=file]')!,
      pdf('new-source.pdf')
    )

    await expect
      .element(screen.getByText('new-source.pdf', { exact: true }))
      .toBeInTheDocument()
    await expect
      .element(screen.getByText('old-source.docx', { exact: true }))
      .not.toBeInTheDocument()
  })

  it('accepts dropped files', async () => {
    const onFilesAdded = vi.fn()
    const screen = await render(
      <Harness multiple onFilesAdded={onFilesAdded} />
    )
    const zone = screen.container.querySelector<HTMLElement>(
      '[data-slot=file-upload-dropzone]'
    )!
    const data = new DataTransfer()
    data.items.add(file('export.csv', 10, 'text/csv'))
    const drag = (type: string) =>
      zone.dispatchEvent(
        new DragEvent(type, {
          bubbles: true,
          cancelable: true,
          dataTransfer: data,
        })
      )

    drag('dragenter')
    await expect.element(zone).toHaveAttribute('data-dragging')
    drag('drop')

    await expect
      .element(screen.getByText('export.csv', { exact: true }))
      .toBeInTheDocument()
    await expect.element(zone).not.toHaveAttribute('data-dragging')
    expect(onFilesAdded).toHaveBeenCalledOnce()
    // Screen readers hear what happened to the drop.
    await expect
      .element(screen.getByText('Added export.csv.'))
      .toBeInTheDocument()
  })

  it('removes a file and keeps focus in the list', async () => {
    const screen = await render(
      <Harness
        multiple
        initial={[
          { id: 'a', name: 'a.pdf', size: 100 },
          { id: 'b', name: 'b.pdf', size: 100 },
        ]}
      />
    )

    await screen.getByRole('button', { name: 'Remove a.pdf' }).click()
    await expect
      .element(screen.getByText('a.pdf', { exact: true }))
      .not.toBeInTheDocument()
    await expect
      .element(screen.getByRole('button', { name: 'Remove b.pdf' }))
      .toHaveFocus()

    await screen.getByRole('button', { name: 'Remove b.pdf' }).click()
    await expect
      .element(screen.getByRole('button', { name: 'Choose files' }))
      .toHaveFocus()
  })

  it('shows upload progress', async () => {
    const screen = await render(
      <Harness
        initial={[{ id: 'a', name: 'a.pdf', size: 2048, progress: 40 }]}
      />
    )

    await expect
      .element(screen.getByRole('progressbar', { name: 'Uploading a.pdf' }))
      .toHaveAttribute('aria-valuenow', '40')
    await expect.element(screen.getByText('2 KB · 40%')).toBeInTheDocument()
  })

  it('does nothing while disabled', async () => {
    const onChange = vi.fn()
    const screen = await render(
      <Harness
        disabled
        multiple
        onChange={onChange}
        initial={[{ id: 'a', name: 'a.pdf', size: 100 }]}
      />
    )
    const data = new DataTransfer()
    data.items.add(pdf('late.pdf'))
    screen.container
      .querySelector('[data-slot=file-upload-dropzone]')!
      .dispatchEvent(
        new DragEvent('drop', { bubbles: true, dataTransfer: data })
      )

    await expect
      .element(screen.getByRole('button', { name: 'Choose files' }))
      .toBeDisabled()
    await expect
      .element(screen.getByRole('button', { name: 'Remove a.pdf' }))
      .toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('passes id and aria props to the browse button, for form labels', async () => {
    const screen = await render(
      <>
        <label htmlFor='evidence'>Evidence</label>
        <Harness id='evidence' aria-invalid />
      </>
    )

    await expect
      .element(screen.getByRole('button', { name: 'Evidence' }))
      .toHaveAttribute('aria-invalid', 'true')
  })
})
