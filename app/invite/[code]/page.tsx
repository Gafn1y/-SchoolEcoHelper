"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, School, User, Mail, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface InviteData {
  id: number
  name: string
  email: string
  subject: string
  school_name: string
  class_name?: string
  invited_by_name: string
}

export default function TeacherInvitePage({ params }: { params: { code: string } }) {
  const [invite, setInvite] = useState<InviteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const router = useRouter()

  useEffect(() => {
    fetchInvite()
  }, [])

  const fetchInvite = async () => {
    try {
      const response = await fetch(`/api/teacher-invites/${params.code}`)
      if (response.ok) {
        const data = await response.json()
        setInvite(data)
        setFormData((prev) => ({
          ...prev,
          name: data.name || "",
          email: data.email || "",
        }))
      } else {
        setError("Приглашение недействительно или истекло")
      }
    } catch (err) {
      setError("Ошибка загрузки приглашения")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/teacher-invites/${params.code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const user = await response.json()
        localStorage.setItem("user", JSON.stringify(user))
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard/teacher")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Ошибка регистрации")
      }
    } catch (err) {
      setError("Ошибка сети")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Загрузка приглашения...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Добро пожаловать!</h2>
            <p className="text-gray-600 mb-4">Ваш аккаунт учителя успешно создан.</p>
            <p className="text-sm text-gray-500">Перенаправление на панель учителя...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <Mail className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Приглашение недействительно</h2>
            <p className="text-gray-600">Это приглашение истекло или уже было использовано.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo-new.png" alt="EcoSchool" className="h-16 w-16" />
            <h1 className="text-3xl font-bold text-blue-900">EcoSchool</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Приглашение учителя</h2>
          <p className="text-gray-600">Завершите регистрацию для присоединения к школе</p>
        </div>

        {/* Invite Details */}
        <Card className="mb-6">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
              <GraduationCap className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle>Вас пригласили преподавать</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <School className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">{invite.school_name}</p>
                <p className="text-sm text-gray-600">Школа</p>
              </div>
            </div>
            {invite.class_name && (
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{invite.class_name}</p>
                  <p className="text-sm text-gray-600">Класс</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">{invite.invited_by_name}</p>
                <p className="text-sm text-gray-600">Пригласил вас</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Создайте ваш аккаунт</CardTitle>
            <CardDescription>Заполните данные для завершения регистрации</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Полное имя</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={submitting}>
                {submitting ? "Создание аккаунта..." : "Создать аккаунт учителя"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
