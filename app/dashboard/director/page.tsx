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
    return <div>Loading...</div>
  }

  // Show school selector if multiple schools or no school selected
  if (showSchoolSelector || (!selectedSchool && schools.length > 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-purple-900">EcoSchool</h1>
                <p className="text-sm text-gray-600">Панель директора</p>
              </div>
            </div>
            <CardTitle>Выберите школу для управления</CardTitle>
            <CardDescription>У вас есть доступ к управлению несколькими школами</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schools.map((school) => (
              <Card
                key={school.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-purple-200"
                onClick={() => handleSchoolSelect(school)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{school.name}</h3>
                      {school.address && <p className="text-sm text-gray-600">{school.address}</p>}
                    </div>
                    <Building className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="pt-4 border-t">
              <Button onClick={() => setShowCreateSchool(true)} className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Создать новую школу
              </Button>
            </div>

            {showCreateSchool && (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Создать новую школу</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateSchool} className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName">Название школы</Label>
                      <Input
                        id="schoolName"
                        value={newSchoolData.name}
                        onChange={(e) => setNewSchoolData({ ...newSchoolData, name: e.target.value })}
                        placeholder="Введите название школы"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolAddress">Адрес школы</Label>
                      <Input
                        id="schoolAddress"
                        value={newSchoolData.address}
                        onChange={(e) => setNewSchoolData({ ...newSchoolData, address: e.target.value })}
                        placeholder="Введите адрес школы"
                      />
                    </div>
                    <div>
                      <Label htmlFor="totalClasses">Количество классов</Label>
                      <Input
                        id="totalClasses"
                        type="number"
                        value={newSchoolData.total_classes}
                        onChange={(e) => setNewSchoolData({ ...newSchoolData, total_classes: e.target.value })}
                        placeholder="Введите количество классов"
                        min="1"
                        required
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading}>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-purple-900">EcoSchool</h1>
                <p className="text-sm text-gray-600">Панель директора</p>
              </div>
            </div>
            <CardTitle>Создайте свою первую школу</CardTitle>
            <CardDescription>Для начала работы необходимо создать школу</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div>
                <Label htmlFor="schoolName">Название школы</Label>
                <Input
                  id="schoolName"
                  value={newSchoolData.name}
                  onChange={(e) => setNewSchoolData({ ...newSchoolData, name: e.target.value })}
                  placeholder="Введите название школы"
                  required
                />
              </div>
              <div>
                <Label htmlFor="schoolAddress">Адрес школы</Label>
                <Input
                  id="schoolAddress"
                  value={newSchoolData.address}
                  onChange={(e) => setNewSchoolData({ ...newSchoolData, address: e.target.value })}
                  placeholder="Введите адрес школы"
                />
              </div>
              <div>
                <Label htmlFor="totalClasses">Количество классов</Label>
                <Input
                  id="totalClasses"
                  type="number"
                  value={newSchoolData.total_classes}
                  onChange={(e) => setNewSchoolData({ ...newSchoolData, total_classes: e.target.value })}
                  placeholder="Введите количество классов"
                  min="1"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Создание..." : "Создать школу"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-purple-900">EcoSchool</h1>
              <p className="text-sm text-gray-600">Панель директора</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {schools.length > 1 && (
              <Button variant="outline" onClick={() => setShowSchoolSelector(true)} className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {selectedSchool?.name}
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
            <div className="text-right">
              <p className="text-sm text-gray-600">Добро пожаловать,</p>
              <p className="font-semibold">{user.name}</p>
              {selectedSchool && <p className="text-xs text-gray-500">{selectedSchool.name}</p>}
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-1 rounded-full">
              <Building className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-800">Директор</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего учеников</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Активных учеников</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Учителей</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Классных руководителей</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Классов</CardTitle>
              <Building className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">Активных классов</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Очки школы</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPoints}</div>
              <p className="text-xs text-muted-foreground">Общие очки школы</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">Классы ({stats.totalClasses})</TabsTrigger>
            <TabsTrigger value="teachers">Учителя ({stats.totalTeachers})</TabsTrigger>
            <TabsTrigger value="overview">Обзор школы</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Create Class Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Создать новый класс
                  </CardTitle>
                  <CardDescription>Добавьте новый класс в вашу школу</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateClass} className="space-y-4">
                    <div>
                      <Label htmlFor="className">Название класса</Label>
                      <Input
                        id="className"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="например: 5А"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="classGrade">Параллель</Label>
                      <Input
                        id="classGrade"
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        placeholder="например: 5"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Создание..." : "Создать класс"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Invite Teacher Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Пригласить учителя
                  </CardTitle>
                  <CardDescription>Отправьте приглашение классному руководителю</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteTeacher} className="space-y-4">
                    <div>
                      <Label htmlFor="inviteEmail">Email учителя</Label>
                      <Input
                        id="inviteEmail"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="teacher@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="classSelect">Класс</Label>
                      <select
                        id="classSelect"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
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
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? "Отправка..." : "Отправить приглашение"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Classes List */}
            <Card>
              <CardHeader>
                <CardTitle>Классы школы</CardTitle>
                <CardDescription>Список всех классов и их классных руководителей</CardDescription>
              </CardHeader>
              <CardContent>
                {classes.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Нет созданных классов</p>
                    <p className="text-sm text-gray-400">Создайте п��рвый класс для начала работы</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-sm text-gray-600">{cls.grade} класс</p>
                          {cls.teacher_name ? (
                            <p className="text-sm text-green-600">Классный руководитель: {cls.teacher_name}</p>
                          ) : (
                            <p className="text-sm text-orange-600">Нет классного руководителя</p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="font-semibold">{cls.student_count} учеников</span>
                          </div>
                          <Badge variant="outline">{cls.grade} класс</Badge>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Активные учителя
                </CardTitle>
                <CardDescription>Учителя, которые уже присоединились к школе</CardDescription>
              </CardHeader>
              <CardContent>
                {teachers.length === 0 ? (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Нет активных учителей</p>
                    <p className="text-sm text-gray-400">Отправьте приглашения учителям</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teachers.map((teacher) => (
                      <div key={teacher.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <Avatar>
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{teacher.name}</h3>
                            {teacher.is_homeroom_teacher && (
                              <Badge className="bg-green-100 text-green-800">Классный руководитель</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{teacher.email}</p>
                          {teacher.class_name && (
                            <p className="text-sm text-blue-600">
                              Класс: {teacher.class_name} ({teacher.grade} класс)
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Присоединился: {new Date(teacher.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{teacher.student_count} учеников</span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{teacher.points} очков</span>
                          </div>
                          <Badge variant="outline">Уровень {teacher.level}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Teacher Invites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-600" />
                  Приглашения учителей
                </CardTitle>
                <CardDescription>Отправленные приглашения и их статус</CardDescription>
              </CardHeader>
              <CardContent>
                {teacherInvites.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Нет отправленных приглашений</p>
                    <p className="text-sm text-gray-400">Отправьте первое приглашение учителю</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teacherInvites.map((invite) => (
                      <div key={invite.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Mail className="h-5 w-5 text-orange-600" />
                        </div>

                        <div className="flex-1">
                          <h3 className="font-semibold">{invite.email}</h3>
                          <p className="text-sm text-gray-600">Класс: {invite.class_name}</p>
                          <p className="text-xs text-gray-500">
                            Отправлено: {new Date(invite.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Истекает: {new Date(invite.expires_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <Badge className={getStatusColor(invite.status)}>{getStatusText(invite.status)}</Badge>
                          <p className="text-xs text-gray-500 mt-1">Код: {invite.invite_code}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Обзор школы</CardTitle>
                <CardDescription>Общая статистика и аналитика школы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Подробная аналитика школы</p>
                  <p className="text-sm text-gray-400">Функция в разработке</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
