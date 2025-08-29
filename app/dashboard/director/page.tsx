"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  GraduationCap,
  TrendingUp,
  Building,
  LogOut,
  Plus,
  Eye,
  SchoolIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  role: string
  school_id: number
  class_id?: number
  grade?: string
  points: number
  level: number
  school_name?: string
  class_name?: string
}

interface School {
  id: number
  name: string
  address?: string
  director_id?: number
  created_at: string
}

interface Class {
  id: number
  name: string
  grade: string
  school_id: number
  teacher_id?: number
  student_count: number
  created_at: string
  teacher_name?: string
  teacher_email?: string
}

interface ClassDetails {
  class: Class & {
    school_name?: string
    school_address?: string
  }
  students: Array<{
    id: number
    name: string
    email: string
    points: number
    level: number
    grade?: string
    created_at: string
  }>
  activity: Array<{
    id: number
    student_name: string
    action_name: string
    action_icon?: string
    points_earned: number
    status: string
    created_at: string
  }>
  stats: {
    total_students: number
    total_points: number
    average_points: number
    pending_actions: number
    approved_actions: number
    rejected_actions: number
  }
}

interface SchoolStats {
  total_students: number
  total_teachers: number
  total_classes: number
  total_points: number
  pending_actions: number
  approved_actions: number
}

export default function DirectorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [stats, setStats] = useState<SchoolStats>({
    total_students: 0,
    total_teachers: 0,
    total_classes: 0,
    total_points: 0,
    pending_actions: 0,
    approved_actions: 0,
  })
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null)
  const [showClassDialog, setShowClassDialog] = useState(false)
  const [showCreateClassDialog, setShowCreateClassDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createClassLoading, setCreateClassLoading] = useState(false)
  const [createClassError, setCreateClassError] = useState<string | null>(null)
  const [createClassSuccess, setCreateClassSuccess] = useState<string | null>(null)

  // Create class form state
  const [newClass, setNewClass] = useState({
    name: "",
    grade: "",
    capacity: "30",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login-choice")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "director") {
        router.push("/auth/login-choice")
        return
      }
      setUser(parsedUser)
      fetchAllData(parsedUser.school_id)
    } catch (error) {
      console.error("Error parsing user data:", error)
      setError("Ошибка загрузки данных пользователя")
      setLoading(false)
    }
  }, [router])

  const fetchAllData = async (schoolId: number) => {
    try {
      await Promise.all([
        fetchSchool(schoolId),
        fetchClasses(schoolId),
        fetchTeachers(schoolId),
        fetchStudents(schoolId),
        fetchStats(schoolId),
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  const fetchSchool = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/schools?id=${schoolId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setSchool(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching school:", error)
    }
  }

  const fetchClasses = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/classes?school_id=${schoolId}`)
      if (response.ok) {
        const data = await response.json()
        setClasses(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching classes:", error)
      setClasses([])
    }
  }

  const fetchTeachers = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/users?role=teacher&school_id=${schoolId}`)
      if (response.ok) {
        const data = await response.json()
        setTeachers(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching teachers:", error)
      setTeachers([])
    }
  }

  const fetchStudents = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/users?role=student&school_id=${schoolId}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      setStudents([])
    }
  }

  const fetchStats = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchClassDetails = async (classId: number) => {
    try {
      const response = await fetch(`/api/classes/${classId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedClass(data)
        setShowClassDialog(true)
      }
    } catch (error) {
      console.error("Error fetching class details:", error)
    }
  }

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateClassLoading(true)
    setCreateClassError(null)
    setCreateClassSuccess(null)

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newClass.name,
          grade: newClass.grade,
          school_id: user?.school_id,
          capacity: Number.parseInt(newClass.capacity) || 30,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setCreateClassSuccess(`Класс "${newClass.name}" успешно создан!`)
        setNewClass({ name: "", grade: "", capacity: "30" })

        // Refresh classes list and stats
        if (user?.school_id) {
          await fetchClasses(user.school_id)
          await fetchStats(user.school_id)
        }

        // Close dialog after 2 seconds
        setTimeout(() => {
          setShowCreateClassDialog(false)
          setCreateClassSuccess(null)
        }, 2000)
      } else {
        setCreateClassError(data.error || "Ошибка при создании класса")
      }
    } catch (error) {
      console.error("Error creating class:", error)
      setCreateClassError("Ошибка сети. Попробуйте еще раз.")
    } finally {
      setCreateClassLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Ошибка загрузки данных"}</p>
          <Button onClick={() => router.push("/auth/login-choice")}>Вернуться к входу</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-sm text-gray-600">Панель директора</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{school?.name}</p>
                <p className="text-xs text-gray-500">Директор</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Классы</p>
                  <p className="text-3xl font-bold">{stats.total_classes}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Учителя</p>
                  <p className="text-3xl font-bold">{stats.total_teachers}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Ученики</p>
                  <p className="text-3xl font-bold">{stats.total_students}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Очки</p>
                  <p className="text-3xl font-bold">{stats.total_points}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <SchoolIcon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-purple-200">
            <TabsTrigger
              value="classes"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Классы
            </TabsTrigger>
            <TabsTrigger
              value="teachers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Учителя
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              Ученики
            </TabsTrigger>
            <TabsTrigger
              value="school"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Школа
            </TabsTrigger>
          </TabsList>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Классы школы</h2>
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                onClick={() => setShowCreateClassDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать класс
              </Button>
            </div>

            {classes.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет классов</h3>
                  <p className="text-gray-500 mb-4">Создайте первый класс для начала работы</p>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    onClick={() => setShowCreateClassDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Создать класс
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="bg-white/80 backdrop-blur-sm border-purple-200 hover:border-purple-300 transition-all cursor-pointer hover:shadow-lg"
                    onClick={() => fetchClassDetails(classItem.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-purple-800">{classItem.name}</CardTitle>
                          <CardDescription>{classItem.grade} класс</CardDescription>
                        </div>
                        <div className="text-2xl">🎓</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Учеников:</span>
                          <Badge className="bg-blue-100 text-blue-800">{classItem.student_count}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Создан:</span>
                          <span className="text-sm text-gray-500">
                            {new Date(classItem.created_at).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Учителя школы</h2>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                <Plus className="h-4 w-4 mr-2" />
                Пригласить учителя
              </Button>
            </div>

            {teachers.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет учителей</h3>
                  <p className="text-gray-500">Пригласите учителей для работы в школе</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.map((teacher) => (
                  <Card key={teacher.id} className="bg-white/80 backdrop-blur-sm border-blue-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-blue-800">{teacher.name}</CardTitle>
                          <CardDescription>{teacher.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Класс:</span>
                          <span className="text-sm text-gray-900">{teacher.class_name || "Не назначен"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Очки:</span>
                          <Badge className="bg-green-100 text-green-800">{teacher.points}</Badge>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Ученики школы</h2>
              <Badge className="bg-green-100 text-green-800 border border-green-300">Топ по очкам</Badge>
            </div>

            {students.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет учеников</h3>
                  <p className="text-gray-500">Ученики появятся после регистрации</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.slice(0, 12).map((student, index) => (
                  <Card key={student.id} className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-green-100 to-teal-100 text-green-700">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-green-800">{student.name}</CardTitle>
                          <CardDescription>
                            {student.class_name} • Уровень {student.level}
                          </CardDescription>
                        </div>
                        {index < 3 && <div className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Очки:</span>
                          <Badge className="bg-green-100 text-green-800">{student.points}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="text-sm text-gray-500">{student.email}</span>
                        </div>
                        <Button size="sm" variant="outline" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* School Tab */}
          <TabsContent value="school" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Информация о школе</h2>
              <Badge className="bg-pink-100 text-pink-800 border border-pink-300">
                <Building className="h-4 w-4 mr-1" />
                Моя школа
              </Badge>
            </div>

            {!school ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Информация недоступна</h3>
                  <p className="text-gray-500">Данные о школе загружаются...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-800">
                      <Building className="h-6 w-6" />
                      Основная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Название:</span>
                      <span className="font-semibold text-gray-900">{school.name}</span>
                    </div>
                    {school.address && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Адрес:</span>
                        <span className="font-semibold text-gray-900">{school.address}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Директор:</span>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Дата создания:</span>
                      <span className="text-sm text-gray-500">
                        {new Date(school.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-800">
                      <TrendingUp className="h-6 w-6" />
                      Статистика
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Всего классов:</span>
                      <Badge className="bg-purple-100 text-purple-800">{stats.total_classes}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Всего учителей:</span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.total_teachers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Всего учеников:</span>
                      <Badge className="bg-green-100 text-green-800">{stats.total_students}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Общие очки:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{stats.total_points}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Class Dialog */}
      <Dialog open={showCreateClassDialog} onOpenChange={setShowCreateClassDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Создать новый класс
            </DialogTitle>
            <DialogDescription>Заполните информацию о новом классе</DialogDescription>
          </DialogHeader>

          {createClassError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{createClassError}</AlertDescription>
            </Alert>
          )}

          {createClassSuccess && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{createClassSuccess}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleCreateClass} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-name">Название класса</Label>
              <Input
                id="class-name"
                type="text"
                placeholder="Например: 7А, 8Б, 9В"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class-grade">Параллель</Label>
              <Select value={newClass.grade} onValueChange={(value) => setNewClass({ ...newClass, grade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите параллель" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 класс</SelectItem>
                  <SelectItem value="7">7 класс</SelectItem>
                  <SelectItem value="8">8 класс</SelectItem>
                  <SelectItem value="9">9 класс</SelectItem>
                  <SelectItem value="10">10 класс</SelectItem>
                  <SelectItem value="11">11 класс</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class-capacity">Максимальное количество учеников</Label>
              <Input
                id="class-capacity"
                type="number"
                placeholder="30"
                min="10"
                max="40"
                value={newClass.capacity}
                onChange={(e) => setNewClass({ ...newClass, capacity: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setShowCreateClassDialog(false)
                  setCreateClassError(null)
                  setCreateClassSuccess(null)
                  setNewClass({ name: "", grade: "", capacity: "30" })
                }}
                disabled={createClassLoading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={createClassLoading || !newClass.name || !newClass.grade}
              >
                {createClassLoading ? "Создание..." : "Создать класс"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Class Details Dialog */}
      <Dialog open={showClassDialog} onOpenChange={setShowClassDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              {selectedClass?.class.name} - Подробная информация
            </DialogTitle>
            <DialogDescription>Полная информация о классе, учениках и активности</DialogDescription>
          </DialogHeader>

          {selectedClass && (
            <div className="space-y-6">
              {/* Class Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedClass.stats.total_students}</div>
                    <div className="text-sm text-gray-600">Учеников</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedClass.stats.total_points}</div>
                    <div className="text-sm text-gray-600">Очков</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedClass.stats.average_points}</div>
                    <div className="text-sm text-gray-600">Средний балл</div>
                  </CardContent>
                </Card>
              </div>

              {/* Class Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Информация о классе</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Учитель:</span>
                      <span className="ml-2 font-semibold">{selectedClass.class.teacher_name || "Не назначен"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Параллель:</span>
                      <span className="ml-2 font-semibold">{selectedClass.class.grade}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email учителя:</span>
                      <span className="ml-2 text-sm text-gray-500">{selectedClass.class.teacher_email || "—"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Дата создания:</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(selectedClass.class.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students List */}
              <Card>
                <CardHeader>
                  <CardTitle>Ученики класса</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClass.students.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">В классе пока нет учеников</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedClass.students.map((student, index) => (
                        <div key={student.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{student.name}</span>
                              {index < 3 && (
                                <span className="text-lg">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {student.points} очков • Уровень {student.level}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Последняя активность</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedClass.activity.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Пока нет активности</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedClass.activity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{activity.action_icon || "🌱"}</span>
                            <div>
                              <div className="font-semibold">{activity.student_name}</div>
                              <div className="text-sm text-gray-600">{activity.action_name}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                activity.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : activity.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {activity.status === "approved"
                                ? "Одобрено"
                                : activity.status === "pending"
                                  ? "На проверке"
                                  : "Отклонено"}
                            </Badge>
                            <span className="font-bold text-green-600">+{activity.points_earned}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
