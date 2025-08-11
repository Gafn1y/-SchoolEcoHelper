"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, AlertTriangle, RefreshCw } from "lucide-react"

export default function DatabaseAdminPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const resetDatabase = async () => {
    if (!confirm("Are you sure you want to reset the database? This will delete ALL data!")) {
      return
    }

    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch("/api/database/reset", {
        method: "POST",
      })

      if (response.ok) {
        setMessage("Database reset successfully!")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to reset database")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Database className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Database Administration</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Danger Zone
            </CardTitle>
            <CardDescription>These actions are irreversible and should only be used in development.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h3 className="font-semibold text-red-800 mb-2">Reset Database</h3>
              <p className="text-sm text-red-700 mb-4">
                This will permanently delete all data including users, schools, classes, and actions.
              </p>
              <Button
                onClick={resetDatabase}
                disabled={loading}
                variant="destructive"
                className="flex items-center gap-2"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                {loading ? "Resetting..." : "Reset Database"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
