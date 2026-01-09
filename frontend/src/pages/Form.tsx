import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react'
import { api } from '@/lib/api'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['User', 'Manager', 'Admin'], {
    message: 'Please select a role',
  }),
})

type FormValues = z.infer<typeof formSchema>

type SubmitStatus = {
  type: 'success' | 'error'
  message: string
  errors?: Record<string, string>
} | null

export default function FormPage() {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      role: undefined,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const result = await api.validateForm(data)

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Form validated and submitted successfully!',
        })
        toast.success('Form submitted successfully!')
        form.reset()
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Server validation failed',
          errors: result.errors,
        })
        toast.error('Server validation failed')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit form'
      setSubmitStatus({
        type: 'error',
        message,
      })
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    form.reset()
    setSubmitStatus(null)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Form Validation</CardTitle>
          <CardDescription>
            Test client-side and server-side validation using React Hook Form, Zod, and the /api/validate endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitStatus && (
            <Alert
              variant={submitStatus.type === 'success' ? 'success' : 'destructive'}
              className="mb-6"
            >
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {submitStatus.type === 'success' ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription>
                {submitStatus.message}
                {submitStatus.errors && (
                  <ul className="mt-2 list-disc list-inside">
                    {Object.entries(submitStatus.errors).map(([field, error]) => (
                      <li key={field}><strong>{field}:</strong> {error}</li>
                    ))}
                  </ul>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Minimum 2 characters required
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Must be a valid email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the user&apos;s role in the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <div>
                <strong>Name:</strong> Required field, minimum 2 characters
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <div>
                <strong>Email:</strong> Required field, must be a valid email format
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <div>
                <strong>Role:</strong> Required field, must be one of: User, Manager, Admin
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Testing Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Testing Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>
                <strong>Invalid name:</strong> Enter a single character to see validation error
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>
                <strong>Invalid email:</strong> Enter &quot;test&quot; or &quot;test@&quot; to see format error
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>
                <strong>Missing role:</strong> Try submitting without selecting a role
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>
                <strong>Valid submission:</strong> Fill all fields correctly to see success
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <span>
                <strong>Real-time validation:</strong> Watch errors appear/disappear as you type
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
