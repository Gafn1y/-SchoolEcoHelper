"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, GraduationCap, Building } from 'lucide-react'
import Link from "next/link"

export default function RegisterChoicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo-new.png" alt="EcoSchool" className="h-16 w-16" />
            <h1 className="text-3xl font-bold text-blue-900">EcoSchool</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Создайте свой аккаунт</h2>
          <p className="text-gray-600">Выберите вашу роль для регистрации</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/register?role=director">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300 h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                  <Building className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Директор</CardTitle>
                <CardDescription className="text-base">
                  Управляйте школой, добавляйте классы и контролируйте экологические программы
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
                  <li>• Создание и управление школой</li>
                  <li>• Добавление классов</li>
                  <li>• Общая аналитика школы</li>
                  <li>�� Управление учителями</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Выбрать роль
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/register?role=teacher">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-300 h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                  <GraduationCap className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-xl">Учитель</CardTitle>
                <CardDescription className="text-base">
                  Станьте классным руководителем, создавайте челленджи и отслеживайте прогресс учеников
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
                  <li>• Классное руководство</li>
                  <li>• Создание челленджей</li>
                  <li>• Аналитика и отчеты</li>
                  <li>• Мониторинг прогресса</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Выбрать роль
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/register?role=student">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300 h-full">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Ученик</CardTitle>
                <CardDescription className="text-base">
                  Записывайте эко-действия, участвуйте в челленджах и зарабатывайте очки
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <ul className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
                  <li>• Логирование экологических действий</li>
                  <li>• Участие в челленджах</li>
                  <li>• Система очков и значков</li>
                  <li>• Рейтинги и соревнования</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Выбрать роль
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4" />
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
