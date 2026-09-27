import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'Primitives/OTP',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function CodeSlots({ invalid }: { invalid?: boolean }) {
  return (
    <>
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot key={index} index={index} aria-invalid={invalid} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} aria-invalid={invalid} />
        ))}
      </InputOTPGroup>
    </>
  )
}

type VerifyCardProps = {
  id: string
  initialCode?: string
  error?: string
  disabled?: boolean
}

function VerifyCard({
  id,
  initialCode = '',
  error,
  disabled = false,
}: VerifyCardProps) {
  const [code, setCode] = useState(initialCode)
  const [verified, setVerified] = useState(false)
  const messageId = `${id}-message`
  const invalid = Boolean(error) && code === initialCode

  return (
    <Card className='max-w-sm'>
      <CardHeader>
        <CardTitle>Verify the subject’s email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to a•••••@northwind.eu for DSR-20418.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-3'>
        {verified ? (
          <Alert>
            <ShieldCheck />
            <AlertTitle>Identity verified</AlertTitle>
            <AlertDescription>
              Data collection can start for this request.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Label htmlFor={id}>Verification code</Label>
            <InputOTP
              id={id}
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={setCode}
              disabled={disabled}
              aria-invalid={invalid || undefined}
              aria-describedby={messageId}
            >
              <CodeSlots invalid={invalid} />
            </InputOTP>
            <p
              id={messageId}
              className={
                invalid
                  ? 'text-caption text-destructive-strong'
                  : 'text-caption text-muted-foreground'
              }
            >
              {invalid
                ? error
                : 'The code expires 10 minutes after it is sent.'}
            </p>
          </>
        )}
      </CardContent>
      {!verified && (
        <CardFooter className='justify-between'>
          <Button variant='link' disabled={disabled}>
            Resend code
          </Button>
          <Button
            disabled={disabled || code.length < 6 || invalid}
            onClick={() => setVerified(true)}
          >
            Verify
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

/** Six digits in two groups. Verify unlocks when every slot is filled; pasting a code fills them all. */
export const VerifySubject: Story = {
  render: () => <VerifyCard id='otp-verify' />,
}

/** A wrong code outlines each slot and says how many attempts are left. */
export const Invalid: Story = {
  render: () => (
    <VerifyCard
      id='otp-invalid'
      initialCode='482193'
      error='That code does not match. 2 attempts left.'
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className='grid max-w-sm gap-3'>
      <VerifyCard id='otp-locked' disabled />
      <Alert variant='warning'>
        <AlertTitle>Too many attempts</AlertTitle>
        <AlertDescription>
          Ask the subject to request a new code in 15 minutes.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
