"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Leaf, CheckCircle, AlertCircle } from "lucide-react"

interface EcoAction {
  id: number
  name: string
  points: number
  category: string
  description: string
}

interface User {
  id: number
  name: string
  role: string
}

export default function LogActionPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([])
  const [selectedAction, setSelectedAction] = useState<EcoAction | null>(null)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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
    fetchEcoActions()
  }, [router])

  const fetchEcoActions = async () => {
    try {
      const response = await fetch("/api/eco-actions")
      if (response.ok) {
        const data = await response.json()
        setEcoActions(data)
      }
    } catch (error) {
      console.error("Error fetching eco actions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAction || !user) return

    setSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/user-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          actionId: selectedAction.id,
          description: description.trim() || null,
        }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: `Действие записано! Вы получили ${selectedAction.points} баллов.` })
        setSelectedAction(null)
        setDescription("")

        // Update user points in localStorage
        const updatedUser = { ...user, points: user.points + selectedAction.points }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        const errorData = await response.json()
        setMessage({ type: "error", text: errorData.error || "Произошла ошибка при записи действия" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Произошла ошибка при записи действия" })
    } finally {
      setSubmitting(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "переработка":
        return "bg-blue-100 text-blue-800"
      case "энергосбережение":
        return "bg-yellow-100 text-yellow-800"
      case "вода":
        return "bg-cyan-100 text-cyan-800"
      case "транспорт":
        return "bg-green-100 text-green-800"
      case "природа":
        return "bg-emerald-100 text-emerald-800"
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/dashboard/student">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Назад</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Записать действие</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Зафиксируйте свое эко-действие и получите баллы
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              <span className="text-sm sm:text-base font-semibold text-green-600">{user.points} баллов</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        {message && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Action Selection */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Выберите действие</CardTitle>
              <CardDescription className="text-sm">Выберите эко-действие, которое вы выполнили</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {ecoActions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAction?.id === action.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                    }`}
                    onClick={() => setSelectedAction(action)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm sm:text-base">{action.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(action.category)}>{action.category}</Badge>
                        <span className="text-sm font-semibold text-green-600">+{action.points}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{action.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Детали действия</CardTitle>
              <CardDescription className="text-sm">Опишите, как вы выполнили это действие</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {selectedAction ? (
                  <>
                    <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm sm:text-base text-green-800">{selectedAction.name}</h3>
                        <span className="text-sm font-semibold text-green-600">+{selectedAction.points} баллов</span>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700">{selectedAction.description}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm">
                        Описание (необязательно)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Расскажите подробнее о том, как вы выполнили это действие..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="text-sm"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Записываем...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Записать действие
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm sm:text-base text-gray-600">Выберите действие из списка слева</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 sm:mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Быстрые действия</CardTitle>
            <CardDescription className="text-sm">Популярные эко-действия для быстрой записи</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {ecoActions.slice(0, 6).map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-3 sm:p-4 text-left justify-start bg-transparent"
                  onClick={() => setSelectedAction(action)}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-xs sm:text-sm">{action.name}</span>
                      <span className="text-xs text-green-600">+{action.points}</span>
                    </div>
                    <Badge className={`${getCategoryColor(action.category)} text-xs`}>{action.category}</Badge>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
