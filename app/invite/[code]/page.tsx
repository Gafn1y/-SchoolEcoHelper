"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, School, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from "next/navigation"

interface Invite {
  id: number
  name: string
  school_name: string
  class_name: string
  class_grade: string
  invite_code: string
  expires_at: string
}

export default function AcceptInvitePage({ params }: { params: { code: string } }) {
  const [invite, setInvite] = useState<Invite | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchInvite()
  }, [])

  const fetchInvite = async () => {
    try {
      const response = await fetch(`/api/teacher-invites/${params.code}`)
      if (response.ok) {
        const inviteData = await response.json()
        setInvite(inviteData)
      } else {
        setError('Приглашение недействительно или истекло')
      }
    } catch (error) {
      console.error('Error fetching invite:', error)
      setError('Ошибка при загрузке приглашения')
    }
  }

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/teacher-invites/${params.code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        const user = await response.json()
        localStorage.setItem('user', JSON.stringify(user))
        
        alert(`Добро пожаловать в ${invite?.school_name}! Вы назначены учителем класса ${invite?.class_name}.`)
        router.push('/dashboard/teacher')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Ошибка при принятии приглашения')
      }
    } catch (error) {
      console.error('Error accepting invite:', error)
      setError('Ошибка п��и принятии приглашения')
    } finally {
      setLoading(false)
    }
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Приглашение недействительно</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Обратитесь к директору школы за новым приглашением</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invite) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
            <h1 className="text-2xl font-bold text-green-900">EcoSchool</h1>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-green-600" />
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <CardTitle className="text-green-900">Приглашение учителя</CardTitle>
          <CardDescription>
            Вы приглашены стать учителем в {invite.school_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Invite Details */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-green-600" />
                <span className="font-medium">Школа:</span>
                <span>{invite.school_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium">Класс:</span>
                <span>{invite.class_name} ({invite.class_grade} класс)</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-600" />
                <span className="font-medium">Имя:</span>
                <span>{invite.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Должность: Классный руководитель
                </Badge>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleAcceptInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Электронная почта</Label>
              <Input
                id="email"
                type="email"
                placeholder="Введите вашу электронную почту"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Создайте пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Принимаем приглашение...' : 'Принять приглашение и создать аккаунт'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Приглашение действительно до: {new Date(invite.expires_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
