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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка панели учителя...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-green-900">EcoSchool</h1>
              <p className="text-sm text-gray-600">Панель учителя</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Добро пожаловать,</p>
              <p className="font-semibold">{user.name}</p>
              {school && <p className="text-xs text-gray-500">{school.name}</p>}
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Award className="w-4 h-4 mr-1" />
              Классный руководитель
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Учеников</p>
                  <p className="text-2xl font-bold">{classData?.student_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">На проверке</p>
                  <p className="text-2xl font-bold">{stats.pendingActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Подтверждено</p>
                  <p className="text-2xl font-bold">{stats.approvedActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Очки класса</p>
                  <p className="text-2xl font-bold">{stats.totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Ожидают проверки ({stats.pendingActions})</TabsTrigger>
            <TabsTrigger value="students">Ученики ({students.length})</TabsTrigger>
            <TabsTrigger value="school">Школа</TabsTrigger>
            <TabsTrigger value="class">Класс</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Действия на проверке
                </CardTitle>
                <CardDescription>Подтвердите или отклоните эко-действия учеников</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingActions.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Нет действий на проверке</p>
                    <p className="text-sm text-gray-400">Все действия учеников проверены</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingActions.map((action) => {
                      const IconComponent = getIconComponent(action.icon)
                      return (
                        <div key={action.id} className="border rounded-lg p-4 bg-orange-50">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <IconComponent className="h-5 w-5 text-blue-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{action.action_name}</h3>
                                <Badge variant="outline">{action.student_name}</Badge>
                              </div>

                              <p className="text-sm text-gray-600 mb-2">
                                Количество: {action.quantity} {action.unit}
                              </p>

                              {action.description && (
                                <p className="text-sm text-gray-600 mb-2">Описание: {action.description}</p>
                              )}

                              <p className="text-xs text-gray-500">Отправлено: {formatDateTime(action.created_at)}</p>
                            </div>

                            <div className="text-right">
                              <Badge className="bg-blue-100 text-blue-800 mb-3">+{action.points_earned} очков</Badge>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                  onClick={() => handleActionReview(action.id, "rejected")}
                                  disabled={actionLoading}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Отклонить
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleActionReview(action.id, "approved")}
                                  disabled={actionLoading}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Мои ученики ({students.length})
                  </span>
                  <Button size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    Выдать значки
                  </Button>
                </CardTitle>
                <CardDescription>Управление учениками вашего класса</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name || "Неизвестный ученик"}</h4>
                          <p className="text-sm text-gray-600">{student.email || "Email не указан"}</p>
                          <p className="text-xs text-gray-500">Присоединился: {formatDate(student.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{student.points || 0} очков</span>
                          </div>
                          <Badge variant="outline">Уровень {student.level || 1}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {students.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Нет учеников в классе</p>
                      <p className="text-sm text-gray-500">Ученики появятся здесь после регистрации</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Информация о школе
                </CardTitle>
                <CardDescription>Подробная информация о вашей школе</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {school ? (
                  <>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{school.name}</h3>
                      <p className="text-gray-600 mb-4">
                        {school.description ||
                          "Наша школа активно участвует в экологических программах и поощряет учеников к заботе об окружающей среде. Мы стремимся воспитать экологически ответственное поколение."}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{school.address}</span>
                        </div>
                        {school.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{school.phone}</span>
                          </div>
                        )}
                        {school.website && (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              {school.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{school.total_classes || 0} классов</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-lg mb-4">Директор школы</h4>
                      <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {getInitials(school.director_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg">{school.director_name}</h5>
                          <p className="text-purple-600 font-medium mb-2">Директор школы</p>
                          <p className="text-sm text-gray-600 mb-3">
                            Руководит экологическими программами школы и поддерживает инициативы по охране окружающей
                            среды. Отвечает за развитие экологического сознания учащихся.
                          </p>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{school.director_email}</span>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">Руководство</Badge>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Информация о школе недоступна</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="class">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Информация о классе
                </CardTitle>
                <CardDescription>Подробная информация о вашем классе</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {classData ? (
                  <>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{classData.name}</h3>
                      <p className="text-gray-600 text-lg mb-4">{classData.grade} класс</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">{classData.student_count}</p>
                          <p className="text-sm text-gray-600">Учеников</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Star className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">{stats.totalPoints}</p>
                          <p className="text-sm text-gray-600">Очков класса</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-yellow-600">{stats.approvedActions}</p>
                          <p className="text-sm text-gray-600">Достижений</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">О вашем классе</h4>
                        <p className="text-gray-700">
                          Вы являетесь классным руководителем {classData.name}. В вашем классе {classData.student_count}{" "}
                          учеников, которые активно участвуют в экологических мероприятиях школы. Ваша задача -
                          направлять и поддерживать их в изучении экологии и формировании ответственного отношения к
                          окружающей среде.
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-lg mb-4">Классный руководитель</h4>
                      <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h5 className="font-semibold text-lg">{user.name}</h5>
                          <p className="text-green-600 font-medium mb-2">Классный руководитель</p>
                          <p className="text-sm text-gray-600 mb-3">
                            Как классный руководитель, вы направляете учеников в их экологическом путешествии, выдаете
                            значки за достижения и помогаете развивать экологическое сознание через различные
                            мероприятия и вызовы.
                          </p>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Учитель</Badge>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-lg mb-4">Быстрые действия</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button className="justify-start h-12" size="lg">
                          <Award className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Выдать значки</div>
                            <div className="text-xs opacity-80">Наградить учеников</div>
                          </div>
                        </Button>
                        <Button className="justify-start h-12 bg-transparent" size="lg" variant="outline">
                          <TrendingUp className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Прогресс класса</div>
                            <div className="text-xs opacity-80">Статистика и аналитика</div>
                          </div>
                        </Button>
                        <Button className="justify-start h-12 bg-transparent" size="lg" variant="outline">
                          <Calendar className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Планировать активности</div>
                            <div className="text-xs opacity-80">Создать мероприятия</div>
                          </div>
                        </Button>
                        <Button className="justify-start h-12 bg-transparent" size="lg" variant="outline">
                          <CheckCircle className="w-5 h-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Проверить работы</div>
                            <div className="text-xs opacity-80">Оценить действия</div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Информация о классе недоступна</p>
                    <p className="text-sm text-gray-400">Возможно, вы еще не назначены классным руководителем</p>
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
