"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Trophy, Target, Users, TrendingUp, Leaf, Award, Menu, LogOut } from "lucide-react"

interface ClassInfo {
  name: string
  total_points: number
  student_count: number
  teacher_name: string
  school_name: string
}

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  difficulty: string
  category: string
}

interface UserAction {
  id: number
  action_name: string
  points_earned: number
  created_at: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any | null>(null)
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [recentActions, setRecentActions] = useState<UserAction[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login-choice")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "student") {
      router.push("/auth/login-choice")
      return
    }

    setUser(parsedUser)
    fetchData(parsedUser.id)
  }, [router])

  const fetchData = async (userId: number) => {
    try {
      const [classResponse, challengesResponse, actionsResponse] = await Promise.all([
        fetch("/api/class-info"),
        fetch("/api/challenges"),
        fetch(`/api/user-actions?userId=${userId}`),
      ])

      if (classResponse.ok) {
        const classData = await classResponse.json()
        setClassInfo(classData)
      }

      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json()
        setChallenges(challengesData.slice(0, 6))
      }

      if (actionsResponse.ok) {
        const actionsData = await actionsResponse.json()
        setRecentActions(actionsData.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Mobile Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 lg:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-600 text-white text-sm">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-gray-900 text-sm">{user.name}</h1>
              <p className="text-xs text-gray-600">{user.class_name}</p>
            </div>
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-600 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.class_name}</p>
                  </div>
                </div>

                <Link href="/actions/log" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Leaf className="h-4 w-4 mr-2" />
                    Записать действие
                  </Button>
                </Link>

                <Link href="/challenges" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Челленджи
                  </Button>
                </Link>

                <Link href="/leaderboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Trophy className="h-4 w-4 mr-2" />
                    Рейтинг
                  </Button>
                </Link>

                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать, {user.name}!</h1>
            <p className="text-gray-600 mt-1">
              {user.class_name} • {user.school_name}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/actions/log">
              <Button className="bg-green-600 hover:bg-green-700">
                <Leaf className="h-4 w-4 mr-2" />
                Записать действие
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        {/* Mobile Welcome */}
        <div className="lg:hidden mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Добро пожаловать!</h1>
          <p className="text-sm text-gray-600">{user.school_name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Мои баллы</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{user.points}</div>
              <p className="text-xs text-muted-foreground">+12 за последнюю неделю</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Баллы класса</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{classInfo?.total_points || 0}</div>
              <p className="text-xs text-muted-foreground">{classInfo?.student_count || 0} учеников</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активных челленджей</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{challenges.length}</div>
              <p className="text-xs text-muted-foreground">Доступно для участия</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Прогресс</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="challenges" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="challenges" className="text-xs sm:text-sm py-2">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Челленджи</span>
              <span className="sm:hidden">Цели</span>
            </TabsTrigger>
            <TabsTrigger value="actions" className="text-xs sm:text-sm py-2">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Мои действия</span>
              <span className="sm:hidden">Действия</span>
            </TabsTrigger>
            <TabsTrigger value="class" className="text-xs sm:text-sm py-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Мой класс</span>
              <span className="sm:hidden">Класс</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-xs sm:text-sm py-2">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Достижения</span>
              <span className="sm:hidden">Награды</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="challenges" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Доступные челленджи</h2>
              <Link href="/challenges">
                <Button variant="outline" size="sm">
                  Все челленджи
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                      <span className="text-sm font-semibold text-green-600">+{challenge.points} баллов</span>
                    </div>
                    <CardTitle className="text-base sm:text-lg">{challenge.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-4">{challenge.description}</CardDescription>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      Принять вызов
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Последние действия</h2>
              <Link href="/actions/log">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Leaf className="h-4 w-4 mr-2" />
                  Записать действие
                </Button>
              </Link>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentActions.length > 0 ? (
                recentActions.map((action) => (
                  <Card key={action.id} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base">{action.action_name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {new Date(action.created_at).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">+{action.points_earned} баллов</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <Leaf className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-600">У вас пока нет записанных эко-действий</p>
                    <Link href="/actions/log">
                      <Button className="mt-4 bg-green-600 hover:bg-green-700">Записать первое действие</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="class" className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Информация о классе</h2>
            {classInfo ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Общая информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Класс:</span>
                      <span className="font-semibold text-sm">{classInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Учитель:</span>
                      <span className="font-semibold text-sm">{classInfo.teacher_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Учеников:</span>
                      <span className="font-semibold text-sm">{classInfo.student_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Общие баллы:</span>
                      <span className="font-semibold text-sm text-green-600">{classInfo.total_points}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Рейтинг класса</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">#3</div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4">место в школе</p>
                      <Link href="/leaderboard">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Посмотреть рейтинг
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">Информация о классе недоступна</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Мои достижения</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Первые шаги</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Записал первое эко-действие</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md opacity-50">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Эко-воин</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Набрать 100 баллов</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md opacity-50">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-sm sm:text-base mb-2">Командный игрок</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Участвовать в 5 челленджах</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
