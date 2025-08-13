"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  Activity,
  LogOut,
  Eye,
  Star,
  Building,
  GraduationCap,
  AlertCircle,
  BookOpen,
  MapPin,
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

interface Student {
  id: number
  name: string
  email: string
  points: number
  level: number
  grade?: string
  created_at: string
}

interface PendingAction {
  id: number
  user_id: number
  student_name: string
  action_name: string
  description?: string
  points_earned: number
  photo_url?: string
  created_at: string
  status: string
  action_icon?: string
}

interface ClassActivity {
  id: number
  student_name: string
  action_name: string
  points_earned: number
  created_at: string
  status: string
  action_icon?: string
}

interface TeacherStats {
  total_students: number
  total_class_points: number
  pending_actions: number
  approved_actions: number
  average_student_points: number
}

interface ClassInfo {
  id: number
  name: string
  grade: string
  school_id: number
  teacher_id?: number
  student_count: number
  created_at: string
  teacher_name?: string
  teacher_email?: string
  school_name?: string
  school_address?: string
}

interface SchoolInfo {
  id: number
  name: string
  address?: string
  director_id?: number
  total_classes: number
  created_at: string
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const [classActivity, setClassActivity] = useState<ClassActivity[]>([])
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null)
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [stats, setStats] = useState<TeacherStats>({
    total_students: 0,
    total_class_points: 0,
    pending_actions: 0,
    approved_actions: 0,
    average_student_points: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login-choice")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "teacher") {
        router.push("/auth/login-choice")
        return
      }
      setUser(parsedUser)

      fetchAllData(parsedUser.id)
    } catch (error) {
      console.error("Error parsing user data:", error)
      setError("Ошибка загрузки данных пользователя")
      setLoading(false)
    }
  }, [router])

  const fetchAllData = async (teacherId: number) => {
    try {
      await Promise.all([
        fetchStudents(teacherId),
        fetchPendingActions(teacherId),
        fetchClassActivity(teacherId),
        fetchTeacherStats(teacherId),
        fetchClassInfo(teacherId),
        fetchSchoolInfo(teacherId),
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Ошибка загрузки данных")
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/users?teacher_id=${teacherId}&role=student`)
      if (response.ok) {
        const data = await response.json()
        setStudents(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch students")
        setStudents([])
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      setStudents([])
    }
  }

  const fetchPendingActions = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/teacher/actions?teacher_id=${teacherId}&status=pending`)
      if (response.ok) {
        const data = await response.json()
        setPendingActions(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch pending actions")
        setPendingActions([])
      }
    } catch (error) {
      console.error("Error fetching pending actions:", error)
      setPendingActions([])
    }
  }

  const fetchClassActivity = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/teacher/actions?teacher_id=${teacherId}&status=approved&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setClassActivity(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch class activity")
        setClassActivity([])
      }
    } catch (error) {
      console.error("Error fetching class activity:", error)
      setClassActivity([])
    }
  }

  const fetchTeacherStats = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/teacher/stats?teacher_id=${teacherId}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error("Failed to fetch teacher stats")
      }
    } catch (error) {
      console.error("Error fetching teacher stats:", error)
    }
  }

  const fetchClassInfo = async (teacherId: number) => {
    try {
      // Get current teacher info first
      const teacherResponse = await fetch(`/api/users?id=${teacherId}`)
      if (teacherResponse.ok) {
        const teacherData = await teacherResponse.json()
        console.log("Teacher data:", teacherData) // Debug log

        if (teacherData && teacherData.class_id) {
          const classResponse = await fetch(`/api/classes/${teacherData.class_id}`)
          if (classResponse.ok) {
            const data = await classResponse.json()
            console.log("Class data:", data) // Debug log
            setClassInfo(data.class)
          } else {
            console.error("Failed to fetch class details")
          }
        } else {
          console.log("Teacher has no class assigned")
        }
      } else {
        console.error("Failed to fetch teacher info")
      }
    } catch (error) {
      console.error("Error fetching class info:", error)
    }
  }

  const fetchSchoolInfo = async (teacherId: number) => {
    try {
      // Get teacher's school_id from user data first
      const teacherResponse = await fetch(`/api/users?id=${teacherId}`)
      if (teacherResponse.ok) {
        const teacherData = await teacherResponse.json()
        console.log("Teacher data for school:", teacherData) // Debug log

        if (teacherData && teacherData.school_id) {
          const response = await fetch(`/api/schools?director_id=${teacherData.school_id}`)
          if (response.ok) {
            const data = await response.json()
            console.log("School data:", data) // Debug log
            if (Array.isArray(data) && data.length > 0) {
              setSchoolInfo(data[0])
            } else {
              // Try alternative approach - get school by ID
              const schoolResponse = await fetch(`/api/schools`)
              if (schoolResponse.ok) {
                const allSchools = await schoolResponse.json()
                const school = allSchools.find((s: any) => s.id === teacherData.school_id)
                if (school) {
                  setSchoolInfo(school)
                }
              }
            }
          } else {
            console.error("Failed to fetch school info")
          }
        } else {
          console.log("Teacher has no school assigned")
        }
      }
    } catch (error) {
      console.error("Error fetching school info:", error)
    }
  }

  const handleActionReview = async (actionId: number, status: "approved" | "rejected") => {
    try {
      const response = await fetch(`/api/teacher/actions`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action_id: actionId,
          teacher_id: user?.id,
          status,
        }),
      })

      if (response.ok) {
        // Remove the action from pending list
        setPendingActions((prev) => prev.filter((action) => action.id !== actionId))

        // Refresh stats and activity
        if (user?.id) {
          fetchTeacherStats(user.id)
          fetchClassActivity(user.id)
          fetchStudents(user.id)
        }
      } else {
        console.error("Failed to update action status")
      }
    } catch (error) {
      console.error("Error updating action status:", error)
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
                <p className="text-sm text-gray-600">Панель учителя</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{schoolInfo?.name || user.school_name || "Школа не назначена"}</p>
                {classInfo && <p className="text-xs text-gray-500">Классный руководитель {classInfo.name}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Class Assignment Alert */}
        {!user.class_id && (
          <Alert className="mb-8 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Вы не назначены классным руководителем. Обратитесь к директору школы для назначения класса.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Учеников</p>
                  <p className="text-3xl font-bold">{stats.total_students}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Очки класса</p>
                  <p className="text-3xl font-bold">{stats.total_class_points}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">На проверке</p>
                  <p className="text-3xl font-bold">{pendingActions.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Одобрено</p>
                  <p className="text-3xl font-bold">{stats.approved_actions}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Средний балл</p>
                  <p className="text-3xl font-bold">{Math.round(stats.average_student_points)}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-purple-200">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              На проверке
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Ученики
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              Активность
            </TabsTrigger>
            <TabsTrigger
              value="class"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              О классе
            </TabsTrigger>
            <TabsTrigger
              value="school"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              О школе
            </TabsTrigger>
            <TabsTrigger
              value="awards"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Награды
            </TabsTrigger>
          </TabsList>

          {/* Pending Actions Tab */}
          <TabsContent value="pending" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Действия на проверке</h2>
              <Badge className="bg-orange-100 text-orange-800 border border-orange-300">
                {pendingActions.length} ожидают проверки
              </Badge>
            </div>

            {pendingActions.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Все действия проверены</h3>
                  <p className="text-gray-500">Новые действия учеников появятся здесь для проверки</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <Card key={action.id} className="bg-white/80 backdrop-blur-sm border-orange-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gradient-to-br from-purple-100 to-blue-100 text-purple-700">
                                {getInitials(action.student_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{action.student_name}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(action.created_at).toLocaleDateString("ru-RU")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{action.action_icon || "🌱"}</span>
                            <h4 className="font-semibold text-purple-800 text-lg">{action.action_name}</h4>
                          </div>
                          {action.description && <p className="text-gray-600 mb-2">{action.description}</p>}
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800 border border-green-300">
                              +{action.points_earned} очков
                            </Badge>
                            <Badge variant="outline" className="border-orange-300 text-orange-700">
                              <Clock className="h-3 w-3 mr-1" />
                              Ожидает проверки
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleActionReview(action.id, "approved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Одобрить
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleActionReview(action.id, "rejected")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Отклонить
                          </Button>
                        </div>
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
              <h2 className="text-2xl font-bold text-gray-900">Мои ученики</h2>
              {classInfo && (
                <Badge className="bg-blue-100 text-blue-800 border border-blue-300">{classInfo.name}</Badge>
              )}
            </div>

            {students.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Нет учеников в классе</h3>
                  <p className="text-gray-500">Ученики появятся здесь после регистрации в вашем классе</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student, index) => (
                  <Card key={student.id} className="bg-white/80 backdrop-blur-sm border-blue-200">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg text-blue-800">{student.name}</CardTitle>
                          <CardDescription>
                            {student.grade && `${student.grade} • `}
                            Уровень {student.level}
                          </CardDescription>
                        </div>
                        {index < 3 && <div className="text-2xl">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</div>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Очки:</span>
                          <Badge className="bg-blue-100 text-blue-800">{student.points}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="text-sm text-gray-500">{student.email}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Регистрация:</span>
                          <span className="text-sm text-gray-500">
                            {new Date(student.created_at).toLocaleDateString("ru-RU")}
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

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Активность класса</h2>
              <Badge className="bg-green-100 text-green-800 border border-green-300">Последние действия</Badge>
            </div>

            {classActivity.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Пока нет активности</h3>
                  <p className="text-gray-500">Действия учеников будут отображаться здесь</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {classActivity.map((activity) => (
                  <Card key={activity.id} className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{activity.action_icon || "🌱"}</span>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-green-100 to-teal-100 text-green-700">
                              {getInitials(activity.student_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{activity.student_name}</p>
                            <p className="text-sm text-gray-600">{activity.action_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-800">Одобрено</Badge>
                          <div className="text-right">
                            <p className="font-bold text-green-600">+{activity.points_earned}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Class Info Tab */}
          <TabsContent value="class" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Информация о классе</h2>
              <Badge className="bg-cyan-100 text-cyan-800 border border-cyan-300">
                <GraduationCap className="h-4 w-4 mr-1" />
                Мой класс
              </Badge>
            </div>

            {!classInfo ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Класс не назначен</h3>
                  <p className="text-gray-500">Обратитесь к директору для назначения класса</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-cyan-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-800">
                      <GraduationCap className="h-6 w-6" />
                      Основная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Название класса:</span>
                      <span className="font-semibold text-gray-900">{classInfo.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Параллель:</span>
                      <span className="font-semibold text-gray-900">{classInfo.grade}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Количество учеников:</span>
                      <span className="font-semibold text-gray-900">{stats.total_students}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Общие очки класса:</span>
                      <Badge className="bg-blue-100 text-blue-800">{stats.total_class_points}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Средний балл:</span>
                      <Badge className="bg-green-100 text-green-800">{stats.average_student_points}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Дата создания:</span>
                      <span className="text-sm text-gray-500">
                        {new Date(classInfo.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-cyan-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-800">
                      <Award className="h-6 w-6" />
                      Достижения класса
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Система достижений в разработке</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* School Info Tab */}
          <TabsContent value="school" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Информация о школе</h2>
              <Badge className="bg-pink-100 text-pink-800 border border-pink-300">
                <Building className="h-4 w-4 mr-1" />
                Моя школа
              </Badge>
            </div>

            {!schoolInfo ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Информация о школе недоступна</h3>
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
                      <span className="text-gray-600">Название школы:</span>
                      <span className="font-semibold text-gray-900">{schoolInfo.name}</span>
                    </div>
                    {schoolInfo.address && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Адрес:</span>
                        <span className="font-semibold text-gray-900 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {schoolInfo.address}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Всего классов:</span>
                      <span className="font-semibold text-gray-900">{schoolInfo.total_classes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Дата основания:</span>
                      <span className="text-sm text-gray-500">
                        {new Date(schoolInfo.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                
              </div>
            )}
          </TabsContent>

          {/* Awards Tab */}
          <TabsContent value="awards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Система наград</h2>
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">Скоро доступно</Badge>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Система наград в разработке</h3>
                <p className="text-gray-500 mb-6">Скоро вы сможете награждать учеников значками за достижения</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-3xl mb-2">🏆</div>
                    <p className="text-sm text-gray-600">Лидер класса</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">🌱</div>
                    <p className="text-sm text-gray-600">Эко-воин</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">♻️</div>
                    <p className="text-sm text-gray-600">Сортировщик</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-sm text-gray-600">Активист</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
