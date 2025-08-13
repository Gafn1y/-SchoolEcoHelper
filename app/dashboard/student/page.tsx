"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Users,
  Award,
  BookOpen,
  Gamepad2,
  Camera,
  Plus,
  TrendingUp,
  Star,
  Leaf,
  Recycle,
  LogOut,
  Calendar,
  CheckCircle,
  Clock,
  Play,
} from "lucide-react"
import Link from "next/link"
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

interface UserAction {
  id: number
  action_name: string
  points_earned: number
  status: string
  created_at: string
  description?: string
}

interface Challenge {
  id: number
  title: string
  description: string
  target_value: number
  current_progress: number
  points_reward: number
  deadline?: string
  completed: boolean
}

interface Classmate {
  id: number
  name: string
  points: number
  level: number
}

interface UserBadge {
  id: number
  name: string
  description: string
  icon: string
  earned_at?: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [myActions, setMyActions] = useState<UserAction[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [classmates, setClassmates] = useState<Classmate[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
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
      setUser(parsedUser)

      fetchMyActions(parsedUser.id)
      fetchChallenges()
      if (parsedUser.class_id) {
        fetchClassmates(parsedUser.class_id)
      }
      fetchMyBadges(parsedUser.id)
    } catch (error) {
      console.error("Error parsing user data:", error)
      setError("Ошибка загрузки данных пользователя")
      setLoading(false)
    }
  }, [router])

  const fetchMyActions = async (userId: number) => {
    try {
      const response = await fetch(`/api/user-actions?user_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMyActions(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch my actions")
        setMyActions([])
      }
    } catch (error) {
      console.error("Error fetching my actions:", error)
      setMyActions([])
    }
  }

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges")
      if (response.ok) {
        const data = await response.json()
        setChallenges(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch challenges")
        setChallenges([])
      }
    } catch (error) {
      console.error("Error fetching challenges:", error)
      setChallenges([])
    }
  }

  const fetchClassmates = async (classId: number) => {
    try {
      const response = await fetch(`/api/users?class_id=${classId}&role=student`)
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array before sorting
        if (Array.isArray(data)) {
          setClassmates(data.sort((a: Classmate, b: Classmate) => b.points - a.points))
        } else {
          console.error("Classmates data is not an array:", data)
          setClassmates([])
        }
      } else {
        console.error("Failed to fetch classmates")
        setClassmates([])
      }
    } catch (error) {
      console.error("Error fetching classmates:", error)
      setClassmates([])
    } finally {
      setLoading(false)
    }
  }

  const fetchMyBadges = async (userId: number) => {
    try {
      const response = await fetch(`/api/badges?user_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setBadges(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch badges")
        setBadges([])
      }
    } catch (error) {
      console.error("Error fetching badges:", error)
      setBadges([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100
  }

  const getCurrentLevelProgress = (points: number, level: number) => {
    const currentLevelPoints = (level - 1) * 100
    const nextLevelPoints = level * 100
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    return Math.max(0, Math.min(100, progress))
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Ошибка загрузки данных"}</p>
          <Button onClick={() => router.push("/auth/login-choice")}>Вернуться к входу</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  EcoSchool
                </h1>
                <p className="text-sm text-gray-600">Панель ученика</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.school_name}</p>
                {user.class_name && <p className="text-xs text-gray-500">{user.class_name}</p>}
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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Мои очки</p>
                  <p className="text-3xl font-bold">{user.points}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Star className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Уровень</p>
                  <p className="text-3xl font-bold">{user.level}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Мои действия</p>
                  <p className="text-3xl font-bold">{myActions.length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Leaf className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Значки</p>
                  <p className="text-3xl font-bold">{badges.filter((b) => b.earned_at).length}</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level Progress */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Award className="h-5 w-5" />
              Прогресс уровня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Уровень {user.level}</span>
                <span>
                  {user.points} / {getNextLevelPoints(user.level)} очков
                </span>
              </div>
              <Progress value={getCurrentLevelProgress(user.points, user.level)} className="h-3" />
              <p className="text-xs text-gray-600">
                До следующего уровня: {getNextLevelPoints(user.level) - user.points} очков
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="actions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-blue-200">
            <TabsTrigger
              value="actions"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white"
            >
              Мои действия
            </TabsTrigger>
            <TabsTrigger
              value="challenges"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Челленджи
            </TabsTrigger>
            <TabsTrigger
              value="learning"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              Обучение
            </TabsTrigger>
            <TabsTrigger
              value="class"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              Мой класс
            </TabsTrigger>
            <TabsTrigger
              value="badges"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Значки
            </TabsTrigger>
          </TabsList>

          {/* My Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Мои экологические действия</h2>
              <Link href="/actions/log">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Записать действие
                </Button>
              </Link>
            </div>

            {myActions.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Пока нет записанных действий</h3>
                  <p className="text-gray-500 mb-6">
                    Начните записывать свои экологические действия и зарабатывайте очки!
                  </p>
                  <Link href="/actions/log">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Записать первое действие
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myActions.map((action) => (
                  <Card key={action.id} className="bg-white/80 backdrop-blur-sm border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-800 text-lg">{action.action_name}</h3>
                          {action.description && <p className="text-gray-600 mt-1">{action.description}</p>}
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(action.created_at).toLocaleDateString("ru-RU")}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            className={`${
                              action.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : action.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {action.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {action.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {action.status === "approved"
                              ? "Подтверждено"
                              : action.status === "pending"
                                ? "На проверке"
                                : "Отклонено"}
                          </Badge>
                          <div className="text-right">
                            <p className="font-bold text-lg text-blue-600">+{action.points_earned}</p>
                            <p className="text-xs text-gray-500">очков</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Активные челленджи</h2>
              <Badge
                className={`${
                  challenges.filter((c) => c.completed).length > 0
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {challenges.filter((c) => c.completed).length} из {challenges.length} завершено
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="bg-white/80 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-purple-800">
                      <span>{challenge.title}</span>
                      {challenge.completed && <Trophy className="h-5 w-5 text-yellow-500" />}
                    </CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Прогресс</span>
                          <span>
                            {challenge.current_progress} / {challenge.target_value}
                          </span>
                        </div>
                        <Progress value={(challenge.current_progress / challenge.target_value) * 100} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-green-100 text-green-800 border border-green-300">
                          +{challenge.points_reward} очков
                        </Badge>
                        {challenge.deadline && (
                          <div className="text-sm text-gray-500">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            До {new Date(challenge.deadline).toLocaleDateString("ru-RU")}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Обучающие материалы</h2>
              <Badge className="bg-green-100 text-green-800 border border-green-300">Интерактивное обучение</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Recycle className="h-6 w-6" />
                    Сортировка мусора
                  </CardTitle>
                  <CardDescription>Изучите основы правильной сортировки отходов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        <span>Видео урок</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gamepad2 className="h-4 w-4" />
                        <span>Игра</span>
                      </div>
                    </div>
                    <Link href="/learning/waste-sorting">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Начать обучение
                      </Button>
                    </Link>
                    <Link href="/learning/waste-sorting/game">
                      <Button
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        <Gamepad2 className="h-4 w-4 mr-2" />
                        Играть в игру
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Leaf className="h-6 w-6" />
                    Экология дома
                  </CardTitle>
                  <CardDescription>Узнайте, как сделать свой дом более экологичным</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Скоро доступно
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Camera className="h-6 w-6" />
                    Эко-фотография
                  </CardTitle>
                  <CardDescription>Документируйте свои экологические действия</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                    <Camera className="h-4 w-4 mr-2" />
                    Скоро доступно
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Class Tab */}
          <TabsContent value="class" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Мой класс</h2>
              {user.class_name && (
                <Badge className="bg-orange-100 text-orange-800 border border-orange-300">{user.class_name}</Badge>
              )}
            </div>

            {classmates.length > 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">Рейтинг класса</CardTitle>
                  <CardDescription>Топ учеников по количеству очков</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classmates.slice(0, 10).map((classmate, index) => (
                      <div
                        key={classmate.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          classmate.id === user.id
                            ? "bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-300"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                          </div>
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-green-100 text-blue-700">
                              {getInitials(classmate.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p
                              className={`font-semibold ${classmate.id === user.id ? "text-blue-800" : "text-gray-800"}`}
                            >
                              {classmate.name} {classmate.id === user.id && "(Вы)"}
                            </p>
                            <p className="text-sm text-gray-600">Уровень {classmate.level}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-orange-600">{classmate.points}</p>
                          <p className="text-xs text-gray-500">очков</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Вы не назначены в класс</h3>
                  <p className="text-gray-500">Обратитесь к учителю для назначения в класс</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Мои значки</h2>
              <Badge
                className={`${
                  badges.filter((b) => b.earned_at).length > 0
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {badges.filter((b) => b.earned_at).length} заработано
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`${
                    badge.earned_at
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  } transition-all duration-300`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-3xl">{badge.icon}</span>
                      <span className={badge.earned_at ? "text-yellow-800" : "text-gray-600"}>{badge.name}</span>
                    </CardTitle>
                    <CardDescription>{badge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {badge.earned_at ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Получен {new Date(badge.earned_at).toLocaleDateString("ru-RU")}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Значок не получен</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {badges.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Пока нет значков</h3>
                  <p className="text-gray-500">
                    Выполняйте экологические действия и участвуйте в челленджах, чтобы заработать значки!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
