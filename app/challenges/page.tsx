"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Target, Calendar, Users, Trophy, Clock, CheckCircle, Recycle, TreePine, Droplets, Lightbulb, Car, Trash2 } from 'lucide-react'
import Link from "next/link"

const weeklyChallenge = null

const activeChallenges = []
const completedChallenges = []
const upcomingChallenges = []

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState("active")

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const joinChallenge = (challengeId: number) => {
    alert("Вы присоединились к челленджу! Проверьте свою панель для отслеживания прогресса.")
  }

  const translateTime = (time: string) => {
    if (time.includes("days")) {
      return time.replace("days", "дней")
    } else if (time.includes("week")) {
      return time.replace("week", "неделя").replace("weeks", "недель")
    }
    return time
  }

  const translateDate = (date: string) => {
    if (date.includes("days ago")) {
      return date.replace("days ago", "дней назад")
    } else if (date.includes("week ago")) {
      return date.replace("week ago", "неделю назад")
    }
    return date
  }

  const translateStartDate = (date: string) => {
    if (date.includes("Next Monday")) {
      return "Следующий понедельник"
    } else if (date.includes("In 2 weeks")) {
      return "Через 2 недели"
    }
    return date
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard/student">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к панели
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Эко-челленджи</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Weekly Challenge */}
        {weeklyChallenge ? (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 via-cyan-50 to-green-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-600">Еженедельный челлендж</Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {translateTime(weeklyChallenge.timeLeft)} осталось
                </Badge>
              </div>
              <CardTitle className="flex items-center gap-3">
                <weeklyChallenge.icon className="h-6 w-6 text-blue-600" />
                {weeklyChallenge.title}
              </CardTitle>
              <CardDescription className="text-base">
                {weeklyChallenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Прогресс: {weeklyChallenge.current}/{weeklyChallenge.target}</span>
                    <span>{Math.round((weeklyChallenge.current / weeklyChallenge.target) * 100)}%</span>
                  </div>
                  <Progress value={(weeklyChallenge.current / weeklyChallenge.target) * 100} className="h-3" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      <span>{weeklyChallenge.points} очков</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{weeklyChallenge.participants} участников</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    Продолжить челлендж
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-dashed">
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет активного еженедельного челленджа</h3>
              <p className="text-gray-500">Еженедельные челленджи будут появляться здесь</p>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Активные челленджи</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
            <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeChallenges.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет активных челленджей</h3>
                  <p className="text-gray-500">Активные челленджи появятся здесь когда их создадут учителя</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeChallenges.map((challenge) => {
                  const IconComponent = challenge.icon
                  const progress = (challenge.current / challenge.target) * 100
                  
                  return (
                    <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {
                              challenge.difficulty === "Easy" ? "Легко" :
                              challenge.difficulty === "Medium" ? "Средне" :
                              challenge.difficulty === "Hard" ? "Сложно" :
                              challenge.difficulty
                            }
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {translateTime(challenge.timeLeft)}
                          </Badge>
                        </div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          {challenge.title}
                        </CardTitle>
                        <CardDescription>
                          {challenge.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Прогресс: {challenge.current}/{challenge.target}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              <span>{challenge.points} очков</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{challenge.participants}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full" 
                            variant={progress > 0 ? "default" : "outline"}
                            onClick={() => joinChallenge(challenge.id)}
                          >
                            {progress > 0 ? "Продолжить" : "Присоединиться к челленджу"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {completedChallenges.map((challenge) => {
                const IconComponent = challenge.icon
                
                return (
                  <Card key={challenge.id} className="bg-green-50 border-green-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{challenge.title}</h3>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                          <p className="text-xs text-gray-500">Completed {translateDate(challenge.completedDate)}</p>
                        </div>
                        
                        <div className="text-right">
                          <Badge className="bg-green-600">
                            +{challenge.points} очков
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              
              {completedChallenges.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Пока нет завершенных челленджей</h3>
                    <p className="text-gray-500">Завершите свой первый челлендж, чтобы увидеть его здесь!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            {upcomingChallenges.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Нет предстоящих челленджей</h3>
                  <p className="text-gray-500">Предстоящие челленджи будут отображаться здесь</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingChallenges.map((challenge) => {
                  const IconComponent = challenge.icon
                  
                  return (
                    <Card key={challenge.id} className="border-dashed">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {
                              challenge.difficulty === "Easy" ? "Легко" :
                              challenge.difficulty === "Medium" ? "Средне" :
                              challenge.difficulty === "Hard" ? "Сложно" :
                              challenge.difficulty
                            }
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {translateStartDate(challenge.startDate)}
                          </Badge>
                        </div>
                        <CardTitle className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-gray-500" />
                          {challenge.title}
                        </CardTitle>
                        <CardDescription>
                          {challenge.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4" />
                              <span>{challenge.points} очков</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{challenge.duration}</span>
                            </div>
                          </div>
                          
                          <Button className="w-full" variant="outline" disabled>
                            Скоро
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
