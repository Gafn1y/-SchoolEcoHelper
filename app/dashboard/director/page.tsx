"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building, Users, GraduationCap, Plus, Mail, Star, Trophy, ChevronDown } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  school_name?: string
}

interface School {
  id: number
  name: string
  address: string
  director_id: number
}

interface Class {
  id: number
  name: string
  grade: string
  school_id: number
  student_count: number
  teacher_name?: string
  teacher_email?: string
}

interface Teacher {
  id: number
  name: string
  email: string
  points: number
  level: number
  created_at: string
  is_homeroom_teacher: boolean
  class_id?: number
  class_name?: string
  grade?: string
  student_count: number
}

interface TeacherInvite {
  id: number
  email: string
  invite_code: string
  status: string
  class_name: string
  created_at: string
  expires_at: string
}

interface SchoolStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalPoints: number
}

export default function DirectorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [teacherInvites, setTeacherInvites] = useState<TeacherInvite[]>([])
  const [stats, setStats] = useState<SchoolStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalPoints: 0,
  })

  // Form states
  const [newClassName, setNewClassName] = useState("")
  const [newClassGrade, setNewClassGrade] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedClassId, setSelectedClassId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSchoolSelector, setShowSchoolSelector] = useState(false)

  // New school form
  const [showCreateSchool, setShowCreateSchool] = useState(false)
  const [newSchoolData, setNewSchoolData] = useState({
    name: "",
    address: "",
    total_classes: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchDirectorSchools(parsedUser.id)
    }
  }, [])

  const fetchDirectorSchools = async (directorId: number) => {
    try {
      const response = await fetch(`/api/schools?director_id=${directorId}`)
      if (response.ok) {
        const schoolsData = await response.json()
        setSchools(schoolsData)

        if (schoolsData.length === 1) {
          // If only one school, select it automatically
          setSelectedSchool(schoolsData[0])
          await fetchSchoolData(schoolsData[0].id)
        } else if (schoolsData.length > 1) {
          // If multiple schools, show selector
          setShowSchoolSelector(true)
        }
      }
    } catch (error) {
      console.error("Error fetching schools:", error)
      setError("Ошибка при загрузке школ")
    }
  }

  const fetchSchoolData = async (schoolId: number) => {
    try {
      await fetchClasses(schoolId)
      await fetchTeachers(schoolId)
      await fetchTeacherInvites(schoolId)
      await fetchSchoolStats(schoolId)
    } catch (error) {
      console.error("Error fetching school data:", error)
      setError("Ошибка при загрузке данных школы")
    }
  }

  const fetchClasses = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/classes?school_id=${schoolId}`)
      if (response.ok) {
        const classesData = await response.json()
        setClasses(classesData)
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
    }
  }

  const fetchTeachers = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/teachers?school_id=${schoolId}`)
      if (response.ok) {
        const teachersData = await response.json()
        setTeachers(teachersData)
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
    }
  }

  const fetchTeacherInvites = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/teacher-invites?school_id=${schoolId}`)
      if (response.ok) {
        const invitesData = await response.json()
        setTeacherInvites(invitesData)
      }
    } catch (error) {
      console.error("Error fetching teacher invites:", error)
    }
  }

  const fetchSchoolStats = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/stats`)
      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching school stats:", error)
    }
  }

  const handleSchoolSelect = async (school: School) => {
    setSelectedSchool(school)
    setShowSchoolSelector(false)
    await fetchSchoolData(school.id)
  }

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newSchoolData.name || !newSchoolData.total_classes) return

    setLoading(true)
    try {
      const response = await fetch("/api/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSchoolData.name,
          address: newSchoolData.address,
          total_classes: Number.parseInt(newSchoolData.total_classes),
          director_id: user.id,
        }),
      })

      if (response.ok) {
        const newSchool = await response.json()
        setNewSchoolData({ name: "", address: "", total_classes: "" })
        setShowCreateSchool(false)

        // Refresh schools list and select the new school
        await fetchDirectorSchools(user.id)
        setSelectedSchool(newSchool)
        await fetchSchoolData(newSchool.id)

        alert("Школа успешно создана!")
      } else {
        throw new Error("Failed to create school")
      }
    } catch (error) {
      console.error("Error creating school:", error)
      setError("Ошибка при создании школы")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSchool || !newClassName || !newClassGrade) return

    setLoading(true)
    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClassName,
          grade: newClassGrade,
          school_id: selectedSchool.id,
        }),
      })

      if (response.ok) {
        setNewClassName("")
        setNewClassGrade("")
        await fetchClasses(selectedSchool.id)
        await fetchSchoolStats(selectedSchool.id)
        alert("Класс успешно создан!")
      } else {
        throw new Error("Failed to create class")
      }
    } catch (error) {
      console.error("Error creating class:", error)
      setError("Ошибка при создании класса")
    } finally {
      setLoading(false)
    }
  }

  const handleInviteTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSchool || !inviteEmail || !selectedClassId) return

    setLoading(true)
    try {
      const response = await fetch("/api/teacher-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: selectedSchool.id,
          class_id: Number.parseInt(selectedClassId),
          email: inviteEmail,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setInviteEmail("")
        setSelectedClassId("")
        await fetchTeacherInvites(selectedSchool.id)
        alert(`Приглашение отправлено! Код приглашения: ${result.invite_code}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to send invite")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      setError(`Ошибка при отправке приглашения: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает"
      case "accepted":
        return "Принято"
      case "expired":
        return "Истекло"
      default:
        return status
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Show school selector if multiple schools or no school selected
  if (showSchoolSelector || (!selectedSchool && schools.length > 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl border-0 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl">
                <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-gray-600 font-medium">Панель директора</p>
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-800">Выберите школу для управления</CardTitle>
            <CardDescription className="text-gray-600">
              У вас есть доступ к управлению несколькими школами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {schools.map((school) => (
              <Card
                key={school.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-gradient-to-r from-white to-gray-50"
                onClick={() => handleSchoolSelect(school)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800">{school.name}</h3>
                      {school.address && <p className="text-gray-600 mt-1">{school.address}</p>}
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Building className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-6 border-t">
              <Button
                onClick={() => setShowCreateSchool(true)}
                className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-3" />
                Создать новую школу
              </Button>
            </div>

            {showCreateSchool && (
              <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Создать новую школу</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateSchool} className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName" className="font-medium">
                        Название школы
                      </Label>
                      <Input
                        id="schoolName"
                        value={newSchoolData.name}
                        onChange={(e) => setNewSchoolData({ ...newSchoolData, name: e.target.value })}
                        placeholder="Введите название школы"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolAddress" className="font-medium">
                        Адрес школы
                      </Label>
                      <Input
                        id="schoolAddress"
                        value={newSchoolData.address}
                        onChange={(e) => setNewSchoolData({ ...newSchoolData, address: e.target.value })}
                        placeholder="Введите адрес школы"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalClasses" className="font-medium">
                        Количество классов
                      </Label>
                      <Input
                        id="totalClasses"
                        type="number"
                        value={newSchoolData.total_classes}
                        onChange={(e) => setNewSchoolData({ ...newSchoolData, total_classes: e.target.value })}
                        placeholder="Введите количество классов"
                        className="mt-1"
                        min="1"
                        required
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                      >
                        {loading ? "Создание..." : "Создать школу"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateSchool(false)}>
                        Отмена
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show message if no schools exist
  if (schools.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-0 shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl">
                <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-gray-600 font-medium">Панель директора</p>
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-800">Создайте свою первую школу</CardTitle>
            <CardDescription className="text-gray-600">Для начала работы необходимо создать школу</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <Label htmlFor="schoolName" className="font-medium">
                  Название школы
                </Label>
                <Input
                  id="schoolName"
                  value={newSchoolData.name}
                  onChange={(e) => setNewSchoolData({ ...newSchoolData, name: e.target.value })}
                  placeholder="Введите название школы"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="schoolAddress" className="font-medium">
                  Адрес школы
                </Label>
                <Input
                  id="schoolAddress"
                  value={newSchoolData.address}
                  onChange={(e) => setNewSchoolData({ ...newSchoolData, address: e.target.value })}
                  placeholder="Введите адрес школы"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="totalClasses" className="font-medium">
                  Количество классов
                </Label>
                <Input
                  id="totalClasses"
                  type="number"
                  value={newSchoolData.total_classes}
                  onChange={(e) => setNewSchoolData({ ...newSchoolData, total_classes: e.target.value })}
                  placeholder="Введите количество классов"
                  className="mt-1"
                  min="1"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 mt-6"
              >
                {loading ? "Создание..." : "Создать школу"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl">
                <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-gray-600 font-medium">Панель директора</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {schools.length > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setShowSchoolSelector(true)}
                  className="flex items-center gap-2 border-2 border-purple-200 hover:border-purple-300"
                >
                  <Building className="h-4 w-4" />
                  {selectedSchool?.name}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500">Добро пожаловать,</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                {selectedSchool && <p className="text-sm text-gray-500">{selectedSchool.name}</p>}
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full border-2 border-purple-200">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-purple-800">Директор</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm">Всего учеников</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.totalStudents}</p>
                  <p className="text-blue-500 text-xs">Активных учеников</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium text-sm">Учителей</p>
                  <p className="text-3xl font-bold text-green-700">{stats.totalTeachers}</p>
                  <p className="text-green-500 text-xs">Классных руководителей</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium text-sm">Классов</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.totalClasses}</p>
                  <p className="text-purple-500 text-xs">Активных классов</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 font-medium text-sm">Очки школы</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.totalPoints}</p>
                  <p className="text-yellow-500 text-xs">Общие очки школы</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="bg-white shadow-lg border-0 p-1 rounded-xl">
            <TabsTrigger
              value="classes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Классы ({stats.totalClasses})
            </TabsTrigger>
            <TabsTrigger
              value="teachers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Учителя ({stats.totalTeachers})
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Обзор школы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Create Class Form */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-blue-700">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                    Создать новый класс
                  </CardTitle>
                  <CardDescription className="text-blue-600">Добавьте новый класс в вашу школу</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleCreateClass} className="space-y-4">
                    <div>
                      <Label htmlFor="className" className="font-medium">
                        Название класса
                      </Label>
                      <Input
                        id="className"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="например: 5А"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="classGrade" className="font-medium">
                        Параллель
                      </Label>
                      <Input
                        id="classGrade"
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        placeholder="например: 5"
                        className="mt-1"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                    >
                      {loading ? "Создание..." : "Создать класс"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Invite Teacher Form */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-green-700">
                    <div className="p-2 bg-green-200 rounded-lg">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    Пригласить учителя
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Отправьте приглашение классному руководителю
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleInviteTeacher} className="space-y-4">
                    <div>
                      <Label htmlFor="inviteEmail" className="font-medium">
                        Email учителя
                      </Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="teacher@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="classSelect" className="font-medium">
                        Класс
                      </Label>
                      <select
                        id="classSelect"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-white"
                        required
                      >
                        <option value="">Выберите класс</option>
                        {classes
                          .filter((c) => !c.teacher_name)
                          .map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name} ({cls.grade} класс)
                            </option>
                          ))}
                      </select>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                    >
                      {loading ? "Отправка..." : "Отправить приглашение"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Classes List */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-indigo-700">Классы школы</CardTitle>
                <CardDescription className="text-indigo-600">
                  Список всех классов и их классных руководителей
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {classes.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Building className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Нет созданных классов</p>
                    <p className="text-gray-500">Создайте первый класс для начала работы</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div
                        key={cls.id}
                        className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="p-3 bg-blue-100 rounded-full">
                          <Building className="h-6 w-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{cls.name}</h3>
                          <p className="text-gray-600">{cls.grade} класс</p>
                          {cls.teacher_name ? (
                            <p className="text-green-600 font-medium">Классный руководитель: {cls.teacher_name}</p>
                          ) : (
                            <p className="text-orange-600 font-medium">Нет классного руководителя</p>
                          )}
                        </div>

                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-500" />
                            <span className="font-bold text-lg text-gray-800">{cls.student_count} учеников</span>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-0">
                            {cls.grade} класс
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            {/* Active Teachers */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  Активные учителя
                </CardTitle>
                <CardDescription className="text-green-600">
                  Учителя, которые уже присоединились к школе
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {teachers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <GraduationCap className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Нет активных учителей</p>
                    <p className="text-gray-500">Отправьте приглашения учителям</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50 transition-all duration-200 hover:shadow-lg"
                      >
                        <Avatar className="h-14 w-14 border-3 border-green-200">
                          <AvatarFallback className="bg-gradient-to-br from-green-100 to-teal-100 text-green-700 font-bold text-lg">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-gray-800">{teacher.name}</h3>
                            {teacher.is_homeroom_teacher && (
                              <Badge className="bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-0">
                                Классный руководитель
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-1">{teacher.email}</p>
                          {teacher.class_name && (
                            <p className="text-blue-600 font-medium">
                              Класс: {teacher.class_name} ({teacher.grade} класс)
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Присоединился: {new Date(teacher.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">{teacher.student_count} учеников</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span className="text-gray-700">{teacher.points} очков</span>
                          </div>
                          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                            Уровень {teacher.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Teacher Invites */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-orange-700">
                  <div className="p-2 bg-orange-200 rounded-lg">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                  Приглашения учителей
                </CardTitle>
                <CardDescription className="text-orange-600">Отправленные приглашения и их статус</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {teacherInvites.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Mail className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Нет отправленных приглашений</p>
                    <p className="text-gray-500">Отправьте первое приглашение учителю</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teacherInvites.map((invite) => (
                      <div
                        key={invite.id}
                        className="flex items-center gap-6 p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Mail className="h-6 w-6 text-orange-600" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{invite.email}</h3>
                          <p className="text-gray-600 mb-1">Класс: {invite.class_name}</p>
                          <p className="text-sm text-gray-500">
                            Отправлено: {new Date(invite.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Истекает: {new Date(invite.expires_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right space-y-2">
                          <Badge className={`${getStatusColor(invite.status)} border-0 font-medium`}>
                            {getStatusText(invite.status)}
                          </Badge>
                          <p className="text-sm text-gray-500">Код: {invite.invite_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-purple-700">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <Trophy className="h-6 w-6 text-purple-600" />
                  </div>
                  Обзор школы
                </CardTitle>
                <CardDescription className="text-purple-600">Общая статистика и аналитика школы</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-10 w-10 text-purple-600" />
                  </div>
                  <p className="text-gray-600 text-lg mb-2">Подробная аналитика школы</p>
                  <p className="text-gray-500">Функция в разработке</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
