import { createFileRoute } from '@tanstack/react-router'
import { UserProfile } from '@/features/github/components/UserProfile'

export const Route = createFileRoute('/user/$username')({
  component: UserProfile,
})
