"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Building } from "lucide-react"

export default function LoginChoicePage() {
  const roles = [
    {
      id: "student",
      title: "Ученик",
      description: "Участвуй в эко-челленджах и зарабатывай баллы для своего класса",
      icon: <GraduationCap className="h-8 w-8 sm:h-12 sm:w-12" />,
      color: "from-blue-500 to-blue-600",
      href: "/login?role=student",
    },
    {
      id: "teacher",
      title: "Учитель",
      description: "Управляй классом и отслеживай прогресс учеников в экологических активностях",
      icon: <Users className="h-8 w-8 sm:h-12 sm:w-12" />,
      color: "from-green-500 to-green-600",
      href: "/login?role=teacher",
    },
    {
      id: "director",
      title: "Директор",
      description: "Контролируй экологическую активность всей школы и управляй учителями",
      icon: <Building className="h-8 w-8 sm:h-12 sm:w-12" />,
      color: "from-purple-500 to-purple-600",
      href: "/login?role=director",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
            <Image src="/logo-new.png" alt="EcoSchool Logo" width={32} height={32} className="sm:w-12 sm:h-12" />
            <span className="text-xl sm:text-2xl font-bold text-green-800">EcoSchool</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Выберите свою роль</h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Войдите в систему, выбрав подходящую роль для доступа к персонализированному интерфейсу
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {roles.map((role) => (
            <Link key={role.id} href={role.href}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 shadow-lg">
                <CardHeader className="text-center pb-3 sm:pb-4">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center text-white mb-3 sm:mb-4`}
                  >
                    {role.icon}
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-gray-900">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pt-0">
                  <CardDescription className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Registration Link */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Еще нет аккаунта?</p>
          <Link href="/auth/register-choice">
            <Button variant="outline" className="text-sm sm:text-base px-4 sm:px-6 bg-transparent">
              Зарегистрироваться
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
