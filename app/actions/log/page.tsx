"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter, Plus, CheckCircle, Clock, X, Menu, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface UserAction {
  id: number
  actionName: string
  category: string
  points: number
  date: string
  status: "pending" | "approved" | "rejected"
  description?: string
}

export default function ActionsLog() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [actions, setActions] = useState<UserAction[]>([])
  const [filteredActions, setFilteredActions] = useState<UserAction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockActions: UserAction[] = [
      {
        id: 1,
        actionName: "Сбор макулатуры",
        category: "Переработка",
        points: 10,
        date: "2024-01-15",
        status: "approved",
        description: "Собрал 5 кг макулатуры",
      },
      {
        id: 2,
        actionName: "Посадка дерева",
        category: "Озеленение",
        points: 25,
        date: "2024-01-14",
        status: "approved",
        description: "Посадил дуб в школьном дворе",
      },
      {
        id: 3,
        actionName: "Уборка территории",
        category: "Уборка",
        points: 15,
        date: "2024-01-13",
        status: "pending",
        description: "Убрал мусор возле школы",
      },
      {
        id: 4,
        actionName: "Экономия воды",
        category: "Ресурсы",
        points: 20,
        date: "2024-01-12",
        status: "rejected",
        description: "Не предоставлены доказательства",
      },
      {
        id: 5,
        actionName: "Сортировка мусора",
        category: "Переработка",
        points: 8,
        date: "2024-01-11",
        status: "approved",
        description: "Сортировал мусор дома неделю",
      },
    ]

    setActions(mockActions)
    setFilteredActions(mockActions)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = actions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (action) =>
          action.actionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((action) => action.status === statusFilter)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((action) => action.category === categoryFilter)
    }

    setFilteredActions(filtered)
  }, [actions, searchTerm, statusFilter, categoryFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Одобрено"
      case "pending":
        return "На рассмотрении"
      case "rejected":
        return "Отклонено"
      default:
        return "Неизвестно"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "rejected":
        return <X className="w-4 h-4" />
      default:
        return null
    }
  }

  const totalPoints = actions
    .filter((action) => action.status === "approved")
    .reduce((sum, action) => sum + action.points, 0)

  const pendingActions = actions.filter((action) => action.status === "pending").length
  const approvedActions = actions.filter((action) => action.status === "approved").length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка действий...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/dashboard/student">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-sm">Мои действия</h1>
          </div>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <Link href="/dashboard/student" className="text-sm font-medium">
                  Главная
                </Link>
                <Link href="/challenges" className="text-sm font-medium">
                  Челленджи
                </Link>
                <Link href="/leaderboard" className="text-sm font-medium">
                  Рейтинг
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/dashboard/student" className="mr-6 flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded"></div>
              <span className="font-bold">EcoSchool</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/dashboard/student">Главная</Link>
            <Link href="/actions/log" className="text-green-600">
              Мои действия
            </Link>
            <Link href="/challenges">Челленджи</Link>
            <Link href="/leaderboard">Рейтинг</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Всего баллов</p>
                  <p className="text-lg lg:text-2xl font-bold text-green-600">{totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">На рассмотрении</p>
                  <p className="text-lg lg:text-2xl font-bold text-yellow-600">{pendingActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                <div>
                  <p className="text-xs lg:text-sm text-gray-600">Одобрено</p>
                  <p className="text-lg lg:text-2xl font-bold text-blue-600">{approvedActions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 lg:mb-8">
          <CardHeader>
            <CardTitle className="text-lg lg:text-xl">Фильтры и поиск</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Поиск по названию или категории..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="approved">Одобрено</SelectItem>
                  <SelectItem value="pending">На рассмотрении</SelectItem>
                  <SelectItem value="rejected">Отклонено</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="Переработка">Переработка</SelectItem>
                  <SelectItem value="Озеленение">Озеленение</SelectItem>
                  <SelectItem value="Уборка">Уборка</SelectItem>
                  <SelectItem value="Ресурсы">Ресурсы</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Найдено: {filteredActions.length} из {actions.length} действий
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить действие
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions List */}
        <div className="space-y-4 lg:space-y-6">
          {filteredActions.length > 0 ? (
            filteredActions.map((action) => (
              <Card key={action.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-base lg:text-lg">{action.actionName}</h3>
                        <Badge className={getStatusColor(action.status)} variant="secondary">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(action.status)}
                            <span className="text-xs lg:text-sm">{getStatusText(action.status)}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {action.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(action.date).toLocaleDateString("ru-RU")}</span>
                        </div>
                      </div>

                      {action.description && (
                        <p className="text-sm lg:text-base text-gray-700 mt-2">{action.description}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-lg lg:text-2xl font-bold text-green-600">+{action.points}</div>
                      <p className="text-xs lg:text-sm text-gray-500">баллов</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8 lg:py-12">
                <Filter className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">Действия не найдены</h3>
                <p className="text-sm lg:text-base text-gray-500 mb-4">
                  Попробуйте изменить фильтры или добавить новое действие
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить действие
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
