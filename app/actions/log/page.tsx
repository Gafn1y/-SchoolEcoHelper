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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Leaf,
  Recycle,
  Lightbulb,
  Users,
  Calendar,
  Trophy,
  Plus,
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

interface UserAction {
  id: number
  eco_action_id: number
  title: string
  description: string
  points: number
  category: string
  completed_at: string
  status: "completed" | "pending"
}

interface EcoAction {
  id: number
  title: string
  description: string
  points: number
  category: string
  completed: boolean
}

export default function ActionsLogPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userActions, setUserActions] = useState<UserAction[]>([])
  const [availableActions, setAvailableActions] = useState<EcoAction[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

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

        // Fetch user actions
        const actionsResponse = await fetch("/api/user-actions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (actionsResponse.ok) {
          const actionsData = await actionsResponse.json()
          setUserActions(actionsData)
        }

        // Fetch available eco actions
        const ecoActionsResponse = await fetch("/api/eco-actions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (ecoActionsResponse.ok) {
          const ecoActionsData = await ecoActionsResponse.json()
          setAvailableActions(ecoActionsData)
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
        setAvailableActions((prev) =>
          prev.map((action) => (action.id === actionId ? { ...action, completed: true } : action)),
        )

        // Refresh user actions
        const actionsResponse = await fetch("/api/user-actions", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (actionsResponse.ok) {
          const actionsData = await actionsResponse.json()
          setUserActions(actionsData)
        }
      }
    } catch (error) {
      console.error("Error completing action:", error)
    }
  }

  const filteredUserActions = userActions.filter((action) => {
    const matchesSearch =
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || action.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredAvailableActions = availableActions.filter((action) => {
    const matchesSearch =
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || action.category === categoryFilter
    return matchesSearch && matchesCategory && !action.completed
  })

  const categories = ["Переработка", "Энергосбережение", "Транспорт", "Вода", "Образование"]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Переработка":
        return <Recycle className="h-4 w-4" />
      case "Энергосбережение":
        return <Lightbulb className="h-4 w-4" />
      case "Транспорт":
        return <Users className="h-4 w-4" />
      case "Вода":
        return <Leaf className="h-4 w-4" />
      case "Образование":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Leaf className="h-4 w-4" />
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
                <span className="text-lg sm:text-xl font-bold text-green-700">Мои действия</span>
                <p className="text-xs sm:text-sm text-gray-500">История эко-действий</p>
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Мои эко-действия</h1>
            <p className="text-sm sm:text-base text-gray-600">Отслеживайте свой прогресс и выполняйте новые действия</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{userActions.length}</p>
                    <p className="text-xs sm:text-sm text-gray-600">Выполнено</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                    <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {availableActions.filter((a) => !a.completed).length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Доступно</p>
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
                      {userActions.reduce((sum, action) => sum + action.points, 0)}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Баллов</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {
                        userActions.filter((a) => {
                          const actionDate = new Date(a.completed_at)
                          const today = new Date()
                          return actionDate.toDateString() === today.toDateString()
                        }).length
                      }
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Сегодня</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Поиск действий..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="completed" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Выполненные ({filteredUserActions.length})
              </TabsTrigger>
              <TabsTrigger value="available" className="text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Доступные ({filteredAvailableActions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="completed" className="space-y-3 sm:space-y-4">
              {filteredUserActions.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Нет выполненных действий</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">
                      Начните выполнять эко-действия, чтобы увидеть их здесь
                    </p>
                    <Button onClick={() => document.querySelector('[value="available"]')?.click()}>
                      Посмотреть доступные действия
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {filteredUserActions.map((action) => (
                    <Card key={action.id} className="bg-green-50 border-green-200">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getCategoryIcon(action.category)}
                              <h4 className="font-semibold text-sm sm:text-base">{action.title}</h4>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">{action.description}</p>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {action.category}
                              </Badge>
                              <Badge className="bg-green-600 text-xs">+{action.points} баллов</Badge>
                            </div>
                            <p className="text-xs text-gray-500">
                              Выполнено: {new Date(action.completed_at).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                          <div className="ml-3">
                            <div className="flex items-center space-x-1 text-green-600">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="available" className="space-y-3 sm:space-y-4">
              {filteredAvailableActions.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Нет доступных действий</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Все действия выполнены или не найдены по вашему запросу
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {filteredAvailableActions.map((action) => (
                    <Card key={action.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getCategoryIcon(action.category)}
                              <h4 className="font-semibold text-sm sm:text-base">{action.title}</h4>
                            </div>
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
                            <Button size="sm" onClick={() => completeAction(action.id)} className="text-xs sm:text-sm">
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              Выполнить
                            </Button>
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
