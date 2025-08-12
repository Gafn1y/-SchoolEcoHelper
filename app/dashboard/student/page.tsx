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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">EcoSchool</h1>
                <p className="text-sm text-gray-600">Панель ученика</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("user")
                  router.push("/")
                }}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="actions">Мои действия</TabsTrigger>
            <TabsTrigger value="learning">Обучение</TabsTrigger>
            <TabsTrigger value="school">Информация о школе</TabsTrigger>
            <TabsTrigger value="class">Информация о классе</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Stats */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Мои очки</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{user.points}</div>
                  <p className="text-xs text-muted-foreground">Уровень {user.level}</p>
                  <Progress value={getLevelProgress(user.points)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Мой класс</CardTitle>
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{classInfo?.class?.name || "Не назначен"}</div>
                  <p className="text-xs text-muted-foreground">
                    {classInfo?.class?.grade ? `${classInfo.class.grade} класс` : "Класс не выбран"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Моя школа</CardTitle>
                  <Building className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{classInfo?.school?.name || "Не назначена"}</div>
                  <p className="text-xs text-muted-foreground">
                    {classInfo?.school?.total_classes ? `${classInfo.school.total_classes} классов` : ""}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Быстрые действия
                </CardTitle>
                <CardDescription>Выберите экологическое действие для записи</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => router.push("/actions/log")}
                  >
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Записать действие</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => router.push("/challenges")}
                  >
                    <Target className="h-6 w-6 text-blue-600" />
                    <span className="text-sm">Челленджи</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => router.push("/leaderboard")}
                  >
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    <span className="text-sm">Рейтинг</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => router.push("/badges")}
                  >
                    <Award className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Значки</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Actions Tab */}
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Мои экологические действия
                </CardTitle>
                <CardDescription>История ваших действий и достижений</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">У вас пока нет записанных действий</p>
                  <Button onClick={() => router.push("/actions/log")}>Записать первое действие</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Обучение и игры
                  </CardTitle>
                  <CardDescription>Изучайте экологию через интерактивные материалы и игры</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Waste Sorting Learning */}
                    <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
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
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => router.push("/learning/waste-sorting")}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Начать обучение
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/learning/waste-sorting/game")}
                          >
                            <GamepadIcon className="h-4 w-4 mr-2" />
                            Играть сразу
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Coming Soon Cards */}
                    <Card className="border-2 border-gray-200 opacity-75">
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

                    <Card className="border-2 border-gray-200 opacity-75">
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

                    <Card className="border-2 border-gray-200 opacity-75">
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
            </div>
          </TabsContent>

          {/* School Info Tab */}
          <TabsContent value="school">
            <div className="space-y-6">
              {classInfo?.school ? (
                <>
                  {/* School Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-green-600" />
                        {classInfo.school.name}
                      </CardTitle>
                      <CardDescription>Информация о вашей школе</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {classInfo.school.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Адрес</p>
                            <p className="text-gray-600">{classInfo.school.address}</p>
                          </div>
                        </div>
                      )}

                      {classInfo.school.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">Телефон</p>
                            <p className="text-gray-600">{classInfo.school.phone}</p>
                          </div>
                        </div>
                      )}

                      {classInfo.school.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-gray-500" />
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

                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium">О школе</p>
                          <p className="text-gray-600">
                            {classInfo.school.description ||
                              "Наша школа активно участвует в экологических программах и стремится воспитать экологически ответственное поколение."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Количество классов</p>
                          <p className="text-gray-600">{classInfo.school.total_classes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Director Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-purple-600" />
                        Директор школы
                      </CardTitle>
                      <CardDescription>Информация о руководстве школы</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-lg">
                            {getInitials(classInfo.school.director_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{classInfo.school.director_name || "Не назначен"}</h3>
                          <p className="text-gray-600 mb-2">Директор школы</p>
                          <p className="text-sm text-gray-500 mb-3">
                            Руководит экологическими программами школы и поддерживает инициативы учеников по охране
                            окружающей среды.
                          </p>
                          {classInfo.school.director_email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">{classInfo.school.director_email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Информация о школе недоступна</p>
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        {classInfo.class.name}
                      </CardTitle>
                      <CardDescription>Информация о вашем классе</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{classInfo.class.grade}</div>
                          <div className="text-sm text-gray-600">Класс</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{classInfo.class.student_count}</div>
                          <div className="text-sm text-gray-600">Учеников</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{classInfo.class.capacity || 30}</div>
                          <div className="text-sm text-gray-600">Вместимость</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">{classInfo.class.total_points || 0}</div>
                          <div className="text-sm text-gray-600">Очки класса</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Статистика класса</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span>Участие в рейтинге</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-blue-500" />
                            <span>Сбор эко-очков</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" />
                            <span>Достижения</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Teacher Info */}
                  {classInfo.class.teacher_name && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                          Классный руководитель
                        </CardTitle>
                        <CardDescription>Информация о вашем классном руководителе</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                              {getInitials(classInfo.class.teacher_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{classInfo.class.teacher_name}</h3>
                            <p className="text-gray-600 mb-2">Классный руководитель</p>
                            <p className="text-sm text-gray-500 mb-3">
                              Координирует экологические активности класса, помогает ученикам в достижении целей и
                              поддерживает их инициативы.
                            </p>
                            {classInfo.class.teacher_email && (
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">{classInfo.class.teacher_email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Вы не назначены в класс</p>
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
