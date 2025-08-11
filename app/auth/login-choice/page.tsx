"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, UserCheck, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function LoginChoice() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const roles = [
    {
      title: "Ученик",
      description: "Участвуй в эко-активностях и зарабатывай баллы",
      icon: GraduationCap,
      href: "/login?role=student",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Учитель",
      description: "Управляй классом и отслеживай прогресс учеников",
      icon: UserCheck,
      href: "/login?role=teacher",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Директор",
      description: "Контролируй всю школу и анализируй статистику",
      icon: Users,
      href: "/login?role=director",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="h-6 w-6 bg-green-600 rounded"></div>
              <span className="font-bold text-sm">EcoSchool</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-sm font-medium">
                    Главная
                  </Link>
                  <Link href="/auth/register-choice" className="text-sm font-medium">
                    Регистрация
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="h-8 w-8 bg-green-600 rounded"></div>
              <span className="font-bold">EcoSchool</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/">Главная</Link>
            <Link href="/auth/register-choice">Регистрация</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">Выберите свою роль</h1>
          <p className="text-base lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Войдите в систему в соответствии с вашей ролью в школе
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {roles.map((role) => (
            <Card
              key={role.title}
              className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-200"
            >
              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-full ${role.color} flex items-center justify-center mb-4`}
                >
                  <role.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                <CardTitle className="text-xl lg:text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-sm lg:text-base">{role.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href={role.href}>Войти как {role.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8 lg:mt-12">
          <p className="text-sm lg:text-base text-gray-600 mb-4">Нет аккаунта?</p>
          <Button
            variant="outline"
            asChild
            className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
          >
            <Link href="/auth/register-choice">Зарегистрироваться</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
