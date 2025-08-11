"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, GraduationCap, Building } from "lucide-react"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Присоединяйтесь к нам!</h2>
          <p className="text-gray-600">Выберите вашу роль для регистрации в системе</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/register?role=director">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-purple-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-purple-100 rounded-full w-fit">
                  <Building className="h-12 w-12 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Регистрация директора</CardTitle>
                <CardDescription className="text-base">
                  Зарегистрируйте свою школу и начните экологическую программу
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Зарегистрироваться как директор</Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-2 border-gray-200 opacity-75">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
                <GraduationCap className="h-12 w-12 text-gray-400" />
              </div>
              <CardTitle className="text-xl text-gray-600">Регистрация учителя</CardTitle>
              <CardDescription className="text-base">
                Учителя регистрируются по приглашению от директора школы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Только по приглашению
              </Button>
            </CardContent>
          </Card>

          <Link href="/register?role=student">
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Регистрация ученика</CardTitle>
                <CardDescription className="text-base">
                  Присоединитесь к своему классу и начните экологический путь
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Зарегистрироваться как ученик</Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Login Link */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login-choice" className="text-blue-600 hover:underline">
              Войти в систему
            </Link>
          </p>
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
