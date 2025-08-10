"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const roleParam = searchParams.get("role") || ""

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Login failed")
      }

      const user = await response.json()

      // Check if role matches
      if (roleParam && user.role !== roleParam) {
        throw new Error(`Этот аккаунт не является аккаунтом ${getRoleText(roleParam)}`)
      }

      localStorage.setItem("user", JSON.stringify(user))

      // Redirect based on role
      switch (user.role) {
        case "student":
          router.push("/dashboard/student")
          break
        case "teacher":
          router.push("/dashboard/teacher")
          break
        case "director":
          router.push("/dashboard/director")
          break
        default:
          router.push("/dashboard/admin")
      }
    } catch (error) {
      console.error("Login error:", error)
      alert(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleTitle = () => {
    switch (roleParam) {
      case "student":
        return "Вход для ученика"
      case "teacher":
        return "Вход для учителя"
      case "director":
        return "Вход для директора"
      default:
        return "Добро пожаловать!"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "student":
        return "ученика"
      case "teacher":
        return "учителя"
      case "director":
        return "директора"
      default:
        return ""
    }
  }

  const getRoleColor = () => {
    switch (roleParam) {
      case "student":
        return "text-blue-900"
      case "teacher":
        return "text-green-900"
      case "director":
        return "text-purple-900"
      default:
        return "text-blue-900"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
            <h1 className={`text-2xl font-bold ${getRoleColor()}`}>EcoSchool</h1>
          </div>
          <CardTitle>{getRoleTitle()}</CardTitle>
          <CardDescription>Войдите, чтобы продолжить свой экологический путь</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Введите ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className={`w-full ${
                roleParam === "director"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : roleParam === "teacher"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{" "}
              <Link href="/auth/register-choice" className="text-blue-600 hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link
              href="/auth/login-choice"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Назад к выбору роли
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">Загрузка...</div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
