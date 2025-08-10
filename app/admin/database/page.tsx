"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Database, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DatabaseAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleResetDatabase = async () => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch('/api/database/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'RESET_DATABASE' })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        // Clear localStorage since all users are deleted
        localStorage.clear()
      } else {
        setError(data.error || 'Reset failed')
      }
    } catch (error) {
      console.error('Reset error:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo-new.png" alt="EcoSchool" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-red-900">EcoSchool Admin</h1>
              <p className="text-sm text-gray-600">Управление базой данных</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Warning */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>⚠️ ВНИМАНИЕ:</strong> Эта страница предназначена только для разработки. 
            Операции на этой странице могут полностью удалить все данные!
          </AlertDescription>
        </Alert>

        {/* Database Reset */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <Database className="h-5 w-5" />
              Сброс базы данных
            </CardTitle>
            <CardDescription>
              Полностью удаляет все данные и пересоздает структуру БД с нуля
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Что произойдет:</h3>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Все пользователи будут удалены</li>
                <li>• Все школы и классы будут удалены</li>
                <li>• Все эко-действия и очки будут сброшены</li>
                <li>• Все приглашения и челленджи будут удалены</li>
                <li>• Структура БД будет пересоздана с базовыми данными</li>
              </ul>
            </div>

            <Button 
              variant="destructive" 
              onClick={() => setShowConfirmDialog(true)}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Сброс базы данных...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Сбросить базу данных
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="h-5 w-5" />
                Операция выполнена успешно
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {result.message}
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="font-semibold mb-2">Созданные таблицы:</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.tables_created?.map((table: string) => (
                      <Badge key={table} variant="outline">
                        {table}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Базовые данные:</h3>
                  <div className="text-sm text-gray-600">
                    <p>• Эко-действий: {result.default_data?.eco_actions}</p>
                    <p>• Значков: {result.default_data?.badges}</p>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Все пользовательские сессии сброшены. Необходимо заново зарегистрироваться.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {error && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <XCircle className="h-5 w-5" />
                Ошибка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>
              Полезные ссылки после сброса БД
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/">
                Вернуться на главную страницу
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/auth/register-choice">
                Создать нового пользователя
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-900">Подтвердите сброс базы данных</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Все данные будут безвозвратно удалены.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>ВНИМАНИЕ:</strong> Будут удалены ВСЕ данные:
                <br />• Пользователи, школы, классы
                <br />• Эко-действия, очки, значки
                <br />• Приглашения, челленджи
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleResetDatabase}>
              Да, сбросить базу данных
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
