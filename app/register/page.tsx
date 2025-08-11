"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building, AlertCircle, Eye, EyeOff, User, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface School {
  id: number
  name: string
  address?: string
  director_name?: string
}

interface Class {
  id: number
  name: string
  grade: string
  teacher_name?: string
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const roleParam = searchParams.get("role") || ""

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: roleParam,
    school_id: "",
    class_id: "",
    grade: "",
    // Director-specific fields
    school_name: "",
    school_address: "",
    total_classes: "",
  })

  const [schools, setSchools] = useState<School[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (formData.role === "student" || formData.role === "teacher") {
      fetchSchools()
    }
  }, [formData.role])

  useEffect(() => {
    if (formData.school_id && (formData.role === "student" || formData.role === "teacher")) {
      fetchClasses()
    }
  }, [formData.school_id, formData.role])

  const fetchSchools = async () => {
    try {
      const response = await fetch("/api/schools")
      if (response.ok) {
        const data = await response.json()
        setSchools(data)
      }
    } catch (error) {
      console.error("Error fetching schools:", error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/classes?school_id=${formData.school_id}`)
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const validateRussianName = (name: string): boolean => {
    // Check if name contains only Cyrillic letters, spaces, and hyphens
    const russianNameRegex = /^[А-Яа-яЁё\s-]+$/
    return russianNameRegex.test(name.trim()) && name.trim().length >= 2
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, name: value })

    if (value && !validateRussianName(value)) {
      setError("Имя должно содержать только русские буквы")
    } else {
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate Russian name
    if (!validateRussianName(formData.name)) {
      setError("Пожалуйста, введите корректное имя на русском языке")
      setLoading(false)
      return
    }

    try {
      if (formData.role === "director") {
        // Create user first
        const userResponse = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            school_id: null,
            class_id: null,
            grade: null,
          }),
        })

        const userData = await userResponse.json()

        if (!userResponse.ok) {
          throw new Error(userData.error || "Registration failed")
        }

        const user = userData

        // Then create school with director_id
        const schoolResponse = await fetch("/api/schools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.school_name,
            address: formData.school_address,
            total_classes: Number.parseInt(formData.total_classes),
            director_id: user.id,
          }),
        })

        if (!schoolResponse.ok) {
          throw new Error("Failed to create school")
        }

        const school = await schoolResponse.json()

        // Update user with school_id
        await fetch("/api/users", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            school_id: school.id,
          }),
        })

        // Store user data with school info
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            school_id: school.id,
            school_name: school.name,
          }),
        )

        router.push("/dashboard/director")
      } else {
        // Regular registration for students and teachers
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          school_id: formData.school_id ? Number.parseInt(formData.school_id) : null,
          class_id: formData.class_id ? Number.parseInt(formData.class_id) : null,
          grade: formData.grade || null,
        }

        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.error || "Registration failed")
        }

        const user = responseData

        localStorage.setItem("user", JSON.stringify(user))

        // Redirect based on role
        if (formData.role === "student") {
          router.push("/dashboard/student")
        } else if (formData.role === "teacher") {
          router.push("/dashboard/teacher")
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getRoleTitle = () => {
    switch (formData.role) {
      case "student":
        return "Регистрация ученика"
      case "teacher":
        return "Регистрация учителя"
      case "director":
        return "Регистрация директора"
      default:
        return "Создайте свой аккаунт"
    }
  }

  const getRoleColor = () => {
    switch (formData.role) {
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
          <CardDescription>
            {formData.role === "director"
              ? "Создайте школу и начните экологическую программу"
              : "Присоединяйтесь к экологическому движению в вашей школе"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
                {error.includes("уже зарегистрирован") && (
                  <div className="mt-2">
                    <Link href="/auth/login-choice" className="text-red-600 hover:text-red-800 underline">
                      Войти в существующий аккаунт
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Полное имя (на русском языке)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван Иванович Иванов"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={`pl-10 ${!validateRussianName(formData.name) && formData.name ? "border-red-500" : ""}`}
                  required
                />
              </div>
              {formData.name && !validateRussianName(formData.name) && (
                <p className="text-sm text-red-600">Используйте только русские буквы</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Электронная почта</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Создайте пароль (минимум 6 символов)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pr-10"
                  minLength={6}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {formData.role === "director" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="school_name">Название школы</Label>
                  <Input
                    id="school_name"
                    type="text"
                    placeholder="Введите название школы"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_address">Адрес школы</Label>
                  <Textarea
                    id="school_address"
                    placeholder="Введите адрес ш��олы"
                    value={formData.school_address}
                    onChange={(e) => setFormData({ ...formData, school_address: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_classes">Количество классов</Label>
                  <Input
                    id="total_classes"
                    type="number"
                    placeholder="Введите количество классов"
                    value={formData.total_classes}
                    onChange={(e) => setFormData({ ...formData, total_classes: e.target.value })}
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="school">Выберите школу</Label>
                  <Select
                    value={formData.school_id}
                    onValueChange={(value) => setFormData({ ...formData, school_id: value, class_id: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вашу школу" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{school.name}</div>
                              {school.director_name && (
                                <div className="text-xs text-gray-500">Директор: {school.director_name}</div>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.school_id && (
                  <div className="space-y-2">
                    <Label htmlFor="class">
                      {formData.role === "teacher"
                        ? "Выберите класс для руководства"
                        : "Выберите класс (необязательно)"}
                    </Label>
                    <Select
                      value={formData.class_id}
                      onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.role === "teacher" ? "Класс для руководства" : "Выберите ваш класс или пропустите"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {classes
                          .filter((classItem) => formData.role === "student" || !classItem.teacher_name)
                          .map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id.toString()}>
                              <div>
                                <div className="font-medium">{classItem.name}</div>
                                {classItem.teacher_name ? (
                                  <div className="text-xs text-gray-500">Кл. рук.: {classItem.teacher_name}</div>
                                ) : formData.role === "teacher" ? (
                                  <div className="text-xs text-green-600">Нужен классный руководитель</div>
                                ) : null}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.role === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="grade">Класс (параллель)</Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => setFormData({ ...formData, grade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ваш класс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 класс</SelectItem>
                        <SelectItem value="7">7 класс</SelectItem>
                        <SelectItem value="8">8 класс</SelectItem>
                        <SelectItem value="9">9 класс</SelectItem>
                        <SelectItem value="10">10 класс</SelectItem>
                        <SelectItem value="11">11 класс</SelectItem>
                        <SelectItem value="12">12 класс</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <Button
              type="submit"
              className={`w-full ${
                formData.role === "director"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : formData.role === "teacher"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading || (formData.name && !validateRussianName(formData.name))}
            >
              {loading ? "Создание аккаунта..." : "Создать аккаунт"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login-choice" className="text-blue-600 hover:underline">
                Войти
              </Link>
            </p>
          </div>

          <div className="mt-4">
            <Link
              href="/auth/register-choice"
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

export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  )
}
