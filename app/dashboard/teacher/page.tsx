"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Users,
  Award,
  TrendingUp,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  Globe,
  Clock,
  XCircle,
  Recycle,
  Building,
} from "lucide-react"

interface Student {
  id: number
  name: string
  email: string
  points: number
  level: number
  created_at: string
}

interface School {
  id: number
  name: string
  address: string
  phone?: string
  website?: string
  description?: string
  director_name: string
  director_email: string
  total_classes: number
  total_students: number
}

interface Class {
  id: number
  name: string
  grade: string
  student_count: number
  capacity: number
  teacher_name: string
  teacher_email: string
  students: Student[]
  created_at: string
}

interface ClassInfoResponse {
  user: {
    id: number
    name: string
    email: string
    role: string
    school_id: number
    class_id: number
    grade: string
    points: number
    level: number
  }
  school: School | null
  class: Class | null
  classmates: any[]
}

interface PendingAction {
  id: number
  action_name: string
  student_name: string
  quantity: number
  points_earned: number
  description?: string
  created_at: string
  icon: string
  unit: string
}

interface TeacherStats {
  totalStudents: number
  pendingActions: number
  approvedActions: number
  totalPoints: number
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

function getInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function TeacherDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [classInfoData, setClassInfoData] = useState<ClassInfoResponse | null>(null)
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    pendingActions: 0,
    approvedActions: 0,
    totalPoints: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchClassInfo(parsedUser.id)
      fetchPendingActions(parsedUser.id)
      fetchTeacherStats(parsedUser.id)
    } else {
      setError("User not found. Please log in again.")
      setLoading(false)
    }
  }, [])

  const fetchClassInfo = async (userId: number) => {
    try {
      const response = await fetch(`/api/class-info?user_id=${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setClassInfoData(data)
    } catch (error) {
      console.error("Error fetching class info:", error)
      setError("Failed to load class information")
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingActions = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/teacher/actions?teacher_id=${teacherId}`)
      if (response.ok) {
        const actions = await response.json()
        setPendingActions(actions)
      }
    } catch (error) {
      console.error("Error fetching pending actions:", error)
    }
  }

  const fetchTeacherStats = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/teacher/stats?teacher_id=${teacherId}`)
      if (response.ok) {
        const teacherStats = await response.json()
        setStats(teacherStats)
      }
    } catch (error) {
      console.error("Error fetching teacher stats:", error)
    }
  }

  const handleActionReview = async (actionId: number, status: "approved" | "rejected") => {
    if (!user) return

    setActionLoading(true)
    try {
      const response = await fetch("/api/teacher/actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action_id: actionId,
          teacher_id: user.id,
          status,
        }),
      })

      if (response.ok) {
        await fetchPendingActions(user.id)
        await fetchTeacherStats(user.id)
        const actionName = pendingActions.find((a) => a.id === actionId)?.action_name
        alert(`Действие "${actionName}" ${status === "approved" ? "подтверждено" : "отклонено"}!`)
      } else {
        throw new Error("Failed to review action")
      }
    } catch (error) {
      console.error("Error reviewing action:", error)
      alert("Ошибка при обработке действия")
    } finally {
      setActionLoading(false)
    }
  }

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case "Recycle":
        return Recycle
      case "Trash2":
        return Recycle
      case "Droplets":
        return Recycle
      default:
        return Recycle
    }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "Неизвестно"
    try {
      return new Date(dateString).toLocaleString("ru-RU")
    } catch {
      return "Неизвестно"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Неизвестно"
    try {
      return new Date(dateString).toLocaleDateString("ru-RU")
    } catch {
      return "Неизвестно"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка панели учителя...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Попробовать снова
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Пользователь не найден</p>
              <p className="text-sm text-gray-500">Пожалуйста, войдите в систему снова</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const school = classInfoData?.school
  const classData = classInfoData?.class
  const students = classData?.students || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl">
                <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-gray-600 font-medium">Панель учителя</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500">Добро пожаловать,</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                {school && <p className="text-sm text-gray-500">{school.name}</p>}
              </div>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full border-2 border-green-200">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="font-bold text-green-800">Классный ��уководитель</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm">Учеников</p>
                  <p className="text-3xl font-bold text-blue-700">{classData?.student_count || 0}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 font-medium text-sm">На проверке</p>
                  <p className="text-3xl font-bold text-orange-700">{stats.pendingActions}</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-full">
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium text-sm">Подтверждено</p>
                  <p className="text-3xl font-bold text-green-700">{stats.approvedActions}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 font-medium text-sm">Очки класса</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.totalPoints}</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-white shadow-lg border-0 p-1 rounded-xl">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Ожидают проверки ({stats.pendingActions})
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Ученики ({students.length})
            </TabsTrigger>
            <TabsTrigger
              value="school"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Школа
            </TabsTrigger>
            <TabsTrigger
              value="class"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Класс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-orange-700">
                  <div className="p-2 bg-orange-200 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  Действия на проверке
                </CardTitle>
                <CardDescription className="text-orange-600">
                  Подтвердите или отклоните эко-действия учеников
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {pendingActions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-gray-600 text-lg mb-2">Нет действий на проверке</p>
                    <p className="text-gray-500">Все действия учеников проверены</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingActions.map((action) => {
                      const IconComponent = getIconComponent(action.icon)
                      return (
                        <div
                          key={action.id}
                          className="border border-orange-200 rounded-xl p-6 bg-gradient-to-r from-orange-50 to-yellow-50 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-bold text-lg text-gray-800">{action.action_name}</h3>
                                <Badge className="bg-blue-100 text-blue-800 border-0">{action.student_name}</Badge>
                              </div>

                              <div className="space-y-2 mb-4">
                                <p className="text-gray-700">
                                  <span className="font-medium">Количество:</span> {action.quantity} {action.unit}
                                </p>
                                {action.description && (
                                  <p className="text-gray-700">
                                    <span className="font-medium">Описание:</span> {action.description}
                                  </p>
                                )}
                                <p className="text-sm text-gray-500">Отправлено: {formatDateTime(action.created_at)}</p>
                              </div>
                            </div>

                            <div className="text-right space-y-3">
                              <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-full">
                                <span className="font-bold text-blue-800">+{action.points_earned} очков</span>
                              </div>

                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-300 hover:bg-red-50 bg-white"
                                  onClick={() => handleActionReview(action.id, "rejected")}
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Отклонить
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0"
                                  onClick={() => handleActionReview(action.id, "approved")}
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Подтвердить
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-blue-700">
                    <div className="p-2 bg-blue-200 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    Мои ученики ({students.length})
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                    <Award className="w-4 h-4 mr-2" />
                    Выдать значки
                  </Button>
                </CardTitle>
                <CardDescription className="text-blue-600">Управление учениками вашего класса</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14 border-3 border-blue-200">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-lg">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">{student.name || "Неизвестный ученик"}</h4>
                          <p className="text-gray-600">{student.email || "Email не указан"}</p>
                          <p className="text-sm text-gray-500">Присоединился: {formatDate(student.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right space-y-2">
                          <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-lg text-gray-800">{student.points || 0} очков</span>
                          </div>
                          <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
                            Уровень {student.level || 1}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="text-center py-12">
                      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-lg">Нет учеников в классе</p>
                      <p className="text-gray-500">Ученики появятся здесь после регистрации</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="school">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-purple-700">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  Информация о школе
                </CardTitle>
                <CardDescription className="text-purple-600">Подробная информация о вашей школе</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {school ? (
                  <>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{school.name}</h3>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {school.description ||
                          "Наша школа активно участвует в экологических программах и поощряет учеников к заботе об окружающей среде. Мы стремимся воспитать экологически ответственное поколение."}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{school.address}</span>
                        </div>
                        {school.phone && (
                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{school.phone}</span>
                          </div>
                        )}
                        {school.website && (
                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <Globe className="w-5 h-5 text-gray-500" />
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {school.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                          <Building className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-700">{school.total_classes || 0} классов</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                      <h4 className="font-bold text-xl mb-6 text-purple-800">Директор школы</h4>
                      <div className="flex items-start space-x-6">
                        <Avatar className="h-16 w-16 border-3 border-purple-200">
                          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 font-bold text-xl">
                            {getInitials(school.director_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h5 className="font-bold text-xl text-gray-900 mb-2">{school.director_name}</h5>
                          <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block mb-4">
                            <span className="font-medium">Директор школы</span>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Руководит экологическими программами школы и поддерживает инициативы по охране окружающей
                            среды. Отвечает за развитие экологического сознания учащихся.
                          </p>
                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{school.director_email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">Информация о школе недоступна</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="class">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  Информация о классе
                </CardTitle>
                <CardDescription className="text-green-600">Подробная информация о вашем классе</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {classData ? (
                  <>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{classData.name}</h3>
                      <p className="text-gray-600 text-xl mb-6">{classData.grade} класс</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                          <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                          <p className="text-3xl font-bold text-blue-700">{classData.student_count}</p>
                          <p className="text-blue-600 font-medium">Учеников</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                          <Star className="h-10 w-10 text-green-600 mx-auto mb-3" />
                          <p className="text-3xl font-bold text-green-700">{stats.totalPoints}</p>
                          <p className="text-green-600 font-medium">Очков класса</p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                          <Award className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
                          <p className="text-3xl font-bold text-yellow-700">{stats.approvedActions}</p>
                          <p className="text-yellow-600 font-medium">Достижений</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl">
                        <h4 className="font-bold text-green-800 mb-3 text-lg">О вашем классе</h4>
                        <p className="text-gray-700 leading-relaxed">
                          Вы являетесь классным руководителем {classData.name}. В вашем классе {classData.student_count}{" "}
                          учеников, которые активно участвуют в экологических мероприятиях школы. Ваша задача -
                          направлять и поддерживать их в изучении экологии и формировании ответственного отношения к
                          окружающей среде.
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                      <h4 className="font-bold text-xl mb-6 text-green-800">Классный руководитель</h4>
                      <div className="flex items-start space-x-6">
                        <Avatar className="h-16 w-16 border-3 border-green-200">
                          <AvatarFallback className="bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 font-bold text-xl">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h5 className="font-bold text-xl text-gray-900 mb-2">{user.name}</h5>
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block mb-4">
                            <span className="font-medium">Классный руководитель</span>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            Как классный руководитель, вы направляете учеников в их экологическом путешествии, выдаете
                            значки за достижения и помогаете развивать экологическое сознание через различные
                            мероприятия и вызовы.
                          </p>
                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <Mail className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
                      <h4 className="font-bold text-xl mb-6 text-gray-800">Быстрые действия</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          className="justify-start h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                          size="lg"
                        >
                          <Award className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-bold">Выдать значки</div>
                            <div className="text-sm opacity-90">Наградить учеников</div>
                          </div>
                        </Button>
                        <Button
                          className="justify-start h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                          size="lg"
                        >
                          <TrendingUp className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-bold">Прогресс класса</div>
                            <div className="text-sm opacity-90">Статистика и аналитика</div>
                          </div>
                        </Button>
                        <Button
                          className="justify-start h-16 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                          size="lg"
                        >
                          <Calendar className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-bold">Планировать активности</div>
                            <div className="text-sm opacity-90">Создать мероприятия</div>
                          </div>
                        </Button>
                        <Button
                          className="justify-start h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
                          size="lg"
                        >
                          <CheckCircle className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-bold">Проверить работы</div>
                            <div className="text-sm opacity-90">Оценить действия</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">Информация о классе недоступна</p>
                    <p className="text-gray-500">Возможно, вы еще не назначены классным руководителем</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
