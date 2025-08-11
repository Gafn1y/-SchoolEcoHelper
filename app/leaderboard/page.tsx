"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  Users,
  School,
  Menu,
  LogOut,
  Home,
  BarChart3,
  BookOpen,
  Target,
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

interface LeaderboardEntry {
  id: number
  name: string
  points: number
  school_name?: string
  class_name?: string
  rank: number
  change?: number
}

interface SchoolStats {
  id: number
  name: string
  total_points: number
  student_count: number
  average_points: number
  rank: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [classLeaderboard, setClassLeaderboard] = useState<LeaderboardEntry[]>([])
  const [schoolLeaderboard, setSchoolLeaderboard] = useState<LeaderboardEntry[]>([])
  const [schoolsLeaderboard, setSchoolsLeaderboard] = useState<SchoolStats[]>([])
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

        // Fetch leaderboard data
        const leaderboardResponse = await fetch("/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json()
          setClassLeaderboard(leaderboardData.class || [])
          setSchoolLeaderboard(leaderboardData.school || [])
          setSchoolsLeaderboard(leaderboardData.schools || [])
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
      default:
        return <span className="text-sm sm:text-base font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">🥇 1 место</Badge>
      case 2:
        return <Badge className="bg-gray-400 hover:bg-gray-500">🥈 2 место</Badge>
      case 3:
        return <Badge className="bg-amber-600 hover:bg-amber-700">🥉 3 место</Badge>
      default:
        return <Badge variant="outline">#{rank}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Загрузка рейтинга...</p>
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

  const menuItems = [
    { icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Главная", href: "/dashboard/student" },
    { icon: <Target className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Челленджи", href: "/challenges" },
    { icon: <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Рейтинг", href: "/leaderboard" },
    { icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />, label: "Мои действия", href: "/actions/log" },
  ]

  const userClassRank = classLeaderboard.findIndex((entry) => entry.id === user.id) + 1
  const userSchoolRank = schoolLeaderboard.findIndex((entry) => entry.id === user.id) + 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard/student" className="flex items-center space-x-2">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                <Image
                  src="/logo-new.png"
                  alt="SchoolEcoHelper"
                  width={32}
                  height={32}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
              </Link>
              <div className="hidden sm:block">
                <span className="text-lg sm:text-xl font-bold text-green-700">Рейтинг</span>
                <p className="text-xs sm:text-sm text-gray-500">Лидеры эко-движения</p>
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
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Рейтинг лидеров 🏆</h1>
            <p className="text-sm sm:text-base text-gray-600">Посмотрите, кто лидирует в эко-движении</p>
          </div>

          {/* User Stats */}
          <Card className="mb-6 sm:mb-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                    <AvatarFallback className="bg-white text-green-700 text-lg sm:text-xl font-bold">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">{user.name}</h3>
                    <p className="text-sm sm:text-base opacity-90">
                      {user.school_name} • {user.class_name}
                    </p>
                    <p className="text-lg sm:text-xl font-semibold">{user.points} баллов</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex flex-col space-y-1 sm:space-y-2">
                    {userClassRank > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        #{userClassRank} в классе
                      </Badge>
                    )}
                    {userSchoolRank > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        #{userSchoolRank} в школе
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="class" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="class" className="text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Класс
              </TabsTrigger>
              <TabsTrigger value="school" className="text-xs sm:text-sm">
                <School className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Школа
              </TabsTrigger>
              <TabsTrigger value="schools" className="text-xs sm:text-sm">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Школы
              </TabsTrigger>
            </TabsList>

            <TabsContent value="class" className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Рейтинг класса</h3>
                <Badge variant="outline">{classLeaderboard.length} участников</Badge>
              </div>

              {classLeaderboard.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Нет данных о классе</h3>
                    <p className="text-sm sm:text-base text-gray-600">Рейтинг класса пока недоступен</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {classLeaderboard.slice(0, 10).map((entry, index) => (
                    <Card
                      key={entry.id}
                      className={`${entry.id === user.id ? "ring-2 ring-green-500 bg-green-50" : ""} ${
                        entry.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                              {getRankIcon(entry.rank)}
                            </div>
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarFallback className="bg-green-100 text-green-700 text-sm sm:text-base">
                                {entry.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm sm:text-base">
                                {entry.name}
                                {entry.id === user.id && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Вы
                                  </Badge>
                                )}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">{entry.points} баллов</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getRankBadge(entry.rank)}
                            {entry.change && (
                              <div
                                className={`flex items-center mt-1 text-xs ${
                                  entry.change > 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {entry.change > 0 ? "+" : ""}
                                {entry.change}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="school" className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Рейтинг школы</h3>
                <Badge variant="outline">{schoolLeaderboard.length} участников</Badge>
              </div>

              {schoolLeaderboard.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <School className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Нет данных о школе</h3>
                    <p className="text-sm sm:text-base text-gray-600">Рейтинг школы пока недоступен</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {schoolLeaderboard.slice(0, 20).map((entry, index) => (
                    <Card
                      key={entry.id}
                      className={`${entry.id === user.id ? "ring-2 ring-green-500 bg-green-50" : ""} ${
                        entry.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                              {getRankIcon(entry.rank)}
                            </div>
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm sm:text-base">
                                {entry.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm sm:text-base">
                                {entry.name}
                                {entry.id === user.id && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Вы
                                  </Badge>
                                )}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {entry.class_name} • {entry.points} баллов
                              </p>
                            </div>
                          </div>
                          <div className="text-right">{getRankBadge(entry.rank)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="schools" className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Рейтинг школ</h3>
                <Badge variant="outline">{schoolsLeaderboard.length} школ</Badge>
              </div>

              {schoolsLeaderboard.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Нет данных о школах</h3>
                    <p className="text-sm sm:text-base text-gray-600">Рейтинг школ пока недоступен</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {schoolsLeaderboard.map((school, index) => (
                    <Card
                      key={school.id}
                      className={`${school.name === user.school_name ? "ring-2 ring-green-500 bg-green-50" : ""} ${
                        school.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50" : ""
                      }`}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
                              {getRankIcon(school.rank)}
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full">
                              <School className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm sm:text-base">
                                {school.name}
                                {school.name === user.school_name && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Ваша школа
                                  </Badge>
                                )}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {school.student_count} учеников • {school.total_points} баллов
                              </p>
                              <p className="text-xs text-gray-500">Средний балл: {Math.round(school.average_points)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getRankBadge(school.rank)}
                            <div className="mt-2">
                              <Progress
                                value={Math.min((school.average_points / 100) * 100, 100)}
                                className="w-16 sm:w-20 h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
