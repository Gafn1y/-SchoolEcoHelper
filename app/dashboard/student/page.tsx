"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Trophy,
  Leaf,
  Users,
  Star,
  TrendingUp,
  Award,
  Building,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  BookOpen,
  Target,
  MapPin,
  AlertCircle,
  GamepadIcon,
  Play,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Student {
  id: number
  name: string
  email: string
  role: string
  school_id?: number
  class_id?: number
  grade?: string
  points: number
  level: number
}

interface School {
  id: number
  name: string
  address?: string
  phone?: string
  website?: string
  description?: string
  total_classes: number
  director_name?: string
  director_email?: string
  created_at: string
}

interface Class {
  id: number
  name: string
  grade: string
  student_count: number
  capacity?: number
  teacher_name?: string
  teacher_email?: string
  students: Student[]
  created_at: string
  total_points?: number
}

interface ClassInfo {
  user: Student
  school: School | null
  class: Class | null
  classmates: Student[]
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<Student | null>(null)
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchClassInfo(parsedUser.id)
  }, [router])

  const fetchClassInfo = async (userId: number) => {
    try {
      const response = await fetch(`/api/class-info?user_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        // Calculate total class points
        if (data.class && data.class.students) {
          const totalPoints = data.class.students.reduce(
            (sum: number, student: Student) => sum + (student.points || 0),
            0,
          )
          data.class.total_points = totalPoints
        }
        setClassInfo(data)
      } else {
        setError("Failed to load class information")
      }
    } catch (error) {
      console.error("Error fetching class info:", error)
      setError("Failed to load class information")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string | undefined | null): string => {
    if (!name || typeof name !== "string") return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getLevelProgress = (points: number): number => {
    const pointsForNextLevel = (user?.level || 1) * 100
    const pointsInCurrentLevel = points % 100
    return (pointsInCurrentLevel / pointsForNextLevel) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-green-500 rounded-xl">
                <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-gray-600 font-medium">Панель ученика</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-500">Добро пожаловать,</p>
                </div>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-green-100 px-4 py-2 rounded-full border-2 border-blue-200">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-blue-800">Ученик</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("user")
                  router.push("/")
                }}
                className="border-2 border-gray-200 hover:border-gray-300"
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 font-medium text-sm">Мои очки</p>
                  <p className="text-3xl font-bold text-yellow-700">{user.points}</p>
                  <p className="text-yellow-500 text-xs">Уровень {user.level}</p>
                </div>
                <div className="p-3 bg-yellow-200 rounded-full">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <Progress value={getLevelProgress(user.points)} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm">Мой класс</p>
                  <p className="text-3xl font-bold text-blue-700">{classInfo?.class?.name || "Не назначен"}</p>
                  <p className="text-blue-500 text-xs">
                    {classInfo?.class?.grade ? `${classInfo.class.grade} класс` : "Класс не выбран"}
                  </p>
                </div>
                <div className="p-3 bg-blue-200 rounded-full">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 font-medium text-sm">Моя школа</p>
                  <p className="text-3xl font-bold text-green-700">{classInfo?.school?.name || "Не назначена"}</p>
                  <p className="text-green-500 text-xs">
                    {classInfo?.school?.total_classes ? `${classInfo.school.total_classes} классов` : ""}
                  </p>
                </div>
                <div className="p-3 bg-green-200 rounded-full">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 font-medium text-sm">Очки класса</p>
                  <p className="text-3xl font-bold text-purple-700">{classInfo?.class?.total_points || 0}</p>
                  <p className="text-purple-500 text-xs">Общие очки</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-full">
                  <Trophy className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white shadow-lg border-0 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Обзор
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-teal-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Мои действия
            </TabsTrigger>
            <TabsTrigger
              value="learning"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Обучение
            </TabsTrigger>
            <TabsTrigger
              value="school"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-400 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Информация о школе
            </TabsTrigger>
            <TabsTrigger
              value="class"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium"
            >
              Информация о классе
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  Быстрые действия
                </CardTitle>
                <CardDescription className="text-green-600">Выберите экологическое действие для записи</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 hover:shadow-lg transition-all duration-200"
                    onClick={() => router.push("/actions/log")}
                  >
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">Записать действие</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                    onClick={() => router.push("/challenges")}
                  >
                    <Target className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Челленджи</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-200"
                    onClick={() => router.push("/leaderboard")}
                  >
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    <span className="text-sm font-medium">Рейтинг</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200"
                    onClick={() => router.push("/badges")}
                  >
                    <Award className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">Значки</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Actions Tab */}
          <TabsContent value="actions">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-green-700">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  Мои экологические действия
                </CardTitle>
                <CardDescription className="text-green-600">История ваших действий и достижений</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Leaf className="h-10 w-10 text-green-600" />
                  </div>
                  <p className="text-gray-600 text-lg mb-4">У вас пока нет записанных действий</p>
                  <Button
                    onClick={() => router.push("/actions/log")}
                    className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                  >
                    Записать первое действие
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-purple-700">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  Обучение и игры
                </CardTitle>
                <CardDescription className="text-purple-600">
                  Изучайте экологию через интерактивные материалы и игры
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Waste Sorting Learning */}
                  <Card className="border-2 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <div className="text-2xl">🗂️</div>
                        Сортировка мусора
                      </CardTitle>
                      <CardDescription>
                        Изучите основы правильной сортировки отходов и поиграйте в интерактивную игру
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          <span>Видео урок</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GamepadIcon className="h-4 w-4" />
                          <span>Интерактивная игра</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0"
                          onClick={() => router.push("/learning/waste-sorting")}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Начать обучение
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-2 border-green-200 hover:border-green-300 bg-white"
                          onClick={() => router.push("/learning/waste-sorting/game")}
                        >
                          <GamepadIcon className="h-4 w-4 mr-2" />
                          Играть сразу
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Coming Soon Cards */}
                  <Card className="border-2 border-gray-200 opacity-75 bg-gradient-to-br from-gray-50 to-gray-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-600">
                        <div className="text-2xl">🌱</div>
                        Экосистемы
                      </CardTitle>
                      <CardDescription>Изучение различных экосистем и их взаимосвязей (скоро)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button disabled className="w-full">
                        Скоро доступно
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200 opacity-75 bg-gradient-to-br from-gray-50 to-gray-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-600">
                        <div className="text-2xl">💧</div>
                        Водные ресурсы
                      </CardTitle>
                      <CardDescription>Изучение важности воды и способов её сохранения (скоро)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button disabled className="w-full">
                        Скоро доступно
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-gray-200 opacity-75 bg-gradient-to-br from-gray-50 to-gray-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-gray-600">
                        <div className="text-2xl">🌍</div>
                        Изменение климата
                      </CardTitle>
                      <CardDescription>Понимание причин и последствий изменения климата (скоро)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button disabled className="w-full">
                        Скоро доступно
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* School Info Tab */}
          <TabsContent value="school">
            <div className="space-y-6">
              {classInfo?.school ? (
                <>
                  {/* School Details */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-indigo-700">
                        <div className="p-2 bg-indigo-200 rounded-lg">
                          <Building className="h-6 w-6 text-indigo-600" />
                        </div>
                        {classInfo.school.name}
                      </CardTitle>
                      <CardDescription className="text-indigo-600">Информация о вашей школе</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {classInfo.school.address && (
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                              <MapPin className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="font-medium">Адрес</p>
                                <p className="text-gray-600">{classInfo.school.address}</p>
                              </div>
                            </div>
                          )}

                          {classInfo.school.phone && (
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                              <Phone className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="font-medium">Телефон</p>
                                <p className="text-gray-600">{classInfo.school.phone}</p>
                              </div>
                            </div>
                          )}

                          {classInfo.school.website && (
                            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                              <Globe className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="font-medium">Веб-сайт</p>
                                <a
                                  href={classInfo.school.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {classInfo.school.website}
                                </a>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                            <Users className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium">Количество классов</p>
                              <p className="text-gray-600">{classInfo.school.total_classes}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium text-lg mb-3">О школе</h4>
                          <p className="text-gray-700 leading-relaxed">
                            {classInfo.school.description ||
                              "Наша школа активно участвует в экологических программах и стремится воспитать экологически ответственное поколение."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Director Info */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-purple-700">
                        <div className="p-2 bg-purple-200 rounded-lg">
                          <Building className="h-6 w-6 text-purple-600" />
                        </div>
                        Директор школы
                      </CardTitle>
                      <CardDescription className="text-purple-600">Информация о руководстве школы</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                        <div className="flex items-start gap-6">
                          <Avatar className="h-16 w-16 border-3 border-purple-200">
                            <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 font-bold text-xl">
                              {getInitials(classInfo.school.director_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {classInfo.school.director_name || "Не назначен"}
                            </h3>
                            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block mb-4">
                              <span className="font-medium">Директор школы</span>
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              Руководит экологическими программами школы и поддерживает инициативы учеников по охране
                              окружающей среды.
                            </p>
                            {classInfo.school.director_email && (
                              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <span className="text-gray-700">{classInfo.school.director_email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="border-0 shadow-xl">
                  <CardContent className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Building className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">Информация о школе недоступна</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Class Info Tab */}
          <TabsContent value="class">
            <div className="space-y-6">
              {classInfo?.class ? (
                <>
                  {/* Class Details */}
                  <Card className="border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                      <CardTitle className="flex items-center gap-3 text-cyan-700">
                        <div className="p-2 bg-cyan-200 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-cyan-600" />
                        </div>
                        {classInfo.class.name}
                      </CardTitle>
                      <CardDescription className="text-cyan-600">Информация о вашем классе</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                            <div className="text-2xl font-bold text-blue-700">{classInfo.class.grade}</div>
                            <div className="text-blue-600 font-medium">Класс</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                            <div className="text-2xl font-bold text-green-700">{classInfo.class.student_count}</div>
                            <div className="text-green-600 font-medium">Учеников</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                            <div className="text-2xl font-bold text-purple-700">{classInfo.class.capacity || 30}</div>
                            <div className="text-purple-600 font-medium">Вместимость</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                            <div className="text-2xl font-bold text-yellow-700">
                              {classInfo.class.total_points || 0}
                            </div>
                            <div className="text-yellow-600 font-medium">Очки класса</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium text-lg">Статистика класса</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                              <Trophy className="h-4 w-4 text-yellow-500" />
                              <span>Участие в рейтинге</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                              <Star className="h-4 w-4 text-blue-500" />
                              <span>Сбор эко-очков</span>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                              <Award className="h-4 w-4 text-green-500" />
                              <span>Достижения</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Teacher Info */}
                  {classInfo.class.teacher_name && (
                    <Card className="border-0 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-green-700">
                          <div className="p-2 bg-green-200 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-green-600" />
                          </div>
                          Классный руководитель
                        </CardTitle>
                        <CardDescription className="text-green-600">
                          Информация о вашем классном руководителе
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
                          <div className="flex items-start gap-6">
                            <Avatar className="h-16 w-16 border-3 border-green-200">
                              <AvatarFallback className="bg-gradient-to-br from-green-100 to-teal-100 text-green-700 font-bold text-xl">
                                {getInitials(classInfo.class.teacher_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{classInfo.class.teacher_name}</h3>
                              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full inline-block mb-4">
                                <span className="font-medium">Классный руководитель</span>
                              </div>
                              <p className="text-gray-700 mb-4 leading-relaxed">
                                Координирует экологические активности класса, помогает ученикам в достижении целей и
                                поддерживает их инициативы.
                              </p>
                              {classInfo.class.teacher_email && (
                                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                                  <Mail className="w-5 h-5 text-gray-500" />
                                  <span className="text-gray-700">{classInfo.class.teacher_email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card className="border-0 shadow-xl">
                  <CardContent className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <GraduationCap className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg">Вы не назначены в класс</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
