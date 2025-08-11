"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  Target,
  Users,
  Leaf,
  Star,
  TrendingUp,
  Award,
  Menu,
  LogOut,
  Home,
  BarChart3,
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  school_name: string
  class_name: string
  points: number
}

interface EcoAction {
  id: number
  title: string
  description: string
  points: number
  category: string
  completed: boolean
  date?: string
}

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  deadline: string
  participants: number
  completed: boolean
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/auth/login-choice")
          return
        }

        // Fetch user data
        const userResponse = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        }

        // Fetch eco actions
        const actionsResponse = await fetch("/api/eco-actions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (actionsResponse.ok) {
          const actionsData = await actionsResponse.json()
          setEcoActions(actionsData)
        }

        // Fetch challenges
        const challengesResponse = await fetch("/api/challenges", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (challengesResponse.ok) {
          const challengesData = await challengesResponse.json()
          setChallenges(challengesData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const completeAction = async (actionId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/user-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eco_action_id: actionId }),
      })

      if (response.ok) {
        setEcoActions((prev) =>
          prev.map((action) =>
            action.id === actionId ? { ...action, completed: true, date: new Date().toISOString() } : action,
          ),
        )

        if (user) {
          const action = ecoActions.find((a) => a.id === actionId)
          if (action) {
            setUser((prev) => (prev ? { ...prev, points: prev.points + action.points } : null))
          }
        }
      }
    } catch (error) {
      console.error("Error completing action:", error)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Ошибка загрузки данных</p>
            <Button onClick={() => router.push("/auth/login-choice")}>Войти заново</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedActions = ecoActions.filter((action) => action.completed).length
  const totalActions = ecoActions.length
  const progressPercentage = totalActions > 0 ? (completedActions / totalActions) * 100 : 0

  const menuItems = [
    { icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Главная", href: "/dashboard/student" },
    { icon: <Target className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Челленджи", href: "/challenges" },
    { icon: <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Рейтинг", href: "/leaderboard" },
    { icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Мои действия", href: "/actions/log" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Image
                src="/logo-new.png"
                alt="SchoolEcoHelper"
                width={32}
                height={32}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl font-bold text-green-700">SchoolEcoHelper</span>
                <p className="text-xs sm:text-sm text-gray-500">Панель ученика</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-2 text-sm font-medium hover:text-green-600 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.points} баллов</p>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-green-100 text-green-700">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut className="h-4 w-4" />
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-700">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.points} баллов</p>
                      </div>
                    </div>

                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center space-x-3 text-lg font-medium hover:text-green-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}

                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => {
                          handleLogout()
                          setIsMenuOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Привет, {user.name}! 👋</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {user.school_name} • {user.class_name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                    <Leaf className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{user.points}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Эко-баллов</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{completedActions}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Выполнено</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                    <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {challenges.filter((c) => c.completed).length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Челленджей</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                    <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
                    <p className="text-xs sm:text-sm text-gray-600">Прогресс</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Section */}
          <Card className="mb-6 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Общий прогресс</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Выполнено {completedActions} из {totalActions} доступных действий
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="h-2 sm:h-3" />
              <p className="text-xs sm:text-sm text-gray-500 mt-2">{Math.round(progressPercentage)}% завершено</p>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Tabs defaultValue="actions" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="actions" className="text-xs sm:text-sm">
                <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Действия
              </TabsTrigger>
              <TabsTrigger value="challenges" className="text-xs sm:text-sm">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Челленджи
              </TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm hidden lg:flex">
                <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Достижения
              </TabsTrigger>
            </TabsList>

            <TabsContent value="actions" className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl font-semibold">Доступные эко-действия</h3>
                <Badge variant="secondary" className="w-fit">
                  {ecoActions.filter((a) => !a.completed).length} доступно
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {ecoActions.slice(0, 6).map((action) => (
                  <Card key={action.id} className={`${action.completed ? "bg-green-50 border-green-200" : ""}`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm sm:text-base mb-1">{action.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">{action.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {action.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              +{action.points} баллов
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-3">
                          {action.completed ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="text-xs sm:text-sm font-medium">Выполнено</span>
                            </div>
                          ) : (
                            <Button size="sm" onClick={() => completeAction(action.id)} className="text-xs sm:text-sm">
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Выполнить
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {ecoActions.length > 6 && (
                <div className="text-center">
                  <Link href="/actions/log">
                    <Button variant="outline">Посмотреть все действия</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="challenges" className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h3 className="text-lg sm:text-xl font-semibold">Активные челленджи</h3>
                <Badge variant="secondary" className="w-fit">
                  {challenges.filter((c) => !c.completed).length} активных
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {challenges.slice(0, 4).map((challenge) => (
                  <Card key={challenge.id} className={`${challenge.completed ? "bg-green-50 border-green-200" : ""}`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm sm:text-base mb-1">{challenge.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">{challenge.description}</p>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(challenge.deadline).toLocaleDateString()}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              +{challenge.points} баллов
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{challenge.participants} участников</p>
                        </div>
                        <div className="ml-3">
                          {challenge.completed ? (
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                          ) : (
                            <Button size="sm" className="text-xs sm:text-sm">
                              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Участвовать
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link href="/challenges">
                  <Button variant="outline">Посмотреть все челленджи</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-3 sm:space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold">Достижения</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                        <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm sm:text-base mb-1">Первые шаги</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Выполните первое эко-действие</p>
                    <Badge className="mt-2 text-xs">Получено</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
                        <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm sm:text-base mb-1">Эко-герой</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Наберите 100 баллов</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Заблокировано
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm sm:text-base mb-1">Командный игрок</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Участвуйте в 5 челленджах</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Заблокировано
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
