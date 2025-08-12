"use client"

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
    borderColor: "border-green-600",
  },
  organic: {
    items: ["🍎", "🍌", "🥕", "🍞", "🥔"],
    label: "Органика",
    color: "bg-yellow-500",
    borderColor: "border-yellow-600",
  },
  paper: {
    items: ["📄", "📰", "📋", "📦", "📚"],
    label: "Бумага",
    color: "bg-red-500",
    borderColor: "border-red-600",
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
  const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    const newWaste: WasteItem[] = []
    const newGameState: GameState = {
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

    // Shuffle the waste items
    const shuffledWaste = newWaste.sort(() => Math.random() - 0.5)

    setCurrentWaste(shuffledWaste)
    setGameState(newGameState)
    setMessage("")
    setMessageType("")
    setGameComplete(false)
  }

  const handleDragStart = (item: WasteItem) => {
    setDraggedItem(item)
  }

  const handleDrop = (binType: "plastic" | "organic" | "paper") => {
    if (!draggedItem) return

    if (draggedItem.type === binType) {
      // Correct drop
      setGameState((prev) => ({
        ...prev,
        [binType]: {
          ...prev[binType],
          collected: prev[binType].collected + 1,
        },
      }))

      setCurrentWaste((prev) => prev.filter((item) => item.id !== draggedItem.id))
      setMessage("Отлично! Правильная сортировка! 🎉")
      setMessageType("success")

      // Check if game is complete
      const newGameState = {
        ...gameState,
        [binType]: {
          ...gameState[binType],
          collected: gameState[binType].collected + 1,
        },
      }

      const allComplete = Object.values(newGameState).every((state) => state.collected === state.total)

      if (allComplete) {
        setTimeout(() => {
          setMessage("🎊 Поздравляем! Вы отсортировали весь мусор! 🎊")
          setMessageType("success")
          setGameComplete(true)
        }, 500)
      }
    } else {
      // Wrong drop
      setMessage("Неправильно! Попробуй еще раз! 😅")
      setMessageType("error")
    }

    setDraggedItem(null)

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 3000)
  }

  const handleWasteClick = (item: WasteItem, binType: "plastic" | "organic" | "paper") => {
    setDraggedItem(item)
    handleDrop(binType)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div className="flex items-center gap-3">
              <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
              <div>
                <h1 className="text-2xl font-bold text-purple-900">🌍 Сортировка Мусора</h1>
                <p className="text-sm text-gray-600">Игра на сортировку отходов</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-3xl">🌍 Сортировка Мусора</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Score Board */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="font-bold">Пластик</div>
                <div className="text-xl font-bold text-green-600">
                  {gameState.plastic.collected}/{gameState.plastic.total}
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold">Органика</div>
                <div className="text-xl font-bold text-yellow-600">
                  {gameState.organic.collected}/{gameState.organic.total}
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold">Бумага</div>
                <div className="text-xl font-bold text-red-600">
                  {gameState.paper.collected}/{gameState.paper.total}
                </div>
              </div>
            </div>

            {/* Bins */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(wasteTypes).map(([type, config]) => (
                <div
                  key={type}
                  className={`relative w-full h-40 ${config.color} ${config.borderColor} border-4 rounded-2xl flex flex-col items-center justify-center text-white transition-all duration-300 hover:scale-105 cursor-pointer`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(type as "plastic" | "organic" | "paper")}
                >
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold border-2 border-white shadow-lg">
                    {gameState[type as keyof GameState].collected}/{gameState[type as keyof GameState].total}
                  </div>
                  <div className="text-6xl mb-2">{type === "plastic" ? "🥤" : type === "organic" ? "🍌" : "🧻"}</div>
                  <div className="text-xl font-bold">{config.label}</div>
                </div>
              ))}
            </div>

            {/* Waste Items */}
            <div className="min-h-48 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="flex flex-wrap justify-center gap-4">
                {currentWaste.map((item) => (
                  <div
                    key={item.id}
                    className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl cursor-grab hover:scale-110 transition-all duration-300 select-none"
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    title={`${item.emoji} (${wasteTypes[item.type].label})`}
                  >
                    {item.emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`text-center mt-6 text-xl font-bold ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            {/* Controls */}
            <div className="text-center mt-6 space-x-4">
              <Button onClick={initGame} className="bg-blue-600 hover:bg-blue-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                Новая игра
              </Button>

              {gameComplete && (
                <Button
                  onClick={() => {
                    setMessage("🌟 Отличная работа! Планета благодарит вас! 🌟")
                    setMessageType("success")
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Проверить
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
