"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Building, GraduationCap, Users, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface School {
  id: number
  name: string
  address?: string
}

interface Class {
  id: number
  name: string
  grade: string
  teacher_name?: string
}

export default function RegisterPage() {
  const [role, setRole] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
    schoolAddress: "",
    selectedSchool: "",
    selectedClass: "",
    grade: "",
  })
  const [schools, setSchools] = useState<School[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam && ["director", "teacher", "student"].includes(roleParam)) {
      setRole(roleParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (role === "student" || role === "teacher") {
      fetchSchools()
    }
  }, [role])

  useEffect(() => {
    if (formData.selectedSchool && role === "student") {
      fetchClasses(Number.parseInt(formData.selectedSchool))
    }
  }, [formData.selectedSchool, role])

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

  const fetchClasses = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/classes?school_id=${schoolId}`)
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const validateRussianName = (name: string) => {
    const russianNameRegex = /^[А-Яа-яЁё\s-]+$/
    return russianNameRegex.test(name.trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    if (!validateRussianName(formData.name)) {
      setError("Имя должно содержать только русские буквы")
      return
    }

    if (role === "director" && !validateRussianName(formData.schoolName)) {
      setError("Название школы должно содержать только русские буквы")
      return
    }

    if (role === "student" && (!formData.selectedSchool || !formData.selectedClass)) {
      setError("Выберите школу и класс")
      return
    }

    setLoading(true)

    try {
      let schoolId = null

      // Create school if director
      if (role === "director") {
        const schoolResponse = await fetch("/api/schools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.schoolName,
            address: formData.schoolAddress,
          }),
        })

        if (!schoolResponse.ok) {
          throw new Error("Failed to create school")
        }

        const school = await schoolResponse.json()
        schoolId = school.id
      } else if (role === "student") {
        schoolId = Number.parseInt(formData.selectedSchool)
      }

      // Create user
      const userResponse = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
          school_id: schoolId,
          class_id: role === "student" ? Number.parseInt(formData.selectedClass) : null,
          grade: role === "student" ? formData.grade : null,
        }),
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      const user = await userResponse.json()

      // Update school with director if director
      if (role === "director" && schoolId) {
        await fetch(`/api/schools/${schoolId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            director_id: user.id,
          }),
        })
      }

      // Store user data and redirect
      localStorage.setItem("user", JSON.stringify(user))

      // Redirect based on role
      switch (role) {
        case "director":
          router.push("/dashboard/director")
          break
        case "teacher":
          router.push("/dashboard/teacher")
          break
        case "student":
          router.push("/dashboard/student")
          break
        default:
          router.push("/")
      }
    } catch (error: any) {
      setError(error.message || "Ошибка регистрации")
    } finally {
      setLoading(false)
    }
  }

  const getRoleInfo = () => {
    switch (role) {
      case "director":
        return {
          icon: Building,
          title: "Регистрация директора",
          description: "Создайте аккаунт директора и зарегистрируйте свою школу",
          color: "purple",
        }
      case "teacher":
        return {
          icon: GraduationCap,
          title: "Регистрация учителя",
          description: "Создайте аккаунт учителя и присоединитесь к школе",
          color: "green",
        }
      case "student":
        return {
          icon: Users,
          title: "Регистрация ученика",
          description: "Создайте аккаунт ученика и присоединитесь к своему классу",
          color: "blue",
        }
      default:
        return null
    }
  }

  const roleInfo = getRoleInfo()

  if (!roleInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-bold mb-4">Неверная роль</h2>
            <Link href="/auth/register-choice">
              <Button>Выбрать роль</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo-new.png" alt="EcoSchool" className="h-16 w-16" />
            <h1 className="text-3xl font-bold text-blue-900">EcoSchool</h1>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 p-4 bg-${roleInfo.color}-100 rounded-full w-fit`}>
              <roleInfo.icon className={`h-12 w-12 text-${roleInfo.color}-600`} />
            </div>
            <CardTitle className="text-2xl">{roleInfo.title}</CardTitle>
            <CardDescription className="text-base">{roleInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Основная информация</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Полное имя *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Введите ваше полное имя"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Минимум 6 символов"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Повторите пароль"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              {role === "director" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Информация о школе</h3>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Название школы *</Label>
                    <Input
                      id="schoolName"
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, schoolName: e.target.value }))}
                      placeholder="Например: МБОУ СОШ №1"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolAddress">Адрес школы</Label>
                    <Textarea
                      id="schoolAddress"
                      value={formData.schoolAddress}
                      onChange={(e) => setFormData((prev) => ({ ...prev, schoolAddress: e.target.value }))}
                      placeholder="Введите адрес школы"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {role === "student" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Информация об обучении</h3>

                  <div className="space-y-2">
                    <Label htmlFor="school">Выберите школу *</Label>
                    <Select
                      value={formData.selectedSchool}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, selectedSchool: value, selectedClass: "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вашу школу" />
                      </SelectTrigger>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school.id} value={school.id.toString()}>
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.selectedSchool && (
                    <div className="space-y-2">
                      <Label htmlFor="class">Выберите класс *</Label>
                      <Select
                        value={formData.selectedClass}
                        onValueChange={(value) => {
                          const selectedClass = classes.find((c) => c.id.toString() === value)
                          setFormData((prev) => ({
                            ...prev,
                            selectedClass: value,
                            grade: selectedClass?.grade || "",
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите ваш класс" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((classItem) => (
                            <SelectItem key={classItem.id} value={classItem.id.toString()}>
                              {classItem.name} ({classItem.grade} класс)
                              {classItem.teacher_name && ` - ${classItem.teacher_name}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <Link href="/auth/register-choice" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Назад
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className={`flex-1 bg-${roleInfo.color}-600 hover:bg-${roleInfo.color}-700`}
                  disabled={loading}
                >
                  {loading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login-choice" className="text-blue-600 hover:underline">
              Войти в систему
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
