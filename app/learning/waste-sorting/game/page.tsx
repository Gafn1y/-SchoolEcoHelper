"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface WasteItem {
  emoji: string
  type: "plastic" | "organic" | "paper"
  id: string
}

interface GameState {
  plastic: { collected: number; total: number }
  organic: { collected: number; total: number }
  paper: { collected: number; total: number }
}

const wasteTypes = {
  plastic: {
    items: ["🥤", "🍼", "🧴", "🛍️", "🥛"],
    label: "Пластик",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
  },
  organic: {
    items: ["🍎", "🍌", "🥕", "🍞", "🥔"],
    label: "Органика",
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    textColor: "text-yellow-700",
  },
  paper: {
    items: ["📄", "📰", "📋", "📦", "📚"],
    label: "Бумага",
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-700",
  },
}

export default function WasteSortingGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState>({
    plastic: { collected: 0, total: 5 },
    organic: { collected: 0, total: 5 },
    paper: { collected: 0, total: 5 },
  })
  const [currentWaste, setCurrentWaste] = useState<WasteItem[]>([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    const newWaste: WasteItem[] = []
    const newGameState = {
      plastic: { collected: 0, total: 5 },
      organic: { collected: 0, total: 5 },
      paper: { collected: 0, total: 5 },
    }

    Object.keys(wasteTypes).forEach((type) => {
      for (let i = 0; i < newGameState[type as keyof GameState].total; i++) {
        const randomEmoji =
          wasteTypes[type as keyof typeof wasteTypes].items[
            i % wasteTypes[type as keyof typeof wasteTypes].items.length
          ]
        newWaste.push({
          emoji: randomEmoji,
          type: type as "plastic" | "organic" | "paper",
          id: `${type}-${i}`,
        })
      }
    })

    const shuffledWaste = newWaste.sort(() => Math.random() - 0.5)
    setCurrentWaste(shuffledWaste)
    setGameState(newGameState)
    setMessage("")
    setMessageType("")
    setGameComplete(false)
  }

  const handleDragStart = (e: React.DragEvent, waste: WasteItem) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(waste))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault()
    const wasteData = JSON.parse(e.dataTransfer.getData("text/plain"))

    if (wasteData.type === binType) {
      // Correct sorting
      setGameState((prev) => ({
        ...prev,
        [binType]: { ...prev[binType as keyof GameState], collected: prev[binType as keyof GameState].collected + 1 },
      }))

      setCurrentWaste((prev) => prev.filter((item) => item.id !== wasteData.id))
      setMessage("Отлично! Правильная сортировка! 🎉")
      setMessageType("success")

      // Check if game is complete
      setTimeout(() => {
        const updatedGameState = {
          ...gameState,
          [binType]: {
            ...gameState[binType as keyof GameState],
            collected: gameState[binType as keyof GameState].collected + 1,
          },
        }

        const isComplete = Object.values(updatedGameState).every((state) => state.collected === state.total)
        if (isComplete) {
          setGameComplete(true)
          setMessage("🎊 Поздравляем! Вы отсортировали весь мусор! 🎊")
        }
      }, 100)
    } else {
      // Wrong sorting
      setMessage("Неправильно! Попробуй еще раз! 😅")
      setMessageType("error")
    }

    // Clear message after 2 seconds
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/student")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к панели
          </Button>
          <h1 className="text-3xl font-bold text-center text-purple-800">🌍 Сортировка Мусора</h1>
          <Button variant="outline" onClick={initGame} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Новая игра
          </Button>
        </div>

        {/* Score Board */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {Object.entries(gameState).map(([type, state]) => (
                <div key={type} className="space-y-2">
                  <div className="font-medium">{wasteTypes[type as keyof typeof wasteTypes].label}</div>
                  <div className="text-2xl font-bold text-green-600">
                    {state.collected}/{state.total}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(wasteTypes).map(([type, config]) => (
            <div
              key={type}
              className={`relative w-full h-40 ${config.color} rounded-xl flex flex-col items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-lg`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, type)}
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="font-bold text-gray-800">
                  {gameState[type as keyof GameState].collected}/{gameState[type as keyof GameState].total}
                </span>
              </div>
              <div className="text-5xl mb-2">{config.items[0]}</div>
              <div className="text-xl font-bold">{config.label}</div>
            </div>
          ))}
        </div>

        {/* Waste Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Перетащите предметы в правильные контейнеры</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-8 gap-4 min-h-[200px] p-4 bg-gray-50 rounded-lg">
              {currentWaste.map((waste) => (
                <div
                  key={waste.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, waste)}
                  className="w-16 h-16 flex items-center justify-center text-3xl cursor-grab bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:cursor-grabbing"
                >
                  {waste.emoji}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message */}
        {message && (
          <div
            className={`text-center mt-6 text-lg font-bold ${
              messageType === "success" ? "text-green-600" : messageType === "error" ? "text-red-600" : "text-gray-600"
            }`}
          >
            {message}
          </div>
        )}

        {/* Complete Button */}
        {gameComplete && (
          <div className="text-center mt-6">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setMessage("🌟 Отличная работа! Планета благодарит вас! 🌟")
                setMessageType("success")
              }}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Завершить игру
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
