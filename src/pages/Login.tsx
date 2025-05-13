import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials
    if (username === 'adm' && password === '1234') {
      // Store login state in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      // Redirect to admin page
      navigate('/admin');
    } else {
      setError('Felaktigt användarnamn eller lösenord');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-charcoal-300 border-charcoal-400">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Logga in för att komma åt admin-panelen
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Användarnamn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-charcoal-200 border-charcoal-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-charcoal-200 border-charcoal-400"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-white text-charcoal-100 hover:bg-gray-200">
              Logga in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Endast för administratörer
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
