"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Camera, Upload, Recycle, Droplets, Trash2, Clock } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"

interface EcoAction {
  id: number
  name: string
  description?: string
  points: number
  category?: string
  icon?: string
  unit?: string
}

export default function LogActionPage() {
  const [selectedAction, setSelectedAction] = useState("")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [quantity, setQuantity] = useState("1")
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchEcoActions()
  }, [])

  const fetchEcoActions = async () => {
    try {
      const response = await fetch('/api/eco-actions')
      if (response.ok) {
        const actions = await response.json()
        setEcoActions(actions)
      }
    } catch (error) {
      console.error('Error fetching eco actions:', error)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const action = ecoActions.find(a => a.id === parseInt(selectedAction))
    if (!action) return

    setLoading(true)

    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('User not found')
      }

      const user = JSON.parse(userData)

      const response = await fetch('/api/user-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          action_id: action.id,
          quantity: parseInt(quantity),
          description: description || null,
          photo_url: null // TODO: implement photo upload
        })
      })

      if (!response.ok) {
        throw new Error('Failed to log action')
      }

      // Calculate total points (but don't add them yet - teacher needs to approve)
      const totalPoints = action.points * parseInt(quantity)

      // Show success message and redirect
      alert(`Действие записано! Ожидайте подтверждения учителя для получения ${totalPoints} очков.`)
      router.push('/dashboard/student')
    } catch (error) {
      console.error('Error logging action:', error)
      alert('Ошибка при записи действия. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  const selectedActionData = ecoActions.find(a => a.id === parseInt(selectedAction))

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Recycle': return Recycle
      case 'Trash2': return Trash2
      case 'Droplets': return Droplets
      default: return Recycle
    }
  }

  const getQuantityOptions = (unit?: string) => {
    switch (unit) {
      case 'кг':
        return [0.5, 1, 2, 3, 5, 10].map(num => ({
          value: num.toString(),
          label: `${num} кг`
        }))
      case 'шт':
        return [1, 2, 5, 10, 15, 20, 50].map(num => ({
          value: num.toString(),
          label: `${num} шт`
        }))
      case 'раз':
        return [1, 2, 3, 5, 10].map(num => ({
          value: num.toString(),
          label: `${num} раз`
        }))
      default:
        return [1, 2, 3, 4, 5].map(num => ({
          value: num.toString(),
          label: num.toString()
        }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/student">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo-new.png" alt="EcoSchool" className="h-10 w-10" />
            <h1 className="text-xl font-bold text-blue-900">Записать эко-действие</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Запишите ваше экологическое действие</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Действие будет отправлено учителю на подтверждение
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Action Type Selection */}
              <div className="space-y-3">
                <Label>Выберите тип действия</Label>
                <div className="grid gap-3">
                  {ecoActions.map((action) => {
                    const IconComponent = getIconComponent(action.icon)
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => setSelectedAction(action.id.toString())}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          selectedAction === action.id.toString()
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{action.name}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                        <Badge variant="secondary">+{action.points} очков за {action.unit}</Badge>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedActionData && (
                <>
                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Количество</Label>
                    <Select value={quantity} onValueChange={setQuantity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите количество" />
                      </SelectTrigger>
                      <SelectContent>
                        {getQuantityOptions(selectedActionData.unit).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600">
                      Потенциальные очки: {selectedActionData.points * parseFloat(quantity)} (после подтверждения)
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание (необязательно)</Label>
                    <Textarea
                      id="description"
                      placeholder="Добавьте любые дополнительные детали..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3">
                    <Link href="/dashboard/student" className="flex-1">
                      <Button type="button" variant="outline" className="w-full">
                        Отмена
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={loading}
                    >
                      {loading ? 'Отправляем...' : 'Отправить на проверку'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
