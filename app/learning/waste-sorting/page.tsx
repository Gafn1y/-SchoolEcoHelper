"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const lessons = [
  {
    id: 1,
    title: "Введение в сортировку отходов",
    description: "Узнайте, почему важно правильно сортировать мусор и как это помогает окружающей среде",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-green-800 mb-4">🌍 Почему важна сортировка отходов?</h3>
          <p class="text-gray-700 mb-4">
            Каждый день мы производим огромное количество мусора. Правильная сортировка отходов помогает:
          </p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Сохранить природные ресурсы</li>
            <li>Уменьшить загрязнение окружающей среды</li>
            <li>Создать новые рабочие места в сфере переработки</li>
            <li>Снизить количество мусора на свалках</li>
          </ul>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-200">
          <h3 class="text-xl font-bold text-blue-800 mb-4">📺 Обучающее видео</h3>
          <div class="relative w-full" style="padding-bottom: 56.25%; height: 0;">
            <iframe 
              src="https://www.youtube.com/embed/6jQ7y_qQYUA" 
              title="Сортировка мусора - обучающее видео"
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
            ></iframe>
          </div>
          <p class="text-sm text-gray-600 mt-3">
            Посмотрите это видео, чтобы лучше понять основы сортировки отходов
          </p>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">💡 Интересный факт</h3>
          <p class="text-yellow-700">
            Одна пластиковая бутылка разлагается в природе более 400 лет! 
            Но если её правильно переработать, из неё можно сделать новые полезные вещи.
          </p>
        </div>
      </div>
    `,
    completed: false,
  },
  {
    id: 2,
    title: "Виды отходов и контейнеры",
    description: "Изучите основные категории мусора и соответствующие им контейнеры",
    content: `
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <div class="text-3xl mb-2">🗞️</div>
            <h3 class="font-bold text-blue-800">Бумага и картон</h3>
            <p class="text-sm text-blue-600 mt-2">Газеты, журналы, коробки, офисная бумага</p>
            <div class="mt-3 p-2 bg-blue-100 rounded text-xs">
              <strong>Контейнер:</strong> Синий
            </div>
          </div>
          
          <div class="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <div class="text-3xl mb-2">🥤</div>
            <h3 class="font-bold text-yellow-800">Пластик</h3>
            <p class="text-sm text-yellow-600 mt-2">Бутылки, пакеты, контейнеры, игрушки</p>
            <div class="mt-3 p-2 bg-yellow-100 rounded text-xs">
              <strong>Контейнер:</strong> Жёлтый
            </div>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <div class="text-3xl mb-2">🍾</div>
            <h3 class="font-bold text-green-800">Стекло</h3>
            <p class="text-sm text-green-600 mt-2">Бутылки, банки, стеклянная посуда</p>
            <div class="mt-3 p-2 bg-green-100 rounded text-xs">
              <strong>Контейнер:</strong> Зелёный
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
            <div class="text-3xl mb-2">🥫</div>
            <h3 class="font-bold text-gray-800">Металл</h3>
            <p class="text-sm text-gray-600 mt-2">Консервные банки, алюминиевые банки</p>
            <div class="mt-3 p-2 bg-gray-100 rounded text-xs">
              <strong>Контейнер:</strong> Серый
            </div>
          </div>
        </div>
        
        <div class="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
          <h3 class="text-lg font-semibold text-red-800 mb-2">⚠️ Важно помнить</h3>
          <p class="text-red-700">
            Перед сортировкой обязательно очистите контейнеры от остатков пищи и жидкости!
          </p>
        </div>
      </div>
    `,
    completed: false,
  },
  {
    id: 3,
    title: "Органические отходы",
    description: "Узнайте, как правильно обращаться с пищевыми отходами и органикой",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-green-800 mb-4">🥬 Что такое органические отходы?</h3>
          <p class="text-gray-700 mb-4">
            Органические отходы - это остатки пищи и другие материалы природного происхождения, 
            которые могут разлагаться естественным путём.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-bold text-green-800 mb-3">✅ Можно компостировать:</h4>
            <ul class="space-y-1 text-sm text-green-700">
              <li>• Овощные и фруктовые очистки</li>
              <li>• Яичная скорлупа</li>
              <li>• Кофейная гуща и чайные пакетики</li>
              <li>• Листья и трава</li>
              <li>• Хлебные крошки</li>
            </ul>
          </div>
          
          <div class="bg-red-50 p-4 rounded-lg">
            <h4 class="font-bold text-red-800 mb-3">❌ Нельзя компостировать:</h4>
            <ul class="space-y-1 text-sm text-red-700">
              <li>• Мясо и рыбу</li>
              <li>• Молочные продукты</li>
              <li>• Жиры и масла</li>
              <li>• Больные растения</li>
              <li>• Экскременты животных</li>
            </ul>
          </div>
        </div>

        <div class="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
          <h3 class="text-lg font-semibold text-amber-800 mb-2">🌱 Польза компостирования</h3>
          <p class="text-amber-700">
            Компост - это отличное удобрение для растений! Он улучшает структуру почвы 
            и помогает растениям лучше расти.
          </p>
        </div>
      </div>
    `,
    completed: false,
  },
  {
    id: 4,
    title: "Опасные отходы",
    description: "Изучите, как безопасно обращаться с батарейками, лампочками и другими опасными отходами",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-red-100 to-orange-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-red-800 mb-4">⚠️ Опасные отходы требуют особого внимания!</h3>
          <p class="text-gray-700">
            Некоторые виды мусора содержат вредные вещества и не должны попадать в обычные контейнеры.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <div class="text-3xl mb-2">🔋</div>
            <h4 class="font-bold text-red-800">Батарейки</h4>
            <p class="text-sm text-red-600 mt-2">Содержат тяжёлые металлы</p>
          </div>
          
          <div class="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
            <div class="text-3xl mb-2">💡</div>
            <h4 class="font-bold text-orange-800">Лампочки</h4>
            <p class="text-sm text-orange-600 mt-2">Энергосберегающие содержат ртуть</p>
          </div>
          
          <div class="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <div class="text-3xl mb-2">📱</div>
            <h4 class="font-bold text-purple-800">Электроника</h4>
            <p class="text-sm text-purple-600 mt-2">Телефоны, планшеты, компьютеры</p>
          </div>
          
          <div class="bg-pink-50 p-4 rounded-lg border-2 border-pink-200">
            <div class="text-3xl mb-2">🎨</div>
            <h4 class="font-bold text-pink-800">Краски</h4>
            <p class="text-sm text-pink-600 mt-2">Лаки, растворители, клеи</p>
          </div>
          
          <div class="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
            <div class="text-3xl mb-2">💊</div>
            <h4 class="font-bold text-indigo-800">Лекарства</h4>
            <p class="text-sm text-indigo-600 mt-2">Просроченные медикаменты</p>
          </div>
          
          <div class="bg-teal-50 p-4 rounded-lg border-2 border-teal-200">
            <div class="text-3xl mb-2">🚗</div>
            <h4 class="font-bold text-teal-800">Автомобильные</h4>
            <p class="text-sm text-teal-600 mt-2">Масла, фильтры, шины</p>
          </div>
        </div>

        <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">📍 Куда сдавать?</h3>
          <p class="text-blue-700 mb-3">
            Опасные отходы нужно сдавать в специальные пункты приёма:
          </p>
          <ul class="list-disc list-inside space-y-1 text-blue-700">
            <li>Экобоксы в торговых центрах</li>
            <li>Специальные контейнеры во дворах</li>
            <li>Пункты приёма в магазинах электроники</li>
            <li>Аптеки (для лекарств)</li>
          </ul>
        </div>
      </div>
    `,
    completed: false,
  },
  {
    id: 5,
    title: "Переработка и вторичное использование",
    description: "Узнайте, что происходит с отсортированным мусором и как его можно использовать повторно",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-blue-800 mb-4">♻️ Жизненный цикл переработки</h3>
          <p class="text-gray-700">
            После сортировки отходы отправляются на переработку, где из них делают новые полезные вещи!
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-green-800">Что можно сделать из переработанных материалов:</h4>
            
            <div class="bg-blue-50 p-4 rounded-lg">
              <h5 class="font-semibold text-blue-800">Из бумаги:</h5>
              <p class="text-sm text-blue-600">Новая бумага, картон, туалетная бумага, яичные лотки</p>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h5 class="font-semibold text-yellow-800">Из пластика:</h5>
              <p class="text-sm text-yellow-600">Одежда, ковры, новые бутылки, мебель</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg">
              <h5 class="font-semibold text-green-800">Из стекла:</h5>
              <p class="text-sm text-green-600">Новые бутылки и банки, стекловата, плитка</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-purple-800">Интересные факты:</h4>
            
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-purple-700">
                <strong>🔢 Из 25 пластиковых бутылок</strong><br/>
                можно сделать одну флисовую кофту!
              </p>
            </div>
            
            <div class="bg-indigo-50 p-4 rounded-lg">
              <p class="text-sm text-indigo-700">
                <strong>📰 1 тонна макулатуры</strong><br/>
                спасает 17 деревьев от вырубки!
              </p>
            </div>
            
            <div class="bg-teal-50 p-4 rounded-lg">
              <p class="text-sm text-teal-700">
                <strong>🍾 Стекло можно перерабатывать</strong><br/>
                бесконечное количество раз без потери качества!
              </p>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
          <h3 class="text-lg font-semibold text-orange-800 mb-2">💡 Принцип 3R</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="text-center">
              <div class="text-2xl mb-2">🔄</div>
              <h4 class="font-bold text-orange-800">Reduce</h4>
              <p class="text-sm text-orange-600">Сокращай потребление</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">♻️</div>
              <h4 class="font-bold text-orange-800">Reuse</h4>
              <p class="text-sm text-orange-600">Используй повторно</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-2">🔄</div>
              <h4 class="font-bold text-orange-800">Recycle</h4>
              <p class="text-sm text-orange-600">Перерабатывай</p>
            </div>
          </div>
        </div>
      </div>
    `,
    completed: false,
  },
  {
    id: 6,
    title: "Экологические проблемы",
    description: "Изучите основные экологические проблемы, связанные с неправильной утилизацией отходов",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-red-100 to-orange-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-red-800 mb-4">🌍 Глобальные проблемы загрязнения</h3>
          <p class="text-gray-700">
            Неправильная утилизация отходов создаёт серьёзные проблемы для нашей планеты.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h4 class="text-lg font-bold text-blue-800 mb-3">🌊 Загрязнение океанов</h4>
            <ul class="space-y-2 text-sm text-blue-700">
              <li>• 8 миллионов тонн пластика попадает в океан ежегодно</li>
              <li>• Морские животные принимают пластик за пищу</li>
              <li>• Образуются огромные мусорные острова</li>
              <li>• Микропластик попадает в пищевую цепь</li>
            </ul>
          </div>
          
          <div class="bg-green-50 p-6 rounded-lg border-2 border-green-200">
            <h4 class="text-lg font-bold text-green-800 mb-3">🏞️ Загрязнение почвы</h4>
            <ul class="space-y-2 text-sm text-green-700">
              <li>• Свалки занимают огромные территории</li>
              <li>• Токсичные вещества проникают в грунтовые воды</li>
              <li>• Плодородная почва становится непригодной</li>
              <li>• Страдают растения и животные</li>
            </ul>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <h4 class="text-lg font-bold text-gray-800 mb-3">💨 Загрязнение воздуха</h4>
            <ul class="space-y-2 text-sm text-gray-700">
              <li>• Сжигание мусора выделяет токсичные газы</li>
              <li>• Метан со свалок усиливает парниковый эффект</li>
              <li>• Ухудшается качество воздуха в городах</li>
              <li>• Растёт число заболеваний дыхательных путей</li>
            </ul>
          </div>
          
          <div class="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <h4 class="text-lg font-bold text-purple-800 mb-3">🐾 Влияние на животных</h4>
            <ul class="space-y-2 text-sm text-purple-700">
              <li>• Животные запутываются в пластиковых отходах</li>
              <li>• Птицы строят гнёзда из мусора</li>
              <li>• Исчезают естественные места обитания</li>
              <li>• Многие виды находятся под угрозой вымирания</li>
            </ul>
          </div>
        </div>

        <div class="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
          <h3 class="text-lg font-semibold text-yellow-800 mb-2">⏰ Время разложения отходов</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div class="text-center">
              <div class="text-2xl mb-1">🍌</div>
              <p class="text-sm font-semibold">Банановая кожура</p>
              <p class="text-xs text-yellow-600">2-5 недель</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">📰</div>
              <p class="text-sm font-semibold">Газета</p>
              <p class="text-xs text-yellow-600">6 недель</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">🥤</div>
              <p class="text-sm font-semibold">Пластиковая бутылка</p>
              <p class="text-xs text-yellow-600">450 лет</p>
            </div>
            <div class="text-center">
              <div class="text-2xl mb-1">🍾</div>
              <p class="text-sm font-semibold">Стеклянная бутылка</p>
              <p class="text-xs text-yellow-600">1 миллион лет</p>
            </div>
          </div>
        </div>
      </div>
    `,
    completed: false,
  },
  {
    id: 7,
    title: "Практические советы",
    description: "Получите практические советы по сортировке отходов в повседневной жизни",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
          <h3 class="text-xl font-bold text-green-800 mb-4">🏠 Сортировка дома: пошаговое руководство</h3>
          <p class="text-gray-700">
            Начните с малого - организуйте сортировку отходов у себя дома!
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-blue-800">📋 Шаг за шагом:</h4>
            
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h5 class="font-semibold text-blue-800 mb-2">1. Подготовьте контейнеры</h5>
              <p class="text-sm text-blue-600">
                Используйте разные ёмкости или пакеты для каждого типа отходов
              </p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h5 class="font-semibold text-green-800 mb-2">2. Очистите упаковку</h5>
              <p class="text-sm text-green-600">
                Промойте контейнеры от остатков пищи перед сортировкой
              </p>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h5 class="font-semibold text-yellow-800 mb-2">3. Сортируйте правильно</h5>
              <p class="text-sm text-yellow-600">
                Изучите маркировку на упаковке и сортируйте соответственно
              </p>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h5 class="font-semibold text-purple-800 mb-2">4. Регулярно выносите</h5>
              <p class="text-sm text-purple-600">
                Не накапливайте большие объёмы отходов дома
              </p>
            </div>
          </div>
          
          <div class="space-y-4">
            <h4 class="text-lg font-bold text-orange-800">💡 Полезные советы:</h4>
            
            <div class="bg-orange-50 p-4 rounded-lg">
              <h5 class="font-semibold text-orange-800">🏷️ Изучайте маркировку</h5>
              <p class="text-sm text-orange-600 mt-1">
                На упаковке есть специальные символы, которые подскажут, как правильно утилизировать товар
              </p>
            </div>
            
            <div class="bg-teal-50 p-4 rounded-lg">
              <h5 class="font-semibold text-teal-800">🧽 Сжимайте упаковку</h5>
              <p class="text-sm text-teal-600 mt-1">
                Сплющивайте пластиковые бутылки и картонные коробки для экономии места
              </p>
            </div>
            
            <div class="bg-pink-50 p-4 rounded-lg">
              <h5 class="font-semibold text-pink-800">👨‍👩‍👧‍👦 Привлекайте семью</h5>
              <p class="text-sm text-pink-600 mt-1">
                Объясните правила сортировки всем членам семьи
              </p>
            </div>
            
            <div class="bg-indigo-50 p-4 rounded-lg">
              <h5 class="font-semibold text-indigo-800">📱 Используйте приложения</h5>
              <p class="text-sm text-indigo-600 mt-1">
                Скачайте приложения, которые помогут найти ближайшие пункты приёма
              </p>
            </div>
          </div>
        </div>

        <div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
          <h3 class="text-lg font-semibold text-green-800 mb-3">🎯 Ваша цель</h3>
          <p class="text-green-700 mb-3">
            Начните с сортировки хотя бы одного вида отходов, например, пластиковых бутылок. 
            Постепенно добавляйте другие категории.
          </p>
          <div class="bg-green-100 p-4 rounded-lg">
            <p class="text-sm text-green-800 font-semibold">
              💪 Помните: каждый правильно отсортированный предмет - это ваш вклад в сохранение планеты!
            </p>
          </div>
        </div>
      </div>
    `,
    completed: false,
  },
]

export default function WasteSortingLearning() {
  const router = useRouter()
  const [currentLesson, setCurrentLesson] = useState(1)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const currentLessonData = lessons.find((lesson) => lesson.id === currentLesson)
  const progress = (completedLessons.length / lessons.length) * 100

  const markLessonComplete = () => {
    if (!completedLessons.includes(currentLesson)) {
      setCompletedLessons([...completedLessons, currentLesson])
    }
  }

  const nextLesson = () => {
    markLessonComplete()
    if (currentLesson < lessons.length) {
      setCurrentLesson(currentLesson + 1)
    }
  }

  const prevLesson = () => {
    if (currentLesson > 1) {
      setCurrentLesson(currentLesson - 1)
    }
  }

  const goToGame = () => {
    markLessonComplete()
    router.push("/learning/waste-sorting/game")
  }

  if (!currentLessonData) {
    return <div>Урок не найден</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard/student">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-green-800">Обучение сортировке отходов</h1>
                <p className="text-sm text-gray-600">
                  Урок {currentLesson} из {lessons.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Прогресс</p>
                <p className="font-semibold text-green-700">{Math.round(progress)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Общий прогресс</span>
            <span className="text-sm font-medium text-gray-700">
              {completedLessons.length}/{lessons.length} уроков
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Lesson Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {lessons.map((lesson) => (
              <Button
                key={lesson.id}
                variant={currentLesson === lesson.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentLesson(lesson.id)}
                className={`${
                  completedLessons.includes(lesson.id)
                    ? "bg-green-100 text-green-800 border-green-300"
                    : currentLesson === lesson.id
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                }`}
              >
                {completedLessons.includes(lesson.id) && <CheckCircle className="h-3 w-3 mr-1" />}
                Урок {lesson.id}
              </Button>
            ))}
          </div>
        </div>

        {/* Current Lesson */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentLessonData.title}</CardTitle>
                <CardDescription className="text-green-100">{currentLessonData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: currentLessonData.content }}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={prevLesson} disabled={currentLesson === 1} className="bg-white/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Предыдущий урок
          </Button>

          <div className="flex items-center gap-2">
            {completedLessons.includes(currentLesson) && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Завершён
              </Badge>
            )}
          </div>

          {currentLesson < lessons.length ? (
            <Button
              onClick={nextLesson}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              Следующий урок
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={goToGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Перейти к игре
            </Button>
          )}
        </div>

        {/* Completion Message */}
        {completedLessons.length === lessons.length && (
          <Card className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 border-green-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Поздравляем! Вы завершили все уроки!</h3>
              <p className="text-green-700 mb-4">
                Теперь вы знаете основы правильной сортировки отходов. Пора проверить свои знания в игре!
              </p>
              <Button
                onClick={goToGame}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Gamepad2 className="h-4 w-4 mr-2" />
                Играть в игру по сортировке
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
